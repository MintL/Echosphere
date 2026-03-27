// ─── Vellin observation pool ──────────────────────────────────────────────────
//
// Primary grazer, Highgrowth canopy. Fast, social, canopy-dependent.
// Predators: Keth (aerial, lag 1 cycle), Skethran (stalking, lag 1 cycle).
// Food: Feltmoss.
//
// The researcher's relationship with Vellin is the emotional spine of the game.
// Every tier deepens the intimacy. The modeled tier carries earned weight because
// the researcher has watched the oscillation complete itself enough times to know
// what comes next — and has learned to feel that knowledge rather than celebrate it.
//
// Physical: pale coloring, small-to-medium, moves in tight bursts. Groups of 4–8.
// Heard before seen — low rhythmic subsonic signal, possibly communication.
// Young stay near group center; older individuals range further.
// Never caches food. Short rest cycles, never fully still. "Someone is always watching."
//
// Key tension: the researcher is never fully comfortable with how much Vellin seems
// to know. The communication behavior remains partially opaque even at modeled tier.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['vellin'] = {

  sighted: {
    any: [
      "Something moving through the upper growth. Groups of four or five.",
      "Pale coloring. Hard to see against the {primaryFood}.",
      "Skittish. Scattered before I could get close.",
      "Saw them again near the canopy edge. Fast movers.",
      "Small groups. Moving between the upper branches in a pattern I can't read yet.",
      "Heard them before I saw them — a low rhythmic sound, almost subsonic.",
      "Spotted three near the canopy floor. Froze when they noticed me. Long pause, then gone.",
    ],
  },

  known: {
    any: [
      "They move in loose groups, always faster near the canopy edge.",
      "The way they graze — methodical, almost ritualistic. Same patches in the same order.",
      "A {primaryPredator} shadow crossed above. The whole group scattered in under a minute.",
      "Found one separated from its group near the {homeBiome} border. Moved differently alone.",
      "They communicate when threatened. I still don't know how.",
      "The young ones stay near the center of the group. The larger ones range further.",
      "Grazing stopped entirely for a full half-cycle when {primaryPredator} was visible overhead. Then resumed, same route.",
      "They cache nothing. Every patch grazed clean and moved on. Whatever {primaryFood} grows back is theirs again.",
    ],
    high: [
      "Three separate groups using the same canopy corridor today. More than I've seen in several cycles.",
      "Audible from camp. The subsonic signal carrying further than usual at this density.",
      "Counting is difficult when numbers are this high — the mid-canopy is full of movement.",
      "The {primaryFood} patches are turning over fast. The groups aren't waiting for full regrowth.",
    ],
    low: [
      "One group, maybe six individuals. The mid-canopy is noticeably quiet.",
      "The {primaryPredator} pressure has been consistent. Finding them lower in the canopy than usual.",
      "Hard to find a group today. The {primaryFood} patches along the main routes mostly undisturbed.",
      "Fewer routes in use. The ones I'm finding are shorter, closer to cover.",
    ],
  },

  understood: {
    any: [
      "Watched a group of eleven navigate around a {primaryPredator} territory for most of a cycle. Methodical.",
      "They don't sleep the way I expected. Short rest cycles, never all at once. Someone is always watching.",
      "The grazing rhythm has shifted — heavier feeding early cycle, almost nothing by midday. Following the {primaryFood} growth patterns.",
      "Saw two groups merge at the northern edge and separate again later. Some kind of exchange. Couldn't determine what.",
      "The older individuals move differently. Slower but more deliberate. They seem to know where the {primaryPredator} will be.",
      "The communication signal changes under pressure. More frequent, lower register. I'm logging it now.",
    ],
    high: [
      "At these numbers they push into sections of the {homeBiome} I don't usually see them use. The canopy edge is crowded.",
      "The subsonic signal has a different quality at high density — faster, layered. Something is being communicated at scale.",
      "High {species} density. {primaryPredator} will follow within a cycle. I've started watching the upper canopy before I check the count.",
    ],
    low: [
      "When {primaryFood} thins, they compress. The whole group collapses inward, tighter movement, shorter range. Waiting.",
      "Two {primaryPredator} passes in the same half-cycle. {species} abandoned the upper canopy entirely afterward. They don't forget quickly.",
      "The communication signal has gone quieter. Lower frequency, less often. A compressed group communicates differently than a full one.",
      "Single groups only this cycle. No corridor sharing, no merging. The mid-canopy is running thin.",
    ],
    crash: [
      "I haven't heard the subsonic signal in three cycles. The {homeBiome} is quieter than it should be.",
      "Found one group, maybe four individuals, pressed to the canopy floor. They didn't move when I approached.",
      "The {primaryFood} is spreading unchecked in the upper canopy. The {species} that would be grazing it aren't there.",
    ],
  },

  modeled: {
    any: [
      "The 6-cycle population rhythm is holding. Up when {primaryFood} is abundant, down when {primaryPredator} follows them into the upper canopy.",
      "Their ranging patterns are more predictable than I initially thought. The same routes, slightly adjusted each cycle.",
      "I can estimate group size now from sound alone. The specific frequency of their communication changes with density.",
      "{species} population peaks lag {primaryFood} abundance by exactly two cycles. Consistent across every oscillation I've recorded.",
    ],
    high: [
      "At high density they graze faster and range wider. I can trace the coverage change in the {primaryFood} directly.",
      "The peak I'm logging now will bring {primaryPredator} within a cycle. The timing has been consistent enough that I treat it as a rule.",
      "More than two hundred individuals across three survey routes. We're near the top of this oscillation. I've stopped finding it surprising.",
    ],
    low: [
      "Low count, {primaryFood} recovering. The next upswing is predictable — the question is whether {primaryPredator} contracts first.",
      "At low density they concentrate near the richest {primaryFood} patches and barely move. Efficiency over range. I know this pattern.",
      "The subsonic signal at low population has a particular quality — sparse, irregular intervals. I recognize it now before I run a count.",
    ],
    crash: [
      "Below thirty. The floor I've come to expect. It still registers differently each time I write it down.",
      "The {primaryPredator} peak preceded this. The lag held exactly. I had logged the prediction and it came true. That doesn't make it easier.",
      "Recovery will come. It has before, from numbers like these. The oscillation reverses. I'm waiting.",
    ],
  },

}
