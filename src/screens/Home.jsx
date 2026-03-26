import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { loadSession, saveSession, onContinue, CYCLE_DURATION_MS } from '../simulation/session.js'
import { clearState } from '../storage/db.js'
import { runCycles } from '../simulation/engine.js'
import { eventToEntry } from '../data/text/events.js'
import styles from './Home.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAtBottom(el) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 50
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function EntryText({ segments, onNavigate }) {
  return (
    <p className={styles.entryText}>
      {segments.map((seg, i) =>
        seg.type === 'entity'
          ? <span
              key={i}
              className="entity"
              onClick={() => onNavigate(seg.entityType === 'sp' ? `/species/${seg.id}` : `/biome/${seg.id}`)}
            >{seg.name}</span>
          : seg.value
      )}
    </p>
  )
}

function Entry({ cycle, type, segments, resolved, onRespond, onNavigate }) {
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
      <EntryText segments={segments} onNavigate={onNavigate} />
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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate   = useNavigate()
  const researcher = localStorage.getItem('echosphere_researcher')

  const feedRef        = useRef(null)
  const markerRef      = useRef(null)
  const atBottomRef    = useRef(true)
  const prevCountRef   = useRef(0)
  const initializedRef = useRef(false)

  const [gameState,        setGameState]        = useState(null)
  const [loading,          setLoading]          = useState(true)
  const [awayCycles,       setAwayCycles]       = useState(0)
  const [awayMs,           setAwayMs]           = useState(0)
  const [visitMarkerCycle, setVisitMarkerCycle] = useState(0)
  const [scrolledUp,       setScrolledUp]       = useState(false)
  const [unseenCount,      setUnseenCount]      = useState(0)

  // Load session
  useEffect(() => {
    if (!researcher) return
    loadSession(researcher).then(({ state, awayCycles: ac, awayMs: am }) => {
      const marker = state.researcher.lastSummaryViewedCycle ?? 0
      setVisitMarkerCycle(marker)
      const advanced = onContinue(state)
      saveSession(advanced)
      setGameState(advanced)
      setLoading(false)
      setAwayCycles(ac ?? 0)
      setAwayMs(am ?? 0)
    })
  }, [])

  // Attach scroll listener once the feed is in the DOM
  useEffect(() => {
    const el = feedRef.current
    if (!el) return
    const onScroll = () => {
      const atBottom = isAtBottom(el)
      atBottomRef.current = atBottom
      setScrolledUp(!atBottom)
      if (atBottom) setUnseenCount(0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [loading])

  // Live cycle ticker
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

  // Memoize entries on event count only — assembleEventText uses module-level dedup sets
  // so calling it on every tick would exhaust the pool and change existing entry text.
  // `resolved` is intentionally excluded: read live from gameState at render so that
  // responding to a crisis updates the CTA without triggering a full recompute.
  const eventCount = gameState?.events?.length ?? 0
  const entries = useMemo(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (!gameState) return []
    return gameState.events.flatMap((ev, i) => {
      const entry = eventToEntry(ev, gameState)
      if (!entry) return []
      return [{ ...entry, globalIdx: i }]
    })
  }, [eventCount])

  // Sticky-bottom: runs only when entry count changes (entries is memoized on eventCount)
  useEffect(() => {
    if (!initializedRef.current) return
    const el = feedRef.current
    if (!el) return
    const added = entries.length - prevCountRef.current
    if (added > 0) {
      if (atBottomRef.current) {
        el.scrollTop = el.scrollHeight
      } else {
        setUnseenCount(c => c + added)
      }
    }
    prevCountRef.current = entries.length
  }, [entries.length])

  // ── Conditional exits — all hooks above this line ──
  if (!researcher) return <Navigate to="/onboarding" replace />
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  // ── Derived render values ──
  const awayHours  = Math.round(awayMs / (1000 * 60 * 60))
  const oldEntries = entries.filter(e => e.cycle <= visitMarkerCycle)
  const newEntries = entries.filter(e => e.cycle >  visitMarkerCycle)
  const hasMarker  = newEntries.length > 0 && visitMarkerCycle > 0

  function handleRespond(globalIdx) {
    const updatedEvents = gameState.events.map((ev, i) =>
      i === globalIdx ? { ...ev, resolved: true } : ev
    )
    const next = { ...gameState, events: updatedEvents }
    setGameState(next)
    saveSession(next)
  }

  function scrollToBottom() {
    const el = feedRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    setUnseenCount(0)
    setScrolledUp(false)
  }

  function onFeedRef(el) {
    feedRef.current = el
    if (!el || initializedRef.current) return
    initializedRef.current = true
    if (hasMarker && markerRef.current) {
      markerRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
    } else {
      el.scrollTop = el.scrollHeight
    }
    atBottomRef.current = isAtBottom(el)
    setScrolledUp(!atBottomRef.current)
    prevCountRef.current = entries.length
  }

  return (
    <div className={styles.page}>

      {/* ── Sticky header ── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.wordmark}>Echosphere</span>
          <button className={styles.logBtn} onClick={async () => { await clearState(); navigate('/', { replace: true }); window.location.reload() }}>⌫ Reset</button>
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
        <div className={styles.researchRow}>
          <ResearchStrip
            research={gameState.research}
            cycle={gameState.cycle}
            onTap={() => navigate('/research')}
          />
        </div>
      </header>

      {/* ── Log feed ── */}
      <div className={styles.logFeed} ref={onFeedRef}>
        {entries.length === 0 ? (
          <p className={styles.emptyNote}>Nothing recorded yet.</p>
        ) : (
          <>
            {oldEntries.map(entry => (
              <Entry
                key={entry.globalIdx}
                cycle={entry.cycle}
                type={entry.type}
                segments={entry.segments}
                resolved={gameState.events[entry.globalIdx]?.resolved ?? false}
                onRespond={() => handleRespond(entry.globalIdx)}
                onNavigate={navigate}
              />
            ))}

            {hasMarker && (
              <div className={styles.visitMarker} ref={markerRef}>
                <span className={styles.visitMarkerLabel}>this visit</span>
              </div>
            )}

            {newEntries.map(entry => (
              <Entry
                key={entry.globalIdx}
                cycle={entry.cycle}
                type={entry.type}
                segments={entry.segments}
                resolved={gameState.events[entry.globalIdx]?.resolved ?? false}
                onRespond={() => handleRespond(entry.globalIdx)}
                onNavigate={navigate}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Unseen pill ── */}
      {scrolledUp && unseenCount > 0 && (
        <button className={styles.unseenPill} onClick={scrollToBottom}>
          {unseenCount} new {unseenCount === 1 ? 'entry' : 'entries'} ↓
        </button>
      )}

    </div>
  )
}
