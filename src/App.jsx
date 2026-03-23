import { Routes, Route } from 'react-router-dom'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Log from './screens/Log'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/"     element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/log"  element={<Log />} />
      </Routes>
    </div>
  )
}
