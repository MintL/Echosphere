import { ADAPTATION_THRESHOLD, STABILIZED_CYCLES } from './migration.js'
import { getCandidatesForRole } from '../data/catalog.js'

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
  NICHE_OPENED:             'nicheOpened',
  FIRST_SIGHTING:      'firstSighting',
  SUBSEQUENT_SIGHTING: 'subsequentSighting',
  SPECIES_NAMED:       'speciesNamed',
  STUDY_SUGGESTED:     'studySuggested',
  STUDY_COMPLETED:    'studyCompleted',
  RESEARCH_STARTED:   'researchStarted',
}

export { EVENT_TYPES }

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Knowledge tier gating ────────────────────────────────────────────────────
//
// Tiers: 0=undiscovered, 1=sighted, 2=known, 3=understood, 4=modeled
// Source: GDD "Event Gating by Knowledge Milestone"

function getKnowledgeTier(sp) {
  const m = sp.milestones || {}
  if (!m.observed)          return 0
  if (!m.roleIdentified)    return 1
  if (!m.behaviorMapped)    return 2
  if (!m.populationModeled) return 3
  return 4
}

// Minimum tier required for each event type to fire
const EVENT_MIN_TIER = {
  extinction:              1,  // sighted
  nicheOpened:             2,  // known
  extinctionWarning:       3,  // understood
  populationCrisis:        3,  // understood
  cascadeRisk:             3,  // understood
  populationSurge:         2,  // known
  populationLow:           2,  // known
  populationStable:        2,  // known
  firstBiomeEntry:         2,  // known
  subpopulationStabilized: 2,  // known
  subpopulationFailed:     2,  // known
  speciationCandidate:     3,  // understood
}

function canFire(eventType, sp) {
  const required = EVENT_MIN_TIER[eventType] ?? 1
  return getKnowledgeTier(sp) >= required
}

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
    if (getKnowledgeTier(sp) === 0) continue  // undiscovered — no events

    const wasAlive = prev.population > 0
    const nowDead  = sp.population === 0

    // Extinction (requires: sighted)
    if (wasAlive && nowDead) {
      if (canFire('extinction', sp)) {
        events.push({
          type:      EVENT_TYPES.EXTINCTION,
          cycle,
          speciesId: sp.id,
          data: {
            name:           sp.name,
            lastPopulation: prev.population,
            peakPopulation: sp.history.peakPopulation,
          },
        })
      }

      // Niche opened (requires: known)
      const catalogRole = sp.catalogRole
      if (catalogRole && canFire('nicheOpened', sp)) {
        const candidates = getCandidatesForRole(catalogRole)
          .filter(c => !nextState.species.some(s => s.id === c.id))
        if (candidates.length > 0) {
          events.push({
            type:      EVENT_TYPES.NICHE_OPENED,
            cycle,
            speciesId: sp.id,
            data: {
              extinctName: sp.name,
              catalogRole,
              candidates:  candidates.map(c => ({
                id:            c.id,
                name:          c.name,
                candidateType: c.candidateType,
                fieldNote:     c.fieldNote,
              })),
            },
          })
        }
      }

      // Cascade risk (requires: understood — on the affected species, not the extinct one)
      const { predators, prey } = rel[sp.id] || { predators: [], prey: [] }

      for (const predId of predators) {
        const predSp = nextMap[predId]
        if (!predSp || predSp.population === 0) continue
        if (!canFire('cascadeRisk', predSp)) continue
        const otherPrey = (rel[predId]?.prey || []).filter(id => id !== sp.id)
        const hasOtherFood = otherPrey.some(id => (nextMap[id]?.population ?? 0) > 0)
        events.push({
          type:      EVENT_TYPES.CASCADE_RISK,
          cycle,
          speciesId: predId,
          data: { name: predSp.name, trigger: 'preyLost', lostSpeciesId: sp.id, lostSpecies: sp.name, hasOtherFood },
        })
      }

      for (const preyId of prey) {
        const preySp = nextMap[preyId]
        if (!preySp || preySp.population === 0) continue
        if (!canFire('cascadeRisk', preySp)) continue
        const otherPredators = (rel[preyId]?.predators || []).filter(id => id !== sp.id)
        const hasOtherPredators = otherPredators.some(id => (nextMap[id]?.population ?? 0) > 0)
        if (!hasOtherPredators) {
          events.push({
            type:      EVENT_TYPES.CASCADE_RISK,
            cycle,
            speciesId: preyId,
            data: { name: preySp.name, trigger: 'predatorLost', lostSpeciesId: sp.id, lostSpecies: sp.name },
          })
        }
      }

      continue
    }

    if (!wasAlive) continue

    const baseline = sp.history.baseline

    // Extinction warning (requires: understood)
    if (canFire('extinctionWarning', sp) && sp.population < baseline * 0.15 && prev.population >= baseline * 0.15) {
      events.push({
        type:      EVENT_TYPES.EXTINCTION_WARNING,
        cycle,
        speciesId: sp.id,
        data: { name: sp.name, population: sp.population, baseline, pct: sp.population / baseline },
      })
    }

    // Population crisis (requires: understood)
    if (canFire('populationCrisis', sp) && prev.population > 0) {
      const drop = (prev.population - sp.population) / prev.population
      if (drop > 0.10) {
        events.push({
          type:      EVENT_TYPES.POPULATION_CRISIS,
          cycle,
          speciesId: sp.id,
          data: { name: sp.name, prevPopulation: prev.population, nextPopulation: sp.population, dropPct: drop },
        })
      }
    }

    // Population surge (requires: known)
    // Compares against population 8 cycles ago so short-term noise doesn't
    // dominate — the species needs to be genuinely higher than it was recently.
    const pop8     = sp.history.recentPopulations?.[0]
    const prevPop8 = prev.history.recentPopulations?.[0]
    if (
      canFire('populationSurge', sp) &&
      pop8 != null &&
      sp.population > pop8 * 1.10 &&
      sp.population > sp.history.baseline * 1.2 &&
      (prevPop8 == null || prev.population <= prevPop8 * 1.10)
    ) {
      events.push({
        type:      EVENT_TYPES.POPULATION_SURGE,
        cycle,
        speciesId: sp.id,
        data: { name: sp.name, population: sp.population, pop8: Math.round(pop8) },
      })
    }

    // Population low (requires: known)
    if (
      canFire('populationLow', sp) &&
      cycle > 20 &&
      sp.population > 0 &&
      sp.population < prev.history.lowestPopulation &&
      prev.population > prev.history.lowestPopulation * 1.10 &&
      sp.population >= sp.history.baseline * 0.15
    ) {
      events.push({
        type:      EVENT_TYPES.POPULATION_LOW,
        cycle,
        speciesId: sp.id,
        data: { name: sp.name, population: sp.population, previousLow: prev.history.lowestPopulation, baseline: sp.history.baseline },
      })
    }

    // Population stable (requires: known)
    if (canFire('populationStable', sp) && sp.history.stableCycles === 20 && cycle > 30) {
      events.push({
        type:      EVENT_TYPES.POPULATION_STABLE,
        cycle,
        speciesId: sp.id,
        data: { name: sp.name, population: sp.population },
      })
    }
  }

  // ── Migration / subpopulation events ─────────────────────────────────────

  for (const sp of nextState.species) {
    const prev = prevMap[sp.id]
    if (!prev) continue
    if (!canFire('firstBiomeEntry', sp)) continue  // requires: known

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

      // Speciation candidate: adaptation threshold just crossed (requires: understood)
      if (canFire('speciationCandidate', sp) &&
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

// ─── Discovery checks ─────────────────────────────────────────────────────────

export function checkDiscovery(prevState, nextState) {
  const events  = []
  const cycle   = nextState.cycle
  const prevMap = indexById(prevState.species)

  for (const sp of nextState.species) {
    if (sp.population <= 0) continue

    const prev     = prevMap[sp.id]
    if (!prev) continue

    const prevDisc = prev.discovery || { sightingScore: 0, sightingCount: 0 }
    const nextDisc = sp.discovery   || { sightingScore: 0, sightingCount: 0 }

    // firstSighting: sightingScore crossed 1.0 for the first time
    if (prevDisc.sightingScore < 1.0 && nextDisc.sightingScore >= 1.0) {
      events.push({
        type:      EVENT_TYPES.FIRST_SIGHTING,
        cycle,
        speciesId: sp.id,
        data: {
          name:      sp.name,
          population: sp.population,
          biomeName: sp.homeBiome,
        },
      })
    }

    // subsequentSighting: counts 2–5 (4 lines in renderer, no repeats)
    if (
      nextDisc.sightingCount > prevDisc.sightingCount &&
      prevDisc.sightingCount >= 1 &&
      nextDisc.sightingCount <= 5
    ) {
      events.push({
        type:      EVENT_TYPES.SUBSEQUENT_SIGHTING,
        cycle,
        speciesId: sp.id,
        data: {
          name:         sp.name,
          population:   sp.population,
          sightingCount: nextDisc.sightingCount,
          biomeName:    sp.homeBiome,
        },
      })
    }

    // speciesNamed: automatic at sightingCount=3 — researcher coins the name informally
    if (prevDisc.sightingCount < 3 && nextDisc.sightingCount >= 3 && sp.milestones.named) {
      events.push({
        type:      EVENT_TYPES.SPECIES_NAMED,
        cycle,
        speciesId: sp.id,
        data: { name: sp.name },
      })
    }

    // studySuggested: sightingCount just reached 3, named but role not yet identified
    if (prevDisc.sightingCount < 3 && nextDisc.sightingCount >= 3 && sp.milestones.named && !sp.milestones.roleIdentified) {
      events.push({
        type:      EVENT_TYPES.STUDY_SUGGESTED,
        cycle,
        speciesId: sp.id,
        data: {
          name: sp.name,
        },
      })
    }
  }

  return events
}

// ─── Research checks ──────────────────────────────────────────────────────────

export function checkResearch(prevState, nextState) {
  const events = []
  const cycle  = nextState.cycle

  const prevResearch = prevState.research || { active: null, queue: [], history: [] }
  const nextResearch = nextState.research || { active: null, queue: [], history: [] }

  // studyCompleted: active project was just completed (moved to history)
  if (
    prevResearch.active !== null &&
    nextResearch.active?.id !== prevResearch.active.id &&
    nextResearch.history.length > prevResearch.history.length
  ) {
    const completed = nextResearch.history[nextResearch.history.length - 1]
    events.push({
      type:  EVENT_TYPES.STUDY_COMPLETED,
      cycle,
      speciesId: completed.targetId,
      data: {
        tier:       completed.type,
        targetName: completed.targetName,
        name:       completed.name,
      },
    })
  }

  // researchStarted: a new project became active (prev had no active or a different one)
  if (
    nextResearch.active !== null &&
    prevResearch.active?.id !== nextResearch.active.id
  ) {
    // Only fire if this is a fresh start (not a carry-over from prev state)
    // We detect "fresh start" by checking if startCycle === current cycle
    if (nextResearch.active.startCycle === cycle) {
      events.push({
        type:  EVENT_TYPES.RESEARCH_STARTED,
        cycle,
        speciesId: nextResearch.active.targetId,
        data: {
          name:           nextResearch.active.name,
          targetName:     nextResearch.active.targetName,
          durationCycles: nextResearch.active.durationCycles,
        },
      })
    }
  }

  return events
}
