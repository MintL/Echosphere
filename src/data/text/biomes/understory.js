// ─── Understory biome observation pool ───────────────────────────────────────
//
// Direct observations of the Understory as a biome.
// Voice: low register, calm, slow sentences. Darkness is the normal condition.
// Observation is indirect throughout — floor conditions, accumulation, absence.
// The sense of age is always present. Silence here is data, not a warning.
//
// Tiers reflect elapsed field time, not species familiarity:
//   early  (<20 cycles)  — still adjusting to this kind of looking
//   mid    (20–60)       — reads the floor, infers from the corridor
//   late   (60+)         — knows this place the way you know a long route walked many times
//
// Health-state buckets:
//   any        — health ≥ 0.6, Understory at its slow equilibrium
//   stressed   — health < 0.3, dead matter accumulating, Nightroot receding
//   recovering — health 0.3–0.6, floor conditions improving

import { BIOME_OBSERVATION_POOLS } from '../tokens.js'

BIOME_OBSERVATION_POOLS['understory'] = {

  early: {
    any: [
      "Below the Highgrowth floor. The shift in light was immediate and total.",
      "Navigating by the Nightroot glow-scatter. Still adjusting to this kind of looking.",
      "The buttress-root corridors are disorienting until you find the landmarks.",
      "Quieter than I expected for a biome this active. Different kind of information here.",
      "The Nightroot floor — pale, continuous, older than anything else I've seen here.",
    ],
    stressed: [
      "Something feels heavier down here than it should. Can't place it.",
      "The floor looks different than last visit. Less uniform in the main corridor.",
    ],
    recovering: [
      "Floor condition seems better than last cycle. Still learning what normal looks like.",
      "The Nightroot glow-scatter is stronger today. Something has improved.",
    ],
  },

  mid: {
    any: [
      "The {homeBiome} at its usual quiet. No deviation from baseline.",
      "Corridor floor continuous and pale. Nightroot doing what it always does.",
      "The chemical smell is stable — old, mineral, exactly as it's always been.",
      "The dark here is legible now. Shape and position before surface detail.",
      "Silence, in the particular way this biome is silent. Low-register, felt more than heard.",
    ],
    stressed: [
      "Dead matter accumulating in the main corridor sections. More than the baseline rate.",
      "The floor coverage is patchy in places I haven't seen patchy before.",
      "The Nightroot glow-scatter is lower than it should be. The pale surface is dimming.",
      "The chemical smell has shifted. Something in the processing is off.",
      "The floor conditions are wrong. Wrong in a way that builds slowly.",
    ],
    recovering: [
      "Floor coverage returning in the stressed sections. The Nightroot is coming back.",
      "The chemical smell has shifted back toward the baseline I know.",
      "The scatter is improving. The corridors are lighter than last cycle.",
      "Dead matter clearing at the processing rate I expect. The {homeBiome} is working again.",
    ],
  },

  late: {
    any: [
      "The {homeBiome} on its own schedule. I've stopped trying to read it at Highgrowth speed.",
      "Nothing moves fast here. That used to feel like absence. Now it's information.",
      "The corridors as they should be. I know this place the way I know a long route.",
      "Pale floor, dim air, the mineral smell that never changes. Equilibrium.",
    ],
    stressed: [
      "I've seen the {homeBiome} under stress before. It goes wrong slowly and then all at once.",
      "The floor is accumulating in the sections I've learned to check. The debt is building.",
      "The Nightroot is receding at the margins. I've watched this. It doesn't stop on its own.",
      "The corridors have a different quality when the floor is stressed — less navigation, more weight.",
      "The dimming starts at the outer corridors and moves inward. Same pattern as before.",
    ],
    recovering: [
      "The floor is clearing in the sections that were stressed. The {homeBiome} recovers slowly.",
      "The scatter is back. I track the Nightroot glow as a health indicator now — automatic.",
      "The dead matter is moving again. The processing has resumed at the rate I know.",
      "Recovery in the {homeBiome} is quiet and gradual. I've learned to measure it in floor coverage, not events.",
    ],
  },

}
