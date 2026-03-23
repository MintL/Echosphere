import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import styles from './Onboarding.module.css'

export default function Onboarding() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  if (localStorage.getItem('echosphere_researcher')) {
    return <Navigate to="/home" replace />
  }

  function handleBegin() {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem('echosphere_researcher', trimmed)
    navigate('/home')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleBegin()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.wordmark}>Echosphere</div>

        <div className={styles.prose}>
          <p className={styles.line1}>A research station has been established.</p>
          <p className={styles.line2}>Enter your name to begin.</p>
        </div>

        <div className={styles.inputWrapper}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Researcher name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoCapitalize="words"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className={`${styles.beginBtn} ${name.trim() ? styles.beginVisible : ''}`}
            onClick={handleBegin}
            tabIndex={name.trim() ? 0 : -1}
          >
            Begin ↵
          </button>
        </div>
      </div>
    </div>
  )
}
