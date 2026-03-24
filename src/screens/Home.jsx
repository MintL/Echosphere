import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const BIOME_COLORS = {
  highgrowth: 'var(--biome-high)',
  understory:  'var(--biome-under)',
  scorch:      'var(--biome-scorch)',
}

const CTA_LABELS = {
  1: 'I should respond',
  2: 'I need to decide',
  3: "Can't ignore this",
}

const MOCK = {
  researcher: 'Dr. Voss',
  cycle: 94,
  away: { hours: 6, cycles: 6 },
  resources: { fieldData: 340, specimens: 12 },
  research: {
    active: {
      targetName: 'Vellin',
      type: 'behavioral study',
      timeLabel: 'a few hours',
      progress: 0.62,
    },
    suggestionsReady: 3,
  },
  events: [
    {
      id: 1,
      urgency: 'crisis',
      urgencyTier: 2,
      expired: false,
      cycle: 91,
      title: 'Vellin population collapsing — Highgrowth',
      body: 'The numbers are bad. Keth pressure has been building for three cycles.',
      speciesIds: ['vellin', 'keth'],
      biome: { id: 'highgrowth', name: 'Highgrowth' },
    },
    {
      id: 3,
      urgency: 'decision',
      expired: false,
      cycle: 90,
      title: 'Keth range expanding into Understory — do you intervene?',
      body: 'They have pushed further than last season. This could stabilize or accelerate.',
      speciesIds: ['keth', 'vellin'],
      biome: { id: 'understory', name: 'Understory' },
    },
    {
      id: 2,
      urgency: 'observation',
      expired: false,
      cycle: 88,
      title: 'Vellin crossed into Understory for the first time.',
      speciesIds: ['vellin'],
      biome: { id: 'understory', name: 'Understory' },
    },
  ],
  biomes: [
    { id: 'highgrowth', name: 'Highgrowth',   health: 0.82, status: 'stable' },
    { id: 'understory', name: 'Understory',   health: 0.71, status: 'rising' },
    { id: 'scorch',     name: 'Scorch Flats', health: 0.44, status: 'stress' },
  ],
  species: [
    { id: 'feltmoss',  name: 'Feltmoss',  pop: 1840, change: 2,   role: 'producer'   },
    { id: 'nightroot', name: 'Nightroot', pop:  920, change: 0,   role: 'producer'   },
    { id: 'scaleweed', name: 'Scaleweed', pop:  640, change: -3,  role: 'producer'   },
    { id: 'vellin',    name: 'Vellin',    pop:  847, change: -23, role: 'consumer'   },
    { id: 'woldren',   name: 'Woldren',   pop:  312, change: 1,   role: 'consumer'   },
    { id: 'brack',     name: 'Brack',     pop:  178, change: -4,  role: 'consumer'   },
    { id: 'torrak',    name: 'Torrak',    pop:   89, change: 0,   role: 'specialist' },
    { id: 'keth',      name: 'Keth',      pop:  203, change: 18,  role: 'predator'   },
    { id: 'skethran',  name: 'Skethran',  pop:   71, change: -2,  role: 'predator'   },
    { id: 'grubmere',  name: 'Grubmere',  pop:  543, change: 5,   role: 'decomposer' },
    { id: 'mordath',   name: 'Mordath',   pop:   14, change: 0,   role: 'apex'       },
  ],
}


function formatPop(n) {
  return n.toLocaleString()
}

function Trend({ change }) {
  if (change > 0) return <span className={styles.trendUp}>↑</span>
  if (change < 0) return <span className={styles.trendDown}>↓</span>
  return <span className={styles.trendFlat}>–</span>
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


export default function Home() {
  const navigate = useNavigate()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'
  const d = { ...MOCK, researcher }
  const eventSpeciesIds = new Set(d.events.flatMap(ev => ev.speciesIds ?? []))
  const eventSpecies = d.species.filter(sp => eventSpeciesIds.has(sp.id))

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.wordmark}>Echosphere</span>
          <button className={styles.logBtn} onClick={() => navigate('/log')}>Log</button>
        </div>
        <div className={styles.headerMeta}>
          Cycle {d.cycle}
          <span className={styles.dot}>·</span>
          Away {d.away.hours}h · {d.away.cycles} cycles passed
        </div>
        <div className={styles.resources}>
          <span className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Field Data</span>
            <span className={styles.resourceValue}>{d.resources.fieldData}</span>
          </span>
          <span className={styles.resourceDot}>·</span>
          <span className={styles.resourceItem}>
            <span className={styles.resourceLabel}>Specimens</span>
            <span className={styles.resourceValue}>{d.resources.specimens}</span>
          </span>
        </div>
      </header>

      {/* ── Events ── */}
      {d.events.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              Events
              <span className={styles.sectionCount}>{d.events.length}</span>
            </span>
          </div>

          <div className={styles.events}>
            {d.events.map(ev => {
              if (ev.urgency === 'crisis') return (
                <button key={ev.id} className={styles.eventCrisis}>
                  <span className={styles.eventTitle}>{ev.title}</span>
                  {ev.body && <span className={styles.eventBody}>{ev.body}</span>}
                  <div className={styles.eventFooterRow}>
                    <span className={styles.eventCycle}>Cycle {ev.cycle}</span>
                    {ev.expired ? (
                      <span className={styles.eventExpired}>resolved while you were away.</span>
                    ) : (
                      <span className={`${styles.eventCta} ${styles[`eventCtaTier${ev.urgencyTier}`]}`}>
                        {CTA_LABELS[ev.urgencyTier]} →
                      </span>
                    )}
                  </div>
                </button>
              )
              if (ev.urgency === 'decision') return (
                <button key={ev.id} className={styles.eventDecision}>
                  <span className={styles.eventTitle}>{ev.title}</span>
                  {ev.body && <span className={styles.eventBody}>{ev.body}</span>}
                  <div className={styles.eventFooterRow}>
                    <span className={styles.eventCycle}>Cycle {ev.cycle}</span>
                    {ev.expired ? (
                      <span className={styles.eventExpired}>resolved while you were away.</span>
                    ) : (
                      <span className={`${styles.eventCta} ${styles.eventCtaDecision}`}>
                        I should weigh in →
                      </span>
                    )}
                  </div>
                </button>
              )
              return (
                <button key={ev.id} className={styles.eventObservation}>
                  <span className={styles.eventTitle}>{ev.title}</span>
                  <div className={styles.eventFooterRow}>
                    <span className={styles.eventCycle}>Cycle {ev.cycle}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Research ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Research</span>
        </div>
        {d.research.active ? (
          <button className={styles.researchStrip}>
            <div className={styles.researchMeta}>
              <span className={styles.researchName}>
                {d.research.active.targetName} {d.research.active.type}
              </span>
              <span className={styles.researchSep}>·</span>
              <span className={styles.researchTime}>results in {d.research.active.timeLabel}</span>
            </div>
            <div className={styles.researchBar}>
              <div
                className={styles.researchBarFill}
                style={{ width: `${d.research.active.progress * 100}%` }}
              />
            </div>
          </button>
        ) : (
          <button className={styles.researchStrip}>
            <div className={styles.researchMeta}>
              <span className={styles.researchName}>No active project.</span>
              <span className={styles.researchTime}>
                {d.research.suggestionsReady} studies ready to begin.
              </span>
            </div>
          </button>
        )}
      </section>

      {/* ── Species + Ecosystem ── */}
      <section className={`${styles.section} ${styles.sectionLast}`}>
        <div className={styles.splitGrid}>

          <div className={styles.splitLeft}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Species</span>
            </div>
            <div className={styles.speciesList}>
              {eventSpecies.map(sp => (
                <div key={sp.id} className={styles.speciesRow}>
                  <span className={`${styles.speciesName} entity`}>{sp.name}</span>
                  <span className={styles.speciesPop}>
                    {formatPop(sp.pop)}<Trend change={sp.change} />
                  </span>
                </div>
              ))}
            </div>
            <button className={styles.viewAll}>View all →</button>
          </div>

          <div className={styles.splitRight}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Ecosystem</span>
            </div>
            <div className={styles.biomeList}>
              {d.biomes.map(b => (
                <div key={b.id} className={styles.biomeRow}>
                  <span
                    className={styles.biomeRowDot}
                    style={{ color: BIOME_COLORS[b.id] }}
                  >●</span>
                  <span className={`${styles.biomeRowName} entity`}>{b.name}</span>
                  <StatusLabel status={b.status} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
