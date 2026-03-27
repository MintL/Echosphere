// ─── Nightroot observation pool ───────────────────────────────────────────────
//
// Understory producer. The geological baseline.
// No predators. No primaryFood. Tokens: {homeBiome} only.
//
// CV 27.4% — the most stable species in the simulation. Zero population crises
// in normal runs. The researcher checks it, finds it unchanged, records nothing.
// Familiarity becomes geological: they see it the way they see geography.
// When it finally dips, it registers as the planet shifting slightly.
//
// Physical: pale ivory root-mass, continuous across every Understory floor.
// Entirely subterranean and root-surface — no above-ground structure. Old ivory
// colour, slightly waxy. Faint chemical smell that never changes. Provides the
// only bright surface in the permanent dark — a faint glow-scatter for navigation.
// Whether it is one organism or many is an open question the researcher stopped needing answered.
//
// Writing rules:
//   sighted   — the researcher enters the Understory: pale floor, chemical smell, glow
//   known     — "as expected." Checked in passing.
//   understood — a health indicator; the Woldren inverse
//   modeled   — geological. Checked without expecting change.
//   crash     — unprecedented. Something ancient, slightly wrong.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['nightroot'] = {

  sighted: {
    any: [
      "The floor of the {homeBiome} is pale ivory and continuous. Nothing like the upper biomes.",
      "A faint chemical smell. Not unpleasant. Stable. I noted it once and stopped noting it.",
      "The only bright surface in the permanent dark down here. It's how I navigate.",
      "Ivory root-mass covering every corridor floor. It doesn't move. It just is.",
      "I ran my hand across the surface. Waxy. Slightly resistant. Nothing like what I expected.",
      "Different kind of looking down here — shapes and positions, not surfaces. The floor scatter is enough.",
    ],
  },

  known: {
    any: [
      "Coverage continuous across all surveyed corridors. As expected.",
      "The chemical signature is stable. I stopped logging it separately because it never changes.",
      "Floor coverage intact. The {homeBiome} floor looks the same as last cycle.",
      "I check it as a baseline. If something has changed here, something bigger has changed in the {homeBiome}.",
      "Coverage normal at corridor margins and the buttress bases. Nothing unusual.",
      "Still unclear whether this is one organism or many. I've stopped needing the answer.",
    ],
    high: [
      "Coverage extending up the buttress bases — above its usual floor-level range. Worth logging.",
      "The glow-scatter from the floor is brighter than the baseline. Coverage unusually dense.",
      "Growth extending up the root structures at the corridor walls. Grazing pressure must be low.",
    ],
    low: [
      "Patchy coverage at the corridor margins. Different from the baseline I've calibrated to.",
      "The glow-scatter is weaker in the eastern corridors. The floor coverage is thinner there.",
      "Receding at the margins of the survey area. Not alarming yet. I'm checking the grazer numbers.",
    ],
  },

  understood: {
    any: [
      "The floor coverage functions as a health indicator. When it changes, something upstream has changed.",
      "Nightroot and the browsing pressure are inversely related in practice. When grazers are high, the floor gets worked. I check both now.",
      "The slowness of it makes it easy to stop watching. It changes at centimetre scale per cycle. That's easy to miss.",
      "The chemical signature in the {homeBiome} is Nightroot, mostly. When it changes subtly, I notice before I understand why.",
      "I think of it as geology now. Not ecology. It moves on a different clock.",
    ],
    high: [
      "Coverage reaching the buttress bases. Grazers must be low — nothing is working the floor at the usual rate.",
      "The {homeBiome} floor is brighter than its baseline. More surface area catching the low ambient light.",
      "High coverage means the grazer population is down. I look at the secondary picture.",
    ],
    low: [
      "The floor is patchy in sections I've used as a reference baseline for cycles. Grazing pressure has increased.",
      "Low coverage in the main corridors. The glow-scatter is compromised. The {homeBiome} feels different.",
      "The surface recovery I expect at corridor margins isn't happening. Something is keeping the pressure on.",
    ],
    crash: [
      "Something ancient is slightly wrong. The floor coverage has never dropped this far in all the cycles I've logged.",
      "The {homeBiome} is harder to navigate. The ivory scatter I rely on is failing. I keep reaching for landmarks that aren't there.",
      "I've been treating this as permanent. Watching it fail is different from watching anything else fail.",
    ],
  },

  modeled: {
    any: [
      "I check it once per cycle and record the number. It rarely surprises me. That is the correct relationship to have with it.",
      "The floor coverage is the slowest variable I track. Changes are measured in cycles, not observations.",
      "Nightroot floor and grazer population tell each other's story. I read them together now.",
    ],
    high: [
      "High coverage at the buttress bases means grazers are low and not working the floor surface. I check the count next.",
      "The {homeBiome} floor is as complete as I've seen it. This is the baseline functioning correctly.",
      "Continuous ivory coverage across all corridors. As expected. Nothing to log beyond the number.",
    ],
    low: [
      "Low floor coverage means something is grazing heavily. I verify the grazer read.",
      "The patchy sections have spread since last cycle. The floor margin is moving. Not dramatically. But moving.",
      "The glow-scatter in the affected corridors is down to a level where I've adjusted my navigation. The {homeBiome} feels smaller.",
    ],
    crash: [
      "This hasn't happened before in any cycle I've logged. I have no reference for this. The floor is failing.",
      "The {homeBiome} without full Nightroot coverage is a different place. I am relearning how to read it.",
      "I don't know when it recovers from this. The recovery record for Nightroot has never needed testing until now.",
    ],
  },

}
