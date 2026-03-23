import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const BIOME_COLORS = {
  highgrowth: 'var(--biome-high)',
  understory:  'var(--biome-under)',
  scorch:      'var(--biome-scorch)',
}

const MOCK = {
  researcher: 'Dr. Voss',
  cycle: 94,
  away: { hours: 6, cycles: 6 },
  resources: { fieldData: 340, specimens: 12 },
  events: [
    {
      id: 1,
      urgency: 'crisis',
      title: 'Vellin population collapsing — Highgrowth',
    },
    {
      id: 2,
      urgency: 'normal',
      title: 'Vellin crossed into Understory for the first time',
    },
  ],
  biomes: [
    { id: 'highgrowth', name: 'Highgrowth',  health: 0.82, status: 'stable' },
    { id: 'understory', name: 'Understory',  health: 0.71, status: 'rising' },
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
  tools: [
    { id: 1, type: 'Observation Post',      location: 'Highgrowth',  status: 'active' },
    { id: 2, type: 'Observation Post',      location: 'Scorch Flats', status: 'active' },
    { id: 3, type: 'Sample Collector',      location: 'Vellin',      status: 'active' },
    { id: 4, type: 'Environmental Sensor',  location: 'Understory',  status: 'active' },
  ],
}


function formatPop(n) {
  return n.toLocaleString()
}

function Trend({ change }) {
  if (change > 0) return <span className={styles.trendUp}>up {change}%</span>
  if (change < 0) return <span className={styles.trendDown}>down {Math.abs(change)}%</span>
  return <span className={styles.trendFlat}>stable</span>
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
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>
            Events
            <span className={styles.sectionCount}>{d.events.length}</span>
          </span>
        </div>

        <div className={styles.events}>
          {d.events.map(ev => (
            <button
              key={ev.id}
              className={`${styles.event} ${ev.urgency === 'crisis' ? styles.eventCrisis : ''}`}
            >
              <span className={styles.eventTitle}>{ev.title}</span>
              <span className={styles.eventArrow}>→</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Ecosystem</span>
        </div>

        <div className={styles.biomes}>
          {d.biomes.map(b => (
            <div key={b.id} className={styles.biomeRow}>
              <span className={`${styles.biomeName} entity`}>{b.name}</span>
              <div className={styles.biomeBar}>
                <div
                  className={styles.biomeBarFill}
                  style={{
                    width: `${b.health * 100}%`,
                    backgroundColor: BIOME_COLORS[b.id],
                  }}
                />
              </div>
              <StatusLabel status={b.status} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Species ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Species</span>
        </div>

        <div className={styles.speciesList}>
          {d.species.map(sp => (
            <div key={sp.id} className={styles.speciesRow}>
              <span className={`${styles.speciesName} entity`}>{sp.name}</span>
              <span className={styles.speciesPop}>{formatPop(sp.pop)}</span>
              <Trend change={sp.change} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools ── */}
      <section className={`${styles.section} ${styles.sectionLast}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Tools</span>
        </div>

        <div className={styles.toolsList}>
          {d.tools.map(t => (
            <div key={t.id} className={styles.toolRow}>
              <span className={styles.toolType}>{t.type}</span>
              <span className={styles.toolSep}>·</span>
              <span className="entity">{t.location}</span>
              <span className={`${styles.toolStatus} ${t.status === 'active' ? styles.toolActive : styles.toolDestroyed}`}>
                {t.status === 'active' ? '●' : '○'}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
