// ─── Fact template pools + selectors ─────────────────────────────────────────
//
// Flat per event type — no tier division. Facts are mechanical field notes:
// numbers, counts, changes. They precede the researcher's reaction in the
// four-slot assembly: [observation_detail] [fact] [context?] [reaction]
//
// Tokens: same system as the rest of the writing ({species}, {primaryPredator}, etc.)

import { resolveTokens, resolveBiomeTokens } from './tokens.js'

// ─── Session dedup ────────────────────────────────────────────────────────────

const _usedFacts = new Set()

// ─── Selectors ────────────────────────────────────────────────────────────────

// Select a fact from the flat pool for this event type.
// Facts have no tier division — they are mechanical.
// Unnamed species share a single dedup scope — all "Unknown organism" events
// draw from the same pool, so the same sentence can't repeat across them.
export function getFact(event, species, state, factTemplates) {
  const pool = factTemplates[event.type]
  if (!pool?.length) return null

  const scopeId = species.milestones?.named ? species.id : '__unknown__'
  const prefix = `fact:${event.type}:${scopeId}:`
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

export function getBiomeFact(event, biome, factTemplates) {
  const pool = factTemplates[event.type]
  if (!pool?.length) return null

  const prefix  = `fact:${event.type}:${biome.id}:`
  let available = pool.filter(s => !_usedFacts.has(prefix + s))

  if (available.length === 0) {
    for (const k of _usedFacts) {
      if (k.startsWith(prefix)) _usedFacts.delete(k)
    }
    available = [...pool]
  }

  const chosen = available[Math.floor(Math.random() * available.length)]
  _usedFacts.add(prefix + chosen)
  return resolveBiomeTokens(chosen, biome)
}

// ─── Fact template pools ──────────────────────────────────────────────────────

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
    "Count breaking the prior record again this cycle.",
    "New session high. Conditions appear to be sustaining the growth.",
    "Population cresting above the previous high.",
    "Another cycle up — no reversal in the data yet.",
    "{species} outpacing the prior peak by a measurable margin.",
    "{declinePct}% increase — the growth is holding.",
    "Continuous upward movement. No correction yet.",
  ],
  populationLow: [
    "New recorded low. {cyclesSinceLow} cycles since the prior one.",
    "{species} at their lowest count on record.",
    "Lower than anything on record.",
    "New floor. {cyclesSinceLow} cycles since the last.",
    "Lower than before — {cyclesSinceLow} cycles since the prior low.",
  ],
  populationStable: [
    "Population unchanged from last cycle.",
    "{species} holding at the same count. No significant change.",
    "Numbers stable — no movement this cycle.",
    "Count within normal variation of last cycle.",
    "Flat this cycle.",
  ],
  extinctionWarning: [
    "Fewest I've recorded — population at critical minimum.",
    "Near zero. Whatever was holding them stable is gone.",
    "Down to the last few individuals.",
    "Not much left to account for.",
    "Fewer individuals than I can confidently track.",
  ],
  extinction: [
    "{species} — none remaining.",
    "Population zero. {species} is gone.",
    "No remaining {species}. Extinction recorded this cycle.",
    "Final entry for {species}. Population: zero.",
    "{species} — zero. The record ends here.",
  ],
  firstBiomeEntry: [
    "{species} recorded in {borderBiome} for the first time.",
    "First confirmed {species} in {borderBiome} this cycle.",
    "{species} in {borderBiome} — first crossing on record.",
    "First documented {species} sighting in {borderBiome}.",
    "{species} has reached {borderBiome}. First entry recorded.",
  ],
  firstSighting: [
    "Something moving in {homeBiome}. No identification possible.",
    "Unidentified organism — brief sighting, {homeBiome}.",
    "First contact: unknown organism. No prior record.",
    "Something in {homeBiome}. Gone before I could observe properly.",
    "Sighting logged — unknown organism. Single observation.",
  ],
  subsequentSighting: [
    "Second sighting. Same or similar organism.",
    "Pattern building. Something is here consistently.",
    "Another observation. Hard to dismiss now.",
    "Repeated sightings suggest something resident, not passing through.",
    "Profile building slowly.",
    "The sightings are becoming regular enough to constitute a record.",
    "Consistent presence. Not a single individual passing through.",
    "I'm building a picture. More sightings needed before I can say much.",
  ],
  speciesNamed: [
    "First name in the field notes.",
    "Named informally — not yet in the formal record.",
    "Named from observation, not study.",
    "The name predates any formal documentation.",
    "In the notes before it was official.",
  ],
  cascadeRisk: [
    "{primaryFood} gone. {species} without their primary food source.",
    "Primary food source failing. {species} will feel this within a few cycles.",
    "{species} with no viable food source remaining — {primaryFood} depleted.",
    "{primaryPredator} population has collapsed. Natural check on {species} removed.",
    "Natural pressure on {species} removed — {primaryPredator} effectively absent.",
    "The check on {species} is gone. {primaryPredator} no longer a factor.",
  ],
  biomeStress: [
    "The {homeBiome} is quieter than it should be.",
    "{homeBiome} feels thin this cycle — coverage and activity both down.",
    "Something shifted in {homeBiome}. Can't place it yet.",
    "Less happening in {homeBiome} than baseline. The gaps are wider.",
    "The {homeBiome} is showing stress. Trying to identify where it started.",
  ],
  biomeRecovery: [
    "{homeBiome} showing signs of recovery.",
    "Activity returning to {homeBiome}. Something is improving.",
    "Coverage up in {homeBiome} — first positive indicators this cycle.",
    "{homeBiome} reading closer to baseline than last cycle.",
    "The stress period in {homeBiome} may be ending.",
  ],
}
