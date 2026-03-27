// ─── Mordath observation pool ─────────────────────────────────────────────────
//
// Apex predator. All biomes. Hunts Woldren, Brack, Torrak.
// Pop: 2–41, median ~10. 2.5 biome entries/run. 1.1 cascade risk events/run.
//
// The researcher never habituates to Mordath. Every sighting carries weight,
// even at modeled tier. Its motivations remain alien even after many cycles.
// Economy of language — Mordath doesn't need flourishes. Its presence is enough.
//
// Physical: the largest mobile organism in the ecosystem. Dense and heavy —
// not proportionally tall, but the mass is apparent in every movement. First
// note: "something large. Not Keth. Different movement entirely." No visible
// external sensory organs — no obvious eyes, ears, or olfactory structures.
// Researcher genuinely cannot determine how it locates prey. Unhurried,
// deliberate. Covers large distances without urgency. Ground track pattern
// suggests directed travel — goes somewhere, then somewhere else. Has never
// been observed to hesitate at a biome crossing.
//
// The researcher has never seen two simultaneously. Whether this means one
// individual, several solitary ones, or something more complex is unresolved.
//
// Writing rules:
//   sighted   — large, slow, deliberate; uncertain this is a new species
//   known     — behavioral basics; the sensory-organ question surfaces and stays open
//   understood — prey compression as leading indicator; feeling Mordath before seeing it
//   modeled   — full ecological function known; the organism remains opaque
//   each sighting gets words. reverence without sentiment. avoid over-mystifying.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['mordath'] = {

  sighted: {
    any: [
      "Something large at the {homeBiome} base. Not Keth. Different movement entirely — on the ground.",
      "Unhurried. The size registered slowly. I had to revise my estimate upward as it moved.",
      "It took several cycles before I was confident this was one species and not the same individual relocated.",
      "Dense and heavy — not tall, but the mass is apparent in every movement.",
      "It went somewhere with a deliberateness I hadn't seen in anything else out here.",
      "Crossed three survey areas in a single cycle. I've been trying to determine the logic of the route.",
    ],
  },

  known: {
    any: [
      "I still cannot locate any sensory organs. No visible eyes, no visible structure for hearing. It locates prey somehow.",
      "The movement pattern suggests directed travel — not ranging, not searching. It goes to a place.",
      "The prey populations compress before {species} is visible. I've started reading that compression as an arrival indicator.",
      "Crossed from {homeBiome} to {borderBiome} without hesitation. The transition meant nothing to it.",
      "Ground level in the {homeBiome}, but capable of aerial transit. I've seen it cross the upper canopy once.",
      "I have not observed two simultaneously. Whether that means one individual or several, I can't determine.",
      "The compression precedes the sighting. I know {species} is here before I see it.",
    ],
    high: [
      "Multiple prey compressions across different areas in the same cycle. More than one individual must be present.",
      "Active in both {homeBiome} and {borderBiome} simultaneously, or moving faster than I can track.",
      "High overall count — rare, difficult to interpret. I'm logging everything from this period carefully.",
    ],
    low: [
      "No {species} sighting in many cycles. Prey populations are expanding — range widening, compression absent.",
      "The {borderBiome} prey are working corridors they'd avoided for the past several cycles. {species} has moved on.",
      "The biomes are relaxing. I notice it before I look for {species} directly.",
    ],
  },

  understood: {
    any: [
      "The sensory organ question remains open after many cycles. I don't know how it finds anything.",
      "I feel the {species} arrival in the prey behavior before I see it. Things withdraw. The corridors go quiet in a specific way.",
      "The route logic has never become clear. It arrives, it hunts, it moves on. The destination sequence doesn't decode.",
      "The slow prey — Woldren, Brack, Torrak — not the fast ones. The energy calculation must favor mass over pursuit cost.",
      "When {species} leaves a biome, the secondary consumers expand immediately. I can read the departure from their behavior too.",
    ],
    high: [
      "Multiple individuals active simultaneously — unprecedented in my observation record. All three prey populations will feel this.",
      "Both {homeBiome} and {borderBiome} showing prey compression at once. {species} is covering more ground than usual.",
      "High {species} count is a system-level event. I'm watching all prey populations simultaneously.",
    ],
    low: [
      "Prey populations expanding into ranges they hadn't occupied. {species} is absent from these areas.",
      "The Woldren have moved back into the southern corridors. That's where they went when {species} was last here.",
      "{species} absent from both biomes. The ecosystem relaxes in a specific way when this is true.",
    ],
    crash: [
      "No confirmed sighting in many cycles. Whether population crisis or extended movement elsewhere, I can't determine.",
      "The prey populations are at their most expanded ranges. The absence is consistent with {species} being far from here.",
      "I don't know if this is near-extinction or the {homeBiome} being between visits. The distinction matters.",
    ],
  },

  modeled: {
    any: [
      "I read prey compression as an arrival indicator. I've been doing this long enough that the signal is reliable.",
      "The sensory organ question has never resolved. I've modeled the population movement without modeling the organism.",
      "{species} arrival restructures prey behavior across a full biome within a cycle. The effect is the most consistent signal I track.",
    ],
    high: [
      "Multiple individuals confirmed by simultaneous prey compressions across both biomes. This is the rarest state I log.",
      "High overall population and active across all survey areas. Prey populations will contract significantly.",
      "I have no established reference for this. I log carefully and wait to see what follows.",
    ],
    low: [
      "Low overall count. Prey populations are expanding into ranges they hold during {species} absence.",
      "The ecosystem is in its {species}-absent configuration. I know what this looks like now. Everything spreads out.",
      "When {species} is low I read the prey range first. The expansion is the clearest signal that the pressure has lifted.",
    ],
    crash: [
      "No confirmed sighting in the longest gap I've recorded. I can't determine if this is crisis or extended movement.",
      "Prey populations at maximum range. The {species} absence is total and has been total for many cycles.",
      "I still don't know what I'm looking at when I see {species}. I've modeled the effects. The organism remains opaque.",
    ],
  },

}
