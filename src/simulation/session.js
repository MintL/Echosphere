import { createInitialState, runCycles } from './engine.js'
import { loadState, saveState } from '../storage/db.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const MINUTES_PER_CYCLE  = 5 / 60   // 5 seconds
const MAX_CATCHUP_CYCLES = 200

export const CYCLE_DURATION_MS = MINUTES_PER_CYCLE * 60 * 1000

// ─── Session load ─────────────────────────────────────────────────────────────

// Call on every app open (after the researcher name is known).
//
// Returns:
//   { state, hasNewEvents, isNewGame }
//
// - state         — up-to-date game state, ready to render
// - hasNewEvents  — true if state.events contains events since lastSummaryViewedCycle
// - isNewGame     — true if this was the first session ever

export async function loadSession(researcherName) {
  const saved = await loadState()

  if (!saved) {
    const seed  = Date.now() >>> 0
    const state = { ...createInitialState(seed, researcherName), lastSavedAt: Date.now() }
    await saveState(state)
    return { state, hasNewEvents: false, isNewGame: true }
  }

  // Compute elapsed cycles from real time
  const now         = Date.now()
  const lastSaved   = saved.lastSavedAt ?? now
  const rawCycles   = Math.floor((now - lastSaved) / CYCLE_DURATION_MS)
  const cyclesToRun = Math.min(rawCycles, MAX_CATCHUP_CYCLES)

  let state = saved
  if (cyclesToRun > 0) {
    const result = runCycles(saved, cyclesToRun)
    state = { ...result.state, lastSavedAt: now }
    await saveState(state)
  }

  const hasNewEvents = state.events.some(
    e => e.cycle > state.researcher.lastSummaryViewedCycle
  )

  const awayMs = now - lastSaved
  return { state, hasNewEvents, isNewGame: false, awayCycles: cyclesToRun, awayMs }
}

// ─── Save checkpoint ──────────────────────────────────────────────────────────

export async function saveSession(state) {
  await saveState({ ...state, lastSavedAt: Date.now() })
}

// ─── Summary markers ─────────────────────────────────────────────────────────

export function canContinue(state) {
  return state.events
    .filter(e => e.cycle > state.researcher.lastSummaryViewedCycle)
    .filter(e => e.requiresDecision)
    .every(e => e.resolved)
}

export function onContinue(state) {
  return {
    ...state,
    researcher: {
      ...state.researcher,
      lastSummaryViewedCycle: state.cycle,
    },
  }
}
