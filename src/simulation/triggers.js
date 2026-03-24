import { ADAPTATION_THRESHOLD, STABILIZED_CYCLES } from './migration.js'

// Event threshold checks — pure function, no side effects.
// Takes (prevState, nextState), returns array of event objects.
//
// Each event: { type, cycle, speciesId?, biomeId?, data }

// Cooldown tracking: per-run object passed through state to prevent event floods.
// For now events only fire once per condition (no cooldown needed for most).

const EVENT_TYPES = {
  EXTINCTION:          'extinction',
  EXTINCTION_WARNING:  'extinctionWarning',
  POPULATION_CRISIS:   'populationCrisis',
  POPULATION_SURGE:    'populationSurge',
  POPULATION_STABLE:   'populationStable',
  POPULATION_LOW:      'populationLow',
  CASCADE_RISK:             'cascadeRisk',
  BIOME_STRESS:             'biomeStress',
  BIOME_RECOVERY:           'biomeRecovery',
  FIRST_BIOME_ENTRY:        'firstBiomeEntry',
  SUBPOPULATION_STABILIZED: 'subpopulationStabilized',
  SUBPOPULATION_FAILED:     'subpopulationFailed',
  SPECIATION_CANDIDATE:     'speciationCandidate',
}

export { EVENT_TYPES }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function indexById(species) {
  const m = {}
  for (const sp of species) m[sp.id] = sp
  return m
}

// Returns { [speciesId]: { predators: [id, ...], prey: [id, ...] } }
// predators = species that eat this one; prey = species this one eats
function buildRelationships(species) {
  const rel = {}
  for (const sp of species) {
    if (!rel[sp.id]) rel[sp.id] = { predators: [], prey: [] }
    for (const eat of sp.eats) {
      if (!rel[eat.preyId]) rel[eat.preyId] = { predators: [], prey: [] }
      rel[sp.id].prey.push(eat.preyId)
      rel[eat.preyId].predators.push(sp.id)
    }
  }
  return rel
}

// ─── Main threshold check ─────────────────────────────────────────────────────

export function checkThresholds(prevState, nextState) {
  const events  = []
  const cycle   = nextState.cycle
  const prevMap = indexById(prevState.species)
  const nextMap = indexById(nextState.species)
  const rel     = buildRelationships(nextState.species)

  // ── Species-level events ──────────────────────────────────────────────────

  for (const sp of nextState.species) {
    const prev = prevMap[sp.id]
    if (!prev) continue

    const wasAlive = prev.population > 0
    const nowDead  = sp.population === 0

    // Extinction
    if (wasAlive && nowDead) {
      events.push({
        type:      EVENT_TYPES.EXTINCTION,
        cycle,
        speciesId: sp.id,
        data: {
          name:             sp.name,
          lastPopulation:   prev.population,
          peakPopulation:   sp.history.peakPopulation,
        },
      })

      // Cascade risk: flag species that depended on this one
      const { predators, prey } = rel[sp.id] || { predators: [], prey: [] }

      // Predators that ate this species have lost a food source
      for (const predId of predators) {
        const predSp = nextMap[predId]
        if (!predSp || predSp.population === 0) continue
        // Only flag if this was their only or primary food source
        const otherPrey = (rel[predId]?.prey || []).filter(id => id !== sp.id)
        const hasOtherFood = otherPrey.some(id => (nextMap[id]?.population ?? 0) > 0)
        events.push({
          type:      EVENT_TYPES.CASCADE_RISK,
          cycle,
          speciesId: predId,
          data: {
            name:          predSp.name,
            trigger:       'preyLost',
            lostSpecies:   sp.name,
            hasOtherFood,
          },
        })
      }

      // Prey that this species kept in check may now surge
      for (const preyId of prey) {
        const preySp = nextMap[preyId]
        if (!preySp || preySp.population === 0) continue
        // Only flag if this was their only predator
        const otherPredators = (rel[preyId]?.predators || []).filter(id => id !== sp.id)
        const hasOtherPredators = otherPredators.some(id => (nextMap[id]?.population ?? 0) > 0)
        if (!hasOtherPredators) {
          events.push({
            type:      EVENT_TYPES.CASCADE_RISK,
            cycle,
            speciesId: preyId,
            data: {
              name:        preySp.name,
              trigger:     'predatorLost',
              lostSpecies: sp.name,
            },
          })
        }
      }

      continue  // no further checks for an extinct species
    }

    if (!wasAlive) continue  // already extinct, skip

    const baseline = sp.history.baseline

    // Extinction warning: below 15 % of baseline
    if (sp.population < baseline * 0.15 && prev.population >= baseline * 0.15) {
      events.push({
        type:      EVENT_TYPES.EXTINCTION_WARNING,
        cycle,
        speciesId: sp.id,
        data: {
          name:       sp.name,
          population: sp.population,
          baseline,
          pct:        sp.population / baseline,
        },
      })
    }

    // Population crisis: dropped more than 30 % in one cycle
    if (prev.population > 0) {
      const drop = (prev.population - sp.population) / prev.population
      if (drop > 0.30) {
        events.push({
          type:      EVENT_TYPES.POPULATION_CRISIS,
          cycle,
          speciesId: sp.id,
          data: {
            name:           sp.name,
            prevPopulation: prev.population,
            nextPopulation: sp.population,
            dropPct:        drop,
          },
        })
      }
    }

    // Population surge: new all-time high, and meaningfully above starting baseline
    if (
      sp.population > sp.history.peakPopulation &&
      sp.population > sp.history.baseline * 1.2
    ) {
      events.push({
        type:      EVENT_TYPES.POPULATION_SURGE,
        cycle,
        speciesId: sp.id,
        data: {
          name:           sp.name,
          population:     sp.population,
          previousPeak:   sp.history.peakPopulation,
        },
      })
    }

    // Population low: new all-time low — but only fires when entering new-low territory
    // from a meaningful recovery (prev was ≥10 % above the old record low).
    // During continuous declines the guard prevents re-firing every cycle.
    if (
      cycle > 20 &&
      sp.population > 0 &&
      sp.population < prev.history.lowestPopulation &&
      prev.population > prev.history.lowestPopulation * 1.10 &&
      sp.population >= sp.history.baseline * 0.15  // below this, extinctionWarning fires instead
    ) {
      events.push({
        type:      EVENT_TYPES.POPULATION_LOW,
        cycle,
        speciesId: sp.id,
        data: {
          name:        sp.name,
          population:  sp.population,
          previousLow: prev.history.lowestPopulation,
          baseline:    sp.history.baseline,
        },
      })
    }

    // Unusually stable: 20+ consecutive cycles of <2 % change (not in first 30 cycles)
    if (sp.history.stableCycles === 20 && cycle > 30) {
      events.push({
        type:      EVENT_TYPES.POPULATION_STABLE,
        cycle,
        speciesId: sp.id,
        data: {
          name:       sp.name,
          population: sp.population,
        },
      })
    }
  }

  // ── Migration / subpopulation events ─────────────────────────────────────

  for (const sp of nextState.species) {
    const prev = prevMap[sp.id]
    if (!prev) continue

    const prevSubs = prev.subpopulations || []
    const nextSubs = sp.subpopulations   || []

    // Index previous subpopulations by biome for quick lookup
    const prevSubMap = {}
    for (const sub of prevSubs) prevSubMap[sub.biome] = sub

    for (const sub of nextSubs) {
      const prevSub = prevSubMap[sub.biome]

      // First biome entry: subpopulation just appeared (no prior sub in this biome)
      if (!prevSub) {
        events.push({
          type:      EVENT_TYPES.FIRST_BIOME_ENTRY,
          cycle,
          speciesId: sp.id,
          data: {
            name:       sp.name,
            biome:      sub.biome,
            population: sub.population,
          },
        })
        continue
      }

      // Subpopulation stabilized: alive for exactly STABILIZED_CYCLES
      if (sub.cyclesAlive === STABILIZED_CYCLES) {
        events.push({
          type:      EVENT_TYPES.SUBPOPULATION_STABILIZED,
          cycle,
          speciesId: sp.id,
          data: {
            name:       sp.name,
            biome:      sub.biome,
            population: sub.population,
          },
        })
      }

      // Speciation candidate: adaptation threshold just crossed
      if (
        sub.adaptationCycles >= ADAPTATION_THRESHOLD &&
        prevSub.adaptationCycles < ADAPTATION_THRESHOLD
      ) {
        events.push({
          type:      EVENT_TYPES.SPECIATION_CANDIDATE,
          cycle,
          speciesId: sp.id,
          data: {
            name:              sp.name,
            biome:             sub.biome,
            population:        sub.population,
            adaptationCycles:  sub.adaptationCycles,
          },
        })
      }
    }

    // Subpopulation failed: was in prevState, gone in nextState
    for (const prevSub of prevSubs) {
      const stillExists = nextSubs.some(s => s.biome === prevSub.biome)
      if (!stillExists && prevSub.cyclesAlive > 0) {
        events.push({
          type:      EVENT_TYPES.SUBPOPULATION_FAILED,
          cycle,
          speciesId: sp.id,
          data: {
            name:        sp.name,
            biome:       prevSub.biome,
            cyclesAlive: prevSub.cyclesAlive,
          },
        })
      }
    }
  }

  // ── Biome-level events ────────────────────────────────────────────────────

  const biomeIds = ['highgrowth', 'understory', 'scorchFlats']

  for (const biomeId of biomeIds) {
    const prev = prevState.biomes[biomeId]
    const next = nextState.biomes[biomeId]
    if (!prev || !next) continue

    // Biome stress: health dropped below 0.3 (fire once on the crossing)
    if (next.health < 0.3 && prev.health >= 0.3) {
      events.push({
        type:    EVENT_TYPES.BIOME_STRESS,
        cycle,
        biomeId,
        data: {
          name:   next.name,
          health: next.health,
        },
      })
    }

    // Biome recovery: health climbed back above 0.5 from below 0.3
    if (next.health >= 0.5 && prev.health < 0.5 && cycle > 10) {
      events.push({
        type:    EVENT_TYPES.BIOME_RECOVERY,
        cycle,
        biomeId,
        data: {
          name:   next.name,
          health: next.health,
        },
      })
    }
  }

  return events
}
