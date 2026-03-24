import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SessionSummary.module.css'

const CTA_LABELS = {
  1: 'I should respond',
  2: 'I need to decide',
  3: "Can't ignore this",
}

function E({ children }) {
  return <span className="entity">{children}</span>
}

function Entry({ cycle, type, urgencyTier, children }) {
  const cta = type === 'crisis'
    ? (CTA_LABELS[urgencyTier] ?? 'I should respond') + ' →'
    : type === 'decision'
    ? 'I should weigh in →'
    : null

  return (
    <article className={`${styles.entry} ${styles[type] || ''}`}>
      <div className={styles.entryMeta}>
        <span className={styles.entryCycle}>Cycle {cycle}</span>
        {type !== 'observation' && (
          <span className={styles.entryType}>{type}</span>
        )}
      </div>
      <p className={styles.entryText}>{children}</p>
      {cta && (
        <button className={`${styles.entryCta} ${styles[`entryCta_${type}`]}`}>
          {cta}
        </button>
      )}
    </article>
  )
}

const CYCLE_END   = 94
const CYCLE_COUNT = 6
const CYCLE_START = CYCLE_END - CYCLE_COUNT

export default function SessionSummary() {
  const navigate = useNavigate()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'
  const [closing, setClosing] = useState(false)

  function handleBack() {
    setClosing(true)
    setTimeout(() => navigate('/home', { state: { fromSummary: true } }), 300)
  }

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitle}>Since you were away</div>
          <div className={styles.headerSub}>{researcher} · {CYCLE_COUNT} cycles · Cycle {CYCLE_START}–{CYCLE_END}</div>
        </header>

        <div className={styles.entries}>

          <Entry cycle={89} type="observation">
            <E>Keth</E> ranging further south than usual. Three individuals recorded
            near the <E>Highgrowth</E> border — further than I have seen them go.
            The <E>Vellin</E> are pulling back.
          </Entry>

          <Entry cycle={90} type="observation">
            <E>Vellin</E> grazing patterns have shifted. They are avoiding the upper
            canopy entirely now, concentrating in the lower growth where <E>Keth</E>{' '}
            rarely descend. Feeding rates down.
          </Entry>

          <Entry cycle={90} type="decision">
            <E>Keth</E> range expanding into <E>Understory</E>. They have pushed
            further than last season. This could stabilize or accelerate.
          </Entry>

          <Entry cycle={91} type="observation">
            First confirmed <E>Vellin</E> sighting in the <E>Understory</E>. A group
            of four, moving along the border fringe. They looked displaced, not
            exploratory.
          </Entry>

          <Entry cycle={92} type="observation">
            <E>Vellin</E> numbers in <E>Highgrowth</E> down significantly. <E>Keth</E>{' '}
            are following them into the lower growth now. The pressure is not easing.
          </Entry>

          <Entry cycle={93} type="observation">
            <E>Keth</E> at the highest recorded density in <E>Highgrowth</E>.{' '}
            <E>Feltmoss</E> spreading unchecked in the areas <E>Vellin</E> have
            abandoned.
          </Entry>

          <Entry cycle={94} type="crisis" urgencyTier={2}>
            <E>Vellin</E> population collapsing. The numbers are bad. <E>Keth</E>{' '}
            pressure has been building for three cycles and shows no sign of easing.
          </Entry>

        </div>
      </div>
    </div>
  )
}
