import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  session: {
    cycles: 6,
    lead: 'Vellin population dropped sharply as Keth pressure built through the upper Highgrowth. A subpopulation crossed into Understory for the first time.',
    entries: [
      {
        cycle: 89,
        type: 'observation',
        text: 'Keth ranging further south than usual. Three individuals recorded near the Highgrowth border — further than I have seen them go. The Vellin are pulling back.',
        speciesIds: ['keth', 'vellin'],
      },
      {
        cycle: 90,
        type: 'observation',
        text: 'Vellin grazing patterns have shifted. They are avoiding the upper canopy entirely now, concentrating in the lower growth where Keth rarely descend. Feeding rates down.',
        speciesIds: ['vellin', 'keth'],
      },
      {
        cycle: 90,
        type: 'decision',
        text: 'Keth range expanding into Understory. They have pushed further than last season. This could stabilize or accelerate.',
        speciesIds: ['keth', 'vellin'],
      },
      {
        cycle: 91,
        type: 'observation',
        text: 'First confirmed Vellin sighting in the Understory. A group of four, moving along the border fringe. They looked displaced, not exploratory.',
        speciesIds: ['vellin'],
        biomeIds: ['understory'],
      },
      {
        cycle: 92,
        type: 'observation',
        text: 'Vellin numbers in Highgrowth down significantly. Keth are following them into the lower growth now. The pressure is not easing.',
        speciesIds: ['vellin', 'keth'],
      },
      {
        cycle: 93,
        type: 'observation',
        text: 'Keth at the highest recorded density in Highgrowth. Feltmoss spreading unchecked in the areas Vellin have abandoned.',
        speciesIds: ['keth', 'feltmoss'],
        biomeIds: ['highgrowth'],
      },
      {
        cycle: 94,
        type: 'crisis',
        text: 'Vellin population collapsing. The numbers are bad. Keth pressure has been building for three cycles and shows no sign of easing.',
        speciesIds: ['vellin', 'keth'],
      },
    ],
  },
  research: {
    active: {
      targetName: 'Vellin',
      type: 'behavioral study',
      timeLabel: 'a few hours',
      progress: 0.62,
    },
    suggestionsReady: 3,
  },
  biomes: [
    { id: 'highgrowth', name: 'Highgrowth',   health: 0.82, status: 'stable' },
    { id: 'understory', name: 'Understory',   health: 0.71, status: 'rising' },
    { id: 'scorch',     name: 'Scorch Flats', health: 0.44, status: 'stress' },
  ],
  species: [
    { id: 'feltmoss',  name: 'Feltmoss',  pop: 1840, popDiff:  +10, trend: 'stable',    role: 'producer'   },
    { id: 'nightroot', name: 'Nightroot', pop:  920, popDiff:    0, trend: 'stable',    role: 'producer'   },
    { id: 'scaleweed', name: 'Scaleweed', pop:  640, popDiff:  -15, trend: 'declining', role: 'producer'   },
    { id: 'vellin',    name: 'Vellin',    pop:  847, popDiff: -115, trend: 'critical',  role: 'consumer'   },
    { id: 'woldren',   name: 'Woldren',   pop:  312, popDiff:   +5, trend: 'stable',    role: 'consumer'   },
    { id: 'brack',     name: 'Brack',     pop:  178, popDiff:  -20, trend: 'declining', role: 'consumer'   },
    { id: 'torrak',    name: 'Torrak',    pop:   89, popDiff:    0, trend: 'stable',    role: 'specialist' },
    { id: 'keth',      name: 'Keth',      pop:  203, popDiff:  +90, trend: 'thriving',  role: 'predator'   },
    { id: 'skethran',  name: 'Skethran',  pop:   71, popDiff:  -10, trend: 'declining', role: 'predator'   },
    { id: 'grubmere',  name: 'Grubmere',  pop:  543, popDiff:  +25, trend: 'thriving',  role: 'decomposer' },
    { id: 'mordath',   name: 'Mordath',   pop:   14, popDiff:    0, trend: 'stable',    role: 'apex'       },
  ],
}


const TREND_ORDER = { critical: 0, declining: 1, stable: 2, thriving: 3 }

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


export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'
  const d = { ...MOCK, researcher }

  useEffect(() => {
    if (!location.state?.fromSummary && d.session?.entries?.length > 0) {
      navigate('/summary', { replace: true })
    }
  }, [])

  const sessionActionable = (d.session?.entries ?? []).filter(e => e.type === 'crisis' || e.type === 'decision')
  const sortedSpecies = [...d.species]
    .sort((a, b) => (TREND_ORDER[a.trend] ?? 2) - (TREND_ORDER[b.trend] ?? 2))
    .slice(0, 5)

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

      {(d.session?.entries?.length > 0) && (
        <button className={styles.sessionStrip} onClick={() => navigate('/summary')}>
          {sessionActionable.length > 0 ? (
            <>Since you were away · <span className={styles.sessionStripCount}>{sessionActionable.length}</span>{sessionActionable.length === 1 ? ' event needs attention' : ' events need attention'} →</>
          ) : 'Since you were away · read what happened →'}
        </button>
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
              {sortedSpecies.map(sp => (
                <div key={sp.id} className={styles.speciesRow}>
                  <span className={`${styles.speciesName} entity`}>{sp.name}</span>
                  <SpeciesTrend pop={sp.pop} popDiff={sp.popDiff} />
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
