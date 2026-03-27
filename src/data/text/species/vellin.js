// ─── Vellin observation pool ──────────────────────────────────────────────────
//
// Reference implementation of the per-species observation detail pool.
// Entries are divided by knowledge tier and use the token system throughout.
//
// Vellin: primary grazer, Highgrowth canopy. Fast, social, canopy-dependent.
// Predators: Keth (aerial), Skethran (stalking). Food: Feltmoss.
// The researcher's relationship with Vellin is the emotional spine of the game.
//
// Authoring principles for this pool:
//   sighted   — sparse, uncertain, physical. The researcher has no names yet.
//   known     — behavioral, social structure emerging. Predator relationship noticed.
//   understood — pressure response, micro-strategy, cycle patterns. Intimacy forming.
//   modeled   — quantified rhythms, predictive detail, earned emotional weight.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['vellin'] = {

  sighted: [
    "Something moving through the upper growth. Groups of four or five.",
    "Pale coloring. Hard to see against the {primaryFood}.",
    "Skittish. Scattered before I could get close.",
    "Saw them again near the canopy edge. Fast movers.",
    "Small groups. Moving between the upper branches in a pattern I can't read yet.",
    "Heard them before I saw them — a low rhythmic sound, almost subsonic.",
    "Spotted three near the canopy floor. Froze when they noticed me. Long pause, then gone.",
  ],

  known: [
    "They move in loose groups, always faster near the canopy edge.",
    "The way they graze — methodical, almost ritualistic. Same patches in the same order.",
    "Resting in clusters in the mid-canopy today. Hard to count when they're still.",
    "A {primaryPredator} shadow crossed above. The whole group scattered in under a minute.",
    "Found one separated from its group near the {homeBiome} border. Moved differently alone.",
    "They communicate when threatened. I still don't know how.",
    "The young ones stay near the center of the group. The larger ones range further.",
    "Counted at least three distinct groups today, all using the same canopy corridor. No conflict at the overlap.",
    "Grazing stopped entirely for a full half-cycle when {primaryPredator} was visible overhead. Then resumed, same route.",
    "They cache nothing. Every patch grazed clean and moved on. Whatever {primaryFood} grows back is theirs again.",
  ],

  understood: [
    "The {primaryPredator} pressure is changing how they move. More time in the lower canopy than usual.",
    "Watched a group of eleven navigate around a {primaryPredator} territory for most of a cycle. Methodical.",
    "They don't sleep the way I expected. Short rest cycles, never all at once. Someone is always watching.",
    "The grazing rhythm has shifted — heavier feeding early cycle, almost nothing by midday. Following the {primaryFood} growth patterns.",
    "Saw two groups merge at the northern edge and separate again later. Some kind of exchange. Couldn't determine what.",
    "The older individuals move differently. Slower but more deliberate. They seem to know where the {primaryPredator} will be.",
    "When {primaryFood} thins, they compress. The whole group collapses inward, tighter movement, shorter range. Waiting.",
    "Two {primaryPredator} passes in the same half-cycle. The {species} abandoned the upper canopy entirely afterward. They don't forget quickly.",
    "The communication signal changes under pressure. More frequent, lower register. I'm logging it now.",
  ],

  modeled: [
    "The 6-cycle population rhythm is holding. Up when {primaryFood} is abundant, down when {primaryPredator} follows them into the upper canopy.",
    "Their ranging patterns are more predictable than I initially thought. The same routes, slightly adjusted each cycle.",
    "I can estimate group size now from sound alone. The specific frequency of their communication changes with density.",
    "The relationship between {species} density and {primaryFood} coverage is almost perfectly inverse. They regulate each other.",
    "{species} population peaks lag {primaryFood} abundance by exactly two cycles. Consistent across every oscillation I've recorded.",
    "The {primaryPredator} lag is three cycles. {species} peak → {primaryPredator} peak → {species} decline. It runs like a clock now.",
    "At high density they graze faster and range further. At low density they concentrate near the richest {primaryFood} patches and barely move. Efficiency scaling.",
  ],

}
