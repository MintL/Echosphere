import { describe, it, expect } from 'vitest'
import { selectContext, applyContextCooldown } from '../../data/text/context.js'

// ─── Minimal test helpers ─────────────────────────────────────────────────────

function makeSpecies(historyOverrides = {}) {
  return {
    id:         'vellin',
    name:       'Vellin',
    population: 200,
    milestones: {},
    history: {
      peakPopulation:       500,
      lowestPopulation:     200,
      lowestPopulationCycle: 0,
      events:               [],
      decisions:            [],
      contextCooldowns:     {},
      ...historyOverrides,
    },
  }
}

function makeEvent(type = 'populationCrash', cycle = 50) {
  return { type, cycle }
}

function makeState(cycle = 50) {
  return { cycle }
}

// ─── nearExtinctionRecovery ───────────────────────────────────────────────────

describe('selectContext — nearExtinctionRecovery', () => {
  it('fires when species recovered from near-extinction low', () => {
    // Peak 500, lowest 10 (2% of peak — below 5% threshold), current pop 200 (20× the low)
    const species = makeSpecies({
      peakPopulation:        500,
      lowestPopulation:      10,
      lowestPopulationCycle: 20,
    })
    const context = selectContext(makeEvent(), species, makeState())
    expect(context).not.toBeNull()
    expect(context.type).toBe('nearExtinctionRecovery')
    expect(context.lowestPop).toBe(10)
    expect(context.lowestCycle).toBe(20)
  })

  it('does not fire when lowest was above 5% of peak', () => {
    // Peak 500, lowest 50 (10% of peak — above 5% threshold)
    const species = makeSpecies({
      peakPopulation:   500,
      lowestPopulation: 50,
    })
    const context = selectContext(makeEvent(), species, makeState())
    // May return other context types — just assert not nearExtinctionRecovery
    expect(context?.type).not.toBe('nearExtinctionRecovery')
  })

  it('does not fire when species has not recovered (still near the low)', () => {
    // Peak 500, lowest 10, current pop 15 — only 1.5× the low, below 4× recovery threshold
    const species = makeSpecies({
      peakPopulation:   500,
      lowestPopulation: 10,
      // population from makeSpecies = 200, but override:
    })
    species.population = 15
    const context = selectContext(makeEvent(), species, makeState())
    expect(context?.type).not.toBe('nearExtinctionRecovery')
  })
})

// ─── priorSameEvent ───────────────────────────────────────────────────────────

describe('selectContext — priorSameEvent', () => {
  it('fires when the same event type occurred in a prior cycle', () => {
    const species = makeSpecies({
      events: [{ type: 'populationCrash', cycle: 30 }],
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    expect(context).not.toBeNull()
    expect(context.type).toBe('priorSameEvent')
    expect(context.priorCycle).toBe(30)
  })

  it('does not fire when no prior event of the same type', () => {
    const species = makeSpecies({
      events: [{ type: 'populationSurge', cycle: 30 }],
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    expect(context?.type).not.toBe('priorSameEvent')
  })

  it('is suppressed when a consecutive streak is active (prev cycle has same event)', () => {
    // Previous cycle (49) had same event type → streak is active → priorSameEvent suppressed
    const species = makeSpecies({
      events: [
        { type: 'populationCrash', cycle: 48 },
        { type: 'populationCrash', cycle: 49 },
      ],
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    // Should be consecutivePattern (streak), not priorSameEvent
    expect(context?.type).not.toBe('priorSameEvent')
    expect(context?.type).toBe('consecutivePattern')
  })
})

// ─── consecutivePattern ───────────────────────────────────────────────────────

describe('selectContext — consecutivePattern', () => {
  it('fires after 3 consecutive cycles of the same event type', () => {
    const species = makeSpecies({
      events: [
        { type: 'populationCrash', cycle: 47 },
        { type: 'populationCrash', cycle: 48 },
        { type: 'populationCrash', cycle: 49 },
      ],
    })
    // Current event at cycle 50 extends the streak to 4
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    expect(context).not.toBeNull()
    expect(context.type).toBe('consecutivePattern')
    expect(context.n).toBe(4)
    expect(context.startCycle).toBe(47)
  })

  it('does not fire with only 2 consecutive cycles', () => {
    const species = makeSpecies({
      events: [
        { type: 'populationCrash', cycle: 48 },
        { type: 'populationCrash', cycle: 49 },
      ],
    })
    // Current event at cycle 50: streak would be 3, exactly at threshold
    // CONSECUTIVE_THRESHOLD = 3, and n starts at 1 for the current event
    // prior: 49, 48 → n = 1 + 2 = 3. That equals threshold, so it fires.
    // Let's test one below threshold: only 1 prior consecutive cycle
    const species2 = makeSpecies({
      events: [
        { type: 'populationCrash', cycle: 49 },
      ],
    })
    // streak would be n=2, below threshold of 3 → should NOT fire consecutivePattern
    const context = selectContext(makeEvent('populationCrash', 50), species2, makeState(50))
    expect(context?.type).not.toBe('consecutivePattern')
  })

  it('breaks streak correctly on a gap', () => {
    const species = makeSpecies({
      events: [
        { type: 'populationCrash', cycle: 40 },  // old isolated event
        { type: 'populationCrash', cycle: 49 },  // only one consecutive before current
      ],
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    // n=2 (cycle 49 + current) → below threshold → no consecutivePattern
    expect(context?.type).not.toBe('consecutivePattern')
  })
})

// ─── Cooldown suppression ─────────────────────────────────────────────────────

describe('selectContext — cooldown', () => {
  it('returns null when all candidates are on cooldown', () => {
    const species = makeSpecies({
      events: [{ type: 'populationCrash', cycle: 45 }],
      contextCooldowns: {
        priorSameEvent: 46,  // fired at 46, cooldown is 8 → next allowed at 54, current is 50
      },
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    // priorSameEvent is on cooldown; no other contexts qualify → null
    expect(context).toBeNull()
  })

  it('returns context after cooldown expires', () => {
    const species = makeSpecies({
      events: [{ type: 'populationCrash', cycle: 30 }],
      contextCooldowns: {
        priorSameEvent: 42,  // fired at 42, cooldown is 8 → allowed at 50+
      },
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    expect(context).not.toBeNull()
    expect(context.type).toBe('priorSameEvent')
  })
})

// ─── Weight ordering ──────────────────────────────────────────────────────────

describe('selectContext — weight ordering', () => {
  it('nearExtinctionRecovery wins over priorSameEvent when both qualify', () => {
    const species = makeSpecies({
      peakPopulation:        500,
      lowestPopulation:      10,   // near-extinction qualifies
      lowestPopulationCycle: 20,
      events: [
        { type: 'populationCrash', cycle: 30 },  // priorSameEvent also qualifies
      ],
    })
    const context = selectContext(makeEvent('populationCrash', 50), species, makeState(50))
    expect(context.type).toBe('nearExtinctionRecovery')
  })
})

// ─── applyContextCooldown ─────────────────────────────────────────────────────

describe('applyContextCooldown', () => {
  it('returns updated species with cooldown recorded', () => {
    const species  = makeSpecies()
    const updated  = applyContextCooldown(species, 'priorSameEvent', 50)
    expect(updated.history.contextCooldowns.priorSameEvent).toBe(50)
  })

  it('does not mutate the original species', () => {
    const species = makeSpecies()
    applyContextCooldown(species, 'priorSameEvent', 50)
    expect(species.history.contextCooldowns.priorSameEvent).toBeUndefined()
  })

  it('preserves existing cooldowns when adding a new one', () => {
    const species = makeSpecies({ contextCooldowns: { consecutivePattern: 40 } })
    const updated = applyContextCooldown(species, 'priorSameEvent', 50)
    expect(updated.history.contextCooldowns.consecutivePattern).toBe(40)
    expect(updated.history.contextCooldowns.priorSameEvent).toBe(50)
  })
})
