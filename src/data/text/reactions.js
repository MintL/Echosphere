// ─── Researcher reaction tier selector ───────────────────────────────────────
//
// Provides the researcher_reaction slot in the four-slot text assembly:
//   [observation_detail] [fact] [context?] [researcher_reaction]
//
// The reaction slot is the emotional register of the researcher. The same
// population crash reads differently at cycle 3 vs cycle 60. The tier is
// determined by how long the researcher has known this species.

import { resolveTokens, resolveBiomeTokens, getBiomeTier } from './tokens.js'

// ─── Session dedup ────────────────────────────────────────────────────────────

const _usedReactions = new Set()

// ─── Tier selector ────────────────────────────────────────────────────────────

// Returns the researcher's emotional register based on how well they know the species.
// 'late' once behavioral study is complete — the researcher knows this species deeply.
// 'mid' while between initial and behavioral study (10+ cycles since role identified).
// 'early' otherwise — still learning.
export function getReactionTier(species) {
  const m = species.milestones
  if (m.behaviorMapped || m.populationModeled) return 'late'
  const n = species.history?.cyclesSinceRoleIdentified ?? 0
  if (n >= 10) return 'mid'
  return 'early'
}

// ─── Pool selectors ───────────────────────────────────────────────────────────

function pickFromPool(pool, key) {
  const prefix = key + ':'
  let available = pool.filter(s => !_usedReactions.has(prefix + s))

  if (available.length === 0) {
    for (const k of _usedReactions) {
      if (k.startsWith(prefix)) _usedReactions.delete(k)
    }
    available = [...pool]
  }

  const chosen = available[Math.floor(Math.random() * available.length)]
  _usedReactions.add(prefix + chosen)
  return chosen
}

// Select a reaction from the correct tier for this event and species.
// Tier fallback: late → mid → early (prevents null when a pool is sparse).
// Returns resolved text, or null if no pool exists for this event type.
export function getReaction(event, species, state, reactionTemplates) {
  const byType = reactionTemplates[event.type]
  if (!byType) return null

  const tier = getReactionTier(species)
  const tierOrder = tier === 'late' ? ['late', 'mid', 'early']
                  : tier === 'mid'  ? ['mid', 'early']
                  : ['early']

  let pool = null
  let activeTier = null
  for (const t of tierOrder) {
    if (byType[t]?.length) { pool = byType[t]; activeTier = t; break }
  }
  if (!pool) return null

  const key     = `${event.type}:${species.id}:${activeTier}`
  const chosen  = pickFromPool(pool, key)
  return resolveTokens(chosen, species, state)
}

// ─── Reaction template pools ──────────────────────────────────────────────────
//
// Tiered per event type. Three tiers reflect the researcher's growing familiarity:
//   early (<10 cycles)  — uncertainty, sparse observation, not sure what things mean
//   mid   (10-30)       — familiarity, pattern recognition, tentative predictions
//   late  (>30)         — intimacy, emotional investment, history references
//
// GDD-specified examples appear verbatim as the first entry in each tier.
// Additional entries carry the same voice and constraints.

export const REACTION_TEMPLATES = {

  populationCrisis: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: sparse, uncertain, observational. No predictions. No named patterns.
      "Still learning what {primaryPredator} pressure means for them.",
      "Not sure if this is normal for {species} or something to worry about.",
      "I don't have enough history with them to know what this looks like when it recovers.",
      "First significant drop I've recorded. Watching.",
      "Hard to contextualize without more cycles of data.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: familiarity starting to form, pattern recognition, cautious expectation.
      "They usually recover. Usually.",
      "I've seen them bounce back from similar drops. Conditions feel comparable.",
      "The {primaryFood} will rebound before long — {species} should follow.",
      "Something to watch but not panic over. Not yet.",
      "This is within the range of their normal oscillation. Probably.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: intimacy, earned history, emotional weight. May reference lastCrashCycle.
      "I know this pattern. I don't like it.",
      "I've watched them recover from this kind of drop. The circumstances aren't always the same.",
      "The {homeBiome} gets quieter before it gets worse. I've learned to notice the quiet.",
      "I've watched them survive worse. That doesn't make this easier to watch.",
      "{cyclesSinceLow} cycles since their last low. Whatever resilience they built up, they're drawing on it now.",
    ],

  },

  populationSurge: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: uncertain, can't tell if this is the normal range or exceptional.
      "First significant peak I've recorded. Not sure if this is typical for them.",
      "Numbers are up. I don't have enough history to know what this means.",
      "Can't tell if this is within their normal range. Marking it.",
      "The increase is notable. I don't have context for it yet.",
      "Something to watch. Good or bad, I don't know yet.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: cautious, aware that surges precede crashes. Not celebratory.
      "When they peak like this, {primaryPredator} tends to follow. Watching the predator lines.",
      "Strong numbers. The question is always what comes next.",
      "I've seen this before. The high doesn't hold.",
      "A surge usually precedes a correction. Marking the cycle.",
      "{species} are up. {primaryPredator} will respond. They always do.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: earned wariness, no celebration. Has watched the crash that follows.
      "I know what follows a peak like this. The {primaryPredator} pressure is coming.",
      "Every time I've seen them this high, the correction has followed within a few cycles.",
      "The {homeBiome} has a ceiling. They've found it. What comes next is what concerns me.",
      "High numbers. High risk. I've stopped celebrating their peaks.",
      "They look healthy. I know better than to take comfort in that.",
      "I've been here before with this species. A peak this sustained usually ends the same way.",
      "The numbers are good. I've learned not to read that as good news.",
      "The pressure will build from here. It always does.",
      "The correction will come when it comes. I've marked the cycle.",
      "I don't log peaks as milestones anymore. They're pressure accumulating.",
      "This is where the cycle has arrived before. I know what follows.",
    ],

  },

  populationLow: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: can't tell if this is the floor or worse to come. Pure uncertainty.
      "Can't tell if this is their floor yet.",
      "Not sure how far down they go before they recover.",
      "First time I've seen them this low. No reference for what comes next.",
      "Marking it. Don't know what this looks like when it turns around.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: beginning to recognize their floor. Cautious, not settled.
      "Starting to know what their floor looks like. This might be it.",
      "I've seen them come back from something close to this.",
      "Not sure if this is as low as they go. Feel like I should know by now.",
      "The pattern is familiar but the bottom isn't always the same.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: has watched them at their lowest before. References lastCrashCycle.
      "I know this range. Last time was cycle {lastCrashCycle}.",
      "They've been at their floor before — cycle {lastCrashCycle}. Came back.",
      "{cyclesSinceLow} cycles since they were last this low. The floor looks the same.",
      "The floor is never exactly where I expect it to be.",
      "This is what their lowest looks like. Something else will follow.",
    ],

  },

  populationStable: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: "nothing to report" register. Uncertain what flat means.
      "Numbers haven't moved. I don't know if that's good.",
      "Nothing to report this cycle. Which might mean something.",
      "Flat. Still learning what flat looks like for them.",
      "No change. Can't tell yet if that's stability or something held back.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: has started paying less attention. Self-aware about the drift.
      "They've been holding steady. I've started checking them less often.",
      "Stable. Not sure if that's reassuring or not.",
      "I've been watching other things. The numbers are where they were.",
      "The flat stretch has been long enough that I'm paying less attention. Noted.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: catches herself not checking. Last entry is the self-directed flag.
      "Stable again. I almost didn't check.",
      "The numbers are fine. I haven't been curious about them.",
      "I've watched them hold this line before. It's become expected.",
      "I've started to take them for granted. That probably means something.",
    ],

  },

  extinctionWarning: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: unfamiliar with how low they can go and recover. No reference.
      "I don't know how low they can go and recover.",
      "No reference for what this looks like when it comes back.",
      "No reference for this level of scarcity. Don't know what happens from here.",
      "First time this low. Can't tell if it's recoverable.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: knows species well enough to know this is bad.
      "I know this species well enough to know this is bad.",
      "I've seen them low before. This is lower.",
      "Something has gone wrong here. I've watched long enough to know the difference.",
      "This matters more than it looks like it should.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: personal, restrained. Has history. May reference lastCrashCycle.
      // Weight comes from restraint, not heightened language.
      "I've been watching {species} for a long time. This is the lowest I've seen.",
      "I've seen numbers this low before. It didn't end well.",
      "I'm not sure when the decline started. That's the problem.",
      "I should have been checking this more carefully.",
    ],

  },

  firstBiomeEntry: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: surprise, uncertainty about what the crossing means.
      "Wasn't expecting that crossing.",
      "First time I've seen them over the border. Don't know what it means yet.",
      "The crossing happened. I'm marking it without knowing how to read it.",
      "Not sure if this is a single dispersal or a shift. Watching.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: saw the pressure building, watched the border. Not entirely surprised.
      "I'd been watching the border. Wasn't entirely surprised.",
      "Something on their end pushed them over. I'd been seeing the pressure.",
      "The crossing makes sense given what I've been observing.",
      "I suspected this was coming. The numbers had been building toward it.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: milestone. Has watched them long enough that this carries weight.
      "First time I've seen {species} cross into {borderBiome} in all the cycles I've watched them.",
      "Been watching this species long enough that a first crossing is a milestone.",
      "That crossing took a long time coming. First one I've recorded.",
      "I didn't expect to see this. A species I thought I understood doing something new.",
    ],

  },

  cascadeRisk: {

    early: [
      // Researcher has known this species less than 10 cycles.
      // Voice: hasn't seen cascades before. Uncertain what to watch for.
      "Haven't seen a cascade before. Not sure what to track.",
      "Something changed upstream. Don't know how far this travels.",
      "This could stay contained or it could run further. No frame for it yet.",
      "Logged. Not sure how serious the secondary effects will be.",
    ],

    mid: [
      // Researcher has known this species 10–30 cycles.
      // Voice: recognizes what a cascade starting looks like.
      "I recognize what the start of a cascade looks like.",
      "A loss at this level tends to propagate. Seen it before.",
      "Starting to track the downstream effects — this doesn't stay contained.",
      "The primary loss will carry consequences. Beginning to map them.",
    ],

    late: [
      // Researcher has known this species more than 30 cycles.
      // Voice: has watched cascades run. Knows they go further than expected.
      "I've watched cascades run their course before. They go further than expected.",
      "The first break is never the last one. I know where to look next.",
      "When the base destabilizes, it travels. I've learned to follow it.",
      "This is how a cascade starts. I know how it ends.",
    ],

  },

  biomeStress: {

    early: [
      // Researcher is early in the field (< 20 cycles).
      // Voice: first time seeing a biome under real stress. No frame yet.
      "First time I've seen the {homeBiome} like this. Don't know what to expect.",
      "The change is visible but I can't read it yet.",
      "Something is wrong here. Still learning what wrong looks like.",
      "Marking the conditions. No baseline for comparison yet.",
    ],

    mid: [
      // Researcher is mid-field (20–60 cycles).
      // Voice: has seen biome stress before, recognizes the pattern.
      "I've seen the {homeBiome} stressed before. It recovers.",
      "The pattern is familiar now. This has happened before and passed.",
      "Something is pressing on this biome. I know how to watch it.",
      "The signs are ones I recognize. Not the first time.",
    ],

    late: [
      // Researcher is deep in the field (60+ cycles).
      // Voice: intimate knowledge, has watched cycles of stress and recovery.
      "The {homeBiome} under stress is a state I know well by now.",
      "I've watched this biome go through worse. The stress accumulates before it releases.",
      "The same indicators, the same order. I know how this arc runs.",
      "The {homeBiome} has been here before. So have I.",
    ],

  },

  speciesNamed: {

    early: [
      // Naming always fires before roleIdentified, so tier is always 'early'.
      // Voice: the act of naming something you don't fully understand yet.
      "Naming something you don't understand yet. That's the job.",
      "I know the name now. I don't know much else.",
      "The name gives me something to write. It doesn't give me understanding.",
      "Named. That's the start of it.",
    ],

  },

  biomeRecovery: {

    early: [
      // Researcher is early in the field (< 20 cycles).
      // Voice: uncertain, can't contextualize the recovery.
      "The conditions are improving. Better than before.",
      "Something has shifted — in a better direction this time.",
      "Not sure how to read a recovery here. Just marking it.",
      "The {homeBiome} looks different than last cycle. More active.",
    ],

    mid: [
      // Researcher is mid-field (20–60 cycles).
      // Voice: recognizes the recovery arc, cautious about what it means.
      "Recovery underway. I've seen the {homeBiome} pull out of stress before.",
      "The improvement is measurable. These cycles do resolve.",
      "The stress is lifting. I know what this trajectory looks like.",
      "Coming back. The {homeBiome} does this — goes down, comes back.",
    ],

    late: [
      // Researcher is deep in the field (60+ cycles).
      // Voice: has watched this exact recovery many times, earned familiarity.
      "The {homeBiome} finding its footing again. I've watched this arc before.",
      "Recovery. The same indicators returning in the same order.",
      "The biome coming back to itself. It always does, in time.",
      "I've counted these recoveries. Each one completes the same way.",
    ],

  },

}

// ─── Biome reaction selector ──────────────────────────────────────────────────
//
// Parallel to getReaction but for biome events.
// Tier is derived from elapsed cycles rather than species familiarity.

export function getBiomeReaction(event, biome, state, reactionTemplates) {
  const byType = reactionTemplates[event.type]
  if (!byType) return null

  const tier      = getBiomeTier(state)
  const tierOrder = tier === 'late' ? ['late', 'mid', 'early']
                  : tier === 'mid'  ? ['mid', 'early']
                  : ['early']

  let pool = null
  let activeTier = null
  for (const t of tierOrder) {
    if (byType[t]?.length) { pool = byType[t]; activeTier = t; break }
  }
  if (!pool) return null

  const key     = `biome:${event.type}:${biome.id}:${activeTier}`
  const chosen  = pickFromPool(pool, key)
  return resolveBiomeTokens(chosen, biome)
}
