// ─── Keth observation pool ────────────────────────────────────────────────────
//
// Highgrowth aerial predator. Hunts Vellin. Lag: 1 cycle.
// 394 surge events / 20 reference runs. Almost never crashes.
//
// Keth is experienced as weather over the canopy, not as individuals.
// "Keth heavy today" is the correct register — a condition, not a sighting.
// The researcher initially sees Keth as a threat to Vellin, then realizes
// by understood tier that Keth is as dependent on Vellin as Vellin is
// endangered by Keth. The oscillation changes what "watching" means.
//
// Physical: large wingspan, dark underside (near-invisible from below), pale
// eye-spots on ventral surface (function unknown; researcher has spent time on
// them without result). Stoops fast — researcher rarely observes a completed
// hunt. Almost always in the upper canopy or above.
//
// Detection: researcher detects Keth by Vellin's behavior before sighting Keth
// directly. Vellin scatter, compress, go quiet. Then the shape overhead.
//
// Writing rules:
//   sighted   — Vellin response first; dark shape; detection always indirect
//   known     — pressure and weather; the 1-cycle lag becoming apparent
//   understood — the full oscillation; stopping rooting for Vellin against Keth
//   modeled   — mechanical clock. Watching the system, not the predator.
//   Never "a Keth was hunting." Always Keth as collective density or condition.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['keth'] = {

  sighted: {
    any: [
      "The {prey} scattered before I saw anything. Then a dark shape crossing the upper growth.",
      "Looked up after the {prey} went quiet. Dark underside against the canopy ceiling. Hard to see from below.",
      "The shadow crossed fast. The {prey} were already gone before it completed the pass.",
      "Pale spots on the underside — I've been trying to determine their function. Still no hypothesis.",
      "Wingbeats above the canopy, then visible for a moment at the upper edge. Gone before I could get a count.",
      "Not {prey} behavior. Not {prey} movement. The {prey} were responding to something above.",
    ],
  },

  known: {
    any: [
      "Keth heavy overhead today. The upper canopy has a particular quality when they're dense.",
      "Circling in overlapping patterns above the {prey} range. The soar radius tells me where the {prey} are.",
      "The {prey} compressed to the canopy floor inside a cycle. I didn't need to look up to know why.",
      "The strike is fast enough that I've rarely seen a completed hunt directly. I see before and after.",
      "Pale eye-spots visible during a low pass. Function still unknown. I keep logging them.",
      "{species} absent from the {homeBiome} today. The upper canopy is emptier than it should be.",
      "Ground sighting — one {species} at the canopy base. I hadn't seen that before. Worth logging.",
    ],
    high: [
      "{species} heavy across the upper canopy. The {prey} are compressed to the floor and barely moving.",
      "Multiple individuals overlapping territory without apparent conflict. The {prey} must be abundant enough to support it.",
      "The {homeBiome} has a held quality at high {species} density. The mid-canopy is very still.",
    ],
    low: [
      "Sparse. Single individuals, wide-ranging. The {prey} must be in recovery.",
      "The upper canopy is quiet in a different way — not pressure, just absence.",
      "Only one confirmed {species} sighting across the full survey. The {prey} aren't being compressed.",
    ],
  },

  understood: {
    any: [
      "I've watched the {species} crash because there was nothing left to hunt. It goes both ways — I know that now.",
      "The 1-cycle lag is close enough to simultaneous that I stopped treating them as separate signals.",
      "I've stopped reading {species} density as a threat to {prey}. I read it as a phase of the system.",
      "The eye-spots have never produced a hypothesis I can confirm. I've logged them in every sighting.",
      "When {species} is absent, the {prey} expand immediately. The mid-canopy reclaims routes it had abandoned.",
    ],
    high: [
      "Dense overhead and the {prey} are compressed below — they already know what's coming before I log it.",
      "The upper canopy has a particular held quality at this density. The mid-canopy is very still.",
      "I've watched this configuration resolve the same way repeatedly. High {species} density precedes a {prey} collapse.",
    ],
    low: [
      "Sparse overhead, and the {prey} are starting to reclaim the upper canopy. Both recovering at the same time.",
      "The {prey} have returned to the upper canopy. The pressure that drove them down isn't there.",
      "{species} ranging wide and sparse. Both populations in the recovery phase. They will follow upward.",
    ],
    crash: [
      "Both populations down simultaneously. The upper canopy is empty in a way that doesn't feel temporary.",
      "{species} crash following the {prey} crash by exactly one cycle. It ran like a clock, as it always does.",
      "No {species} visible in three survey passes. No {prey} either. The {homeBiome} is in the low phase.",
    ],
  },

  modeled: {
    any: [
      "I've watched this run its full course more times than anything else I track. It always completes.",
      "When I see the upper canopy heavy with {species} I don't check the {prey} number first — I already know where it is.",
      "The pale eye-spots are the one thing I cannot fit into the model. Every other behavior has a read. Not those.",
    ],
    high: [
      "Dense overhead. The {prey} at the canopy floor. I've watched this configuration before — I know what follows.",
      "The pattern has held consistently enough that I write the prediction before checking the {prey} count.",
      "Dense overhead. The {prey} are at the canopy floor. Both populations near their respective peaks.",
    ],
    low: [
      "Low {species} count, {prey} recovering. The next {species} surge is predictable from the {prey} trajectory.",
      "The upper canopy is open. The {prey} are using all three vertical levels again. I note it as a phase indicator.",
      "Both populations in recovery. The oscillation continues. I've watched it complete too many times to read it as anything else.",
    ],
    crash: [
      "Both at floor simultaneously. The clock ran exactly. I had the prediction in my log before the count confirmed it.",
      "Waiting for the {prey} recovery to lead the {species} recovery. This is the low point of the cycle. It reverses.",
      "The {homeBiome} without both populations is quieter than almost any other state I track. The oscillation will reassert.",
    ],
  },

}
