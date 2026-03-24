// Migration pressure accumulation, attempt resolution, and subpopulation lifecycle.
// Pure functions — no side effects. Called from simulateCycle after main deltas.
//
// Design:
//   Each migratable species accumulates a pressure score from push/pull factors.
//   When pressure crosses PRESSURE_THRESHOLD an attempt fires.
//   Successful attempts create a subpopulation in the target biome.
//   Subpopulations run simplified per-capita equations each cycle.
//   A subpopulation surviving ADAPTATION_THRESHOLD cycles under stress flags speciation.

import { noise } from './rng.js'

// ─── Biome topology ───────────────────────────────────────────────────────────

export const BIOME_NEIGHBORS = {
  highgrowth:  ['understory', 'scorchFlats'],
  understory:  ['highgrowth'],
  scorchFlats: ['highgrowth'],
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PRESSURE_THRESHOLD   = 1.0   // pressure needed to trigger an attempt
export const PRESSURE_DECAY       = 0.7   // carry-over fraction each cycle
export const SPLINTER_FRACTION    = 0.10  // fraction of population that crosses
export const SUCCESS_THRESHOLD    = 0.5   // biomeComfort × roll must exceed this
export const ADAPTATION_THRESHOLD = 50    // sub cycles under stress → speciation candidate
export const STABILIZED_CYCLES    = 20    // sub cycles alive → stabilized event

const P_BIOME_HEALTH = 0.3   // push: home biome health < 0.4
const P_PREDATOR     = 0.4   // push: predator pop > half of prey pop
const P_OVERPOP      = 0.3   // push: pop > 2.5× baseline
const P_PULL_HEALTH  = 0.1   // pull: neighbor health > home + 0.3
const P_PULL_SAFE    = 0.2   // pull: no active predators in neighbor biome

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Only mobile consumers/predators migrate; sessile producers and decomposers don't.
function canMigrate(sp) {
  return sp.role !== 'producer' &&
    sp.role !== 'decomposer' &&
    sp.population > 0 &&
    sp.movementTraits.length > 0
}

// Neighboring biomes this species has any comfort in (comfort > 0).
function viableNeighbors(sp) {
  return (BIOME_NEIGHBORS[sp.homeBiome] || [])
    .filter(id => (sp.biomeComfort[id] ?? 0) > 0)
}

// ─── Pressure computation ─────────────────────────────────────────────────────

// Returns the pressure increment this cycle (caller adds to accumulated pressure).
export function computePressureDelta(sp, spMap, biomeHealth, foodWeb) {
  if (!canMigrate(sp)) return 0
  if (viableNeighbors(sp).length === 0) return 0

  let delta = 0
  const homeHealth = biomeHealth[sp.homeBiome] ?? 1

  // Push: home biome health collapsing
  if (homeHealth < 0.4) delta += P_BIOME_HEALTH

  // Push: predator pressure too high
  const predators = foodWeb[sp.id] || []
  const predPop   = predators.reduce((s, { predatorId }) =>
    s + (spMap[predatorId]?.population ?? 0), 0)
  if (predPop > sp.population * 0.5 && predPop > 5) delta += P_PREDATOR

  // Push: overpopulation (far above starting baseline)
  if (sp.population > sp.history.baseline * 2.5) delta += P_OVERPOP

  // Pull: neighbor conditions
  for (const nId of viableNeighbors(sp)) {
    const nHealth = biomeHealth[nId] ?? 1

    // Neighbor meaningfully healthier than home
    if (nHealth > homeHealth + 0.3) delta += P_PULL_HEALTH

    // No active predators of this species currently based in the neighbor
    const safeInNeighbor = predators.every(({ predatorId }) => {
      const pred = spMap[predatorId]
      return !pred ||
        pred.population <= 5 ||
        (pred.homeBiome !== nId && pred.borderBiome !== nId)
    })
    if (safeInNeighbor) delta += P_PULL_SAFE
  }

  return delta
}

// ─── Migration attempt ────────────────────────────────────────────────────────

// Returns { targetBiome, migrantCount, success } or null if no attempt possible.
export function resolveMigrationAttempt(sp, biomeHealth, rng) {
  const neighbors = viableNeighbors(sp)
  if (neighbors.length === 0 || sp.population < 10) return null

  // Pick best target: highest comfort × biome health
  const target = neighbors
    .map(id => ({ id, score: (sp.biomeComfort[id] ?? 0) * (biomeHealth[id] ?? 1) }))
    .sort((a, b) => b.score - a.score)[0]

  const comfort = sp.biomeComfort[target.id] ?? 0
  const success = comfort * rng() > SUCCESS_THRESHOLD
  const count   = success ? Math.max(1, Math.floor(sp.population * SPLINTER_FRACTION)) : 0

  return { targetBiome: target.id, migrantCount: count, success }
}

// ─── Subpopulation lifecycle ──────────────────────────────────────────────────

// Net per-capita growth rate for a subpopulation in a non-home biome.
// Uses best available prey (global populations, scaled by comfort + biome health).
// Subpopulations are small — full food-web math would be noisy overkill.
function subpopPerCapitaRate(sp, sub, spMap, biomeHealth) {
  const comfort = sp.biomeComfort[sub.biome] ?? 0
  const health  = biomeHealth[sub.biome] ?? 0.5

  if (sp.eats.length === 0) {
    // Edge case for any mobile decomposer
    return sp.naturalGrowthRate * comfort * health - sp.naturalDeathRate
  }

  const maxGain = sp.eats.reduce((best, eat) => {
    const prey = spMap[eat.preyId]
    if (!prey || prey.population <= 0) return best
    const halfSat = prey.history.baseline * 0.10   // same Holling factor as engine
    const holling = prey.population / (prey.population + halfSat)
    const gain    = eat.efficiency * eat.attackRate * prey.population * holling * comfort * health
    return gain > best ? gain : best
  }, 0)

  return maxGain - sp.naturalDeathRate
}

// Returns updated subpopulation object, or null if it dissolved this cycle.
export function updateSubpopulation(sub, sp, spMap, biomeHealth, rng) {
  if (sub.population <= 0) return null

  const rate    = subpopPerCapitaRate(sp, sub, spMap, biomeHealth)
  const noisy   = rate * (1 + noise(rng))
  const nextPop = Math.max(0, sub.population + noisy * sub.population)

  if (nextPop < 1) return null  // subpopulation dissolved

  // Adaptation accumulates when comfort is meaningfully below home (< 0.8)
  // and the subpopulation has had time to settle in (>10 cycles)
  const isAdapting      = (sp.biomeComfort[sub.biome] ?? 0) < 0.8 && sub.cyclesAlive > 10
  const adaptationCycles = sub.adaptationCycles + (isAdapting ? 1 : 0)

  return {
    ...sub,
    population:        nextPop,
    cyclesAlive:       sub.cyclesAlive + 1,
    adaptationCycles,
  }
}

// ─── Full per-cycle migration pass ────────────────────────────────────────────
//
// Called from simulateCycle after main deltas are applied and biome health
// has been recomputed. Returns an updated species array.
//
// spMap should be built from the same species array passed in (post-delta).

export function processMigration(species, spMap, biomeHealth, foodWeb, rng) {
  return species.map(sp => {
    // 1. Update all existing subpopulations
    const updatedSubs = sp.subpopulations
      .map(sub => updateSubpopulation(sub, sp, spMap, biomeHealth, rng))
      .filter(Boolean)

    // 2. Accumulate migration pressure (decayed from previous cycle + this cycle's delta)
    const pressureDelta = computePressureDelta(sp, spMap, biomeHealth, foodWeb)
    let newPressure     = sp.migrationPressure * PRESSURE_DECAY + pressureDelta

    // 3. Attempt migration if threshold crossed
    let population = sp.population

    if (newPressure >= PRESSURE_THRESHOLD) {
      const attempt = resolveMigrationAttempt(sp, biomeHealth, rng)
      if (attempt) {
        if (attempt.success) {
          population = Math.max(0, population - attempt.migrantCount)

          // Reinforce existing subpopulation in target biome, or start a new one
          const existingIdx = updatedSubs.findIndex(s => s.biome === attempt.targetBiome)
          if (existingIdx >= 0) {
            updatedSubs[existingIdx] = {
              ...updatedSubs[existingIdx],
              population: updatedSubs[existingIdx].population + attempt.migrantCount,
            }
          } else {
            updatedSubs.push({
              biome:             attempt.targetBiome,
              population:        attempt.migrantCount,
              cyclesAlive:       0,
              adaptationCycles:  0,
            })
          }
        }
        // Reset pressure after any attempt (succeed or fail) so attempts don't chain
        newPressure = 0
      }
    }

    return {
      ...sp,
      population,
      migrationPressure: newPressure,
      subpopulations:    updatedSubs,
    }
  })
}
