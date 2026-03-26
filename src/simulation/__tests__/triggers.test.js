import { describe, it, expect } from 'vitest'
import { createInitialState, simulateCycle, runCycles } from '../engine.js'
import { checkThresholds } from '../triggers.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fullyKnownState(state) {
  return {
    ...state,
    species: state.species.map(sp => ({
      ...sp,
      milestones: { observed: true, named: true, roleIdentified: true, behaviorMapped: true, populationModeled: true },
    })),
  }
}

// ─── populationSurge ─────────────────────────────────────────────────────────

describe('populationSurge trigger', () => {
  it('fires when a species reaches a new population peak', () => {
    // Build a minimal prev/next pair where one species has genuinely exceeded its prior peak.
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    // Manually craft prevState with a known peak, nextState above that peak.
    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, peakPopulation: 100, baseline: 80 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 120, history: { ...s.history, peakPopulation: 120, baseline: 80 } }
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const surges = events.filter(e => e.type === 'populationSurge' && e.speciesId === sp.id)
    expect(surges).toHaveLength(1)
  })

  it('does not fire when population is below prior peak', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, peakPopulation: 150, baseline: 80 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 110, history: { ...s.history, peakPopulation: 150, baseline: 80 } }
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const surges = events.filter(e => e.type === 'populationSurge' && e.speciesId === sp.id)
    expect(surges).toHaveLength(0)
  })
})

// ─── populationCrisis ────────────────────────────────────────────────────────

describe('populationCrisis trigger', () => {
  it('fires on a >10% single-cycle drop', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 85, history: { ...s.history, baseline: 100 } }  // 15% drop
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const crises = events.filter(e => e.type === 'populationCrisis' && e.speciesId === sp.id)
    expect(crises).toHaveLength(1)
    expect(crises[0].data.dropPct).toBeCloseTo(0.15, 2)
  })

  it('does not fire on a small drop', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 95, history: { ...s.history, baseline: 100 } }  // 5% drop
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const crises = events.filter(e => e.type === 'populationCrisis' && e.speciesId === sp.id)
    expect(crises).toHaveLength(0)
  })
})

// ─── extinctionWarning ───────────────────────────────────────────────────────

describe('extinctionWarning trigger', () => {
  it('fires when population crosses below 15% of baseline', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, baseline: 100 } }  // exactly at threshold
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 10, history: { ...s.history, baseline: 100 } }   // 10%, below 15%
          : s
      ),
    }

    const events  = checkThresholds(prevState, nextState)
    const warnings = events.filter(e => e.type === 'extinctionWarning' && e.speciesId === sp.id)
    expect(warnings).toHaveLength(1)
  })

  it('does not fire when already below threshold last cycle (no re-trigger)', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 10, history: { ...s.history, baseline: 100 } }   // already below 15%
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 8, history: { ...s.history, baseline: 100 } }    // still below
          : s
      ),
    }

    const events   = checkThresholds(prevState, nextState)
    const warnings = events.filter(e => e.type === 'extinctionWarning' && e.speciesId === sp.id)
    expect(warnings).toHaveLength(0)
  })
})

// ─── extinction ──────────────────────────────────────────────────────────────

describe('extinction trigger', () => {
  it('fires when a species goes from alive to zero', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id ? { ...s, population: 5 } : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id ? { ...s, population: 0 } : s
      ),
    }

    const events     = checkThresholds(prevState, nextState)
    const extinctions = events.filter(e => e.type === 'extinction' && e.speciesId === sp.id)
    expect(extinctions).toHaveLength(1)
  })

  it('does not fire when species was already extinct', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id ? { ...s, population: 0 } : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id ? { ...s, population: 0 } : s
      ),
    }

    const events     = checkThresholds(prevState, nextState)
    const extinctions = events.filter(e => e.type === 'extinction' && e.speciesId === sp.id)
    expect(extinctions).toHaveLength(0)
  })
})

// ─── Knowledge tier gating ────────────────────────────────────────────────────

describe('knowledge tier gating', () => {
  it('suppresses all events for undiscovered species (tier 0)', () => {
    const base = createInitialState()
    const sp   = base.species[0]

    // Undiscovered: no milestones set
    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, milestones: {}, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 0, milestones: {}, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const forSp  = events.filter(e => e.speciesId === sp.id)
    expect(forSp).toHaveLength(0)
  })

  it('fires extinction for sighted species (tier 1), suppresses crisis (requires tier 3)', () => {
    const base = createInitialState()
    const sp   = base.species[0]

    // Tier 1: only observed milestone
    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, milestones: { observed: true }, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 0, milestones: { observed: true }, history: { ...s.history, baseline: 100 } }
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    expect(events.filter(e => e.type === 'extinction'      && e.speciesId === sp.id)).toHaveLength(1)
    expect(events.filter(e => e.type === 'populationCrisis' && e.speciesId === sp.id)).toHaveLength(0)
  })
})

// ─── populationSurge boundary ────────────────────────────────────────────────

describe('populationSurge boundary conditions', () => {
  it('does not fire when new peak is below 1.2x baseline', () => {
    const base = fullyKnownState(createInitialState())
    const sp   = base.species[0]

    // Population exceeds prior peak but is only 1.1× baseline — below 1.2× threshold
    const prevState = {
      ...base,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 100, history: { ...s.history, peakPopulation: 100, baseline: 100 } }
          : s
      ),
    }
    const nextState = {
      ...base,
      cycle: base.cycle + 1,
      species: base.species.map(s =>
        s.id === sp.id
          ? { ...s, population: 110, history: { ...s.history, peakPopulation: 110, baseline: 100 } }
          : s
      ),
    }

    const events = checkThresholds(prevState, nextState)
    const surges = events.filter(e => e.type === 'populationSurge' && e.speciesId === sp.id)
    expect(surges).toHaveLength(0)
  })
})

// ─── Integration: compounds fire in real simulation ──────────────────────────

describe('simulation integration', () => {
  it('produces populationSurge events over 500 cycles', () => {
    const state  = fullyKnownState(createInitialState())
    const result = runCycles(state, 500)
    const surges = result.events.filter(e => e.type === 'populationSurge')
    expect(surges.length).toBeGreaterThan(0)
  })

  it('produces at least one compound event over 500 cycles', () => {
    const state     = fullyKnownState(createInitialState())
    const result    = runCycles(state, 500)
    const compounds = result.events.filter(e => e.type === 'compound')
    expect(compounds.length).toBeGreaterThan(0)
  })
})
