// ─── Torrak observation pool ──────────────────────────────────────────────────
//
// Scorch Flats specialist. The geological animal.
// Predator: Mordath (rare). Food: Scaleweed.
// CV 149.1% — most volatile species in the simulation.
// 14 extinctions / 20 reference runs. Crisis warnings from cycle 19 onward.
//
// The researcher develops a quiet fatalism that mirrors the species itself.
// The extinction rhythm becomes familiar. By modeled tier, the researcher can
// see the crash coming and has nothing to do about it. This is not grief exactly —
// more like watching an inevitable outcome complete itself.
//
// Physical: widest mobile creature in the ecosystem. Enormously plated — fused
// sections, almost structural. Low-profile despite the mass. Moves very slowly.
// "Like slow geology" — first field description, never improved on. Leaves deep
// straight tracks in the Scorch crust; single-individual tracks followable for
// significant distances. No two individuals have overlapping track networks.
// Feeds by moving over Scaleweed and pressing down — invisible from a distance.
// Researcher initially thought it was stationary.
//
// Writing rules:
//   sighted   — "I thought it was a formation"; enormous; barely moving
//   known     — track network as primary evidence; behavioral basics unanswered
//   understood — extinction rhythm recognized; "I've watched this before"
//   modeled   — prediction possible, pointless. Watching the outcome complete.
//   slow language. Long sentences. Quiet fatalism through all tiers.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['torrak'] = {

  sighted: {
    any: [
      "Something enormous on the flat. I thought it was a geological formation until I checked the position against last cycle.",
      "Deep straight tracks in the crust, wider and deeper than anything else I've seen out here.",
      "Massive plated form at the far edge of the array. Not moving. Or moving so slowly I couldn't tell.",
      "I had the scale wrong at first. It wasn't until I got within thirty meters that the correct size registered.",
      "The tracks lead to the {primaryFood} array. Something enormous is at the far end of them.",
      "Low-profile despite the mass. It doesn't rise. It spreads. Moving across the flat like something geological.",
    ],
  },

  known: {
    any: [
      "Deep straight tracks are the primary evidence. I follow them before looking for {species} directly.",
      "The feeding method: {species} moves over the {primaryFood} and presses down. The feeding is invisible from any distance.",
      "No two track networks have overlapped in any survey I've run. The spacing is regular — possibly avoidance.",
      "{species} didn't acknowledge me at ten meters. Continued at exactly the same pace. I waited before leaving.",
      "Solitary in every observation. I've started wondering if they ever encounter each other at all.",
      "The fused plates are almost structural — the mass is as much armor as body, which is considerable.",
      "The tracks are followable for long distances. Single individuals leave a record across the full flat.",
    ],
    high: [
      "Track networks crossing the flat in several directions today. For the {homeBiome}, that qualifies as busy.",
      "More direct sightings this cycle than the previous several combined. The {primaryFood} is carrying them.",
      "Found tracks from at least four separate paths in a single survey. The spacing discipline holds even at abundance.",
    ],
    low: [
      "One track set this cycle, and it looks old. Days, by the crust disturbance.",
      "The {primaryFood} coverage is thin. Whatever tracks were here, I'm not finding them.",
      "Two survey passes. No direct sighting. The tracks I found were from a previous cycle at earliest.",
    ],
  },

  understood: {
    any: [
      "I've watched this before — the {primaryFood} falls and {species} follows. The gap is predictable now. That doesn't help.",
      "{primaryPredator} passes through and the track density changes for cycles afterward. One visit, lasting effect.",
      "The crash isn't gradual. I've watched the count drop from viable to near-zero in three cycles. There's no warning in the data.",
      "The population I log at high count and the population I log at low count feel like different species. Geological either way. Different in scale.",
      "By the time {species} responds to {primaryFood} loss, the window is often already closing.",
    ],
    high: [
      "High numbers on the flat, and the spacing discipline still holds. Whatever keeps them apart operates regardless of density.",
      "When {primaryFood} is covering wide sections, {species} is everywhere in that quiet indifferent way. The flat is just working.",
      "This is the stable period before the {primaryFood} cycle turns. I've seen it before. The tracks will thin.",
    ],
    low: [
      "The {primaryFood} is telling the same story. Both in decline simultaneously.",
      "No direct sighting this cycle. Old tracks only. I'm watching the {primaryFood} for the next signal.",
      "Low enough that the fast drop becomes possible. I know now it doesn't arrive as a warning.",
    ],
    crash: [
      "Two track sets at the far end of the flat, both pointing toward what's left of the {primaryFood}.",
      "I haven't confirmed a living individual in eight cycles. There may be one. I can't say.",
      "I've watched {species} go this low before. What comes next isn't a further decline. It's a stop.",
    ],
  },

  modeled: {
    any: [
      "{primaryFood} leads {species} by three cycles. I check {primaryFood} coverage before I check the track count.",
      "The crash dynamic is the one part I still haven't fully modeled. The population looks stable until it doesn't. Then three cycles.",
      "I can say what will happen. The when is the only variable. The window is narrow and the warning is thin.",
    ],
    high: [
      "High {species} numbers mean the {primaryFood} was good for at least a few cycles. That window is probably past its midpoint.",
      "I log the track density and note the {primaryFood} coverage. The relationship is consistent. It will reverse.",
      "More individuals than I've seen in many cycles. The flat is working. I don't trust it to last.",
    ],
    low: [
      "Low numbers, {primaryFood} thin. The crash comes fast from here if conditions hold. I've stopped being surprised.",
      "The track network simplified to a few paths near the remaining {primaryFood}. Consolidation before it ends.",
      "Recording what I see and waiting. Prediction is available to me. Intervention is not.",
    ],
    crash: [
      "The last track I logged was eight cycles ago. {species} may be below viable count. They've been here before.",
      "I've marked this in the log fourteen times. They come back. Not quickly. But they come back.",
      "The flat is empty in the way it gets between {species} cycles. The {primaryFood} will recover first.",
    ],
  },

}
