import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loadSession, saveSession, CYCLE_DURATION_MS } from '../simulation/session.js'
import { clearState } from '../storage/db.js'
import { simulateCycle, runCycles } from '../simulation/engine.js'
import { checkThresholds } from '../simulation/triggers.js'
import { spName } from '../utils/species.js'
import styles from './Home.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeTrend(sp) {
  const pop      = sp.population
  const prev     = sp.history.previousPopulation
  const baseline = sp.history.baseline
  if (pop < baseline * 0.15) return 'critical'
  if (prev > 0 && (pop - prev) / prev < -0.05) return 'declining'
  if (prev > 0 && (pop - prev) / prev > 0.05 && pop > baseline) return 'thriving'
  return 'stable'
}

function biomeStatus(health) {
  if (health < 0.3) return 'critical'
  if (health < 0.5) return 'stress'
  if (health >= 0.75) return 'rising'
  return 'stable'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpeciesTrend({ pop, popDiff }) {
  const diffCls = popDiff > 0 ? styles.diffPos : popDiff < 0 ? styles.diffNeg : styles.diffNeutral
  const diffStr = popDiff > 0 ? `+${popDiff}` : popDiff < 0 ? `${popDiff}` : '—'
  return (
    <span className={styles.speciesTrend}>
      <span className={styles.speciesPop}>{pop.toLocaleString()}</span>
      <span className={`${styles.speciesDiff} ${diffCls}`}>({diffStr})</span>
    </span>
  )
}

function StatusLabel({ status }) {
  const cls = {
    stable:   styles.statusStable,
    rising:   styles.statusRising,
    stress:   styles.statusStress,
    critical: styles.statusCritical,
  }[status] || styles.statusStable
  return <span className={`${styles.statusLabel} ${cls}`}>{status}</span>
}

const TREND_ORDER = { critical: 0, declining: 1, stable: 2, thriving: 3 }

function ResearchStrip({ research, cycle, onTap }) {
  const r = research || { active: null, queue: [], history: [], suggestions: [] }

  let name, time, pct

  if (r.active) {
    const elapsed   = cycle - r.active.startCycle
    const remaining = r.active.completionCycle - cycle
    pct  = Math.min(1, elapsed / r.active.durationCycles)
    name = `${r.active.name} — ${r.active.targetName}`
    time = remaining <= 0
      ? 'Completing this cycle'
      : remaining === 1
        ? '1 cycle remaining'
        : `${remaining} cycles remaining`
  } else if (r.suggestions.length > 0) {
    const n = r.suggestions.length
    name = 'No active project.'
    time = `${n} suggested ${n === 1 ? 'project' : 'projects'}`
  } else {
    name = 'No active project.'
    time = 'No studies available yet.'
  }

  return (
    <button className={styles.researchStrip} onClick={onTap}>
      <div className={styles.researchMeta}>
        <span className={styles.researchName}>{name}</span>
        {time && <span className={styles.researchTime}>{time}</span>}
        <span className={styles.navArrow}>→</span>
      </div>
      {r.active && pct !== undefined && (
        <div className={styles.researchBar}>
          <div className={styles.researchBarFill} style={{ width: `${pct * 100}%` }} />
        </div>
      )}
    </button>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'

  const [gameState,   setGameState]   = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [awayCycles,  setAwayCycles]  = useState(0)
  const [awayMs,      setAwayMs]      = useState(0)

  useEffect(() => {
    loadSession(researcher).then(({ state, hasNewEvents, awayCycles: ac, awayMs: am }) => {
      setGameState(state)
      setLoading(false)
      setAwayCycles(ac ?? 0)
      setAwayMs(am ?? 0)

      if (!location.state && hasNewEvents) {
        navigate('/summary', { replace: true })
      }
    })
  }, [])

  // Live cycle ticker — runs one cycle per CYCLE_DURATION_MS while on this screen
  useEffect(() => {
    if (!gameState) return
    const id = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev
        const { state, events } = runCycles(prev, 1)
        const saved = { ...state, lastSavedAt: Date.now() }
        saveSession(saved)
        return saved
      })
    }, CYCLE_DURATION_MS)
    return () => clearInterval(id)
  }, [gameState !== null])  // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  const awayHours = Math.round(awayMs / (1000 * 60 * 60))

  const species = gameState.species
    .filter(sp => sp.population > 0 && (sp.discovery?.sightingCount ?? 0) >= 1)
    .map(sp => ({
      id:        sp.id,
      name:      spName(sp),
      homeBiome: sp.homeBiome,
      pop:       Math.round(sp.population),
      popDiff:   Math.round(sp.population - sp.history.previousPopulation),
      trend:     computeTrend(sp),
    }))
    .sort((a, b) => (TREND_ORDER[a.trend] ?? 2) - (TREND_ORDER[b.trend] ?? 2))

  const biomes = Object.values(gameState.biomes).map(b => ({
    id:           b.id,
    name:         b.name,
    status:       b.surveyMilestones?.located ? biomeStatus(b.health) : null,
  }))

  const unreadEvents   = gameState.events.filter(
    e => e.cycle > gameState.researcher.lastSummaryViewedCycle
  )
  const actionable     = unreadEvents.filter(e => e.requiresDecision && !e.resolved)
  const hasUnread      = unreadEvents.length > 0

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.wordmark}>Echosphere</span>
          <button className={styles.logBtn} onClick={() => navigate('/log')}>Log</button>
          <button className={styles.logBtn} onClick={async () => { await clearState(); navigate('/home', { replace: true }); window.location.reload() }}>⌫ Reset</button>
        </div>
        <div className={styles.headerMeta}>
          Cycle {gameState.cycle}
          {awayCycles > 0 && (
            <>
              <span className={styles.dot}>·</span>
              Away {awayHours > 0 ? `${awayHours}h` : 'briefly'}
              <span className={styles.dot}>·</span>
              {awayCycles} {awayCycles === 1 ? 'cycle' : 'cycles'} passed
            </>
          )}
        </div>
        <div className={styles.resources}>
          <span className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Field Data</span>
            <span className={styles.resourceValue}>{gameState.researcher.resources.fieldData}</span>
          </span>
          <span className={styles.resourceDot}>·</span>
          <span className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Specimens</span>
            <span className={styles.resourceValue}>{gameState.researcher.resources.specimens}</span>
          </span>
        </div>
      </header>

      <button className={styles.sessionStrip} onClick={() => navigate('/summary')}>
        {hasUnread
          ? <>
              <span className={styles.sessionStripCount}>{unreadEvents.length}</span>
              {unreadEvents.length === 1 ? 'new event' : 'new events'}
              {actionable.length > 0 && <>
                <span className={styles.sessionStripSep}>·</span>
                <span className={styles.sessionStripCount}>{actionable.length}</span>
                {actionable.length === 1 ? 'needs attention' : 'need attention'}
              </>}
            </>
          : 'No new events'
        }
        <span className={styles.navArrow}>→</span>
      </button>

      {/* ── Research ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Research</span>
        </div>
        <ResearchStrip
          research={gameState.research}
          cycle={gameState.cycle}
          onTap={() => navigate('/research')}
        />
      </section>

      {/* ── Species + Ecosystem ── */}
      <section className={`${styles.section} ${styles.sectionLast}`}>
        <div className={styles.splitGrid}>

          <div className={styles.splitLeft}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Species</span>
            </div>
            <div className={styles.speciesList}>
              {species.length === 0 ? (
                <div className={styles.speciesEmpty}>No sightings yet.</div>
              ) : species.map(sp => (
                <div key={sp.id} className={styles.speciesRow}>
                  <span
                    className={`${styles.speciesName} ${sp.name === 'Unknown' ? styles.speciesUnknown : ''} entity`}
                    onClick={() => navigate(`/species/${sp.id}`)}
                  >{sp.name}</span>
                  {sp.name !== 'Unknown' && <SpeciesTrend pop={sp.pop} popDiff={sp.popDiff} />}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.splitRight}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Ecosystem</span>
            </div>
            <div className={styles.biomeList}>
              {biomes.map(b => (
                <div key={b.id} className={styles.biomeRow}>
                  <span className={`${styles.biomeRowName} entity`} onClick={() => navigate(`/biome/${b.id}`)}>{b.name}</span>
                  {b.status
                    ? <StatusLabel status={b.status} />
                    : <span className={styles.biomeUncharacterized}>uncharacterized</span>
                  }
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
