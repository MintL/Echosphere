// ─── Research project logic ───────────────────────────────────────────────────
//
// Pure functions for project lifecycle management.
// No side effects, no async.

export const PROJECT_DURATIONS = {
  speciesStudy_initial:    3,
  speciesStudy_behavioral: 6,
  speciesStudy_population: 12,
}

const PROJECT_META = {
  speciesStudy_initial: {
    name:        'Initial Documentation',
    description: 'Ecological role identification and field classification.',
  },
  speciesStudy_behavioral: {
    name:        'Behavioral Study',
    description: 'Movement patterns and ecological interactions.',
  },
  speciesStudy_population: {
    name:        'Population Analysis',
    description: 'Dynamics modeling and intervention assessment.',
  },
}

// ─── hasSuggestion ─────────────────────────────────────────────────────────────

// Check if a study suggestion already exists for this species+tier
// (in suggestions, queue, or as active project)
export function hasSuggestion(research, speciesId, tier) {
  const id = `study_${speciesId}_${tier}`

  if (research.active?.id === id) return true
  if (research.queue.some(p => p.id === id)) return true
  if (research.suggestions.some(p => p.id === id)) return true
  if (research.history.some(p => p.id === id)) return true

  return false
}

// ─── makeStudySuggestion ───────────────────────────────────────────────────────

export function makeStudySuggestion(species, tier, cycle) {
  const meta = PROJECT_META[`speciesStudy_${tier}`] || PROJECT_META.speciesStudy_initial
  const type = `speciesStudy_${tier}`

  return {
    id:            `study_${species.id}_${tier}`,
    type,
    targetId:      species.id,
    targetName:    species.name,
    name:          meta.name,
    description:   meta.description,
    durationCycles: PROJECT_DURATIONS[type],
    suggestedCycle: cycle,
  }
}

// ─── advanceResearch ───────────────────────────────────────────────────────────

// Advance active research for this cycle.
// Returns { research, completedProject } where completedProject may be null.
export function advanceResearch(research, cycle) {
  let { active, queue, history, suggestions } = research

  let completedProject = null

  // Complete active project if cycle has passed
  if (active && cycle >= active.completionCycle) {
    completedProject = { ...active, status: 'completed' }
    history = [...history, completedProject]
    active  = null

    // Auto-start next in queue
    if (queue.length > 0) {
      const [next, ...rest] = queue
      active = {
        ...next,
        startCycle:      cycle,
        completionCycle: cycle + next.durationCycles,
        status:          'active',
      }
      queue = rest
    }
  }

  // If no active project but queue has items, start first
  if (!active && queue.length > 0) {
    const [next, ...rest] = queue
    active = {
      ...next,
      startCycle:      cycle,
      completionCycle: cycle + next.durationCycles,
      status:          'active',
    }
    queue = rest
  }

  return {
    research:         { active, queue, history, suggestions },
    completedProject,
  }
}

// ─── applyProjectCompletion ────────────────────────────────────────────────────

// Apply milestone effects to species array after a project completes.
// Returns a new species array.
export function applyProjectCompletion(species, project) {
  return species.map(sp => {
    if (sp.id !== project.targetId) return sp

    let milestones = { ...sp.milestones }

    if (project.type === 'speciesStudy_initial') {
      milestones = { ...milestones, roleIdentified: true }
    } else if (project.type === 'speciesStudy_behavioral') {
      milestones = { ...milestones, behaviorMapped: true }
    } else if (project.type === 'speciesStudy_population') {
      milestones = { ...milestones, populationModeled: true }
    }

    return { ...sp, milestones }
  })
}

// ─── startProject ─────────────────────────────────────────────────────────────

// Move a suggestion into active (or queue). Mutates nothing — returns new research.
export function startProject(research, projectId, cycle) {
  const suggestion = research.suggestions.find(s => s.id === projectId)
  if (!suggestion) return research

  const suggestions = research.suggestions.filter(s => s.id !== projectId)

  if (!research.active) {
    const active = {
      ...suggestion,
      startCycle:      cycle,
      completionCycle: cycle + suggestion.durationCycles,
      status:          'active',
    }
    return { ...research, active, suggestions }
  }

  // Queue it (max 3)
  if (research.queue.length >= 3) return research

  const queued = { ...suggestion, status: 'queued' }
  return {
    ...research,
    queue:       [...research.queue, queued],
    suggestions,
  }
}

// ─── promoteFromQueue ──────────────────────────────────────────────────────────

// Move a queued project to active if nothing is active.
export function promoteFromQueue(research, projectId, cycle) {
  if (research.active) return research

  const idx = research.queue.findIndex(p => p.id === projectId)
  if (idx === -1) return research

  const project = research.queue[idx]
  const queue   = research.queue.filter((_, i) => i !== idx)

  const active = {
    ...project,
    startCycle:      cycle,
    completionCycle: cycle + project.durationCycles,
    status:          'active',
  }

  return { ...research, active, queue }
}
