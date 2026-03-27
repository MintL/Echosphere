// ─── Feltmoss observation pool ────────────────────────────────────────────────
//
// Highgrowth producer. The invisible foundation.
// No predators. No primaryFood. Tokens: {homeBiome} only.
//
// Feltmoss is background. The researcher notes it as a surface condition and
// moves on — until a crash forces them to realize they've stopped treating it
// as a variable. The emotional register only shifts at crash tier.
//
// Physical: dense pale-gold mat on every horizontal canopy surface. Not quite
// moss — compressed mineral fibre, a few centimetres thick. Faint iridescent
// shimmer up close, possibly photosynthetic pulsing. Dark scars where grazed;
// recovery is fast. Whether it's one organism or a colony is unresolved.
//
// Writing rules:
//   sighted   — texture and surface, not yet a species
//   known     — instrumental check, backdrop
//   understood — tracking as a food-web variable; the bare-patch pattern
//   modeled   — predictive. Crash tier: foundation cracking

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['feltmoss'] = {

  sighted: {
    any: [
      "Pale-gold coverage on every horizontal surface I can see from here.",
      "Dense mat on the canopy surfaces. Not quite soft — resists when I test it.",
      "The shimmer I keep noticing on the upper surfaces. Slow cycling. Might be the light.",
      "Compressed fibre, pale gold, a few centimetres thick. It covers everything.",
      "Hard to read as alive. It doesn't move. It doesn't respond. It covers everything.",
      "The surface the {homeBiome} runs on. I've been noting it without naming it.",
    ],
  },

  known: {
    any: [
      "Coverage dense across the mid-canopy surfaces. No bare patches.",
      "Checked the upper surfaces — same pale-gold mat. No change from last cycle.",
      "A few dark scars where heavy grazing has cut through to the substrate. Recovery looks fast.",
      "The iridescent quality shows up more in direct light. Some kind of cycling in the surface structure.",
      "I still don't know if this is one organism or many. The question doesn't come up because it's never the interesting thing.",
      "Standard coverage. I record the number and move on.",
    ],
    high: [
      "Iridescent shimmer across every horizontal surface. The mid-canopy is almost uniformly gold.",
      "Dense enough that the grazing scars from last cycle have closed over. No bare substrate visible.",
      "More coverage than I've measured in several cycles. Whatever grazed the thin patches, the pressure has let up.",
    ],
    low: [
      "Dark scars advancing in the mid-canopy. The substrate is showing through in sections I've been monitoring.",
      "Coverage down to around sixty percent of the upper surfaces. The bare patches are spreading.",
      "The {homeBiome} looks different without full coverage — more direct light reaching the mid-canopy floor.",
    ],
  },

  understood: {
    any: [
      "I've started checking coverage as the first step when something seems off. The rest follows from here.",
      "A coverage drop precedes the grazer numbers by one or two cycles. I've confirmed this enough times to rely on it.",
      "The bare-patch pattern has a shape — starts at the edges of heavily grazed sections and spreads inward.",
      "The shimmer cycles slowly. I still don't have a hypothesis for it. Possibly photosynthetic. Possibly something else entirely.",
      "I'm not certain it's one organism. At crash level the question starts to matter.",
    ],
    high: [
      "Coverage this dense and the {homeBiome} sounds different — more activity moving through the mid-canopy. I'm logging both.",
      "The iridescent shimmer is stronger at high coverage — more surface area in synchrony.",
      "Full {homeBiome} coverage. The shimmer is running strong on every surface I can see. Nothing to log here until something breaks.",
    ],
    low: [
      "The bare patches are advancing faster than expected. Whatever is downstream of this will follow.",
      "Coverage below half in the mid-canopy. The substrate exposed in wide sections. This changes what the {homeBiome} can support.",
      "The dark scars where it's been stripped are not recovering at the usual rate. Something is keeping the pressure on.",
    ],
    crash: [
      "I hadn't been watching it closely. I was watching other things. The bare patches were already advancing.",
      "The {homeBiome} looks wrong. The light reaching the canopy floor is too direct — the coverage that blocked it is gone.",
      "The bare patches were already advancing. I had stopped watching. I should have been watching.",
    ],
  },

  modeled: {
    any: [
      "When the shimmer starts going patchy I stop and look at everything else before I keep walking.",
      "The bare-patch pattern is readable by stage — light scars first, then wider exposure, then cascade. I know the progression.",
      "The recovery after grazing is faster than I'd expect. Whatever the mechanism, it has redundancy built in.",
      "I've stopped being surprised by the oscillation. The {homeBiome} coverage rises and falls on its own rhythm. I track it.",
    ],
    high: [
      "Full coverage means a grazer surge is incoming or ongoing. I check the next population downstream.",
      "The iridescent cycling at peak coverage — I've logged it long enough to see the frequency pattern.",
      "High {homeBiome} coverage. This is the foundation of the current upswing. Watching for when it starts to thin.",
    ],
    low: [
      "The bare patches have spread past my reference markers. The {homeBiome} is running thin in the mid-canopy now.",
      "The bare-patch advance has reached the sections I use as baselines. My comparison points are compromised.",
      "The {homeBiome} looks different at this level. Less gold, more bare substrate showing through. The recovery will come. Not yet.",
    ],
    crash: [
      "The foundation has cracked. I've been logging this long enough to know the cascade that comes next.",
      "Below twenty percent. The mid-canopy is mostly bare substrate now. I keep checking, hoping I've miscounted.",
      "It comes back. The recovery record is consistent. But the window between crash and recovery is the most dangerous period I track.",
    ],
  },

}
