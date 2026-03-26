// ─── Token resolution system ──────────────────────────────────────────────────
//
// Resolves dynamic tokens in event template strings from live simulation state.
// All resolution happens at render time — never stored in event objects.
//
// Token inventory:
//   {species}            Species name
//   {homeBiome}          Primary biome display name
//   {borderBiome}        Border biome display name (falls back to homeBiome)
//   {primaryPredator}    Named predator, or "something in the {homeBiome}"
//   {primaryFood}        Named food source, or "its food source"
//   {declinePct}         Absolute population change % (prev → current cycle)
//   {lastCrashCycle}     Cycle number of most recent ≥30% crash
//   {cyclesSinceLow}     Cycles elapsed since population all-time low
//   {predatorRiseCycles} Consecutive cycles the primary predator has been rising

const BIOME_NAMES = {
  highgrowth:  'Highgrowth',
  understory:  'Understory',
  scorchFlats: 'Scorch Flats',
}

function biomeName(id) {
  return BIOME_NAMES[id] ?? id
}

function getPopulationChangePct(species) {
  const prev = species.history.previousPopulation
  if (!prev) return 0
  const change  = (species.population - prev) / prev * 100
  if (change === 0) return 0
  const rounded = Math.round(Math.abs(change))
  // Never display 0% for a nonzero change — round sub-1% up to 1
  return change > 0 ? Math.max(1, rounded) : -Math.max(1, rounded)
}

function getCyclesSinceLow(species, state) {
  const low = species.history.lowestPopulationCycle
  if (low == null) return '?'
  return state.cycle - low
}

function getPredatorRiseCycles(predator) {
  if (!predator) return '?'
  return predator.history.consecutiveRiseCycles ?? 0
}

// ─── Relationship helpers ─────────────────────────────────────────────────────

// Returns the most narratively relevant predator of species.
// Weights by population, with a 1.5× bonus for predators the researcher has named.
// If a predator is present but unidentified the caller should use the fallback text.
export function getPrimaryPredator(species, state) {
  return state.species
    .filter(s => s.eats.some(e => e.preyId === species.id) && s.population > 0)
    .sort((a, b) => {
      const aScore = a.population * (a.milestones.roleIdentified ? 1.5 : 0.5)
      const bScore = b.population * (b.milestones.roleIdentified ? 1.5 : 0.5)
      return bScore - aScore
    })[0] ?? null
}

// Returns the highest-population food source that is still alive.
export function getPrimaryFood(species, state) {
  if (!species.eats?.length) return null
  return species.eats
    .map(e => state.species.find(s => s.id === e.preyId))
    .filter(s => s && s.population > 0)
    .sort((a, b) => b.population - a.population)[0] ?? null
}

// ─── Core resolver ────────────────────────────────────────────────────────────

export function resolveTokens(template, species, state) {
  const predator  = getPrimaryPredator(species, state)
  const food      = getPrimaryFood(species, state)
  const homeName  = biomeName(species.homeBiome)

  const predatorText = predator
    ? (predator.milestones.roleIdentified ? predator.name : 'predation')
    : 'predation'

  const foodText = food
    ? (food.milestones.roleIdentified ? food.name : 'food availability')
    : 'food availability'

  return template
    .replace(/{species}/g,           species.name)
    .replace(/{homeBiome}/g,         homeName)
    .replace(/{borderBiome}/g,       species.borderBiome ? biomeName(species.borderBiome) : homeName)
    .replace(/{primaryPredator}/g,   predatorText)
    .replace(/{primaryFood}/g,       foodText)
    .replace(/{declinePct}/g,        Math.abs(getPopulationChangePct(species)))
    .replace(/{lastCrashCycle}/g,    species.history.lastCrashCycle ?? '?')
    .replace(/{cyclesSinceLow}/g,    getCyclesSinceLow(species, state))
    .replace(/{predatorRiseCycles}/g, getPredatorRiseCycles(predator))
}

// ─── Knowledge tier ───────────────────────────────────────────────────────────

// Returns the highest knowledge tier the researcher has reached for a species.
// null = undiscovered (no events should fire).
export function getKnowledgeTier(species) {
  const m = species.milestones
  if (m.populationModeled) return 'modeled'
  if (m.behaviorMapped)    return 'understood'
  if (m.roleIdentified)    return 'known'
  if (m.observed)          return 'sighted'
  return null
}

// ─── Observation detail pool ──────────────────────────────────────────────────

// Registry: speciesId → { sighted, known, understood, modeled }
// Species pool files register themselves here on import.
export const OBSERVATION_POOLS = {}

// Session-scoped deduplication. Resets on page refresh (module re-evaluation).
// Keys: "speciesId:tier:sentence"
const _usedObservations = new Set()

// Select a tier-appropriate observation detail for a species.
// Resolves tokens before returning. Returns null if no pool is registered,
// no sentences are available, or the species is undiscovered.
export function getObservationDetail(species, state) {
  const tier = getKnowledgeTier(species)
  if (!tier) return null

  const pool = OBSERVATION_POOLS[species.id]?.[tier]
  if (!pool?.length) return null

  const prefix    = `${species.id}:${tier}:`
  let available   = pool.filter(s => !_usedObservations.has(prefix + s))

  // Soft reset: if pool exhausted clear just this species+tier and retry
  if (available.length === 0) {
    for (const key of _usedObservations) {
      if (key.startsWith(prefix)) _usedObservations.delete(key)
    }
    available = [...pool]
  }

  const chosen = available[Math.floor(Math.random() * available.length)]
  _usedObservations.add(prefix + chosen)
  return resolveTokens(chosen, species, state)
}
