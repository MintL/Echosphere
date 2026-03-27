// ─── Scaleweed observation pool ───────────────────────────────────────────────
//
// Scorch Flats producer. Resilience without beauty.
// No predators. Tokens: {homeBiome}.
//
// CV 24.8% — the second most stable producer. 8 crises in reference runs,
// 100% recovery rate. The researcher develops a faith built on that record.
// Crashes are real and impactful but the recovery is expected, not uncertain.
//
// Physical: hexagonal armored plates, iron-grey tending rust-brown at edges,
// each about palm-sized. Grow in overlapping arrays, low to the crust, max 10cm.
// Surface rough enough to shred unarmored species — only armored consumers can
// feed here. Dense patches look like tiled geology at distance. The researcher's
// first field note: "geometric crust formation."
//
// Writing rules:
//   sighted   — geological confusion; the hexagonal tiling before the researcher
//               understands what they're looking at
//   known     — monitoring arrays as a health indicator, alien geometry
//   understood — food supply lens; watching coverage against consumer populations
//   modeled   — the recovery record as faith. "It came back before."
//   crash     — weight without drama; Scorch Flats failing, watching and waiting

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['scaleweed'] = {

  sighted: {
    any: [
      "Geometric formations on the flat surface. Hexagonal, iron-grey, low to the crust.",
      "I thought it was a geological feature at first. Then I mapped it twice and found the boundary had moved.",
      "Armored plate arrays, each roughly palm-sized. They don't look alive.",
      "Something about the hexagonal tiling is too regular for crust formation. I'm not sure what I'm looking at yet.",
      "Rust-brown at the plate edges. Iron-grey at the centers. Completely still in the heat.",
      "The surface is rough enough that I can't test it with bare skin. Whatever this is, it has edge.",
    ],
  },

  known: {
    any: [
      "The arrays extend and contract. Coverage maps from different cycles don't match — it's growing.",
      "The plate margins are where new growth appears. Each new plate forms adjacent to an existing one.",
      "Gaps in the array indicate either grazing pressure or a heat anomaly. I check both when I find them.",
      "Only armored feeders can work this without damage. The surface selects for its own consumers.",
      "The {homeBiome} without this is just mineral crust. I've come to understand that those are the only two states the flat has.",
      "Monitoring array coverage as a health indicator. Continuous tiling means the {homeBiome} is functioning.",
      "The geometry is consistent at all coverage levels — never a dense mat, always discrete hexagonal plates.",
    ],
    high: [
      "Arrays extending beyond the survey margins. The coverage is wider than baseline.",
      "The rust-brown at the plate edges is deep, which I've learned means established growth. These plates aren't new.",
      "Array coverage the best I've recorded. The flat doesn't look lush — it never does — but it's working.",
    ],
    low: [
      "Gaps widening between plate clusters. The coverage map is fragmenting.",
      "Scattered arrays only — no continuous coverage in the eastern survey section.",
      "More bare crust visible between plate groups than in the last several cycles.",
    ],
  },

  understood: {
    any: [
      "I've watched both armored feeders go thin in the same week. It starts here — always here.",
      "The crash-and-recovery pattern has been consistent — drops hard, comes back reliably. I've stopped treating the recovery as uncertain.",
      "Grazing pressure shows first at the array margins, then spreads inward. I track the margin condition as an early signal.",
      "The hexagonal geometry persists at all population levels. Even near crash, the plates are discrete, not degraded.",
      "There is nothing else to eat on the {homeBiome}. I think about that sometimes while I'm mapping the array.",
    ],
    high: [
      "Arrays extending into sections of the flat I've only seen occupied in the best conditions. The {homeBiome} is running well.",
      "High coverage means consumer pressure hasn't caught up yet. I watch for the first sign they've noticed.",
      "The plate margins are expanding at a rate I can measure cycle to cycle. Unambiguous growth phase.",
    ],
    low: [
      "The gaps in the array are wide enough that the consumers will feel it within a cycle.",
      "Low coverage across the central survey area. Both armored feeders are sharing a depleted resource.",
      "The array margin has retreated significantly since my last survey. I'm logging the rate.",
    ],
    crash: [
      "The flat looks like crust because it mostly is crust. I'm finding isolated plate clusters only.",
      "The tracks on the flat look different at crash level — fewer, closer together, all pointing at the same remaining clusters.",
      "It has come back before. Every time. I'm logging the current floor and waiting for the turn.",
    ],
  },

  modeled: {
    any: [
      "The array margin tells me what's coming before the tracks change. I check it first on every {homeBiome} survey.",
      "The recovery is reliable — eight crashes and eight recoveries in my reference data. The faith is earned.",
      "Crash and recovery follow a consistent shape. I can read the stage from the margin pattern alone.",
      "I've stopped being surprised by the oscillation. The {homeBiome} floor cycles. I track it.",
    ],
    high: [
      "High coverage. The flat looks as close to productive as the {homeBiome} gets. I know how this goes from here.",
      "Array tiling continuous across the standard survey area. The foundation is intact.",
      "The coverage is deeper into the flat than baseline. A surplus, logged against the reference record.",
    ],
    low: [
      "The array is fragmenting and the tracks show it — everything converging on whatever plate clusters remain.",
      "I can project the rate from here. I know where the floor level is.",
      "I've watched this configuration before. The crash comes next, then the recovery. I know the sequence.",
    ],
    crash: [
      "Crash. The {homeBiome} is down to isolated plate clusters. Both consumers are in trouble.",
      "It came back from worse. The record is eight crashes, eight recoveries. I'm logging crash nine.",
      "The flat looks dead. It isn't. I wait and I survey and I log the margin condition each cycle.",
    ],
  },

}
