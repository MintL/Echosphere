// ─── Scorch Flats biome observation pool ─────────────────────────────────────
//
// Direct observations of the Scorch Flats as a biome.
// Voice: spare. The Flats don't offer much to describe; descriptions should reflect that.
// Heat is always present as a condition, not an event (unless it spikes).
// Track evidence is the primary observation method. Scaleweed arrays are the only
// visual markers. Silence is normal here — not notable.
//
// Tiers reflect elapsed field time, not species familiarity:
//   early  (<20 cycles)  — still surprised that something lives here at all
//   mid    (20–60)       — tracks the array margins, reads the crust
//   late   (60+)         — practical respect, has watched this biome fail and return
//
// Health-state buckets:
//   any        — health ≥ 0.6, Scaleweed at normal distribution
//   stressed   — health < 0.3, arrays retreating, more exposed crust
//   recovering — health 0.3–0.6, arrays expanding, coverage returning

import { BIOME_OBSERVATION_POOLS } from '../tokens.js'

BIOME_OBSERVATION_POOLS['scorchFlats'] = {

  early: {
    any: [
      "Flat in every direction. No shade, no cover, nothing to break the exposure.",
      "The Scaleweed arrays are the only landmarks out here. Without them, the Flats read as empty.",
      "The crust radiates heat from below. First time working a biome with geothermal activity.",
      "Something lives here. The Scaleweed alone. That took a few visits to fully accept.",
      "The track record in the crust — something large has moved through here recently.",
    ],
    stressed: [
      "The arrays are smaller than last visit. More bare crust between them.",
      "Hotter than the previous session, or maybe I'm just noticing the exposure more.",
    ],
    recovering: [
      "More Scaleweed coverage than last time. The arrays seem to be expanding at the margins.",
      "The gaps between arrays are smaller. Something is improving.",
    ],
  },

  mid: {
    any: [
      "Array distribution at the usual coverage. The {homeBiome} functioning.",
      "Crust temperature within the normal range. Heat but not crisis heat.",
      "The track record in the crust is current — the usual evidence of movement.",
      "Flat, hot, quiet. The Scorch Flats at their standard register.",
      "The Scaleweed holds where it always holds. The geometry of this place is consistent.",
    ],
    stressed: [
      "The gaps between arrays are widening. More exposed crust than the baseline.",
      "The coverage has retreated inward. The outer array margins are bare.",
      "The {homeBiome} stripped down further than usual. Just crust and silence.",
      "Array margins pulling back. This is what the Flats look like when they're failing.",
      "The geometry is off — too much crust between what remains.",
    ],
    recovering: [
      "Array margins expanding again at the edges. Coverage improving from the perimeter.",
      "The distribution is filling back toward normal. Slow but measurable.",
      "The gaps are closing. The Scaleweed is working back outward from the center.",
      "Coverage returning. The {homeBiome} doesn't recover fast, but it's moving.",
    ],
  },

  late: {
    any: [
      "The Flats at their lean equilibrium. I've learned to call this healthy.",
      "Heat, silence, Scaleweed where it should be. The {homeBiome} baseline.",
      "I used to find this biome hostile. Now I just find it honest.",
      "The crust and the arrays in their usual arrangement. Nothing to report.",
    ],
    stressed: [
      "The Flats under stress look like the Flats only more so — more crust, less coverage.",
      "I know what the array retreat looks like. I've watched it before. It always looks like it won't stop.",
      "The heat feels different when the coverage is thin. More direct. The Scaleweed buffers something I hadn't noticed.",
      "I've seen the {homeBiome} stripped to almost nothing before. It came back. Watching to see if that holds.",
      "Same retreat pattern as before — margins first, then the interior thins.",
    ],
    recovering: [
      "Coverage returning at the margins where it pulled back. The Flats recover on their own terms.",
      "I've watched this biome come back from worse. The arrays expand from the edges inward.",
      "The recovery is happening the same way it always does. The Scaleweed doesn't hurry.",
      "The geometry normalizing. The gaps are closing in the order I've learned to expect.",
    ],
  },

}
