// ─── Highgrowth biome observation pool ───────────────────────────────────────
//
// Direct observations of the Highgrowth as a biome.
// Voice: active, present-tense. Sound is as important as sight.
// Vertical structure (upper canopy / mid-canopy / canopy floor) is always present.
// Never describe as peaceful — the Highgrowth is always working.
//
// Tiers reflect elapsed field time, not species familiarity:
//   early  (<20 cycles)  — still calibrating, finding the baseline
//   mid    (20–60)       — knows what normal looks like, reads deviations
//   late   (60+)         — intimate, automatic, notices mood before numbers
//
// Health-state buckets:
//   any        — health ≥ 0.6, biome at or near baseline
//   stressed   — health < 0.3, biomeStress threshold
//   recovering — health 0.3–0.6, biomeRecovery range

import { BIOME_OBSERVATION_POOLS } from '../tokens.js'

BIOME_OBSERVATION_POOLS['highgrowth'] = {

  early: {
    any: [
      "Dense canopy above. The scale of it took me a few visits to take in.",
      "The Feltmoss coverage on every horizontal surface — I keep noticing it differently.",
      "The sound here is constant. Low, layered, coming from everywhere at once.",
      "Still orienting to the vertical structure. Three distinct zones and I'm only comfortable in one.",
      "More happening here than I can track at once. Working on narrowing what to watch.",
    ],
    stressed: [
      "The coverage is thinner than it was. Not sure yet if that's normal variation.",
      "Quieter than last visit. Something has pulled back but I haven't isolated it.",
      "Bare patches showing on the upper canopy surfaces. Didn't see those before.",
    ],
    recovering: [
      "Coverage denser than last cycle. The mid-canopy feels more active.",
      "The sound is returning. More layered than it's been.",
    ],
  },

  mid: {
    any: [
      "Mid-canopy at its usual register. The layering I know now.",
      "Three zones all functioning. Upper canopy lit, mid-canopy in motion, floor quiet.",
      "The subsonic background is at baseline. Everything is where it should be.",
      "Dense, loud, working. The {homeBiome} at its full pace.",
      "Coverage solid across the upper surfaces. The food web runs on this.",
    ],
    stressed: [
      "Upper canopy thinning — bare patches advancing where the coverage should be solid.",
      "The sound is lower and less layered than baseline. Something in the mid-canopy has compressed.",
      "Fewer routes in use today. The active corridors have pulled toward the center.",
      "The light is hitting the canopy floor directly. That only happens when coverage is down.",
      "The {homeBiome} is quieter than I've learned to expect. The kind of quiet that precedes something.",
    ],
    recovering: [
      "Coverage returning at the upper surfaces. The patches are filling from the edges.",
      "The mid-canopy is louder than last cycle. Activity is coming back.",
      "More routes in use again. The compression is easing.",
      "The layered sound is rebuilding. The {homeBiome} is finding its register.",
    ],
  },

  late: {
    any: [
      "The {homeBiome} at its full register. I read the mood of it from the edge now before I go in.",
      "Dense, active, working. This is what this biome looks like when it's well.",
      "I've stopped consciously checking the upper canopy. I just know what's there.",
      "Everything in its place. I know this well enough that the absence of surprise is information.",
    ],
    stressed: [
      "The bare patches advance from the top down. I've watched this before.",
      "The quiet is the first signal. I caught it before I checked the coverage.",
      "The mid-canopy has a different quality under stress — compressed, careful, waiting.",
      "I've seen the {homeBiome} stressed before. It recovers. That doesn't make watching it easier.",
      "The light through the canopy is wrong — too direct, too much floor exposure. The coverage is down.",
    ],
    recovering: [
      "Coverage returning where it was thin. I know exactly where to check first.",
      "The layering is rebuilding. The {homeBiome} recovers noisily — you can hear it filling in.",
      "The sound is back at its full register. The stress period is closing.",
      "I've watched this arc before. The coverage fills from the main routes outward.",
    ],
  },

}
