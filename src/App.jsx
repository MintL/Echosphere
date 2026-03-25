import { Routes, Route } from 'react-router-dom'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Log from './screens/Log'
import SessionSummary from './screens/SessionSummary'
import Research from './screens/Research'
import Species from './screens/Species'
import Biome from './screens/Biome'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/"             element={<Onboarding />} />
        <Route path="/home"         element={<Home />} />
        <Route path="/log"          element={<Log />} />
        <Route path="/summary"      element={<SessionSummary />} />
        <Route path="/research"     element={<Research />} />
        <Route path="/species/:id"  element={<Species />} />
        <Route path="/biome/:id"    element={<Biome />} />
      </Routes>
    </div>
  )
}
