// ─── Context detection system ─────────────────────────────────────────────────
//
// The context slot is the researcher's memory surfacing in event text.
// It connects the present moment to specific past events — not generic awareness,
// but precise references. Without context the researcher is always experiencing
// things for the first time. With it they are a person with history.
//
// Context should be empty most of the time. Scarcity is the point.
//
// Context types (in weight order, highest first):
//   nearExtinctionRecovery — species survived near-total collapse before
//   priorDecision          — researcher previously intervened for this species
//   priorSameEvent         — same event type fired for this species before
//   consecutivePattern     — same event type for N consecutive cycles
//
// Usage:
//   const context = selectContext(event, species, state)
//   if (context) {
//     const text = renderContext(context, species, state)
//     // record the fire so cooldown starts
//     const updatedSpecies = applyContextCooldown(species, context.type, state.cycle)
//   }

// ─── Cooldown periods (cycles) ────────────────────────────────────────────────

const CONTEXT_COOLDOWNS = {
  nearExtinctionRecovery: 20,  // rare and weighty — don't dilute it
  priorDecision:          12,
  priorSameEvent:          8,  // don't reference the same past crash twice in 8 cycles
  consecutivePattern:      3,  // can fire more often — pattern is actively developing
}

// Minimum consecutive cycles required to surface a consecutivePattern context
const CONSECUTIVE_THRESHOLD = 3

// Near-extinction threshold: species must have dropped below this fraction of peak
const NEAR_EXTINCTION_FRACTION = 0.05

// Recovery minimum: must be at least this far above the near-extinction low
const RECOVERY_MULTIPLIER = 4

// ─── Cooldown check ───────────────────────────────────────────────────────────

function isCooledDown(species, contextType, currentCycle) {
  const lastFired = species.history.contextCooldowns?.[contextType]
  if (lastFired == null) return true
  return currentCycle - lastFired >= CONTEXT_COOLDOWNS[contextType]
}

// ─── Individual context detectors ────────────────────────────────────────────

// Species previously dropped below 5% of peak and has since recovered.
// Most emotionally weighted — makes current danger feel more consequential.
function getNearExtinctionContext(event, species) {
  const peak = species.history.peakPopulation
  if (!peak || peak <= 0) return null

  const threshold = peak * NEAR_EXTINCTION_FRACTION
  if (species.history.lowestPopulation > threshold) return null

  // Must have actually recovered — not still at/near the low
  if (species.population < species.history.lowestPopulation * RECOVERY_MULTIPLIER) return null

  return {
    type:         'nearExtinctionRecovery',
    cycle:        species.history.lowestPopulationCycle,
    lowestPop:    Math.round(species.history.lowestPopulation),
    lowestCycle:  species.history.lowestPopulationCycle,
  }
}

// Researcher previously made a decision involving this species.
// Uses most recent decision.
function getPriorDecisionContext(event, species, state) {
  const decisions = species.history.decisions
  if (!decisions?.length) return null

  const mostRecent = [...decisions].sort((a, b) => b.cycle - a.cycle)[0]

  return {
    type:          'priorDecision',
    cycle:         mostRecent.cycle,
    decisionCycle: mostRecent.cycle,
    outcome:       mostRecent.outcome ?? null,
  }
}

// Same event subtype has fired for this species in a prior cycle.
// References the most recent prior occurrence.
// Suppressed when an active consecutive streak is developing — consecutivePattern
// is the stronger context and covers the streak case.
function getPriorSameEventContext(event, species) {
  const pastEvents = species.history.events ?? []

  // Suppress if the previous cycle had the same event — streak is active
  const streakActive = pastEvents.some(
    e => e.type === event.type && e.cycle === event.cycle - 1
  )
  if (streakActive) return null

  const prior = pastEvents
    .filter(e => e.type === event.type && e.cycle < event.cycle)
    .sort((a, b) => b.cycle - a.cycle)[0]

  if (!prior) return null

  return {
    type:       'priorSameEvent',
    eventType:  event.type,
    cycle:      prior.cycle,
    priorCycle: prior.cycle,
  }
}

// Same event subtype has fired for N consecutive cycles (ending at the previous cycle).
// Current event extends the streak to N+1 — the context describes the streak.
function getConsecutivePatternContext(event, species) {
  const sameType = (species.history.events ?? [])
    .filter(e => e.type === event.type && e.cycle < event.cycle)
    .sort((a, b) => b.cycle - a.cycle)

  if (sameType.length === 0) return null

  // Count consecutive cycles ending at event.cycle - 1
  let n = 1  // current event is cycle 1 of the streak
  let expected = event.cycle - 1

  for (const e of sameType) {
    if (e.cycle === expected) {
      n++
      expected--
    } else if (e.cycle < expected) {
      break
    }
    // Skip duplicate entries for the same cycle
  }

  if (n < CONSECUTIVE_THRESHOLD) return null

  return {
    type:       'consecutivePattern',
    eventType:  event.type,
    cycle:      event.cycle - n + 1,   // streak start cycle
    n,
    startCycle: event.cycle - n + 1,
  }
}

// ─── Weight scoring ───────────────────────────────────────────────────────────

function getContextWeight(context, state) {
  let weight = 0

  if (context.type === 'nearExtinctionRecovery') weight += 3
  if (context.type === 'priorDecision')          weight += 2
  if (context.type === 'priorSameEvent')         weight += 1
  if (context.type === 'consecutivePattern')     weight += 1

  // Recency bonus — more recent history feels more relevant
  if (context.cycle != null) {
    weight += Math.max(0, 1 - (state.cycle - context.cycle) / 50)
  }

  return weight
}

// ─── Primary export ───────────────────────────────────────────────────────────

// Returns the highest-weight context candidate that has cleared its cooldown,
// or null if no qualifying context exists.
export function selectContext(event, species, state) {
  const candidates = [
    getNearExtinctionContext(event, species),
    getPriorDecisionContext(event, species, state),
    getPriorSameEventContext(event, species),
    getConsecutivePatternContext(event, species),
  ]
    .filter(Boolean)
    .filter(c => isCooledDown(species, c.type, state.cycle))

  if (candidates.length === 0) return null

  return candidates.sort((a, b) => getContextWeight(b, state) - getContextWeight(a, state))[0]
}

// Returns an updated species object with the context cooldown recorded.
// Pure function — caller must apply the result to state.
export function applyContextCooldown(species, contextType, cycle) {
  return {
    ...species,
    history: {
      ...species.history,
      contextCooldowns: {
        ...species.history.contextCooldowns,
        [contextType]: cycle,
      },
    },
  }
}

// ─── Context template pools ───────────────────────────────────────────────────
//
// These are the authored strings for the context slot.
// Tokens: {priorCycle}, {lowestPop}, {lowestCycle}, {decisionCycle},
//         {decisionOutcome}, {n}, {startCycle}
// The standard token system ({species}, {primaryPredator}, etc.) also applies.

export const CONTEXT_TEMPLATES = {
  priorSameEvent: [
    "This is the same pattern that preceded the crash in cycle {priorCycle}.",
    "Saw this before at cycle {priorCycle}. They recovered. Usually.",
    "The numbers looked like this in cycle {priorCycle} too.",
  ],
  priorSameEvent_populationSurge: [
    "Numbers this high in cycle {priorCycle} too. A crash followed.",
    "Saw this in cycle {priorCycle}. The correction came shortly after.",
    "They peaked at similar levels in cycle {priorCycle}.",
  ],
  priorSameEvent_populationCrisis: [
    "Cycle {priorCycle} had a similar run. It took a while to find the floor.",
    "Numbers this low before — cycle {priorCycle}. The turn was slow.",
    "Seen this rate of decline once before. Cycle {priorCycle}.",
    "Cycle {priorCycle} followed the same shape. Recovery came eventually.",
  ],
  priorSameEvent_populationLow: [
    "Population this low in cycle {priorCycle} too. They recovered.",
    "Saw a new low in cycle {priorCycle}. This one is lower.",
    "Same floor as cycle {priorCycle}, roughly.",
    "They've been here before — cycle {priorCycle}.",
  ],
  priorSameEvent_populationStable: [
    "Held flat like this around cycle {priorCycle}.",
    "A similar plateau in cycle {priorCycle}. Not sure what followed.",
    "They went quiet like this in cycle {priorCycle}.",
  ],
  priorSameEvent_extinctionWarning: [
    "Warning-level numbers in cycle {priorCycle} too. They came back.",
    "Saw this same threshold in cycle {priorCycle}.",
    "This low before, in cycle {priorCycle}. That time they recovered.",
    "Cycle {priorCycle}, the same numbers. Different outcome possible this time.",
  ],
  consecutivePattern: [
    "Third consecutive decline.",
    "{n} cycles of contraction now.",
    "The population has been falling since cycle {startCycle}.",
  ],
  consecutivePattern_populationSurge: [
    "Third consecutive peak.",
    "{n} cycles of sustained growth.",
    "Climbing since cycle {startCycle}.",
  ],
  consecutivePattern_populationStable: [
    "Same count every cycle since {startCycle}.",
    "{n} cycles without a shift.",
    "Nothing has changed since cycle {startCycle}.",
    "Holding the same ground for {n} cycles now.",
  ],
  consecutivePattern_populationCrisis: [
    "Down every cycle since {startCycle}. No floor yet.",
    "{n} cycles without a recovery signal.",
    "The decline has run uninterrupted since {startCycle}.",
    "Every cycle since {startCycle} has been lower than the last.",
  ],
  consecutivePattern_populationLow: [
    "{n} consecutive cycles at or near their floor.",
    "Declining every cycle since {startCycle}.",
    "{n} cycles in decline. The floor keeps moving.",
    "Dropping every cycle since {startCycle}.",
  ],
  consecutivePattern_extinctionWarning: [
    "Critical numbers for {n} consecutive cycles.",
    "Warning-level since cycle {startCycle} — not recovering.",
    "{n} cycles at extinction threshold.",
  ],
  nearExtinctionRecovery: [
    "They were at {lowestPop} individuals in cycle {lowestCycle}. Came back from that.",
    "I've watched them recover from worse. Cycle {lowestCycle}, {lowestPop} left.",
    "Lowest I've seen them was cycle {lowestCycle}. They pulled through.",
  ],
  priorDecision: [
    "I intervened in cycle {decisionCycle}. {decisionOutcome}.",
    "Direct support worked in cycle {decisionCycle}. Conditions are different now.",
    "Last time I stepped in was cycle {decisionCycle}. Worth considering again.",
  ],
}

// Resolves context-specific tokens in a template string.
// Delegates standard tokens ({species}, {primaryPredator}, etc.) to resolveTokens.
export function resolveContextTokens(template, context) {
  return template
    .replace(/{priorCycle}/g,      context.priorCycle    ?? '?')
    .replace(/{lowestPop}/g,       context.lowestPop     ?? '?')
    .replace(/{lowestCycle}/g,     context.lowestCycle   ?? '?')
    .replace(/{decisionCycle}/g,   context.decisionCycle ?? '?')
    .replace(/{decisionOutcome}/g, context.outcome       ?? 'uncertain outcome')
    .replace(/{n}/g,               context.n             ?? '?')
    .replace(/{startCycle}/g,      context.startCycle    ?? '?')
}
