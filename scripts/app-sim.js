#!/usr/bin/env node
// ─── app-sim.js ───────────────────────────────────────────────────────────────
//
// Headless simulation that mirrors the real app loop, auto-accepting and
// instantly completing every research suggestion. Outputs a full narrative
// session summary — one rendered line per event.
//
// Usage:
//   node scripts/app-sim.js [cycles] [seeds] [options]
//
//   cycles           Number of cycles to simulate (default: 200)
//   seeds            Single seed or comma-separated list (default: 12345)
//                    e.g.  42  or  12345,99,7
//
// Options:
//   --filter <type>  Show only events of this type (e.g. populationSurge)
//   --species <id>   Show only events involving this species id (e.g. vellin)
//   --text-only      Skip the stats section, output narrative log only
//
// Examples:
//   node scripts/app-sim.js 300
//   node scripts/app-sim.js 200 42,99,7
//   node scripts/app-sim.js 500 --filter populationSurge
//   node scripts/app-sim.js 200 --species vellin --text-only
//   node scripts/app-sim.js 200 42,99 --filter populationCrisis --text-only

import { createInitialState, simulateCycle } from '../src/simulation/engine.js'
import { checkThresholds, checkDiscovery, checkResearch } from '../src/simulation/triggers.js'
import { detectCompoundEvents } from '../src/simulation/compounds.js'
import { startProject, makeStudySuggestion, hasSuggestion } from '../src/simulation/research.js'
import { eventToEntry } from '../src/data/text/events.js'

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)

function parseFlag(name) {
  const idx = args.indexOf(name)
  if (idx === -1) return null
  return args[idx + 1] ?? true
}

function hasFlag(name) {
  return args.includes(name)
}

// Positional args (non-flag entries)
const positional = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')))

const CYCLES    = parseInt(positional[0], 10) || 200
const SEEDS     = (positional[1] ?? '12345').split(',').map(s => parseInt(s.trim(), 10))
const FILTER    = parseFlag('--filter')   // event type to show, or null
const SPECIES   = parseFlag('--species')  // species id to show, or null
const TEXT_ONLY = hasFlag('--text-only')

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const bold    = s => `\x1b[1m${s}\x1b[0m`
const dim     = s => `\x1b[2m${s}\x1b[0m`
const yellow  = s => `\x1b[33m${s}\x1b[0m`
const cyan    = s => `\x1b[36m${s}\x1b[0m`
const red     = s => `\x1b[31m${s}\x1b[0m`
const magenta = s => `\x1b[35m${s}\x1b[0m`
const blue    = s => `\x1b[34m${s}\x1b[0m`

// ─── Simulation helpers ───────────────────────────────────────────────────────

let _eventSeq = 0

function stampEvent(e) {
  return { ...e, id: `ev-${++_eventSeq}`, requiresDecision: false, resolved: false, absorbed: false }
}

function checkBehavioralSuggestions(state, annotatedEvents) {
  let research = state.research
  let changed  = false

  for (const sp of state.species) {
    if (!sp.milestones.roleIdentified) continue
    if (sp.milestones.behaviorMapped)  continue
    if ((sp.history.cyclesSinceRoleIdentified ?? 0) < 5) continue
    if (hasSuggestion(research, sp.id, 'behavioral')) continue

    const evInvolving = annotatedEvents.filter(
      ({ event: e }) => e.speciesId === sp.id || e.data?.preyId === sp.id || e.data?.predatorId === sp.id
    ).length

    if (evInvolving < 4) continue

    const suggestion = makeStudySuggestion(sp, 'behavioral', state.cycle)
    const existing   = research.suggestions
    const trimmed    = existing.length >= 5 ? existing.slice(1) : existing
    research = { ...research, suggestions: [...trimmed, suggestion] }
    changed  = true
  }

  return changed ? { ...state, research } : state
}

function acceptAllSuggestions(state) {
  let research = state.research

  for (const s of [...research.suggestions]) {
    research = startProject(research, s.id, state.cycle)
  }

  const forceComplete = p => ({ ...p, completionCycle: state.cycle })

  if (research.active) {
    research = { ...research, active: forceComplete(research.active) }
  }
  research = { ...research, queue: research.queue.map(forceComplete) }

  return { ...state, research }
}

// ─── Per-seed simulation ──────────────────────────────────────────────────────

function runSeed(seed) {
  const annotatedEvents = []
  const eventCounts     = {}
  let   state           = createInitialState(seed)

  for (let i = 0; i < CYCLES; i++) {
    const prev = state
    state = simulateCycle(state)

    const rawEvents = [
      ...checkThresholds(prev, state),
      ...checkDiscovery(prev, state),
      ...checkResearch(prev, state),
    ]
    const cycleEvents = rawEvents.map(stampEvent)

    const compounds = detectCompoundEvents(cycleEvents, state)
    let finalCycleEvents = cycleEvents
    if (compounds.length > 0) {
      const absorbedIds = new Set(compounds.flatMap(c => c.absorbedEventIds))
      finalCycleEvents = cycleEvents.map(ev =>
        absorbedIds.has(ev.id) ? { ...ev, absorbed: true } : ev
      )
    }
    const allCycleEvents = [...finalCycleEvents, ...compounds]

    for (const ev of allCycleEvents) {
      annotatedEvents.push({ event: ev, speciesSnapshot: state.species, cycleAtTime: state.cycle })
      eventCounts[ev.subtype ?? ev.type] = (eventCounts[ev.subtype ?? ev.type] ?? 0) + 1
    }

    // Species event history
    const eventsBySpecies = {}
    for (const ev of allCycleEvents) {
      if (ev.speciesId) {
        if (!eventsBySpecies[ev.speciesId]) eventsBySpecies[ev.speciesId] = []
        eventsBySpecies[ev.speciesId].push({ type: ev.type, cycle: ev.cycle })
      }
    }
    if (Object.keys(eventsBySpecies).length > 0) {
      state = {
        ...state,
        species: state.species.map(sp => {
          const incoming = eventsBySpecies[sp.id]
          if (!incoming) return sp
          const merged = [...(sp.history.events ?? []), ...incoming]
          return {
            ...sp,
            history: {
              ...sp.history,
              events: merged.length > 100 ? merged.slice(merged.length - 100) : merged,
            },
          }
        }),
      }
    }

    // studySuggested → add to research
    for (const ev of cycleEvents) {
      if (ev.type === 'studySuggested') {
        const research = state.research || { active: null, queue: [], history: [], suggestions: [] }
        const sp = state.species.find(s => s.id === ev.speciesId)
        if (sp && !hasSuggestion(research, sp.id, 'initial')) {
          const suggestion = makeStudySuggestion(sp, 'initial', ev.cycle)
          const existing   = research.suggestions
          const trimmed    = existing.length >= 5 ? existing.slice(1) : existing
          state = { ...state, research: { ...research, suggestions: [...trimmed, suggestion] } }
        }
      }
    }

    state = checkBehavioralSuggestions(state, annotatedEvents)
    state = acceptAllSuggestions(state)
  }

  return { annotatedEvents, eventCounts, finalState: state }
}

// ─── Text rendering ───────────────────────────────────────────────────────────

function renderSegments(segments) {
  return segments.map(seg =>
    seg.type === 'text' ? seg.value
    : seg.entityType === 'sp' ? cyan(seg.name)
    : yellow(seg.name)
  ).join('')
}

function renderEvent(ev, speciesSnapshot, cycleAtTime) {
  const gameState = { species: speciesSnapshot, cycle: cycleAtTime }
  const entry     = eventToEntry(ev, gameState)
  if (!entry) return null

  const colorize = entry.type === 'crisis' ? red : entry.type === 'decision' ? magenta : s => s

  return {
    type:    entry.type,
    text:    colorize(renderSegments(entry.segments)),
    evType:  ev.subtype ?? ev.type,
    species: ev.speciesId ?? null,
  }
}

// ─── Filter helpers ───────────────────────────────────────────────────────────

function eventMatchesFilter(ev) {
  if (FILTER  && (ev.subtype ?? ev.type) !== FILTER) return false
  if (SPECIES) {
    const involvesSpecies =
      ev.speciesId === SPECIES ||
      ev.data?.preyId === SPECIES ||
      ev.data?.predatorId === SPECIES ||
      ev.data?.producerId === SPECIES ||
      ev.data?.consumerId === SPECIES
    if (!involvesSpecies) return false
  }
  return true
}

// ─── Narrative log printer ────────────────────────────────────────────────────

const TYPE_LABEL = { crisis: 'CRISIS  ', observation: 'OBS     ', decision: 'DECISION' }

function printNarrativeLog(annotatedEvents, seed) {
  const surviving = null // computed by caller
  let lastCycle   = null
  let printed     = 0

  for (const { event: ev, speciesSnapshot, cycleAtTime } of annotatedEvents) {
    if (ev.absorbed) continue
    if (!eventMatchesFilter(ev)) continue

    const rendered = renderEvent(ev, speciesSnapshot, cycleAtTime)
    if (!rendered) continue

    if (ev.cycle !== lastCycle) {
      console.log(dim(`  ── Cycle ${ev.cycle} ${'─'.repeat(58)}`))
      lastCycle = ev.cycle
    }

    const label = TYPE_LABEL[rendered.type] ?? (rendered.type ?? '').padEnd(8)
    const tag   = rendered.type === 'crisis' ? red(label)
                : rendered.type === 'decision' ? magenta(label)
                : dim(label)

    // Show event type tag in filter mode so you can see what's generating each line
    const typeSuffix = (FILTER || SPECIES) ? dim(` [${rendered.evType}]`) : ''

    console.log(`  ${tag}  ${rendered.text}${typeSuffix}`)
    printed++
  }

  if (printed === 0) {
    console.log(dim('  (no matching events)'))
  }
}

// ─── Stats printer ────────────────────────────────────────────────────────────

function printStats(allEventCounts, allFinalStates) {
  console.log(dim('\n  ────────────────────────────────────────────────────────────────'))
  console.log()

  const sortedEvents = Object.entries(allEventCounts).sort((a, b) => b[1] - a[1])
  const maxCount     = sortedEvents[0]?.[1] ?? 1
  const BAR_WIDTH    = 20

  console.log(bold('Event counts\n'))
  for (const [type, count] of sortedEvents) {
    const bar = '█'.repeat(Math.round(count / maxCount * BAR_WIDTH))
    console.log(`  ${type.padEnd(36)} ${yellow(bar.padEnd(BAR_WIDTH, ' '))} ${count}`)
  }

  const total      = Object.values(allEventCounts).reduce((s, n) => s + n, 0)
  const totalCycles = CYCLES * SEEDS.length
  console.log(dim(`\n  ${total} events across ${SEEDS.length} seed(s) — ${(total / totalCycles).toFixed(1)}/cycle avg`))

  // Final populations: show each seed's outcome
  for (let i = 0; i < allFinalStates.length; i++) {
    const state = allFinalStates[i]
    const seed  = SEEDS[i]
    console.log(bold(`\nFinal populations — seed ${seed}\n`))
    const sorted = [...state.species].sort((a, b) => b.population - a.population)
    for (const sp of sorted) {
      const name = sp.name.padEnd(14)
      const pop  = sp.population <= 0 ? red('EXTINCT') : String(Math.round(sp.population)).padStart(5)
      const peak = String(Math.round(sp.history.peakPopulation)).padStart(5)
      const low  = String(Math.round(sp.history.lowestPopulation)).padStart(5)
      console.log(`  ${bold(name)} pop ${pop}  peak ${peak}  low ${low}`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const allFinalStates  = []
const allEventCounts  = {}
const filterDesc      = [
  FILTER  && `type=${FILTER}`,
  SPECIES && `species=${SPECIES}`,
].filter(Boolean).join(', ')

const headerLine = [
  `${CYCLES} cycles`,
  SEEDS.length > 1 ? `seeds ${SEEDS.join(', ')}` : `seed ${SEEDS[0]}`,
  filterDesc && `[${filterDesc}]`,
].filter(Boolean).join(' — ')

console.log(bold(`\n╔═══ Session Summary — ${headerLine} ═══╗\n`))

for (const seed of SEEDS) {
  const { annotatedEvents, eventCounts, finalState } = runSeed(seed)

  // Merge event counts
  for (const [type, count] of Object.entries(eventCounts)) {
    allEventCounts[type] = (allEventCounts[type] ?? 0) + count
  }
  allFinalStates.push(finalState)

  // Seed header when running multiple seeds
  if (SEEDS.length > 1) {
    const surviving = finalState.species.filter(s => s.population > 0).length
    const extinct   = finalState.species.filter(s => s.population <= 0)
    const extLine   = extinct.length > 0 ? `  extinct: ${extinct.map(s => s.name).join(', ')}` : ''
    console.log(blue(bold(`  ┌─ seed ${seed} — ${surviving}/${finalState.species.length} surviving${extLine}`)))
    console.log()
  } else {
    const surviving = finalState.species.filter(s => s.population > 0).length
    const extinct   = finalState.species.filter(s => s.population <= 0)
    if (extinct.length > 0) console.log(dim(`  Extinct: ${extinct.map(s => s.name).join(', ')}`))
    console.log()
  }

  printNarrativeLog(annotatedEvents, seed)
  console.log()
}

if (!TEXT_ONLY) {
  printStats(allEventCounts, allFinalStates)
}

console.log(bold('\n╚═══════════════════════════════════════════════════════╝\n'))
