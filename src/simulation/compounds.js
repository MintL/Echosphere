// ─── Compound event detection ─────────────────────────────────────────────────
//
// Runs after the standard trigger pass. Finds causally related events that
// co-occurred in the same cycle and combines them into a single compound event.
//
// Compound events replace their absorbed source events in the session summary
// so the player reads one story rather than two isolated observations.
//
// Absorbed source events are marked `absorbed: true` by the caller (engine.js)
// using the IDs returned in each compound's `absorbedEventIds` array.
//
// Compound event shape:
//   {
//     type:             'compound',
//     subtype:          string,
//     cycle:            number,
//     speciesId:        string,   // primary species (for event history recording)
//     data:             object,   // compound-specific fields
//     absorbedEventIds: string[], // IDs of source events to suppress
//     requiresDecision: false,
//     resolved:         false,
//     absorbed:         false,
//   }

function getSpeciesById(state, id) {
  return state.species.find(s => s.id === id) ?? null
}

// ─── Compound type detectors ──────────────────────────────────────────────────

// A predator reaches a new population peak in the same cycle its prey crashes.
// The most common compound in simulation runs — the core predator/prey story.
function detectPredatorBoomPreyCrash(cycleEvents, state) {
  const predatorBooms = cycleEvents.filter(e => e.type === 'populationSurge'  && e.speciesId)
  const preyCrashes   = cycleEvents.filter(e => e.type === 'populationCrisis' && e.speciesId)

  if (!predatorBooms.length || !preyCrashes.length) return []

  const compounds = []

  for (const boom of predatorBooms) {
    const predator = getSpeciesById(state, boom.speciesId)
    if (!predator?.eats?.length) continue

    for (const crash of preyCrashes) {
      if (!predator.eats.some(e => e.preyId === crash.speciesId)) continue

      compounds.push({
        type:             'compound',
        subtype:          'predatorBoomPreyCrash',
        cycle:            boom.cycle,
        speciesId:        boom.speciesId,
        data: {
          predatorId: boom.speciesId,
          preyId:     crash.speciesId,
        },
        absorbedEventIds: [boom.id, crash.id],
        requiresDecision: false,
        resolved:         false,
        absorbed:         false,
      })
    }
  }

  return compounds
}

// An apex predator exits or crashes. Secondary consumers in the same biome surge
// into the vacated territory. Not a direct food-web relationship — Mordath doesn't
// eat Keth or Skethran — but a territorial vacancy: the apex predator's presence
// suppressed competitor activity, and its absence is immediately felt.
function detectApexDepartureSecondaryBoom(cycleEvents, state) {
  const apexExits = cycleEvents.filter(e =>
    (e.type === 'populationCrisis' || e.type === 'extinction') &&
    e.speciesId &&
    getSpeciesById(state, e.speciesId)?.catalogRole === 'apexPredator'
  )
  const secondaryBooms = cycleEvents.filter(e =>
    e.type === 'populationSurge' &&
    e.speciesId &&
    getSpeciesById(state, e.speciesId)?.catalogRole === 'secondaryConsumer'
  )

  if (!apexExits.length || !secondaryBooms.length) return []

  const compounds = []

  for (const exit of apexExits) {
    const apex = getSpeciesById(state, exit.speciesId)
    if (!apex) continue

    for (const boom of secondaryBooms) {
      const secondary = getSpeciesById(state, boom.speciesId)
      if (!secondary) continue
      // Territorial: both must share the same home biome
      if (apex.homeBiome !== secondary.homeBiome) continue

      compounds.push({
        type:             'compound',
        subtype:          'apexPredatorDepartureSecondaryBoom',
        cycle:            exit.cycle,
        speciesId:        exit.speciesId,
        data: {
          apexId:      exit.speciesId,
          secondaryId: boom.speciesId,
        },
        absorbedEventIds: [exit.id, boom.id],
        requiresDecision: false,
        resolved:         false,
        absorbed:         false,
      })
    }
  }

  return compounds
}

// A producer crashes and a primary consumer that depends on it reaches
// extinction-warning levels in the same cycle. The consumer's crisis is
// directly caused by its food base collapsing.
function detectProducerCrashConsumerCrisis(cycleEvents, state) {
  const producerCrashes = cycleEvents.filter(e =>
    e.type === 'populationCrisis' &&
    e.speciesId &&
    getSpeciesById(state, e.speciesId)?.role === 'producer'
  )
  const consumerWarnings = cycleEvents.filter(e =>
    e.type === 'extinctionWarning' &&
    e.speciesId
  )

  if (!producerCrashes.length || !consumerWarnings.length) return []

  const compounds = []

  for (const crash of producerCrashes) {
    for (const warning of consumerWarnings) {
      const consumer = getSpeciesById(state, warning.speciesId)
      if (!consumer?.eats?.some(e => e.preyId === crash.speciesId)) continue

      compounds.push({
        type:             'compound',
        subtype:          'producerCrashPrimaryConsumerCrisis',
        cycle:            crash.cycle,
        speciesId:        crash.speciesId,
        data: {
          producerId: crash.speciesId,
          consumerId: warning.speciesId,
        },
        absorbedEventIds: [crash.id, warning.id],
        requiresDecision: false,
        resolved:         false,
        absorbed:         false,
      })
    }
  }

  return compounds
}

// ─── Primary export ───────────────────────────────────────────────────────────

// Runs after the standard trigger pass. Returns compound event objects for all
// detected causal relationships. Does not mutate cycleEvents.
export function detectCompoundEvents(cycleEvents, state) {
  return [
    ...detectPredatorBoomPreyCrash(cycleEvents, state),
    ...detectApexDepartureSecondaryBoom(cycleEvents, state),
    ...detectProducerCrashConsumerCrisis(cycleEvents, state),
  ]
}
