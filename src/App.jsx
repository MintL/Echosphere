import { Routes, Route } from 'react-router-dom'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Research from './screens/Research'
import Species from './screens/Species'
import Biome from './screens/Biome'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/onboarding"   element={<Onboarding />} />
        <Route path="/research"     element={<Research />} />
        <Route path="/species/:id"  element={<Species />} />
        <Route path="/biome/:id"    element={<Biome />} />
      </Routes>
    </div>
  )
}
