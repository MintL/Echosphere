import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadState } from '../storage/db.js'
import { spName } from '../utils/species.js'
import { eventToEntry } from '../data/text/events.js'
import styles from './Species.module.css'

// ─── Milestone mapping ────────────────────────────────────────────────────────
// Engine milestones → display tiers

const MILESTONE_DEFS = [
  { key: 'observed',          label: 'Sighted'  },
  { key: 'named',             label: 'Named'    },
  { key: 'behaviorMapped',    label: 'Studied'  },
  { key: 'populationModeled', label: 'Modeled'  },
]

function biomeDisplayName(id, biomes) {
  return biomes?.[id]?.name ?? id
}

function roleLabel(role) {
  const map = {
    producer:  'Producer',
    consumer:  'Primary consumer',
    predator:  'Predator',
    apex:      'Apex predator',
    decomposer:'Decomposer',
    specialist:'Specialist',
  }
  return map[role] ?? role
}

function trendArrow(popDiff) {
  if (popDiff > 0) return '↑'
  if (popDiff < 0) return '↓'
  return '–'
}

// Build interaction list: what this species eats + what eats this species
function buildInteractions(sp, allSpecies) {
  const result = []
  // Things this species eats
  for (const eat of sp.eats ?? []) {
    const prey = allSpecies.find(s => s.id === eat.preyId)
    if (prey) result.push({ species: prey, label: 'prey' })
  }
  // Things that eat this species
  for (const other of allSpecies) {
    if (other.id === sp.id) continue
    if ((other.eats ?? []).some(e => e.preyId === sp.id)) {
      result.push({ species: other, label: 'predator' })
    }
  }
  return result
}

// Filter events relevant to this species
function speciesEvents(events, spId) {
  return events
    .filter(e => e.speciesId === spId || (e.data?.preyId === spId) || (e.data?.predatorId === spId))
    .sort((a, b) => b.cycle - a.cycle)
    .slice(0, 4)
}

function eventTypeLabel(type) {
  const map = {
    extinction:         'extinction',
    extinctionWarning:  'warning',
    populationCrisis:   'crisis',
    populationSurge:    'surge',
    populationLow:      'low',
    firstSighting:      'discovery',
    studyCompleted:     'research',
    firstBiomeEntry:    'migration',
  }
  return map[type] ?? null
}


// ─── Sub-components ───────────────────────────────────────────────────────────

function LogEntry({ cycle, type, segments }) {
  const typeLabel = eventTypeLabel(type)
  return (
    <article className={`${styles.entry} ${typeLabel ? styles[typeLabel] || '' : ''}`}>
      <div className={styles.entryMeta}>
        <span className={styles.entryCycle}>Cycle {cycle}</span>
        {typeLabel && <span className={styles.entryType}>{typeLabel}</span>}
      </div>
      <p className={styles.entryText}>
        {segments.map((seg, i) =>
          seg.type === 'entity'
            ? <span key={i} className="entity">{seg.name}</span>
            : seg.value
        )}
      </p>
    </article>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Species() {
  const navigate     = useNavigate()
  const { id }       = useParams()
  const [closing,    setClosing]    = useState(false)
  const [gameState,  setGameState]  = useState(null)
  const [loading,    setLoading]    = useState(true)

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

  const sp = gameState?.species?.find(s => s.id === id)

  if (!sp) {
    return (
      <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <button className={styles.backBtn} onClick={handleBack}>← Back</button>
            <div className={styles.headerTitle}>Unknown</div>
          </header>
          <section className={styles.section}>
            <p className={styles.journal}>No record of this species.</p>
          </section>
        </div>
      </div>
    )
  }

  const biomes       = gameState.biomes ?? {}
  const allSpecies   = gameState.species ?? []
  const events       = gameState.events  ?? []

  const displayName  = spName(sp)
  const pop          = Math.round(sp.population)
  const popDiff      = Math.round(sp.population - (sp.history?.previousPopulation ?? sp.population))
  const diffStr      = popDiff > 0 ? `+${popDiff}` : `${popDiff}`
  const diffCls      = popDiff > 0 ? styles.diffPos : popDiff < 0 ? styles.diffNeg : styles.diffNeutral
  const trendCls     = popDiff > 0 ? styles.trendPos : popDiff < 0 ? styles.trendNeg : styles.trendNeutral
  const interactions = buildInteractions(sp, allSpecies)
  const recentEvents = speciesEvents(events, sp.id)
  const homeBiomeName = biomeDisplayName(sp.homeBiome, biomes)

  // Observed cycle from discovery data; named cycle not tracked separately yet
  const firstSeen = events.find(e => e.type === 'firstSighting' && e.speciesId === sp.id)

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitleRow}>
            <div className={styles.headerTitle}>{displayName}</div>
          </div>
          <div className={styles.headerSub}>
            {firstSeen
              ? `First observed cycle ${firstSeen.cycle}`
              : sp.milestones?.observed
                ? 'Observed'
                : 'Not yet sighted'
            }
          </div>
        </header>

        {/* ── Journal / milestones ── */}
        <section className={styles.section}>
          <p className={styles.journal}>
            {!sp.milestones?.observed
              ? 'No confirmed sighting yet.'
              : !sp.milestones?.named
                ? `Something in the ${homeBiomeName}. Seen but not yet characterized.`
                : !sp.milestones?.roleIdentified
                  ? `${displayName} — observed but ecological role not yet understood.`
                  : !sp.milestones?.behaviorMapped
                    ? `${displayName} — ${roleLabel(sp.role).toLowerCase()} in the ${homeBiomeName}. Behavior not yet mapped.`
                    : `${displayName} — ${roleLabel(sp.role).toLowerCase()} in the ${homeBiomeName}. Population dynamics and behavior recorded.`
            }
          </p>
          <div className={styles.milestones}>
            {MILESTONE_DEFS.map((m, i) => (
              <span key={m.key} className={sp.milestones?.[m.key] ? styles.milestoneOn : styles.milestoneOff}>
                {i > 0 && <span className={styles.milestoneSep}>·</span>}
                {m.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Ecology — unlocks at roleIdentified ── */}
        {sp.milestones?.roleIdentified && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Ecology</div>
            <div className={styles.ecologyGrid}>
              <div className={styles.ecologyCell}>
                <span className={styles.ecologyKey}>Role</span>
                <span className={styles.ecologyVal}>{roleLabel(sp.role)}</span>
              </div>
              <div className={styles.ecologyCell}>
                <span className={styles.ecologyKey}>Biome</span>
                <span
                  className={`${styles.ecologyVal} entity`}
                  onClick={() => navigate(`/biome/${sp.homeBiome}`)}
                >
                  {homeBiomeName}
                </span>
              </div>
            </div>
            {interactions.length > 0 && (
              <div className={styles.interactions}>
                {interactions.map((ix, i) => (
                  <span key={i} className={styles.interaction}>
                    <span className="entity" onClick={() => navigate(`/species/${ix.species.id}`)}>
                      {spName(ix.species)}
                    </span>
                    <span className={styles.interactionLabel}>{ix.label}</span>
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Population — unlocks at behaviorMapped ── */}
        {sp.milestones?.behaviorMapped && pop > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Population</div>
            <div className={styles.popRow}>
              <span className={styles.popNum}>{pop.toLocaleString()}</span>
              <span className={`${styles.trendArrow} ${trendCls}`}>{trendArrow(popDiff)}</span>
              {popDiff !== 0 && (
                <span className={`${styles.popDiff} ${diffCls}`}>({diffStr})</span>
              )}
            </div>
            <div className={styles.popStats}>
              <span className={styles.popStat}>
                <span className={styles.popStatKey}>Baseline</span>
                <span className={styles.popStatVal}>{Math.round(sp.history?.baseline ?? pop).toLocaleString()}</span>
              </span>
              <span className={styles.popStatSep}>·</span>
              <span className={styles.popStat}>
                <span className={styles.popStatKey}>Peak</span>
                <span className={styles.popStatVal}>{Math.round(sp.history?.peakPopulation ?? pop).toLocaleString()}</span>
              </span>
              <span className={styles.popStatSep}>·</span>
              <span className={styles.popStat}>
                <span className={styles.popStatKey}>Low</span>
                <span className={styles.popStatVal}>{Math.round(sp.history?.lowestPopulation ?? pop).toLocaleString()}</span>
              </span>
            </div>
          </section>
        )}

        {/* ── Recent events ── */}
        {recentEvents.length > 0 && (
          <section className={`${styles.section} ${styles.sectionLast}`}>
            <div className={styles.sectionLabel}>Recent observations</div>
            <div className={styles.entries}>
              {recentEvents.map((e, i) => {
                const entry = eventToEntry(e, gameState)
                if (!entry) return null
                return <LogEntry key={i} cycle={entry.cycle} type={entry.type} segments={entry.segments} />
              })}
            </div>
          </section>
        )}

        {recentEvents.length === 0 && (
          <section className={`${styles.section} ${styles.sectionLast}`}>
            <div className={styles.sectionLabel}>Recent observations</div>
            <p className={styles.empty}>No observations recorded yet.</p>
          </section>
        )}

      </div>
    </div>
  )
}
