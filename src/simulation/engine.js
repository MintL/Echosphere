import { mulberry32, noise, advanceSeed } from './rng.js'
import { generateWorld } from './worldgen.js'
import { checkThresholds, checkDiscovery, checkResearch } from './triggers.js'
import { processMigration } from './migration.js'
import { getCatalogSpecies } from '../data/catalog.js'
import { advanceResearch, applyProjectCompletion, makeStudySuggestion, hasSuggestion } from './research.js'
import { detectCompoundEvents } from './compounds.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const EXTINCTION_THRESHOLD = 1.0
const DEATH_FLOOR = 5          // minimum dead matter per cycle (keeps Grubmere alive)

// Reference populations for biome health calculation
const HEALTH_REF = { feltmoss: 800, nightroot: 400, scaleweed: 200, grubmere: 200 }

// Biome stress from extreme population events
const STRESS_DECAY = 0.92   // stress multiplier per cycle (decays over ~20 cycles)
const MAX_STRESS   = 0.6    // cap — prevents permanent biome death

// ─── Food web index ───────────────────────────────────────────────────────────

// Returns { [preyId]: [{ predatorId, attackRate, efficiency, borderScaled }] }
function buildFoodWeb(species) {
  const web = {}
  for (const sp of species) {
    for (const eat of sp.eats) {
      if (!web[eat.preyId]) web[eat.preyId] = []
      web[eat.preyId].push({
        predatorId: sp.id,
        attackRate: eat.attackRate,
        efficiency: eat.efficiency,
        borderScaled: eat.borderScaled || false,
      })
    }
  }
  return web
}

// ─── Environmental calculations ──────────────────────────────────────────────

// biomeStress: { highgrowth, understory, scorchFlats } — accumulated from extreme events
function computeBiomeHealth(spMap, biomeStress = {}) {
  const f = (id, ref) => Math.min((spMap[id]?.population ?? 0) / ref, 1)

  const base = {
    highgrowth:  Math.max(0.1, 0.3 + 0.7 * f('feltmoss', HEALTH_REF.feltmoss)),
    understory:  Math.max(0.1, 0.3 + 0.7 * (
      f('nightroot', HEALTH_REF.nightroot) * 0.5 +
      f('grubmere',  HEALTH_REF.grubmere)  * 0.5
    )),
    scorchFlats: Math.max(0.1, 0.3 + 0.7 * f('scaleweed', HEALTH_REF.scaleweed)),
  }

  return {
    highgrowth:  Math.max(0.1, base.highgrowth  * (1 - (biomeStress.highgrowth  || 0))),
    understory:  Math.max(0.1, base.understory   * (1 - (biomeStress.understory  || 0))),
    scorchFlats: Math.max(0.1, base.scorchFlats  * (1 - (biomeStress.scorchFlats || 0))),
  }
}

// Compute how much stress each biome accumulates this cycle from crashes and explosions.
// Crash >25 %: +0.04. Crash >50 %: +0.04 more. Population >2× baseline: +0.02. >4×: +0.02 more.
function computeStressIncrements(oldSpecies, newSpecies) {
  const inc = { highgrowth: 0, understory: 0, scorchFlats: 0 }
  for (let i = 0; i < oldSpecies.length; i++) {
    const oldSp = oldSpecies[i]
    const newSp = newSpecies[i]
    if (oldSp.population <= 0) continue

    const biome = oldSp.homeBiome
    const drop  = (oldSp.population - newSp.population) / oldSp.population

    if (drop > 0.25) inc[biome] += 0.04
    if (drop > 0.50) inc[biome] += 0.04

    if (newSp.population > oldSp.history.baseline * 2) inc[biome] += 0.02
    if (newSp.population > oldSp.history.baseline * 4) inc[biome] += 0.02
  }
  return inc
}

// Grubmere modifier: scales producer growth rates.
// At reference population (200): 1.0. At zero: 0.3. Above reference: up to 1.5.
function computeGrubmereMod(grubmere) {
  const frac = (grubmere?.population ?? 0) / HEALTH_REF.grubmere
  return Math.min(Math.max(frac, 0.3), 1.5)
}

// Health of the biome where a piece of prey lives (used to scale hunting gains)
function preyBiomeHealth(preyId, spMap, biomeHealth) {
  const sp = spMap[preyId]
  if (!sp) return 1
  // Border species: blend home + border biome health
  if (sp.borderPosition > 0 && sp.borderBiome) {
    return (1 - sp.borderPosition) * biomeHealth[sp.homeBiome] +
                sp.borderPosition  * biomeHealth[sp.borderBiome]
  }
  return biomeHealth[sp.homeBiome]
}

// ─── Delta calculations ───────────────────────────────────────────────────────

// Total predation removed from sp.population this cycle
function predationLossOn(sp, spMap, foodWeb) {
  const predators = foodWeb[sp.id] || []
  const halfSat   = sp.history.baseline * 0.10
  return predators.reduce((sum, { predatorId, attackRate, borderScaled }) => {
    const pred = spMap[predatorId]
    if (!pred || pred.population <= 0) return sum
    const rate    = borderScaled ? attackRate * pred.borderPosition : attackRate
    const holling = sp.population / (sp.population + halfSat)
    return sum + rate * pred.population * sp.population * holling
  }, 0)
}

function computeProducerDelta(sp, spMap, foodWeb, biomeHealth, grubmereMod) {
  const health = biomeHealth[sp.homeBiome]
  const growth = sp.naturalGrowthRate
    * sp.population
    * (1 - sp.population / sp.carryingCapacity)
    * grubmereMod
    * health
  const predLoss   = predationLossOn(sp, spMap, foodWeb)
  const naturalDeath = sp.naturalDeathRate * sp.population
  return growth - predLoss - naturalDeath
}

function computeConsumerDelta(sp, spMap, foodWeb, biomeHealth) {
  const gains = sp.eats.reduce((sum, eat) => {
    const prey = spMap[eat.preyId]
    if (!prey || prey.population <= 0) return sum
    const rate    = eat.borderScaled ? eat.attackRate * sp.borderPosition : eat.attackRate
    const health  = preyBiomeHealth(eat.preyId, spMap, biomeHealth)
    const comfort = eat.borderScaled ? (sp.biomeComfort[prey.homeBiome] ?? 1) : 1
    const halfSat = prey.history.baseline * 0.10
    const holling = prey.population / (prey.population + halfSat)
    return sum + eat.efficiency * rate * prey.population * sp.population * health * comfort * holling
  }, 0)
  const naturalDeath = sp.naturalDeathRate * sp.population
  const predLoss     = predationLossOn(sp, spMap, foodWeb)
  return gains - naturalDeath - predLoss
}

function computeGrubmereDelta(grubmere, totalDeaths, biomeHealth) {
  if (grubmere.population <= 0) return 0
  const health = biomeHealth.understory
  const growth = grubmere.naturalGrowthRate
    * totalDeaths
    * (1 - grubmere.population / grubmere.carryingCapacity)
    * health
  const naturalDeath = grubmere.naturalDeathRate * grubmere.population
  return growth - naturalDeath
}

// ─── Single-cycle simulation ──────────────────────────────────────────────────

export function simulateCycle(state) {
  // Index species by id for O(1) lookup
  const spMap = {}
  for (const sp of state.species) spMap[sp.id] = sp

  const foodWeb     = buildFoodWeb(state.species)
  const biomeStress = {
    highgrowth:  state.biomes.highgrowth.stress  || 0,
    understory:  state.biomes.understory.stress  || 0,
    scorchFlats: state.biomes.scorchFlats.stress || 0,
  }
  const biomeHealth = computeBiomeHealth(spMap, biomeStress)
  const grubmereMod = computeGrubmereMod(spMap.grubmere)

  // Per-cycle RNG: deterministic per (seed, cycle) pair
  const rng = mulberry32(state.randomSeed ^ (state.cycle * 0x9e3779b9))

  // Phase 1: compute raw deltas (read-only from current state)
  const deltas = {}
  let totalDeaths = DEATH_FLOOR

  for (const sp of state.species) {
    if (sp.id === 'grubmere') continue
    if (sp.population <= 0) { deltas[sp.id] = 0; continue }

    let raw
    if (sp.role === 'producer') {
      raw = computeProducerDelta(sp, spMap, foodWeb, biomeHealth, grubmereMod)
    } else {
      raw = computeConsumerDelta(sp, spMap, foodWeb, biomeHealth)
    }

    // ±10 % noise
    const noisy = raw * (1 + noise(rng))
    deltas[sp.id] = noisy

    if (noisy < 0) totalDeaths += Math.abs(noisy)
  }

  // Grubmere depends on total deaths from the rest of the ecosystem
  const grubRaw   = computeGrubmereDelta(spMap.grubmere, totalDeaths, biomeHealth)
  deltas.grubmere = grubRaw * (1 + noise(rng))

  // Phase 2: apply deltas → new species array (immutable update)
  const newSpecies = state.species.map(sp => {
    const prev = sp.population
    let next = Math.max(0, prev + (deltas[sp.id] ?? 0))

    // Extinction culling: sub-1 populations become 0
    if (next > 0 && next < EXTINCTION_THRESHOLD) next = 0

    const wasAlive  = prev > 0
    const nowDead   = next === 0
    const extinctCycle = wasAlive && nowDead && sp.history.extinctCycle === null
      ? state.cycle + 1
      : sp.history.extinctCycle

    const pctChange = prev > 0 ? Math.abs(next - prev) / prev : 0

    const isNewLow        = next > 0 && next < sp.history.lowestPopulation
    const crashedThisCycle = prev > 0 && next < prev * 0.70

    return {
      ...sp,
      population: next,
      history: {
        ...sp.history,
        previousPopulation:    prev,
        recentPopulations:     [...(sp.history.recentPopulations ?? []).slice(-7), prev],
        peakPopulation:        Math.max(sp.history.peakPopulation, next),
        lowestPopulation:      next > 0
          ? Math.min(sp.history.lowestPopulation, next)
          : sp.history.lowestPopulation,
        stableCycles:          pctChange < 0.02 ? sp.history.stableCycles + 1 : 0,
        extinctCycle,
        lastCrashCycle:        crashedThisCycle ? state.cycle + 1 : sp.history.lastCrashCycle,
        lowestPopulationCycle: isNewLow ? state.cycle + 1 : sp.history.lowestPopulationCycle,
        consecutiveRiseCycles: next > prev ? (sp.history.consecutiveRiseCycles ?? 0) + 1 : 0,
        previousCrashes:       crashedThisCycle ? (sp.history.previousCrashes ?? 0) + 1 : sp.history.previousCrashes,
      },
    }
  })

  // Compute stress from this cycle's extreme events, then decay existing stress
  const stressInc = computeStressIncrements(state.species, newSpecies)
  const newStress = {
    highgrowth:  Math.min(MAX_STRESS, biomeStress.highgrowth  * STRESS_DECAY + stressInc.highgrowth),
    understory:  Math.min(MAX_STRESS, biomeStress.understory  * STRESS_DECAY + stressInc.understory),
    scorchFlats: Math.min(MAX_STRESS, biomeStress.scorchFlats * STRESS_DECAY + stressInc.scorchFlats),
  }

  // Recompute biome health from new populations + new stress
  const newSpMap = {}
  for (const sp of newSpecies) newSpMap[sp.id] = sp
  const newBiomeHealth = computeBiomeHealth(newSpMap, newStress)

  // Phase 3: migration — pressure accumulation, attempts, subpopulation updates
  const newFoodWeb      = buildFoodWeb(newSpecies)
  const migratedSpecies = processMigration(newSpecies, newSpMap, newBiomeHealth, newFoodWeb, rng)

  // Phase 4: discovery — accumulate sighting scores
  const nextCycle = state.cycle + 1
  const discoveredSpecies = migratedSpecies.map(sp => {
    if (sp.population <= 0) return sp

    const disc    = sp.discovery || { sightingScore: 0, sightingCount: 0, lastSightingCycle: null }
    const baseline = sp.history.baseline

    // Too sparse to find
    if (sp.population < baseline * 0.15) return { ...sp, discovery: disc }

    const ROLE_RATE = { producer: 0.22, decomposer: 0.18, consumer: 0.10, predator: 0.06, specialist: 0.08, apex: 0.025 }
    const delta    = (sp.population / baseline) * (ROLE_RATE[sp.role] ?? 0.10)
    const newScore = Math.min(999, disc.sightingScore + delta)

    // Check if we just crossed a new integer threshold
    const prevFloor = Math.floor(disc.sightingScore)
    const nextFloor = Math.floor(newScore)
    let newCount    = disc.sightingCount

    if (nextFloor > prevFloor && newCount < 5) {
      newCount = Math.min(5, newCount + (nextFloor - prevFloor))
    }

    const justSighted = disc.sightingCount === 0 && newCount >= 1
    const justNamed   = !sp.milestones.named && newCount >= 3

    return {
      ...sp,
      milestones: {
        ...sp.milestones,
        ...(justSighted && { observed: true }),
        ...(justNamed   && { named: true }),
      },
      discovery: {
        sightingScore:     newScore,
        sightingCount:     newCount,
        lastSightingCycle: newCount > disc.sightingCount ? nextCycle : disc.lastSightingCycle,
      },
    }
  })

  // Phase 5: research — advance active project
  const research = state.research || { active: null, queue: [], history: [], suggestions: [] }
  const { research: nextResearch, completedProject } = advanceResearch(research, nextCycle)

  let finalSpecies = discoveredSpecies
  if (completedProject) {
    finalSpecies = applyProjectCompletion(discoveredSpecies, completedProject)
  }

  // Track cycles since roleIdentified (resets when behaviorMapped)
  finalSpecies = finalSpecies.map(sp => {
    if (!sp.milestones.roleIdentified || sp.milestones.behaviorMapped) return sp
    return {
      ...sp,
      history: {
        ...sp.history,
        cyclesSinceRoleIdentified: (sp.history.cyclesSinceRoleIdentified ?? 0) + 1,
      },
    }
  })

  return {
    ...state,
    cycle:      nextCycle,
    randomSeed: advanceSeed(state.randomSeed),
    species:    finalSpecies,
    research:   nextResearch,
    biomes: {
      highgrowth:  { ...state.biomes.highgrowth,  health: newBiomeHealth.highgrowth,  stress: newStress.highgrowth },
      understory:  { ...state.biomes.understory,  health: newBiomeHealth.understory,  stress: newStress.understory },
      scorchFlats: { ...state.biomes.scorchFlats, health: newBiomeHealth.scorchFlats, stress: newStress.scorchFlats },
    },
  }
}

// ─── Batch runner ─────────────────────────────────────────────────────────────

// Event types that require an explicit player response before Continue is available.
const REQUIRES_DECISION = new Set([
  'extinction', 'extinctionWarning', 'populationCrisis',
  'cascadeRisk', 'biomeStress', 'nicheOpened',
])

// Monotonically incrementing ID counter. Resets on page load — IDs only
// need to be unique within a session (used for compound event absorption).
let _eventSeq = 0

function stampEvents(rawEvents) {
  return rawEvents.map(e => {
    let requiresDecision = REQUIRES_DECISION.has(e.type)
    // cascadeRisk only produces a crisis entry when prey is lost with no other food source
    if (e.type === 'cascadeRisk') {
      requiresDecision = e.data.trigger === 'preyLost' && !e.data.hasOtherFood
    }
    return { ...e, id: `ev-${++_eventSeq}`, requiresDecision, resolved: false, absorbed: false }
  })
}

export function runCycles(state, cycleCount) {
  const newEvents = []
  for (let i = 0; i < cycleCount; i++) {
    const prev = state
    state = simulateCycle(state)

    const rawEvents  = [
      ...checkThresholds(prev, state),
      ...checkDiscovery(prev, state),
      ...checkResearch(prev, state),
    ]
    const cycleEvents = stampEvents(rawEvents)

    // Compound detection — runs after trigger pass, before event history update.
    // Absorbed events are marked absorbed: true and replaced by compound events.
    const compounds = detectCompoundEvents(cycleEvents, state)
    let finalCycleEvents = cycleEvents
    if (compounds.length > 0) {
      const absorbedIds = new Set(compounds.flatMap(c => c.absorbedEventIds))
      finalCycleEvents = cycleEvents.map(ev =>
        absorbedIds.has(ev.id) ? { ...ev, absorbed: true } : ev
      )
    }
    const allCycleEvents = [...finalCycleEvents, ...compounds]
    newEvents.push(...allCycleEvents)

    // Record species-tagged events into history.events for context detection.
    // Capped at 100 per species — context detection only needs recent history.
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

    // Accumulate open niches from nicheOpened events into state
    for (const ev of cycleEvents) {
      if (ev.type === 'nicheOpened') {
        state = {
          ...state,
          openNiches: [
            ...state.openNiches,
            {
              extinctSpeciesId: ev.speciesId,
              extinctName:      ev.data.extinctName,
              catalogRole:      ev.data.catalogRole,
              cycle:            ev.cycle,
              candidates:       ev.data.candidates,
            },
          ],
        }
      }

      // studySuggested: add suggestion to research state if not already present
      if (ev.type === 'studySuggested') {
        const research = state.research || { active: null, queue: [], history: [], suggestions: [] }
        const sp = state.species.find(s => s.id === ev.speciesId)
        if (sp && !hasSuggestion(research, sp.id, 'initial')) {
          const suggestion = makeStudySuggestion(sp, 'initial', ev.cycle)
          // Cap suggestions at 5 — drop oldest if over limit
          const existing = research.suggestions
          const trimmed  = existing.length >= 5 ? existing.slice(1) : existing
          state = {
            ...state,
            research: {
              ...research,
              suggestions: [...trimmed, suggestion],
            },
          }
        }
      }
    }
  }

  // Behavioral study suggestion: roleIdentified for 5+ cycles with 4+ events involving the species
  for (const sp of state.species) {
    if (
      sp.milestones.roleIdentified &&
      !sp.milestones.behaviorMapped &&
      (sp.history.cyclesSinceRoleIdentified ?? 0) >= 5
    ) {
      const allEvents   = [...state.events, ...newEvents]
      const evInvolving = allEvents.filter(
        e => e.speciesId === sp.id || e.data?.preyId === sp.id || e.data?.predatorId === sp.id
      ).length
      const research = state.research || { active: null, queue: [], history: [], suggestions: [] }
      if (evInvolving >= 4 && !hasSuggestion(research, sp.id, 'behavioral')) {
        const suggestion = makeStudySuggestion(sp, 'behavioral', state.cycle)
        const existing   = research.suggestions
        const trimmed    = existing.length >= 5 ? existing.slice(1) : existing
        state = {
          ...state,
          research: {
            ...research,
            suggestions: [...trimmed, suggestion],
          },
        }
      }
    }
  }

  return {
    state: { ...state, events: [...state.events, ...newEvents] },
    events: newEvents,
  }
}

// ─── Initial state factory ────────────────────────────────────────────────────

export function createInitialState(seed = 12345, researcherName = 'Dr. Voss') {
  const world = generateWorld(seed)

  return {
    cycle:            0,
    randomSeed:       world.seed,
    worldDesignation: world.designation,
    researcher: {
      name:                   researcherName,
      log:                    [],
      tools:                  [],
      resources:              { fieldData: 0, specimens: 0 },
      lastSummaryViewedCycle: 0,
    },
    biomes: {
      highgrowth:  { id: 'highgrowth',  name: 'Highgrowth',   health: 1.0, stress: world.biomeStress.highgrowth },
      understory:  { id: 'understory',  name: 'Understory',   health: 1.0, stress: world.biomeStress.understory },
      scorchFlats: { id: 'scorchFlats', name: 'Scorch Flats', health: 1.0, stress: world.biomeStress.scorchFlats },
    },
    species: world.species.map(def => ({
      ...def,
      population:        def.startingPopulation,
      currentBiome:      def.homeBiome,
      migrationPressure: 0,
      subpopulations:    [],
      history: {
        baseline:           def.startingPopulation,
        previousPopulation: def.startingPopulation,
        peakPopulation:     def.startingPopulation,
        lowestPopulation:   def.startingPopulation,
        stableCycles:          0,
        cyclesObserved:        0,
        extinctCycle:          null,
        lastCrashCycle:        null,
        lowestPopulationCycle: 0,
        consecutiveRiseCycles: 0,
        previousCrashes:       0,
        events:                [],
        decisions:             [],
        contextCooldowns:      {},
      },
      milestones: {
        observed:          false,
        named:             false,
        roleIdentified:    false,
        behaviorMapped:    false,
        populationModeled: false,
      },
      discovery: {
        sightingScore:     def.sightingOffset ?? 0,
        sightingCount:     0,
        lastSightingCycle: null,
      },
    })),
    events:     [],
    openNiches: [],
    catalog:    [],
    research: {
      active:      null,
      queue:       [],
      history:     [],
      suggestions: [],
    },
  }
}

// ─── Catalog introduction ─────────────────────────────────────────────────────
//
// Adds a catalog species to a running simulation as a founding population.
// The researcher has chosen to introduce this species to fill an open niche.
// Applies the same per-world variance as worldgen so the introduced species
// feels like it belongs to this world.
//
// Returns the new state, or the unchanged state if the species is unknown,
// already present, or already extinct in this world.

export function introduceSpecies(state, catalogSpeciesId) {
  const def = getCatalogSpecies(catalogSpeciesId)
  if (!def) return state

  // Prevent double-introduction or re-introduction of a previously extinct species
  if (state.species.some(s => s.id === def.id)) return state

  // Apply light variance using the world seed so it's deterministic per world
  const rng = mulberry32((state.randomSeed ^ def.id.split('').reduce((h, c) => h * 31 + c.charCodeAt(0), 0)) >>> 0)
  const vary = (base, range) => base * (1 + (rng() - 0.5) * 2 * range)

  const variedEats = def.eats.map(eat => ({
    ...eat,
    attackRate: vary(eat.attackRate, 0.20),
    efficiency: vary(eat.efficiency, 0.08),
  }))

  const pop = def.introPopulation

  const newSpecies = {
    ...def,
    startingPopulation: pop,
    naturalDeathRate:   vary(def.naturalDeathRate, 0.15),
    biomeComfort:       Object.fromEntries(
      Object.entries(def.biomeComfort).map(([b, v]) => [b, v === 0 ? 0 : Math.min(1, Math.max(0.1, vary(v, 0.10)))])
    ),
    eats:               variedEats,
    ...(def.naturalGrowthRate !== undefined
      ? { naturalGrowthRate: vary(def.naturalGrowthRate, 0.15) }
      : {}),

    population:        pop,
    currentBiome:      def.homeBiome,
    migrationPressure: 0,
    subpopulations:    [],
    history: {
      baseline:           pop,
      previousPopulation: pop,
      peakPopulation:     pop,
      lowestPopulation:   pop,
      stableCycles:       0,
      cyclesObserved:     0,
      extinctCycle:       null,
    },
    milestones: {
      observed:          false,
      named:             false,
      roleIdentified:    false,
      behaviorMapped:    false,
      populationModeled: false,
    },
    discovery: {
      sightingScore:     0,
      sightingCount:     0,
      lastSightingCycle: null,
    },
  }

  // Close the matching open niche (if any)
  const openNiches = state.openNiches.filter(n =>
    !(n.catalogRole === def.catalogRole && n.candidates.some(c => c.id === def.id))
  )

  return {
    ...state,
    species:    [...state.species, newSpecies],
    openNiches,
  }
}
