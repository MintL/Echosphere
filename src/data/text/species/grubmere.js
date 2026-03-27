// ─── Grubmere observation pool ────────────────────────────────────────────────
//
// Understory decomposer. The invisible species.
// No predators. No conventional primaryFood (eats dead matter).
// Pop: 8–273, median ~31. CV 95.9%. 20/20 runs with extinction warnings.
//
// The researcher barely registers Grubmere for the first many cycles. All
// observation is indirect — floor conditions, processing rates, accumulation.
// The first extinction warning arrives as a surprise: a species they'd been
// treating as background, suddenly critical.
//
// Three direct surface sightings across many cycles. Each is significant and
// referenced sparingly in later tiers. Everything else is inferred.
//
// Inverted relationship: thrives when things are dying. High population means
// ecosystem stress. Low population (when the system is healthy and mortality is
// low) triggers extinction warnings. The researcher finds this counterintuitive
// at first; later it becomes legible.
//
// Physical: subsurface organism. Three direct sightings: segmented and
// translucent, approximately forearm-length, smooth wave-body motion through
// root substrate. Translucency striking — internal structure visible, not
// identifiable. Disappeared into root mass within a minute each time.
//
// Writing rules:
//   sighted   — ALL INDIRECT: floor conditions, processing rates, accumulation
//   known     — checking by proxy; taking for granted
//   understood — extinction warning as discovery; inverting how they read abundance
//   modeled   — indirect checks; sparing references to the three direct sightings
//   high {species} population means the {homeBiome} has been paying a cost

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['grubmere'] = {

  sighted: {
    any: [
      "The {homeBiome} floor is processing normally. Dead matter accumulation within the range I've calibrated as functional.",
      "Checked the floor condition in the main survey corridors. The {homeBiome} is cycling as expected.",
      "Standard processing rate in the eastern corridors. The floor looks clean.",
      "I note the floor condition as part of each {homeBiome} survey. I haven't been thinking about what produces that outcome.",
      "Dead matter turnover rate normal. I take that as a baseline and don't investigate further.",
      "I check the floor on every survey. I've been recording numbers without thinking about them.",
    ],
  },

  known: {
    any: [
      "Floor processing rate logged. Normal. I've stopped thinking about what produces it.",
      "The {homeBiome} floor is clean throughout the corridor survey. That's what I expect and that's what I find.",
      "Dead matter accumulation absent from the main corridors. The {homeBiome} is cycling correctly.",
      "I check {species} by checking the floor. It's the most efficient method. I do it and move on.",
      "The {homeBiome} has been running without notable floor events for many cycles. I take that as the baseline.",
      "I still haven't seen one directly. Everything I know comes from the floor condition and the processing rates.",
      "The {homeBiome} floor chemistry hasn't changed. Whatever is producing that result, it's consistent.",
    ],
    high: [
      "Processing rate elevated. More dead matter moving through the system than usual. The {homeBiome} has been losing organisms.",
      "The floor turnover is high. I'm noting the rate without having fully worked out what it means for what's coming.",
      "Dead matter processing at a pace I haven't seen before. Something has been dying at elevated rates.",
    ],
    low: [
      "Processing rate low. The floor is accumulating dead matter at the margins. Something has slowed.",
      "The floor in the eastern survey section isn't cycling the way it normally does. I'm noting it without urgency.",
      "Dead matter visible at the corridor margins. The processing rate has dropped below my baseline.",
    ],
  },

  understood: {
    any: [
      "The extinction warning arrived and I realized I'd been taking this for granted. Twenty cycles and barely logged it.",
      "High {species} population means the {homeBiome} has been dying heavily. I've been reading this wrong — abundance here is loss elsewhere.",
      "When the processing stops, the floor changes in a way that's hard to articulate. Heavier. The corridors accumulate.",
      "I've been checking the floor in thirty seconds and moving on. That's not enough. I'm adjusting my survey practice.",
      "The inverted relationship: they thrive when things are dying. I understood the mechanism. I hadn't understood what it meant.",
    ],
    high: [
      "High {species} population and I'm logging it as concerning. The {homeBiome} has been paying a cost to produce this.",
      "Processing rate at the highest I've recorded. Something significant has been dying in the {homeBiome}.",
      "The floor is very active. I'm checking what else has changed — what the {homeBiome} has lost recently.",
    ],
    low: [
      "Low processing rate, extinction warning range. The {homeBiome} mortality has been very low — or {species} is declining for reasons I can't identify.",
      "Dead matter building at the corridor margins. The {homeBiome} floor looks different from the baseline I calibrated to.",
      "I'm checking the floor more carefully now. Patches I hadn't examined in cycles are showing accumulation.",
    ],
    crash: [
      "The floor is different in a way I find hard to name. Heavier. The Nightroot looks more varied, less uniform.",
      "Dead matter accumulating in the main corridors. The smell has changed — I think I noticed it cycles ago and didn't log it.",
      "Realising now how much I've been taking them for granted. The {homeBiome} debt is accumulating visibly.",
    ],
  },

  modeled: {
    any: [
      "I track {species} through floor condition, processing rate, and three direct sightings in my full observation record.",
      "The floor is the only instrument I have. I've learned to read it more carefully than I used to.",
      "The third time I saw one directly: segmented, translucent, about a forearm in length, visible for less than a minute. Then gone.",
    ],
    high: [
      "High processing rate means the {homeBiome} has been taking losses. I verify by checking what else has changed.",
      "Elevated floor activity. The {homeBiome} is in a stress period — {species} is thriving because of what has died.",
      "I've learned to read high {species} population as a measure of cost, not health. The {homeBiome} is paying something.",
    ],
    low: [
      "Low processing rate. Either the {homeBiome} is genuinely healthy and mortality is low, or {species} is declining for other reasons.",
      "Floor accumulation visible at the margins. The processing has slowed below the functional threshold.",
      "I check the floor chemistry and the processing rate and note the discrepancy. Something is off in the {homeBiome} substrate.",
    ],
    crash: [
      "The floor has stopped cycling. Dead matter throughout the survey corridors. The {homeBiome} debt is building.",
      "I've seen one directly, three times in my record. I've never seen what happens when they're gone from the floor entirely. I'm watching it now.",
      "The {homeBiome} gets heavier when this fails. That's the only word I have for it. Heavier. I'm logging what I can measure.",
    ],
  },

}
