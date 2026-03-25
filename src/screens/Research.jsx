import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadSession, saveSession, CYCLE_DURATION_MS } from '../simulation/session.js'
import { startProject, promoteFromQueue } from '../simulation/research.js'
import { runCycles } from '../simulation/engine.js'
import { spName } from '../utils/species.js'
import styles from './Research.module.css'

const PROJECT_DURATIONS_LABEL = {
  speciesStudy_initial:    '3 cycles',
  speciesStudy_behavioral: '6 cycles',
  speciesStudy_population: '12 cycles',
}

function progressPct(active, cycle) {
  if (!active) return 0
  const elapsed = cycle - active.startCycle
  return Math.min(1, elapsed / active.durationCycles)
}

function etaLabel(active, cycle) {
  const remaining = active.completionCycle - cycle
  if (remaining <= 0) return 'Completing this cycle'
  if (remaining === 1) return '1 cycle remaining'
  return `${remaining} cycles remaining`
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Research() {
  const navigate    = useNavigate()
  const researcher  = localStorage.getItem('echosphere_researcher') || 'Researcher'

  const [gameState, setGameState]   = useState(null)
  const [loading,   setLoading]     = useState(true)
  const [closing,   setClosing]     = useState(false)

  useEffect(() => {
    loadSession(researcher).then(({ state }) => {
      setGameState(state)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!gameState) return
    const id = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev
        const { state } = runCycles(prev, 1)
        const saved = { ...state, lastSavedAt: Date.now() }
        saveSession(saved)
        return saved
      })
    }, CYCLE_DURATION_MS)
    return () => clearInterval(id)
  }, [gameState !== null])  // eslint-disable-line react-hooks/exhaustive-deps

  function handleBack() {
    setClosing(true)
    setTimeout(() => navigate('/home', { state: { fromResearch: true } }), 280)
  }

  async function handleStartOrQueue(projectId) {
    if (!gameState) return
    const research = gameState.research || { active: null, queue: [], history: [], suggestions: [] }
    const newResearch = startProject(research, projectId, gameState.cycle)
    const newState    = { ...gameState, research: newResearch }
    await saveSession(newState)
    setGameState(newState)
  }

  async function handlePromote(projectId) {
    if (!gameState) return
    const research = gameState.research || { active: null, queue: [], history: [], suggestions: [] }
    const newResearch = promoteFromQueue(research, projectId, gameState.cycle)
    const newState    = { ...gameState, research: newResearch }
    await saveSession(newState)
    setGameState(newState)
  }

  if (loading) {
    return (
      <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
        <div className={styles.inner} />
      </div>
    )
  }

  const research    = gameState.research || { active: null, queue: [], history: [], suggestions: [] }
  const cycle       = gameState.cycle
  const active      = research.active
  const queue       = research.queue
  const suggestions = research.suggestions

  function resolveTargetName(project) {
    const sp = gameState.species?.find(s => s.id === project.targetId)
    return sp ? spName(sp) : project.targetName
  }

  const pct   = active ? progressPct(active, cycle) : 0
  const eta   = active ? etaLabel(active, cycle) : null
  const soon  = active && (active.completionCycle - cycle) <= 1

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitle}>Research</div>
          <div className={styles.headerSub}>Cycle {cycle}</div>
        </header>

        {/* ── Active Project ── */}
        {active && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Active Project</span>
            <div className={styles.activeBlock}>
              <p className={styles.projectName}>{active.name}</p>
              <p className={styles.projectTarget}>{resolveTargetName(active)}</p>
              <p className={styles.projectDesc}>{active.description}</p>

              <div className={styles.progressRow}>
                <span className={styles.progressLabel}>
                  Cycle {cycle - active.startCycle} / {active.durationCycles}
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${pct * 100}%` }}
                />
                <div
                  className={styles.progressTick}
                  style={{ left: `${pct * 100}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Queue ── */}
        {queue.length > 0 && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Queue</span>
            <div className={styles.queueList}>
              {queue.map((project, i) => (
                <div key={project.id} className={styles.queueItem}>
                  <span className={styles.queueIndex}>{i + 1}</span>
                  <div className={styles.queueInfo}>
                    <span className={styles.queueName}>{project.name}</span>
                    <span className={styles.queueTarget}>{resolveTargetName(project)}</span>
                  </div>
                  {!active && (
                    <button
                      className={styles.queueAction}
                      onClick={() => handlePromote(project.id)}
                    >
                      Start →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Suggestions ── */}
        {suggestions.length > 0 && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Suggested Studies</span>
            <div className={styles.suggestionList}>
              {suggestions.map(project => {
                const canQueue  = !!active && queue.length < 3
                const canStart  = !active
                const label     = canStart ? 'Start →' : canQueue ? 'Queue →' : null
                return (
                  <div key={project.id} className={styles.suggestionItem}>
                    <div className={styles.suggestionHeader}>
                      <span className={styles.suggestionName}>{project.name}</span>
                      {label && (
                        <button
                          className={styles.suggestionAction}
                          onClick={() => handleStartOrQueue(project.id)}
                        >
                          {label}
                        </button>
                      )}
                    </div>
                    <span className={styles.suggestionMeta}>
                      {resolveTargetName(project)} · {PROJECT_DURATIONS_LABEL[project.type] || `${project.durationCycles} cycles`}
                    </span>
                    {project.description && (
                      <p className={styles.suggestionDesc}>{project.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty suggestions state */}
        {suggestions.length === 0 && queue.length === 0 && !active && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Suggested Studies</span>
            <p className={styles.emptyState}>
              No studies available yet. More observations needed.
            </p>
          </section>
        )}

      </div>
    </div>
  )
}
