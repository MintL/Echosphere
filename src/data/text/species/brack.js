// ─── Brack observation pool ───────────────────────────────────────────────────
//
// Cross-biome feeder. Scorch Flats / Highgrowth Fringe specialist.
// Predator: Mordath (opportunistic). Food: Scaleweed (primary), Feltmoss (border).
// 7 extinctions / 20 runs. CV 93.9%. Surge events come late (cycle 156+).
//
// The researcher doesn't think about Brack much. It's unglamorous — no
// communication behavior, no social drama. They respect it the way you respect
// something built for endurance. Crisis tier is when they discover they've been
// taking it for granted.
//
// Physical: heavily armored carapace, sand-colored, heat-darkened at edges,
// low and wide. Moves with deliberate economy — no wasted motion. First
// comparison: "a river-smoothed stone that had decided to walk." The armoring
// makes it effectively invulnerable to everything except Mordath.
//
// Lives at the Char Line: 20–30 meters of transitional crust between the
// Highgrowth base structures and the Scorch Flats proper. Works both sides in
// systematic sweeps. Never fast. Never hurried.
//
// Writing rules:
//   sighted   — compact, low, methodical at the Fringe
//   known     — professional register; dual-producer sweep
//   understood — entanglement pattern; one producer crash from crisis
//   modeled   — distribution as cross-biome indicator; slow recovery arcs

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['brack'] = {

  sighted: {
    any: [
      "Something low and wide working the transitional crust at the {homeBiome} border.",
      "Sand-colored with darkened edges. It moved with an economy I didn't expect — no wasted motion at all.",
      "A compact armored form at the edge of the {primaryFood} array. Not hurrying.",
      "I got close before it registered my presence. It didn't change pace.",
      "The first comparison I wrote down: a river-smoothed stone that had decided to walk. I haven't improved on it.",
      "Heat-darkened at the edges, pale at the center. The coloring is camouflage for this border zone.",
    ],
  },

  known: {
    any: [
      "{species} works the Fringe in systematic sweeps — {primaryFood} side, then border, then into the {borderBiome} edge.",
      "Small loose groups when food is adequate. They don't coordinate. They just end up in proximity.",
      "The armoring handles everything this border throws at it. Only {primaryPredator} changes the calculation.",
      "Not fast. Not hurried. The sweep pattern is consistent across every observation I've made.",
      "Found a small group at the transitional crust. Four individuals, spaced evenly, all moving in the same direction.",
      "The dual-producer dependency is the defining fact. {species} lives where both food sources are within reach.",
      "At low food, the groups dissolve and individuals range further. Convergence tracks availability.",
    ],
    high: [
      "Both producers are available at once. The Fringe is productive and {species} is making use of all of it.",
      "Groups larger than my baseline. More individuals converging on the same border zone.",
      "Working both sides of the Fringe simultaneously. I haven't seen this since both producers were last strong.",
    ],
    low: [
      "Single individuals only. The groups have dissolved. They're ranging further to find what the Fringe isn't providing.",
      "The sweep range is narrowing toward whichever producer is holding up better.",
      "Thin on the Fringe today. Tracks but no individuals in the main survey area.",
    ],
  },

  understood: {
    any: [
      "One producer crash and {species} starts pulling toward the other. A crash in both and there's nowhere to pull toward.",
      "The Fringe is the whole world for {species}. Neither biome fully. Both biomes partially. The margin is all it has.",
      "I've started checking {species} distribution as a cross-biome health indicator. The pull direction tells me which producer is weaker.",
      "{primaryPredator} doesn't come here often. When it does, at these population levels, every individual counts.",
      "The late surge recovery pattern means {species} doesn't bounce fast. Watching a recovery from near-zero takes many cycles.",
    ],
    high: [
      "Both sides productive simultaneously. {species} ranging freely across the full Fringe width. This doesn't happen often.",
      "The group sizes I'm seeing are the largest in my record for this species. The Fringe is supporting more than baseline.",
      "When both producers are up, {species} numbers follow. For once the entanglement works in their favor.",
    ],
    low: [
      "The sweep is concentrated on {primaryFood} this cycle — {borderBiome} producer must be thinner. I note the pull direction.",
      "Thin numbers, and the ones I'm finding are working harder. Longer sweeps, more ground covered per individual.",
      "One producer crash from a crisis. I keep that in mind every time I log a low count here.",
    ],
    crash: [
      "Both producers down simultaneously. {species} has nowhere to pull toward. This is the configuration I've been watching for.",
      "{primaryPredator} was here recently. At these numbers, a single pass changes the calculus entirely.",
      "I've been checking {species} more often than the data justifies. I notice that. I keep checking anyway.",
    ],
  },

  modeled: {
    any: [
      "{species} distribution tells me which producer is under stress before I run the coverage survey. I read the pull direction first.",
      "The surge events come late — cycle 156 and beyond in every run I've tracked. Recovery is slow. I factor that in.",
      "I respect {species} without romanticizing it. It endures. That is the complete description.",
    ],
    high: [
      "High numbers and a productive Fringe. Rare conditions. I log them carefully because the context matters when things turn.",
      "Full Fringe usage across both sides. {species} doing what it evolved to do without obstruction.",
      "Both producers supporting simultaneously. This window closes. I'm logging its length.",
    ],
    low: [
      "The pull toward {primaryFood} is consistent with a {borderBiome} producer stress event. I check the coverage next.",
      "Low numbers and a narrow effective range. {species} is managing, but the margin is thin.",
      "At these counts, one {primaryPredator} visit changes the population materially. I track biome entry data now.",
    ],
    crash: [
      "Crisis. Both producers down, {primaryPredator} presence confirmed in the previous cycle. The variables aligned badly.",
      "I've watched {species} pull back from near-zero before. The recovery is slow and comes late. I wait.",
      "Three individuals logged across the full Fringe survey. The Fringe is effectively empty.",
    ],
  },

}
