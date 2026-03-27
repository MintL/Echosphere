// ─── Event → display entry conversion ────────────────────────────────────────
//
// Converts raw engine events into display entries for the session summary.
// Each entry: { cycle, type, segments, speciesIds, biomeIds }
//
// Entry types: 'observation' | 'crisis' | 'decision'
// Text is researcher-voiced, first person, present tense.
//
// Species and biome names are parameterized as [sp:id] / [biome:id] markers
// and resolved against current game state at render time.

import { spName } from '../../utils/species.js'
import { getObservationDetail, getBiomeObservationDetail } from './tokens.js'
import { selectContext, resolveContextTokens, CONTEXT_TEMPLATES } from './context.js'
import { getReaction, getBiomeReaction, REACTION_TEMPLATES } from './reactions.js'
import { getFact, getBiomeFact, FACT_TEMPLATES } from './facts.js'

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

// Side-effect imports: each file registers itself into BIOME_OBSERVATION_POOLS on load.
import './biomes/highgrowth.js'
import './biomes/understory.js'
import './biomes/scorchflats.js'

// ─── Event text assembly ──────────────────────────────────────────────────────

function pickContextTemplate(context) {
  if (!context) return null
  const specificKey = context.eventType ? `${context.type}_${context.eventType}` : null
  const pool = (specificKey && CONTEXT_TEMPLATES[specificKey]?.length)
    ? CONTEXT_TEMPLATES[specificKey]
    : CONTEXT_TEMPLATES[context.type]
  if (!pool?.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// Assembles observation_detail + fact + reaction for biome events.
// No context slot — biomes have no history tracking in game state.
// Pure text — returns null if no content is available.
function assembleBiomeEventText(event, state) {
  const biome = state.biomes?.[event.biomeId]
  if (!biome) return null

  const parts = [
    getBiomeObservationDetail(biome, state),
    getBiomeFact(event, biome, FACT_TEMPLATES),
    getBiomeReaction(event, biome, state, REACTION_TEMPLATES),
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' ') : null
}

// Assembles observation_detail + fact + context + reaction into a paragraph.
// Pure text — does NOT apply context cooldown (caller's responsibility).
function assembleEventText(event, species, state) {
  if (event.speciesId !== species.id) {
    console.warn('[assembleEventText] speciesId mismatch', { eventType: event.type, eventSpeciesId: event.speciesId, resolvedSpeciesId: species.id, cycle: event.cycle })
  }

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

// Event types that use the full researcher-voice assembly instead of
// the mechanical template. Falls back to mechanical if assembly returns null.
// Requirements: event must have a speciesId and at least a FACT_TEMPLATES pool.
// Excluded: extinction (mechanical by spec), firstSighting/subsequentSighting/biomeStress/biomeRecovery (no speciesId).
const VOICED_TYPES = new Set([
  'populationCrisis',
  'populationSurge',
  'populationLow',
  'populationStable',
  'extinctionWarning',
  'firstBiomeEntry',
  'cascadeRisk',
  'speciesNamed',
  'firstSighting',
  'subsequentSighting',
  'biomeStress',
  'biomeRecovery',
])

const BIOME_NAMES = {
  highgrowth:  'Highgrowth',
  understory:  'Understory',
  scorchFlats: 'Scorch Flats',
}

function pct(n) {
  return `${Math.round(n * 100)}%`
}

// ─── Segment resolution ───────────────────────────────────────────────────────

// Parse a template string containing [sp:id] and [biome:id] markers into
// an array of segments: { type: 'text', value } | { type: 'entity', entityType, id, name }
function resolveSegments(template, gameState) {
  const segments = []
  const regex    = /\[(sp|biome):([^\]]+)\]/g
  let last = 0, match

  while ((match = regex.exec(template)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: template.slice(last, match.index) })
    }
    const [, entityType, id] = match
    let name
    if (entityType === 'sp') {
      const sp = gameState?.species?.find(s => s.id === id)
      name = sp ? spName(sp) : id
    } else {
      name = BIOME_NAMES[id] || id
    }
    segments.push({ type: 'entity', entityType, id, name })
    last = match.index + match[0].length
  }

  if (last < template.length) {
    segments.push({ type: 'text', value: template.slice(last) })
  }
  return segments
}

// ─── Per-event-type renderers ─────────────────────────────────────────────────
// Each renderer receives the full event object and returns { type, template }.

const RENDERERS = {

  extinction(ev) {
    const sp   = `[sp:${ev.speciesId}]`
    const peak = Math.round(ev.data.peakPopulation)
    const variants = [
      `${sp} — no individuals recorded this cycle. Peak count was ${peak}. The record ends here.`,
      `${sp} — gone. Population zero. They reached ${peak} at their highest.`,
      `${sp} — none remaining. Peak of ${peak}. Extinction recorded this cycle.`,
      `${sp} — zero. The count has held at zero this cycle. I don't expect it to change.`,
      `${sp} — population collapsed to zero. Final logged peak was ${peak}.`,
    ]
    return {
      type: 'crisis',
      template: variants[ev.cycle % variants.length],
    }
  },

  extinctionWarning(ev) {
    return {
      type: 'crisis',
      template: `[sp:${ev.speciesId}] population at ${pct(ev.data.pct)} of baseline — ${Math.round(ev.data.population)} individuals. At this rate, collapse is possible within a few cycles.`,
    }
  },

  populationCrisis(ev) {
    return {
      type: 'crisis',
      template: `[sp:${ev.speciesId}] dropped ${pct(ev.data.dropPct)} in a single cycle — from ${Math.round(ev.data.prevPopulation)} to ${Math.round(ev.data.nextPopulation)}. Something has shifted sharply.`,
    }
  },

  populationSurge(ev) {
    return {
      type: 'observation',
      template: `[sp:${ev.speciesId}] at a new peak — ${Math.round(ev.data.population)} individuals, surpassing the previous high of ${Math.round(ev.data.previousPeak)}. Conditions appear favorable.`,
    }
  },

  populationLow(ev) {
    return {
      type: 'observation',
      template: `[sp:${ev.speciesId}] reached a new recorded low of ${Math.round(ev.data.population)}. Previous low was ${Math.round(ev.data.previousLow)}.`,
    }
  },

  populationStable(ev) {
    return {
      type: 'observation',
      template: `[sp:${ev.speciesId}] has maintained a stable population near ${Math.round(ev.data.population)} for twenty consecutive cycles. Unusually consistent for this species.`,
    }
  },

  cascadeRisk(ev) {
    const { data } = ev
    if (data.trigger === 'preyLost') {
      const foodNote = data.hasOtherFood
        ? 'It has other prey available, but this loss will be felt.'
        : 'With no remaining prey, it faces starvation pressure.'
      return {
        type: data.hasOtherFood ? 'observation' : 'crisis',
        template: `[sp:${ev.speciesId}] has lost [sp:${data.lostSpeciesId}] as a food source. ${foodNote}`,
      }
    } else {
      return {
        type: 'observation',
        template: `[sp:${ev.speciesId}] is no longer being kept in check by [sp:${data.lostSpeciesId}]. Population pressure may increase.`,
      }
    }
  },

  biomeStress(ev) {
    return {
      type: 'crisis',
      template: `[biome:${ev.biomeId}] biome health has dropped below 30% — currently at ${pct(ev.data.health)}. Ecosystem stress is accumulating.`,
    }
  },

  biomeRecovery(ev) {
    return {
      type: 'observation',
      template: `[biome:${ev.biomeId}] showing signs of recovery — health back above 50% at ${pct(ev.data.health)}.`,
    }
  },

  firstBiomeEntry(ev) {
    return {
      type: 'observation',
      template: `First [sp:${ev.speciesId}] individuals recorded in [biome:${ev.data.biome}] — a subpopulation of ${Math.round(ev.data.population)}. New territory.`,
    }
  },

  subpopulationStabilized(ev) {
    return {
      type: 'observation',
      template: `The [sp:${ev.speciesId}] subpopulation in [biome:${ev.data.biome}] has persisted long enough to be considered established — ${Math.round(ev.data.population)} individuals.`,
    }
  },

  subpopulationFailed(ev) {
    return {
      type: 'observation',
      template: `The [sp:${ev.speciesId}] subpopulation in [biome:${ev.data.biome}] has disappeared after ${ev.data.cyclesAlive} cycles. The expansion attempt failed.`,
    }
  },

  speciationCandidate(ev) {
    return {
      type: 'observation',
      template: `The [sp:${ev.speciesId}] subpopulation in [biome:${ev.data.biome}] has been adapting for ${ev.data.adaptationCycles} cycles. Divergence from the main population is measurable.`,
    }
  },

  nicheOpened(ev) {
    const candidateNames = ev.data.candidates.map(c => c.name).join(', ')
    return {
      type: 'decision',
      template: `[sp:${ev.speciesId}] is gone. The niche it occupied is vacant. Potential replacements have been identified: ${candidateNames}.`,
    }
  },

  firstSighting(ev) {
    return {
      type: 'observation',
      template: `Unknown organism — first confirmed sighting in [biome:${ev.data.biomeName}]. ${Math.round(ev.data.population)} individuals observed. Added to the observation list.`,
    }
  },

  subsequentSighting(ev) {
    const lines = [
      `Unknown organism — spotted again in [biome:${ev.data.biomeName}]. ${Math.round(ev.data.population)} individuals. Behavior consistent with previous observations.`,
      `Unknown organism — another sighting. Population holding near ${Math.round(ev.data.population)}.`,
      `Unknown organism — fourth confirmed sighting. Pattern is consistent.`,
      `Unknown organism — fifth sighting recorded. Sufficient observations to propose a formal study.`,
    ]
    return {
      type: 'observation',
      template: lines[Math.min(ev.data.sightingCount - 2, lines.length - 1)],
    }
  },

  speciesNamed(ev) {
    const sp = `[sp:${ev.speciesId}]`
    const variants = [
      `I've been calling it ${sp}. The name stuck.`,
      `${sp} — the name came from the first clear look. I've used it in my notes since.`,
      `I started writing ${sp} in the margins a few cycles ago. It fits.`,
      `The name ${sp} came from something about the movement. I've kept it.`,
      `${sp} — I needed something to write. Now I can't think of it as anything else.`,
    ]
    return { type: 'observation', template: variants[ev.cycle % variants.length] }
  },

  studySuggested(ev) {
    const sp = `[sp:${ev.speciesId}]`
    const variants = [
      `${sp} — enough sightings to justify a formal study. Added to research suggestions.`,
      `Formal study suggested for ${sp}. Added to the queue.`,
      `${sp} — sighting record warrants Initial Documentation. Added to suggestions.`,
      `Adding ${sp} to study suggestions. The record is there to support it.`,
    ]
    return {
      type: 'observation',
      template: variants[ev.cycle % variants.length],
    }
  },

  studyCompleted(ev) {
    const { data } = ev
    const sp = `[sp:${ev.speciesId}]`
    if (data.tier === 'speciesStudy_initial') {
      const variants = [
        `Initial study on ${sp} complete. Species formally designated. Role in the ecosystem confirmed.`,
        `Baseline documentation on ${sp} complete. Formally named and classified.`,
        `Completed initial study on ${sp}. Role in the ecosystem mapped.`,
        `${sp} study complete. Named and added to the formal species record.`,
        `Documentation wrapped on ${sp}. Role confirmed. I know what this species is now.`,
      ]
      return { type: 'observation', template: variants[ev.cycle % variants.length] }
    }
    if (data.tier === 'speciesStudy_behavioral') {
      const variants = [
        `Behavioral study on ${sp} complete. Movement patterns and ecological interactions documented.`,
        `Behavioral documentation on ${sp} complete. Activity patterns mapped over the study period.`,
        `${sp} behavior study wrapped. The movement data fills in what I'd been guessing at.`,
        `Completed behavioral study on ${sp}. Interaction patterns documented.`,
        `${sp} behavioral study complete. I understand their patterns better than I did going in.`,
      ]
      return { type: 'observation', template: variants[ev.cycle % variants.length] }
    }
    return {
      type: 'observation',
      template: `Research project on ${sp} complete.`,
    }
  },

  researchStarted(ev) {
    return {
      type: 'observation',
      template: `Starting: ${ev.data.name} — [sp:${ev.speciesId}]. Expected completion in ${ev.data.durationCycles} ${ev.data.durationCycles === 1 ? 'cycle' : 'cycles'}.`,
    }
  },
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Convert a raw engine event into a display entry.
// gameState is used to resolve species/biome names at render time.
// Returns null for event types with no renderer.
export function eventToEntry(event, gameState) {
  const renderer = RENDERERS[event.type]
  if (!renderer) return null

  // For voiced event types, try the full researcher-voice assembly first.
  if (VOICED_TYPES.has(event.type)) {
    // Biome events — no speciesId, use biome assembly path.
    if (event.biomeId && !event.speciesId) {
      const voiced = assembleBiomeEventText(event, gameState)
      if (voiced) {
        return {
          cycle:      event.cycle,
          type:       renderer(event).type,
          segments:   [{ type: 'text', value: voiced }],
          speciesIds: [],
          biomeIds:   [event.biomeId],
        }
      }
    }

    // Species events — standard assembly path.
    if (event.speciesId) {
      const species = gameState?.species?.find(s => s.id === event.speciesId)
      if (species) {
        const voiced = assembleEventText(event, species, gameState)
        if (voiced) {
          return {
            cycle:      event.cycle,
            type:       renderer(event).type,
            segments:   [{ type: 'text', value: voiced }],
            speciesIds: [event.speciesId],
            biomeIds:   [],
          }
        }
      }
    }
  }

  const rendered = renderer(event)
  const segments = resolveSegments(rendered.template, gameState)

  return {
    cycle:      event.cycle,
    type:       rendered.type,
    segments,
    speciesIds: event.speciesId ? [event.speciesId] : [],
    biomeIds:   event.biomeId   ? [event.biomeId]   : [],
  }
}

// Convert an array of engine events into display entries, dropping nulls.
export function eventsToEntries(events, gameState) {
  return events.map(ev => eventToEntry(ev, gameState)).filter(Boolean)
}
