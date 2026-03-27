// ─── Researcher reaction tier selector + event text assembly ─────────────────
//
// Provides the researcher_reaction slot and assembles all four event text slots:
//   [observation_detail] [fact] [context?] [researcher_reaction]
//
// The reaction slot is the emotional register of the researcher. The same
// population crash reads differently at cycle 3 vs cycle 60. The tier is
// determined by how long the researcher has known this species.
//
// Usage:
//   const text = assembleEventText(event, species, state)
//   // caller should then: applyContextCooldown(species, context.type, state.cycle)
//   // (assembleEventText is pure text output — side effects are the caller's job)

import { getObservationDetail, resolveTokens } from './tokens.js'
import { selectContext, resolveContextTokens, CONTEXT_TEMPLATES } from './context.js'

// Side-effect imports: each file registers itself into OBSERVATION_POOLS on load.
import './species/feltmoss.js'
import './species/nightroot.js'
import './species/scaleweed.js'
import './species/vellin.js'
import './species/woldren.js'
import './species/brack.js'
import './species/torrak.js'
import './species/keth.js'
import './species/skethran.js'
import './species/mordath.js'
import './species/grubmere.js'

// ─── Session dedup sets ───────────────────────────────────────────────────────

const _usedReactions = new Set()
const _usedFacts     = new Set()

// ─── Tier selector ────────────────────────────────────────────────────────────

// Returns the researcher's emotional register based on cycles since role identification.
// cyclesSinceRoleIdentified is tracked in engine.js phase 5 — increments while
// roleIdentified && !behaviorMapped, then freezes. Null/missing → 0 → 'early'.
export function getReactionTier(species) {
  const n = species.history?.cyclesSinceRoleIdentified ?? 0
  if (n < 10)  return 'early'
  if (n <= 30) return 'mid'
  return 'late'
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

// Select a fact from the flat pool for this event type.
// Facts have no tier division — they are mechanical.
export function getFact(event, species, state, factTemplates) {
  const pool = factTemplates[event.type]
  if (!pool?.length) return null

  const prefix = `fact:${event.type}:${species.id}:`
  let available = pool.filter(s => !_usedFacts.has(prefix + s))

  if (available.length === 0) {
    for (const k of _usedFacts) {
      if (k.startsWith(prefix)) _usedFacts.delete(k)
    }
    available = [...pool]
  }

  const chosen = available[Math.floor(Math.random() * available.length)]
  _usedFacts.add(prefix + chosen)
  return resolveTokens(chosen, species, state)
}

// ─── Context template picker (private) ───────────────────────────────────────

function pickContextTemplate(context) {
  if (!context) return null
  // Try event-type-specific pool first, fall back to generic
  const specificKey = context.eventType ? `${context.type}_${context.eventType}` : null
  const pool = (specificKey && CONTEXT_TEMPLATES[specificKey]?.length)
    ? CONTEXT_TEMPLATES[specificKey]
    : CONTEXT_TEMPLATES[context.type]
  if (!pool?.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Event text assembly ──────────────────────────────────────────────────────

// Assembles all four slots into a single researcher-voice paragraph.
// Pure text output — does NOT apply context cooldown (caller's responsibility).
export function assembleEventText(event, species, state) {
  const context     = selectContext(event, species, state)
  const contextText = context
    ? resolveContextTokens(pickContextTemplate(context), context)
    : null

  const parts = [
    getObservationDetail(species, state),
    getFact(event, species, state, FACT_TEMPLATES),
    contextText,
    getReaction(event, species, state, REACTION_TEMPLATES),
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' ') : null
}

// ─── Fact template pools ──────────────────────────────────────────────────────
//
// Flat per event type — no tier division. Facts are mechanical.
// Tokens: same system as the rest of the writing ({species}, {primaryPredator}, etc.)

export const FACT_TEMPLATES = {
  populationCrisis: [
    "{species} down {declinePct}%, {primaryPredator} pressure from above.",
    "Numbers down {declinePct}% this cycle.",
    "{primaryPredator} ranging further in. Down {declinePct}% this cycle.",
    "Down {declinePct}% from last cycle.",
    "Population down {declinePct}%. Lowest in {cyclesSinceLow} cycles.",
  ],
  populationSurge: [
    "Up {declinePct}% from last cycle — new recorded peak.",
    "{species} at their highest observed count.",
    "Sharp increase this cycle. {primaryFood} appears to be supporting it.",
    "New high. {primaryPredator} pressure has been light.",
    "Numbers climbing — {declinePct}% above last cycle.",
  ],
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
      "They've been here before — cycle {lastCrashCycle}. They came back. Different circumstances now.",
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
    ],

  },

}
