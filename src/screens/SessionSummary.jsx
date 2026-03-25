import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadState } from '../storage/db.js'
import { saveSession, canContinue, onContinue } from '../simulation/session.js'
import { eventToEntry } from '../data/text/events.js'
import styles from './SessionSummary.module.css'

function Entry({ cycle, type, text, resolved, onRespond }) {
  const cta = type === 'crisis'   ? 'I should respond →'
            : type === 'decision' ? 'I should weigh in →'
            : null

  return (
    <article className={`${styles.entry} ${styles[type] || ''}`}>
      <div className={styles.entryMeta}>
        <span className={styles.entryCycle}>Cycle {cycle}</span>
        {type !== 'observation' && (
          <span className={styles.entryType}>{type}</span>
        )}
      </div>
      <p className={styles.entryText}>{text}</p>
      {cta && !resolved && (
        <button
          className={`${styles.entryCta} ${styles[`entryCta_${type}`]}`}
          onClick={onRespond}
        >
          {cta}
        </button>
      )}
      {cta && resolved && (
        <span className={styles.entryResolved}>Responded</span>
      )}
    </article>
  )
}

export default function SessionSummary() {
  const navigate   = useNavigate()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'

  const [gameState, setGameState] = useState(null)
  const [closing,   setClosing]   = useState(false)

  useEffect(() => {
    loadState().then(state => setGameState(state))
  }, [])

  function dismiss(fn) {
    if (closing) return
    setClosing(true)
    fn().then(() => navigate('/home', { state: { fromSummary: true } }))
  }

  function handleBack() {
    dismiss(() => Promise.resolve())
  }

  function handleContinue() {
    dismiss(async () => {
      const next = onContinue(gameState)
      await saveSession(next)
    })
  }

  if (!gameState) return null

  const marker     = gameState.researcher.lastSummaryViewedCycle
  const cycleStart = marker || 1   // display only
  const cycleEnd   = gameState.cycle

  const newEvents = gameState.events.filter(e => e.cycle > marker && e.cycle <= cycleEnd)

  // Build entries keeping a reference to the global event index so we can resolve them
  const entries = newEvents.flatMap((ev, i) => {
    const entry = eventToEntry(ev)
    if (!entry) return []
    const globalIdx = gameState.events.indexOf(ev)
    return [{ ...entry, resolved: ev.resolved, globalIdx }]
  })

  function handleRespond(globalIdx) {
    const updatedEvents = gameState.events.map((ev, i) =>
      i === globalIdx ? { ...ev, resolved: true } : ev
    )
    const next = { ...gameState, events: updatedEvents }
    setGameState(next)
    saveSession(next)
  }

  const blocked = newEvents.filter(e => e.requiresDecision && !e.resolved)
  const ok      = blocked.length === 0

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitle}>Since you were away</div>
          <div className={styles.headerSub}>
            {researcher} · {newEvents.length} event{newEvents.length !== 1 ? 's' : ''} · Cycle {cycleStart}–{cycleEnd}
          </div>
        </header>

        <div className={styles.entries}>
          {entries.length === 0 ? (
            <p className={styles.emptyNote}>Nothing significant happened while you were away.</p>
          ) : (
            entries.map((entry, i) => (
              <Entry
                key={i}
                cycle={entry.cycle}
                type={entry.type}
                text={entry.text}
                resolved={entry.resolved}
                onRespond={() => handleRespond(entry.globalIdx)}
              />
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={`${styles.continueBtn} ${!ok ? styles.continueBtnBlocked : ''}`}
            onClick={ok && !closing ? handleContinue : undefined}
            disabled={!ok}
          >
            {ok
              ? 'Continue →'
              : `Continue — respond to ${blocked.length} event${blocked.length !== 1 ? 's' : ''} first`
            }
          </button>
        </div>

      </div>
    </div>
  )
}
