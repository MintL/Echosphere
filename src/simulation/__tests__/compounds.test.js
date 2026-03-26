import { describe, it, expect } from 'vitest'
import { detectCompoundEvents } from '../compounds.js'

// ─── Minimal test helpers ─────────────────────────────────────────────────────

function makeSpecies(overrides) {
  return {
    id:          overrides.id,
    name:        overrides.name ?? overrides.id,
    population:  overrides.population ?? 100,
    homeBiome:   overrides.homeBiome ?? 'highgrowth',
    catalogRole: overrides.catalogRole ?? null,
    role:        overrides.role ?? null,
    eats:        overrides.eats ?? [],
    history:     {},
    milestones:  {},
    ...overrides,
  }
}

function makeEvent(overrides) {
  return {
    id:       overrides.id ?? 'ev-1',
    cycle:    overrides.cycle ?? 10,
    absorbed: false,
    ...overrides,
  }
}

function makeState(species) {
  return { species }
}

// ─── predatorBoomPreyCrash ────────────────────────────────────────────────────

describe('detectCompoundEvents — predatorBoomPreyCrash', () => {
  it('detects compound when predator surges and prey crashes in same cycle', () => {
    const keth   = makeSpecies({ id: 'keth',   eats: [{ preyId: 'vellin' }] })
    const vellin = makeSpecies({ id: 'vellin', eats: [] })
    const state  = makeState([keth, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationSurge',  speciesId: 'keth',   cycle: 10 }),
      makeEvent({ id: 'ev-2', type: 'populationCrisis', speciesId: 'vellin', cycle: 10 }),
    ]

    const compounds = detectCompoundEvents(events, state)
    expect(compounds).toHaveLength(1)
    expect(compounds[0].subtype).toBe('predatorBoomPreyCrash')
    expect(compounds[0].data.predatorId).toBe('keth')
    expect(compounds[0].data.preyId).toBe('vellin')
    expect(compounds[0].absorbedEventIds).toEqual(['ev-1', 'ev-2'])
    expect(compounds[0].cycle).toBe(10)
    expect(compounds[0].speciesId).toBe('keth')
  })

  it('does not detect compound when predator does not eat the crashed species', () => {
    const keth    = makeSpecies({ id: 'keth',    eats: [{ preyId: 'feltmoss' }] })
    const vellin  = makeSpecies({ id: 'vellin',  eats: [] })
    const state   = makeState([keth, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationSurge',  speciesId: 'keth',   cycle: 10 }),
      makeEvent({ id: 'ev-2', type: 'populationCrisis', speciesId: 'vellin', cycle: 10 }),
    ]

    expect(detectCompoundEvents(events, state)).toHaveLength(0)
  })

  it('does not detect compound when only surge fires (no crisis)', () => {
    const keth   = makeSpecies({ id: 'keth', eats: [{ preyId: 'vellin' }] })
    const vellin = makeSpecies({ id: 'vellin', eats: [] })
    const state  = makeState([keth, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationSurge', speciesId: 'keth', cycle: 10 }),
    ]

    expect(detectCompoundEvents(events, state)).toHaveLength(0)
  })

  it('creates one compound per matching pair when predator eats multiple prey', () => {
    const keth    = makeSpecies({ id: 'keth', eats: [{ preyId: 'vellin' }, { preyId: 'woldren' }] })
    const vellin  = makeSpecies({ id: 'vellin',  eats: [] })
    const woldren = makeSpecies({ id: 'woldren', eats: [] })
    const state   = makeState([keth, vellin, woldren])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationSurge',  speciesId: 'keth',    cycle: 10 }),
      makeEvent({ id: 'ev-2', type: 'populationCrisis', speciesId: 'vellin',  cycle: 10 }),
      makeEvent({ id: 'ev-3', type: 'populationCrisis', speciesId: 'woldren', cycle: 10 }),
    ]

    const compounds = detectCompoundEvents(events, state)
    expect(compounds).toHaveLength(2)
    expect(compounds.map(c => c.data.preyId).sort()).toEqual(['vellin', 'woldren'])
  })
})

// ─── apexPredatorDepartureSecondaryBoom ──────────────────────────────────────

describe('detectCompoundEvents — apexPredatorDepartureSecondaryBoom', () => {
  it('detects compound when apex crashes and secondary booms in same biome', () => {
    const mordath  = makeSpecies({ id: 'mordath', catalogRole: 'apexPredator',      homeBiome: 'highgrowth', eats: [] })
    const keth     = makeSpecies({ id: 'keth',    catalogRole: 'secondaryConsumer',  homeBiome: 'highgrowth', eats: [] })
    const state    = makeState([mordath, keth])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationCrisis', speciesId: 'mordath', cycle: 20 }),
      makeEvent({ id: 'ev-2', type: 'populationSurge',  speciesId: 'keth',    cycle: 20 }),
    ]

    const compounds = detectCompoundEvents(events, state)
    expect(compounds).toHaveLength(1)
    expect(compounds[0].subtype).toBe('apexPredatorDepartureSecondaryBoom')
    expect(compounds[0].data.apexId).toBe('mordath')
    expect(compounds[0].data.secondaryId).toBe('keth')
  })

  it('does not detect compound when apex and secondary are in different biomes', () => {
    const mordath = makeSpecies({ id: 'mordath', catalogRole: 'apexPredator',     homeBiome: 'highgrowth',  eats: [] })
    const keth    = makeSpecies({ id: 'keth',    catalogRole: 'secondaryConsumer', homeBiome: 'scorchFlats', eats: [] })
    const state   = makeState([mordath, keth])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationCrisis', speciesId: 'mordath', cycle: 20 }),
      makeEvent({ id: 'ev-2', type: 'populationSurge',  speciesId: 'keth',    cycle: 20 }),
    ]

    expect(detectCompoundEvents(events, state)).toHaveLength(0)
  })

  it('detects compound on extinction as well as crisis', () => {
    const mordath = makeSpecies({ id: 'mordath', catalogRole: 'apexPredator',     homeBiome: 'highgrowth', eats: [] })
    const keth    = makeSpecies({ id: 'keth',    catalogRole: 'secondaryConsumer', homeBiome: 'highgrowth', eats: [] })
    const state   = makeState([mordath, keth])

    const events = [
      makeEvent({ id: 'ev-1', type: 'extinction',      speciesId: 'mordath', cycle: 20 }),
      makeEvent({ id: 'ev-2', type: 'populationSurge', speciesId: 'keth',    cycle: 20 }),
    ]

    const compounds = detectCompoundEvents(events, state)
    expect(compounds).toHaveLength(1)
    expect(compounds[0].subtype).toBe('apexPredatorDepartureSecondaryBoom')
  })
})

// ─── producerCrashPrimaryConsumerCrisis ──────────────────────────────────────

describe('detectCompoundEvents — producerCrashPrimaryConsumerCrisis', () => {
  it('detects compound when producer crashes and dependent consumer hits extinction warning', () => {
    const feltmoss = makeSpecies({ id: 'feltmoss', role: 'producer', eats: [] })
    const vellin   = makeSpecies({ id: 'vellin',   eats: [{ preyId: 'feltmoss' }] })
    const state    = makeState([feltmoss, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationCrisis',    speciesId: 'feltmoss', cycle: 30 }),
      makeEvent({ id: 'ev-2', type: 'extinctionWarning',   speciesId: 'vellin',   cycle: 30 }),
    ]

    const compounds = detectCompoundEvents(events, state)
    expect(compounds).toHaveLength(1)
    expect(compounds[0].subtype).toBe('producerCrashPrimaryConsumerCrisis')
    expect(compounds[0].data.producerId).toBe('feltmoss')
    expect(compounds[0].data.consumerId).toBe('vellin')
    expect(compounds[0].cycle).toBe(30)
    expect(compounds[0].speciesId).toBe('feltmoss')
  })

  it('does not detect compound when consumer does not eat the crashed producer', () => {
    const feltmoss  = makeSpecies({ id: 'feltmoss',  role: 'producer', eats: [] })
    const scaleweed = makeSpecies({ id: 'scaleweed', role: 'producer', eats: [] })
    const vellin    = makeSpecies({ id: 'vellin',    eats: [{ preyId: 'scaleweed' }] })
    const state     = makeState([feltmoss, scaleweed, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationCrisis',  speciesId: 'feltmoss', cycle: 30 }),
      makeEvent({ id: 'ev-2', type: 'extinctionWarning', speciesId: 'vellin',   cycle: 30 }),
    ]

    expect(detectCompoundEvents(events, state)).toHaveLength(0)
  })
})

// ─── Unrelated events — no compounds ─────────────────────────────────────────

describe('detectCompoundEvents — no false positives', () => {
  it('returns empty array when events are unrelated', () => {
    const keth   = makeSpecies({ id: 'keth',   eats: [] })
    const vellin = makeSpecies({ id: 'vellin', eats: [] })
    const state  = makeState([keth, vellin])

    const events = [
      makeEvent({ id: 'ev-1', type: 'populationSurge',  speciesId: 'keth',   cycle: 10 }),
      makeEvent({ id: 'ev-2', type: 'populationCrisis', speciesId: 'vellin', cycle: 10 }),
    ]

    expect(detectCompoundEvents(events, state)).toHaveLength(0)
  })

  it('returns empty array when no events', () => {
    const state = makeState([])
    expect(detectCompoundEvents([], state)).toHaveLength(0)
  })
})
