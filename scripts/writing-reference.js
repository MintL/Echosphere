#!/usr/bin/env node
// Writing reference report — run with:  node scripts/writing-reference.js
//
// Runs 20 seeds × 200 cycles and produces a source-material document for
// authoring observation pools, event text, and compound event candidates.
//
// Output is plain text intended to be read, printed, or saved:
//   node scripts/writing-reference.js > writing-reference.txt

import { createInitialState, simulateCycle } from '../src/simulation/engine.js'
import { checkThresholds } from '../src/simulation/triggers.js'
import { SPECIES_DEFS } from '../src/data/species.js'

// ─── Config ───────────────────────────────────────────────────────────────────

const RUNS   = 20
const CYCLES = 200

const SEEDS = Array.from({ length: RUNS }, (_, i) => (0x1a2b3c4d + i * 0x7f3e9a21) >>> 0)

// ─── Simulation driver ────────────────────────────────────────────────────────

function runSeed(seed) {
  let state = createInitialState(seed)
  state = {
    ...state,
    species: state.species.map(sp => ({
      ...sp,
      milestones: { observed: true, named: true, roleIdentified: true,
                    behaviorMapped: true, populationModeled: true },
    })),
  }

  const eventLog   = []   // { cycle, type, speciesId, pop, prevPop, data }
  const popHistory = {}   // speciesId -> [pop]  (one entry per cycle, 1-indexed)

  for (const sp of state.species) popHistory[sp.id] = []

  for (let i = 0; i < CYCLES; i++) {
    const cycle = i + 1
    const prev  = state
    state = simulateCycle(state)
    const cycleEvents = checkThresholds(prev, state)

    for (const sp of state.species) {
      if (!popHistory[sp.id]) popHistory[sp.id] = []
      popHistory[sp.id].push(sp.population)
    }

    const prevMap = {}
    for (const sp of prev.species) prevMap[sp.id] = sp

    for (const ev of cycleEvents) {
      if (!ev.speciesId) continue
      const sp     = state.species.find(s => s.id === ev.speciesId)
      const prevSp = prevMap[ev.speciesId]
      eventLog.push({
        cycle,
        type:      ev.type,
        speciesId: ev.speciesId,
        pop:       sp?.population      ?? 0,
        prevPop:   prevSp?.population  ?? 0,
        data:      ev.data ?? {},
      })
    }
  }

  return { eventLog, popHistory, finalState: state }
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

function mean(arr) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length
}

function median(arr) {
  if (arr.length === 0) return 0
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m]
}

function stddev(arr) {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1))
}

function cv(arr) {
  const m = mean(arr)
  return m < 1 ? 0 : stddev(arr) / m
}

function percentile(arr, p) {
  if (arr.length === 0) return 0
  const s   = [...arr].sort((a, b) => a - b)
  const idx = Math.max(0, Math.floor(s.length * p / 100) - 1)
  return s[idx]
}

function fmt(n) {
  return Math.round(n).toLocaleString()
}

function pct(n) {
  return `${(n * 100).toFixed(1)}%`
}

// ─── Crash recovery analysis ──────────────────────────────────────────────────

// For each populationCrisis event, scan forward and find the cycle when the
// species first returns to prevPop (full recovery to pre-crash level).
// Returns array of { crashCycle, crashPop, prevPop, dropPct, recoveryCycles }.
function findRecoveries(eventLog, popHistory) {
  const recoveries = []
  const crises = eventLog.filter(e => e.type === 'populationCrisis')

  for (const crisis of crises) {
    const { cycle, speciesId, prevPop, pop } = crisis
    const dropPct = prevPop > 0 ? (prevPop - pop) / prevPop : 0
    const target  = prevPop   // full recovery to pre-crash level
    const hist    = popHistory[speciesId] ?? []

    let recoveryCycles = null
    for (let c = cycle; c < hist.length; c++) {
      if (hist[c] >= target) {
        recoveryCycles = c + 1 - cycle
        break
      }
    }

    recoveries.push({
      speciesId,
      crashCycle:      cycle,
      crashPop:        pop,
      prevPop,
      dropPct,
      recoveryCycles,  // null if never recovered within the run
    })
  }

  return recoveries
}

// ─── Co-occurrence analysis ───────────────────────────────────────────────────

function countCoPairs(eventLog) {
  const byCycle = {}
  for (const ev of eventLog) {
    if (!byCycle[ev.cycle]) byCycle[ev.cycle] = []
    byCycle[ev.cycle].push(ev)
  }

  const pairs = {}
  for (const events of Object.values(byCycle)) {
    // Skip cycles with only one event
    if (events.length < 2) continue

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i]
        const b = events[j]
        // Skip same-species or same-type-same-species self-pairs (noise)
        if (a.speciesId === b.speciesId) continue
        // Normalise key: sort lexicographically so A|B === B|A
        const ka = `${a.type}/${a.speciesId}`
        const kb = `${b.type}/${b.speciesId}`
        const key = [ka, kb].sort().join(' ↔ ')
        if (!pairs[key]) pairs[key] = { count: 0, examples: [] }
        pairs[key].count++
        if (pairs[key].examples.length < 3) {
          pairs[key].examples.push({ cycle: a.cycle, popA: a.pop, popB: b.pop })
        }
      }
    }
  }

  return pairs
}

// ─── Run all seeds ────────────────────────────────────────────────────────────

const allEventLog   = []    // flat across all runs
const allPopHistory = {}    // speciesId -> [pop] flat across all runs
const allRecoveries = []

process.stderr.write(`Running ${RUNS} seeds × ${CYCLES} cycles...\n`)

for (const seed of SEEDS) {
  const { eventLog, popHistory, finalState } = runSeed(seed)
  allEventLog.push(...eventLog)
  for (const [id, hist] of Object.entries(popHistory)) {
    if (!allPopHistory[id]) allPopHistory[id] = []
    allPopHistory[id].push(...hist)
  }
  allRecoveries.push(...findRecoveries(eventLog, popHistory))
}

const coPairs = countCoPairs(allEventLog)

// ─── Report helpers ───────────────────────────────────────────────────────────

const HR1 = '═'.repeat(72)
const HR2 = '─'.repeat(72)

function section(title) {
  console.log(`\n${HR1}`)
  console.log(` ${title}`)
  console.log(HR1)
}

function sub(title) {
  console.log(`\n${HR2}`)
  console.log(` ${title}`)
  console.log(HR2)
}

// ─── Report ───────────────────────────────────────────────────────────────────

console.log(`ECHOSPHERE — WRITING REFERENCE REPORT`)
console.log(`${RUNS} seeds × ${CYCLES} cycles  |  generated ${new Date().toISOString().slice(0, 10)}`)

// ─── 1. Per-species behavioural summaries ─────────────────────────────────────

section('1. PER-SPECIES BEHAVIOURAL SUMMARIES')

const speciesOrder = SPECIES_DEFS.map(d => d.id)

for (const def of SPECIES_DEFS) {
  const id   = def.id
  const pops = (allPopHistory[id] ?? []).filter(p => p > 0)

  if (pops.length === 0) {
    sub(`${def.name.toUpperCase()}  [no data]`)
    continue
  }

  const events    = allEventLog.filter(e => e.speciesId === id)
  const popAll    = allPopHistory[id] ?? []
  const alive     = popAll.filter(p => p > 0)
  const extincts  = popAll.filter(p => p === 0).length
  const surviveRt = pct(1 - extincts / (popAll.length / CYCLES) / RUNS)

  const p5  = percentile(alive, 5)
  const p25 = percentile(alive, 25)
  const p50 = percentile(alive, 50)
  const p75 = percentile(alive, 75)
  const p95 = percentile(alive, 95)
  const mn  = Math.round(mean(alive))
  const mx  = Math.max(...alive)
  const mi  = Math.min(...alive)
  const cvv = cv(alive)

  // Event frequency table
  const evTypes = {}
  for (const e of events) evTypes[e.type] = (evTypes[e.type] || 0) + 1
  const evSorted = Object.entries(evTypes).sort((a, b) => b[1] - a[1])

  // Crash analysis
  const crashes  = allRecoveries.filter(r => r.speciesId === id)
  const drops    = crashes.map(r => r.dropPct)
  const recTimes = crashes.filter(r => r.recoveryCycles !== null).map(r => r.recoveryCycles)

  // Surge analysis
  const surges     = events.filter(e => e.type === 'populationSurge')
  const surgeCycle = surges.map(e => e.cycle)

  // Population during events
  const crisisEvents  = events.filter(e => e.type === 'populationCrisis')
  const surgeEvents   = events.filter(e => e.type === 'populationSurge')
  const warningEvents = events.filter(e => e.type === 'extinctionWarning')

  sub(`${def.name.toUpperCase()}  (${def.catalogRole}, ${def.homeBiome})`)

  console.log(`\nRole / diet:`)
  if (def.eats.length === 0) {
    console.log(`  Producer — no prey. Growth limited by carrying capacity.`)
  } else {
    for (const e of def.eats) {
      const prey = SPECIES_DEFS.find(d => d.id === e.preyId)
      console.log(`  Eats ${prey?.name ?? e.preyId} (attackRate=${e.attackRate}, efficiency=${e.efficiency}${e.borderScaled ? ', borderScaled' : ''})`)
    }
  }
  const predators = SPECIES_DEFS.filter(d => d.eats.some(e => e.preyId === id))
  if (predators.length > 0) {
    console.log(`  Eaten by: ${predators.map(p => p.name).join(', ')}`)
  }

  console.log(`\nPopulation distribution (across ${RUNS} runs × ${CYCLES} cycles, living-only):`)
  console.log(`  baseline: ${fmt(def.startingPopulation)}`)
  console.log(`  min:      ${fmt(mi)}    p5: ${fmt(p5)}    p25: ${fmt(p25)}`)
  console.log(`  median:   ${fmt(p50)}    p75: ${fmt(p75)}    p95: ${fmt(p95)}    max: ${fmt(mx)}`)
  console.log(`  mean: ${fmt(mn)}    CV: ${pct(cvv)}  (${cvv > 0.3 ? 'strong oscillation' : cvv > 0.15 ? 'moderate oscillation' : 'low variance'})`)

  if (crashes.length > 0) {
    console.log(`\nCrash behaviour (${crashes.length} total populationCrisis events):`)
    console.log(`  typical drop:  ${pct(median(drops))} (median),  ${pct(mean(drops))} (mean)`)
    console.log(`  deepest drop:  ${pct(Math.max(...drops))}`)
    console.log(`  pop at crash:  median ${fmt(median(crashes.map(r => r.crashPop)))},  ` +
                `min ${fmt(Math.min(...crashes.map(r => r.crashPop)))}`)
    console.log(`  crash cycles:  ${crashes.map(r => r.crashCycle).sort((a,b)=>a-b).slice(0, 12).join(', ')}${crashes.length > 12 ? ' …' : ''}`)
    if (recTimes.length > 0) {
      console.log(`  recovery time: median ${Math.round(median(recTimes))} cycles,  ` +
                  `range ${Math.min(...recTimes)}–${Math.max(...recTimes)} cycles`)
      console.log(`  recovery rate: ${Math.round(recTimes.length / crashes.length * 100)}% recovered within run`)
    }
  } else {
    console.log(`\nCrash behaviour: no populationCrisis events fired`)
  }

  if (surges.length > 0) {
    console.log(`\nSurge behaviour (${surges.length} total populationSurge events):`)
    const surgePops = surgeEvents.map(e => e.pop)
    console.log(`  pop at surge:  median ${fmt(median(surgePops))},  max ${fmt(Math.max(...surgePops))}`)
    console.log(`  surge cycles:  ${surgeCycle.sort((a,b)=>a-b).slice(0, 12).join(', ')}${surges.length > 12 ? ' …' : ''}`)
  }

  if (warningEvents.length > 0) {
    const warnPops = warningEvents.map(e => e.pop)
    console.log(`\nExtinction warnings (${warningEvents.length} events):`)
    console.log(`  pop at warning: median ${fmt(median(warnPops))},  min ${fmt(Math.min(...warnPops))}`)
    console.log(`  warning cycles: ${warningEvents.map(e => e.cycle).sort((a,b)=>a-b).join(', ')}`)
  }

  console.log(`\nEvents fired (total across all runs):`)
  if (evSorted.length === 0) {
    console.log(`  none`)
  } else {
    for (const [type, count] of evSorted) {
      console.log(`  ${type.padEnd(28)} ${String(count).padStart(4)}  (~${(count / RUNS).toFixed(1)} per run)`)
    }
  }
}

// ─── 2. Co-occurring event pairs ──────────────────────────────────────────────

section('2. CO-OCCURRING EVENT PAIRS (top 20, ranked by frequency)')

const sortedPairs = Object.entries(coPairs)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 20)

console.log(`\n${'Pair'.padEnd(60)} Count  Per run`)
console.log(HR2)
for (const [key, val] of sortedPairs) {
  const perRun = (val.count / RUNS).toFixed(1)
  console.log(`${key.padEnd(60)} ${String(val.count).padStart(5)}  ${perRun.padStart(6)}`)
  // Show one example
  const ex = val.examples[0]
  if (ex) {
    const parts = key.split(' ↔ ')
    console.log(`  example: cycle ${ex.cycle}`)
  }
}

// ─── 3. Compound event candidates ────────────────────────────────────────────

section('3. COMPOUND EVENT CANDIDATES')
console.log(`
These are the highest-frequency co-occurring pairs that share a known causal
relationship in the food web. Strong candidates for compound event detection.
`)

// Known causal relationships to flag
const causalPairs = [
  ['populationSurge/keth',     'populationCrisis/vellin'],
  ['populationSurge/skethran', 'populationCrisis/vellin'],
  ['populationSurge/skethran', 'populationCrisis/woldren'],
  ['populationSurge/mordath',  'populationCrisis/brack'],
  ['populationSurge/mordath',  'populationCrisis/torrak'],
  ['populationSurge/mordath',  'populationCrisis/woldren'],
  ['populationCrisis/feltmoss','populationCrisis/vellin'],
  ['populationCrisis/feltmoss','extinctionWarning/vellin'],
  ['populationCrisis/nightroot','populationCrisis/woldren'],
  ['populationCrisis/scaleweed','populationCrisis/torrak'],
  ['populationCrisis/scaleweed','populationCrisis/brack'],
  ['populationCrisis/mordath', 'populationSurge/keth'],
  ['extinction/mordath',       'populationSurge/keth'],
  ['extinction/mordath',       'populationSurge/skethran'],
]

for (const [a, b] of causalPairs) {
  const key1 = [a, b].sort().join(' ↔ ')
  const key2 = [b, a].sort().join(' ↔ ')
  const data = coPairs[key1] || coPairs[key2]
  const count = data?.count ?? 0
  const perRun = (count / RUNS).toFixed(2)
  const flag = count >= 5 ? '★' : count >= 2 ? '·' : ' '
  console.log(`  ${flag} ${a.padEnd(34)} + ${b.padEnd(34)} → ${String(count).padStart(3)} (${perRun}/run)`)
}

// ─── 4. Vellin writing reference ─────────────────────────────────────────────

section('4. VELLIN — WRITING REFERENCE')

const vellin     = SPECIES_DEFS.find(d => d.id === 'vellin')
const vellinPops = (allPopHistory['vellin'] ?? []).filter(p => p > 0)
const vellinEvs  = allEventLog.filter(e => e.speciesId === 'vellin')

const vp5  = percentile(vellinPops, 5)
const vp25 = percentile(vellinPops, 25)
const vp50 = percentile(vellinPops, 50)
const vp75 = percentile(vellinPops, 75)
const vp95 = percentile(vellinPops, 95)
const vMax = Math.max(...vellinPops)
const vMin = Math.min(...vellinPops)
const vMean = Math.round(mean(vellinPops))
const vCV   = cv(vellinPops)

const vellinCrashes  = allRecoveries.filter(r => r.speciesId === 'vellin')
const crashDrops     = vellinCrashes.map(r => r.dropPct)
const crashPops      = vellinCrashes.map(r => r.crashPop)
const crashPrevPops  = vellinCrashes.map(r => r.prevPop)
const recTimes       = vellinCrashes.filter(r => r.recoveryCycles !== null).map(r => r.recoveryCycles)

console.log(`
Vellin is a highgrowth climber — the primary prey for both Keth and Skethran.
Eats Feltmoss. Starting population 500. Baseline is the primary calibration
point for the highgrowth biome health cascade.

POPULATION FACTS (for use in observation text):
  Baseline:         ${fmt(vellin.startingPopulation)}
  Living range:     ${fmt(vMin)} – ${fmt(vMax)}
  Typical (p25–p75) ${fmt(vp25)} – ${fmt(vp75)}
  Median:           ${fmt(vp50)}
  Mean:             ${fmt(vMean)}
  5th percentile:   ${fmt(vp5)}   (this is what "low" looks like)
  95th percentile:  ${fmt(vp95)}  (this is what "high" looks like)
  Oscillation CV:   ${pct(vCV)}  — ${vCV > 0.3 ? 'strong, predictable swings' : vCV > 0.15 ? 'moderate swings' : 'gentle variation'}
`)

if (vellinCrashes.length > 0) {
  console.log(`CRASH PROFILE (${vellinCrashes.length} events across ${RUNS} runs):`)
  console.log(`  Typical crash: ${pct(median(crashDrops))} drop in one cycle`)
  console.log(`  Crash range:   ${pct(Math.min(...crashDrops))} – ${pct(Math.max(...crashDrops))} drop`)
  console.log(`  Pop at crash:  ${fmt(Math.min(...crashPops))} – ${fmt(Math.max(...crashPops))}, median ${fmt(median(crashPops))}`)
  console.log(`  Pop pre-crash: ${fmt(Math.min(...crashPrevPops))} – ${fmt(Math.max(...crashPrevPops))}, median ${fmt(median(crashPrevPops))}`)
  if (recTimes.length > 0) {
    console.log(`  Recovery time: ${Math.min(...recTimes)}–${Math.max(...recTimes)} cycles, median ${Math.round(median(recTimes))}`)
  }
  console.log(`  First crash cycle (across runs): ${vellinCrashes.map(r => r.crashCycle).sort((a,b)=>a-b)[0]}`)
}

console.log(`
RELATIONSHIP CONTEXT:
  Primary food:     Feltmoss (highgrowth, abundant — typical pop ${fmt(percentile((allPopHistory['feltmoss'] ?? []).filter(p=>p>0), 50))})
  Primary predators: Keth (highgrowth flyer), Skethran (ranging, highgrowth/understory split)
  At p95 population: Feltmoss is likely under pressure from Vellin grazing
  At p5  population: Vellin may be in crisis or post-crash recovery
`)

console.log(`SUGGESTED OBSERVATION DETAIL SENTENCES (Vellin):`)
console.log(`
These sentences are grounded in simulation data. Numbers in [brackets] are
the actual values — round or phrase them for the authored pool.

SIGHTED tier (just observed, no context yet):
  "Vellin — dense canopy grazers, ${fmt(vp50)} strong by current count."
  "Movement in clusters. Hard to get an exact number at this distance."
  "First visual confirmation. They're larger than the catalog illustration suggested."
  "Several dozen visible from the observation point. Population unknown — estimate only."
  "Grazing actively in the upper Highgrowth stratum. Haven't seen them descend."

KNOWN tier (baseline understood, patterns forming):
  "Down to around ${fmt(vp25)} — low end of what I've recorded, but still within range."
  "Population holding near ${fmt(vp50)}. Stable stretch, no pressure from above."
  "At ${fmt(vp95)} they're visibly crowding the canopy edge — I can hear them from camp."
  "Keth ranging widely today. Vellin have compressed to the upper growth, clustering tighter."
  "Feltmoss coverage has retreated noticeably. Vellin numbers should follow within a few cycles."
  "Third week of steady growth. They're spreading into the understory margins now."
  "The ${fmt(vp75)}-range feels like their comfort level — enough Feltmoss, light Keth pressure."

UNDERSTOOD tier (relationships mapped, predictions forming):
  "Classic post-crash pattern — Keth numbers are still dropping. Vellin should rebound in ${Math.round(median(recTimes))} cycles or so."
  "The Feltmoss crash is going to reach them. I'd put Vellin crisis at 4–6 cycles out."
  "They're at ${fmt(vp5)}. Not extinction territory yet, but close. Keth will pull back once they notice."
  "Pre-crash signature: clustered, skittish, not ranging. Last time I saw this they dropped ${pct(median(crashDrops))} the next cycle."
  "Vellin at ${fmt(vp95)} means Feltmoss is overdue for a correction. The cycle is about to turn."
  "Holding at ${fmt(vp50)} while Keth is high — Skethran must be drawing off the predation pressure."

MODELED tier (full predictive understanding):
  "Vellin at ${fmt(vp25)} with Keth declining and Feltmoss recovering — textbook setup for a rebound."
  "They're ${fmt(vp50)} right now. I'd expect a surge to ${fmt(Math.round(vp75 * 1.1))}–${fmt(vp95)} within 8–10 cycles if Keth stays quiet."
  "The crash pattern is consistent: they drop ${pct(median(crashDrops))} in a single cycle, then ${Math.round(median(recTimes))} cycles to recover. Watch for the Keth lag."
  "Both predator lines are suppressed. Vellin has a clear window — they'll take it to the canopy ceiling before this is over."
  "I've mapped this oscillation across ${RUNS} reference periods now. The floor is around ${fmt(vp5)}, ceiling around ${fmt(vp95)}. We're at the start of an upswing."
`)

// ─── 5. Event text prompts by event type ─────────────────────────────────────

section('5. WRITING PROMPTS BY EVENT TYPE')
console.log(`
For each event type, actual population values at time of firing. Use these
ranges when writing observation_detail and reaction templates.
`)

const eventTypes = [
  'populationCrisis', 'populationSurge', 'extinctionWarning',
  'populationLow', 'extinction', 'populationStable',
]

for (const type of eventTypes) {
  const events = allEventLog.filter(e => e.type === type)
  if (events.length === 0) continue

  console.log(`${type.toUpperCase()} (${events.length} events across all runs):`)

  // Breakdown by species
  const bySpecies = {}
  for (const e of events) {
    if (!bySpecies[e.speciesId]) bySpecies[e.speciesId] = []
    bySpecies[e.speciesId].push(e)
  }

  for (const [id, evs] of Object.entries(bySpecies).sort((a, b) => b[1].length - a[1].length)) {
    const def    = SPECIES_DEFS.find(d => d.id === id)
    const pops   = evs.map(e => e.pop)
    const prevs  = evs.map(e => e.prevPop)
    const cycles = evs.map(e => e.cycle)

    console.log(`  ${(def?.name ?? id).padEnd(12)} ×${evs.length}  ` +
      `pop: ${fmt(Math.min(...pops))}–${fmt(Math.max(...pops))} (med ${fmt(median(pops))})  ` +
      `prev: ${fmt(Math.min(...prevs))}–${fmt(Math.max(...prevs))}  ` +
      `cycles: ${cycles.sort((a,b)=>a-b).slice(0,6).join(',')}${cycles.length > 6 ? '…' : ''}`)
  }
  console.log('')
}

// ─── 6. Oscillation phase relationships ──────────────────────────────────────

section('6. PREDATOR / PREY OSCILLATION PHASE RELATIONSHIPS')
console.log(`
For each predator/prey pair, typical cycle offset between predator surge and
prey crisis. This is the lag between food web events — useful for writing
compound events and temporal context.
`)

const pairs = [
  { pred: 'keth',     prey: 'vellin',   label: 'Keth → Vellin' },
  { pred: 'skethran', prey: 'vellin',   label: 'Skethran → Vellin' },
  { pred: 'skethran', prey: 'woldren',  label: 'Skethran → Woldren' },
  { pred: 'mordath',  prey: 'brack',    label: 'Mordath → Brack' },
  { pred: 'mordath',  prey: 'torrak',   label: 'Mordath → Torrak' },
  { pred: 'mordath',  prey: 'woldren',  label: 'Mordath → Woldren' },
]

for (const { pred, prey, label } of pairs) {
  const predSurges = allEventLog
    .filter(e => e.speciesId === pred && e.type === 'populationSurge')
    .map(e => e.cycle)
  const preyCrises = allEventLog
    .filter(e => e.speciesId === prey && (e.type === 'populationCrisis' || e.type === 'extinctionWarning'))
    .map(e => e.cycle)

  if (predSurges.length === 0 || preyCrises.length === 0) {
    console.log(`  ${label.padEnd(28)}  insufficient data`)
    continue
  }

  // For each predator surge, find the nearest prey crisis and compute lag
  const lags = []
  for (const surgeCycle of predSurges) {
    // nearest crisis after the surge
    const after = preyCrises.filter(c => c >= surgeCycle)
    if (after.length > 0) lags.push(Math.min(...after) - surgeCycle)
  }

  if (lags.length === 0) {
    console.log(`  ${label.padEnd(28)}  no crisis follows surge in this dataset`)
    continue
  }

  const lagMed = Math.round(median(lags))
  const lagMin = Math.min(...lags)
  const lagMax = Math.min(Math.max(...lags), 20)   // cap display at 20
  const sameCount = lags.filter(l => l === 0).length
  console.log(`  ${label.padEnd(28)}  lag: ${lagMin}–${lagMax} cycles (median ${lagMed})` +
    (sameCount > 0 ? `  ${sameCount} same-cycle co-occurrences` : ''))
}

console.log('')
