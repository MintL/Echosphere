// Seeded pseudo-random number generator (mulberry32)
// Returns a function that produces floats in [0, 1)
export function mulberry32(seed) {
  let s = seed >>> 0
  return function () {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), s | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Returns a noise value in [-magnitude, +magnitude]
export function noise(rng, magnitude = 0.1) {
  return rng() * magnitude * 2 - magnitude
}

// Advance a seed value deterministically (LCG step)
export function advanceSeed(seed) {
  return ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0
}
