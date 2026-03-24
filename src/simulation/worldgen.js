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
// Variance ranges (from GDD):
//   startingPopulation  ±20%
//   naturalGrowthRate   ±10%  (producers + grubmere only)
//   naturalDeathRate    ±10%
//   predation efficiency ±7%  (midpoint of 5–8%; tightest — most sensitive)
//   biomeComfort        ±8%   (non-zero values only)
//   biomeStress         0–5%  (small per-biome starting stress)
export function generateWorld(seed) {
  const rng = mulberry32(seed >>> 0)

  // World designation: 4-digit number recorded in researcher log at game start
  const designation = 1000 + Math.floor(rng() * 9000)

  const species = SPECIES_DEFS.map(def => {
    const variedEats = def.eats.map(eat => ({
      ...eat,
      efficiency: vary(eat.efficiency, 0.07, rng),
    }))

    const variedDef = {
      ...def,
      startingPopulation: Math.max(1, Math.round(vary(def.startingPopulation, 0.20, rng))),
      naturalDeathRate:   vary(def.naturalDeathRate, 0.10, rng),
      biomeComfort:       varyComfort(def.biomeComfort, 0.08, rng),
      eats:               variedEats,
    }

    if (def.naturalGrowthRate !== undefined) {
      variedDef.naturalGrowthRate = vary(def.naturalGrowthRate, 0.10, rng)
    }

    return variedDef
  })

  // Small per-biome starting stress (0–5%) — creates minor initial health variance
  const biomeStress = {
    highgrowth:  rng() * 0.05,
    understory:  rng() * 0.05,
    scorchFlats: rng() * 0.05,
  }

  return { seed: seed >>> 0, designation, species, biomeStress }
}
