// ─── Event → display entry conversion ────────────────────────────────────────
//
// Converts raw engine events into display entries for the session summary.
// Each entry: { cycle, type, text, speciesIds, biomeIds }
//
// Entry types: 'observation' | 'crisis' | 'decision'
// Text is researcher-voiced, first person, present tense.

const BIOME_NAMES = {
  highgrowth:  'Highgrowth',
  understory:  'Understory',
  scorchFlats: 'Scorch Flats',
}

function pct(n) {
  return `${Math.round(n * 100)}%`
}

// Per-event-type renderers
const RENDERERS = {

  extinction({ data }) {
    return {
      type: 'crisis',
      text: `${data.name} — no individuals recorded this cycle. Peak population was ${Math.round(data.peakPopulation)}. The species appears to have collapsed entirely.`,
      speciesIds: [],
    }
  },

  extinctionWarning({ data }) {
    return {
      type: 'crisis',
      text: `${data.name} population at ${pct(data.pct)} of baseline — ${Math.round(data.population)} individuals. At this rate, collapse is possible within a few cycles.`,
      speciesIds: [],
    }
  },

  populationCrisis({ data }) {
    return {
      type: 'crisis',
      text: `${data.name} dropped ${pct(data.dropPct)} in a single cycle — from ${Math.round(data.prevPopulation)} to ${Math.round(data.nextPopulation)}. Something has shifted sharply.`,
      speciesIds: [],
    }
  },

  populationSurge({ data }) {
    return {
      type: 'observation',
      text: `${data.name} at a new peak — ${Math.round(data.population)} individuals, surpassing the previous high of ${Math.round(data.previousPeak)}. Conditions appear favorable.`,
      speciesIds: [],
    }
  },

  populationLow({ data }) {
    return {
      type: 'observation',
      text: `${data.name} reached a new recorded low of ${Math.round(data.population)}. Previous low was ${Math.round(data.previousLow)}.`,
      speciesIds: [],
    }
  },

  populationStable({ data }) {
    return {
      type: 'observation',
      text: `${data.name} has maintained a stable population near ${Math.round(data.population)} for twenty consecutive cycles. Unusually consistent for this species.`,
      speciesIds: [],
    }
  },

  cascadeRisk({ data }) {
    if (data.trigger === 'preyLost') {
      const foodNote = data.hasOtherFood
        ? 'It has other prey available, but this loss will be felt.'
        : 'With no remaining prey, it faces starvation pressure.'
      return {
        type: data.hasOtherFood ? 'observation' : 'crisis',
        text: `${data.name} has lost ${data.lostSpecies} as a food source. ${foodNote}`,
        speciesIds: [],
      }
    } else {
      return {
        type: 'observation',
        text: `${data.name} is no longer being kept in check by ${data.lostSpecies}. Population pressure may increase.`,
        speciesIds: [],
      }
    }
  },

  biomeStress({ biomeId, data }) {
    const name = BIOME_NAMES[biomeId] ?? biomeId
    return {
      type: 'crisis',
      text: `${name} biome health has dropped below 30% — currently at ${pct(data.health)}. Ecosystem stress is accumulating.`,
      biomeIds: [biomeId],
    }
  },

  biomeRecovery({ biomeId, data }) {
    const name = BIOME_NAMES[biomeId] ?? biomeId
    return {
      type: 'observation',
      text: `${name} showing signs of recovery — health back above 50% at ${pct(data.health)}.`,
      biomeIds: [biomeId],
    }
  },

  firstBiomeEntry({ data }) {
    const biomeName = BIOME_NAMES[data.biome] ?? data.biome
    return {
      type: 'observation',
      text: `First ${data.name} individuals recorded in ${biomeName} — a subpopulation of ${Math.round(data.population)}. New territory.`,
      speciesIds: [],
      biomeIds: [data.biome],
    }
  },

  subpopulationStabilized({ data }) {
    const biomeName = BIOME_NAMES[data.biome] ?? data.biome
    return {
      type: 'observation',
      text: `The ${data.name} subpopulation in ${biomeName} has persisted long enough to be considered established — ${Math.round(data.population)} individuals.`,
      speciesIds: [],
      biomeIds: [data.biome],
    }
  },

  subpopulationFailed({ data }) {
    const biomeName = BIOME_NAMES[data.biome] ?? data.biome
    return {
      type: 'observation',
      text: `The ${data.name} subpopulation in ${biomeName} has disappeared after ${data.cyclesAlive} cycles. The expansion attempt failed.`,
      speciesIds: [],
      biomeIds: [data.biome],
    }
  },

  speciationCandidate({ data }) {
    const biomeName = BIOME_NAMES[data.biome] ?? data.biome
    return {
      type: 'observation',
      text: `The ${data.name} subpopulation in ${biomeName} has been adapting for ${data.adaptationCycles} cycles. Divergence from the main population is measurable.`,
      speciesIds: [],
      biomeIds: [data.biome],
    }
  },

  nicheOpened({ data }) {
    const candidateNames = data.candidates.map(c => c.name).join(', ')
    return {
      type: 'decision',
      text: `${data.extinctName} is gone. The niche it occupied is vacant. Potential replacements have been identified: ${candidateNames}.`,
      speciesIds: [],
    }
  },
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Convert a raw engine event into a display entry.
// Returns null for event types with no renderer (silently dropped).
export function eventToEntry(event) {
  const renderer = RENDERERS[event.type]
  if (!renderer) return null

  const rendered = renderer(event)
  return {
    cycle:      event.cycle,
    speciesIds: event.speciesId ? [event.speciesId] : [],
    biomeIds:   event.biomeId   ? [event.biomeId]   : [],
    ...rendered,
  }
}

// Convert an array of engine events into display entries, dropping nulls.
export function eventsToEntries(events) {
  return events.map(eventToEntry).filter(Boolean)
}
