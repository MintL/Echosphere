import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadState } from '../storage/db.js'
import { spName } from '../utils/species.js'
import styles from './Biome.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biomeStatus(health) {
  if (health < 0.3) return 'critical'
  if (health < 0.5) return 'stress'
  if (health >= 0.75) return 'rising'
  return 'stable'
}

function trendArrow(popDiff) {
  if (popDiff > 0) return '↑'
  if (popDiff < 0) return '↓'
  return '–'
}

// Filter events relevant to this biome
function biomeEvents(events, biomeId) {
  return events
    .filter(e => e.biomeId === biomeId || e.data?.biomeId === biomeId || e.data?.biome === biomeId)
    .sort((a, b) => b.cycle - a.cycle)
    .slice(0, 4)
}

function eventTypeLabel(type) {
  const map = {
    biomeStress:    'stress',
    biomeRecovery:  'recovery',
    firstBiomeEntry:'migration',
    extinction:     'extinction',
    populationCrisis: 'crisis',
    subpopulationStabilized: 'migration',
    subpopulationFailed:     'migration',
  }
  return map[type] ?? null
}

function eventText(ev, biomeName) {
  switch (ev.type) {
    case 'biomeStress':    return `${biomeName} under environmental stress.`
    case 'biomeRecovery':  return `${biomeName} showing signs of recovery.`
    case 'firstBiomeEntry': return `New species entered ${biomeName} for the first time.`
    case 'extinction':     return `Extinction event in ${biomeName}.`
    case 'populationCrisis': return `Population crisis affecting ${biomeName}.`
    case 'subpopulationStabilized': return `Subpopulation established in ${biomeName}.`
    case 'subpopulationFailed':     return `Migration attempt into ${biomeName} failed.`
    default: return ev.data?.text ?? `Event: ${ev.type}`
  }
}

const SURVEY_MILESTONES = [
  { key: 'located',      label: 'Located'      },
  { key: 'characterized', label: 'Characterized' },
  { key: 'mapped',       label: 'Mapped'       },
  { key: 'monitored',    label: 'Monitored'    },
]

const STATUS_LABEL = { stable: 'stable', rising: 'rising', stress: 'stress', critical: 'critical' }
const SEVERITY_CLS = { minor: styles.severityMinor, moderate: styles.severityModerate, critical: styles.severityCritical }

// ─── Sub-components ───────────────────────────────────────────────────────────

function LogEntry({ cycle, type, text }) {
  const typeLabel = eventTypeLabel(type)
  return (
    <article className={`${styles.entry} ${typeLabel ? styles[typeLabel] || '' : ''}`}>
      <div className={styles.entryMeta}>
        <span className={styles.entryCycle}>Cycle {cycle}</span>
        {typeLabel && <span className={styles.entryType}>{typeLabel}</span>}
      </div>
      <p className={styles.entryText}>{text}</p>
    </article>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Biome() {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const [closing,   setClosing]   = useState(false)
  const [gameState, setGameState] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    loadState().then(state => {
      setGameState(state)
      setLoading(false)
    })
  }, [])

  function handleBack() {
    setClosing(true)
    setTimeout(() => navigate(-1), 300)
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.loading}>Loading…</div>
        </div>
      </div>
    )
  }

  const biomeData = gameState?.biomes?.[id]

  if (!biomeData) {
    return (
      <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <button className={styles.backBtn} onClick={handleBack}>← Back</button>
            <div className={styles.headerTitle}>Unknown biome</div>
          </header>
          <section className={styles.section}>
            <p className={styles.empty}>No data for this location.</p>
          </section>
        </div>
      </div>
    )
  }

  const allSpecies  = gameState.species ?? []
  const events      = gameState.events  ?? []

  const health      = biomeData.health ?? 1.0
  const survey      = biomeData.surveyMilestones ?? { located: true }
  const status      = survey.characterized ? biomeStatus(health) : null

  // Species in this biome (home + any subpopulations), only observed ones
  const biomeSpecies = allSpecies
    .filter(sp => {
      if (sp.population <= 0) return false
      if ((sp.discovery?.sightingCount ?? 0) < 1) return false
      const inHome  = sp.homeBiome === id
      const inSub   = (sp.subpopulations ?? []).some(sub => sub.biome === id && sub.population > 0)
      return inHome || inSub
    })
    .map(sp => {
      const subPop = (sp.subpopulations ?? []).find(sub => sub.biome === id)
      const pop    = sp.homeBiome === id
        ? Math.round(sp.population)
        : Math.round(subPop?.population ?? 0)
      return {
        id:      sp.id,
        name:    spName(sp),
        homeBiome: sp.homeBiome,
        pop,
        popDiff: Math.round(sp.population - (sp.history?.previousPopulation ?? sp.population)),
        milestones: sp.milestones,
      }
    })
    .sort((a, b) => b.pop - a.pop)

  // Dominant species = highest-population observed species in home biome
  const dominantSp = biomeSpecies[0]

  const recentEvents = biomeEvents(events, id)

  const statusCls = {
    stable:   styles.statusStable,
    rising:   styles.statusRising,
    stress:   styles.statusStress,
    critical: styles.statusCritical,
  }[status] || ''

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitleRow}>
            <span className={styles.headerTitle}>{biomeData.name}</span>
            {status && (
              <span className={`${styles.statusBadge} ${statusCls}`}>{STATUS_LABEL[status]}</span>
            )}
          </div>
          <div className={styles.headerSub}>
            {survey.characterized
              ? `${Math.round(health * 100)}% health`
              : 'Uncharacterized — survey to learn more'
            }
          </div>
        </header>

        {/* ── Journal / survey milestones ── */}
        <section className={styles.section}>
          <p className={styles.journal}>
            {!survey.located
              ? 'No survey data yet.'
              : !survey.characterized
                ? `${biomeData.name} — first confirmed location. Conditions uncharacterized.`
                : !survey.mapped
                  ? `${biomeData.name} — conditions partially characterized. Full mapping not yet complete.`
                  : !survey.monitored
                    ? `${biomeData.name} — fully mapped. Three distinct zones identified. Long-term monitoring not yet established.`
                    : `${biomeData.name} — full characterization complete. Long-term monitoring active.`
            }
          </p>
          <div className={styles.milestones}>
            {SURVEY_MILESTONES.map((m, i) => (
              <span key={m.key} className={survey[m.key] ? styles.milestoneOn : styles.milestoneOff}>
                {i > 0 && <span className={styles.milestoneSep}>·</span>}
                {m.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Conditions — unlocks at Characterized ── */}
        {survey.characterized && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Conditions</div>
            <div className={styles.conditionsGrid}>
              <div className={styles.condCell}>
                <span className={styles.condKey}>Health</span>
                <div className={styles.healthBar}>
                  <div
                    className={styles.healthFill}
                    style={{
                      width: `${health * 100}%`,
                      background: health < 0.3 ? 'var(--crisis)' : health < 0.5 ? 'var(--accent)' : 'var(--positive)',
                    }}
                  />
                </div>
                <span className={styles.condVal}>{Math.round(health * 100)}%</span>
              </div>
              <div className={styles.condCell}>
                <span className={styles.condKey}>Dominant</span>
                {dominantSp
                  ? <span
                      className={`${styles.condVal} entity`}
                      onClick={() => navigate(`/species/${dominantSp.id}`)}
                    >
                      {spName(dominantSp)}
                    </span>
                  : <span className={styles.condValMuted}>unknown</span>
                }
              </div>
              {survey.monitored && (
                <div className={`${styles.condCell} ${styles.condCellFull}`}>
                  <span className={styles.condKey}>Stress</span>
                  <span className={styles.condValItalic}>
                    {biomeData.stress > 0.3
                      ? 'High environmental stress accumulated.'
                      : biomeData.stress > 0.1
                        ? 'Moderate stress from recent population events.'
                        : 'Conditions stable.'}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Species present — unlocks at Characterized ── */}
        {survey.characterized && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Species present</div>
            {biomeSpecies.length === 0
              ? <p className={styles.empty}>No sightings recorded.</p>
              : (
                <div className={styles.speciesList}>
                  {biomeSpecies.map(sp => {
                    const arrow    = trendArrow(sp.popDiff)
                    const arrowCls = sp.popDiff > 0 ? styles.arrowPos : sp.popDiff < 0 ? styles.arrowNeg : styles.arrowNeutral
                    return (
                      <div key={sp.id} className={styles.speciesRow}>
                        <span className="entity" onClick={() => navigate(`/species/${sp.id}`)}>
                          {sp.name}
                        </span>
                        <span className={styles.speciesPop}>
                          {sp.pop.toLocaleString()}
                          <span className={`${styles.arrow} ${arrowCls}`}>{arrow}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </section>
        )}

        {/* ── Hazards — unlocks at Characterized, gated per severity ── */}
        {survey.characterized && (biomeData.hazards?.length > 0) && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Hazards</div>
            <div className={styles.hazardList}>
              {biomeData.hazards
                .filter(h => {
                  if (h.severity === 'critical') return survey.characterized
                  if (h.severity === 'moderate') return survey.mapped
                  return survey.monitored
                })
                .map((h, i) => (
                  h.revealed ? (
                    <div key={i} className={styles.hazardRow}>
                      <span className={styles.hazardName}>{h.name}</span>
                      <span className={`${styles.severityBadge} ${SEVERITY_CLS[h.severity] || ''}`}>{h.severity}</span>
                    </div>
                  ) : (
                    <div key={i} className={styles.hazardRow}>
                      <span className={styles.hazardUnknown}>[Unknown hazard — survey to reveal]</span>
                      <span className={`${styles.severityBadge} ${SEVERITY_CLS[h.severity] || ''}`}>{h.severity}</span>
                    </div>
                  )
                ))
              }
            </div>
          </section>
        )}

        {/* ── Recent events ── */}
        <section className={`${styles.section} ${styles.sectionLast}`}>
          <div className={styles.sectionLabel}>Recent events</div>
          {recentEvents.length === 0
            ? <p className={styles.empty}>No events recorded in this biome yet.</p>
            : (
              <div className={styles.entries}>
                {recentEvents.map((e, i) => (
                  <LogEntry key={i} cycle={e.cycle} type={e.type} text={eventText(e, biomeData.name)} />
                ))}
              </div>
            )
          }
        </section>

      </div>
    </div>
  )
}
