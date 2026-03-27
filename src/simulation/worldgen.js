import { SPECIES_DEFS } from '../data/species.js'
import { mulberry32 } from './rng.js'

// ─── Variance helpers ─────────────────────────────────────────────────────────

// Multiply base by a random factor within ±range (e.g. range=0.10 → ±10%)
function vary(base, range, rng) {
  return base * (1 + (rng() - 0.5) * 2 * range)
}

// Vary each non-zero comfort value independently. Zero stays zero (incompatible biome).
function varyComfort(comfortMap, range, rng) {
  const result = {}
  for (const [biome, val] of Object.entries(comfortMap)) {
    result[biome] = val === 0 ? 0 : Math.min(1, Math.max(0.1, vary(val, range, rng)))
  }
  return result
}

// ─── World generation ─────────────────────────────────────────────────────────

// Generates a seeded world with varied starting conditions layered on top of
// the base species definitions. Base coefficients and variance are separate
// concerns — do not solve them together.
//
// Variance ranges — wider ranges produce more varied extinction outcomes across worlds:
//
//   startingPopulation  ±40%
//   naturalGrowthRate   ±20%  (producers + grubmere only)
//   naturalDeathRate    ±40%  (wide enough that "fragile" species sometimes survive)
//   attackRate          ±50%  (primary driver of which species collapse)
//   predation efficiency ±12%
//   biomeComfort        ±15%  (non-zero values only)
//   biomeStress         0–12% (per-biome starting stress)
export function generateWorld(seed) {
  const rng = mulberry32(seed >>> 0)

  // World designation: 4-digit number recorded in researcher log at game start
  const designation = 1000 + Math.floor(rng() * 9000)

  const species = SPECIES_DEFS.map(def => {
    const variedEats = def.eats.map(eat => ({
      ...eat,
      attackRate: vary(eat.attackRate, 0.50, rng),
      efficiency: vary(eat.efficiency, 0.12, rng),
    }))

    const variedDef = {
      ...def,
      startingPopulation: Math.max(1, Math.round(vary(def.startingPopulation, 0.40, rng))),
      naturalDeathRate:   vary(def.naturalDeathRate, 0.40, rng),
      biomeComfort:       varyComfort(def.biomeComfort, 0.15, rng),
      eats:               variedEats,
      sightingOffset:     rng() * 0.4,
    }

    if (def.naturalGrowthRate !== undefined) {
      variedDef.naturalGrowthRate = vary(def.naturalGrowthRate, 0.20, rng)
    }

    return variedDef
  })

  // Per-biome starting stress (0–12%) — creates initial health variance
  const biomeStress = {
    highgrowth:  rng() * 0.12,
    understory:  rng() * 0.12,
    scorchFlats: rng() * 0.12,
  }

  return { seed: seed >>> 0, designation, species, biomeStress }
}
