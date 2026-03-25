#!/usr/bin/env node
// Headless simulation test — run with:  node scripts/simulate.js
//
// Runs N independent 500-cycle simulations with different seeds and checks
// whether ecosystem dynamics meet the design criteria from CLAUDE.md.

import { createInitialState, simulateCycle } from '../src/simulation/engine.js'
import { checkThresholds } from '../src/simulation/triggers.js'

// ─── Config ───────────────────────────────────────────────────────────────────

const RUNS          = 10
const CYCLES        = 500
const EARLY_WINDOW  = 50     // "early extinction" means within this many cycles
const POP_MAX       = 10_000
const EVENT_MIN     = 20
const EVENT_MAX     = 100
const SURVIVE_MIN   = 6
const TOTAL_SPECIES = 11
const FLAT_CYCLES   = 200
const OSC_CV_MIN    = 0.06   // CV threshold for "visible oscillation"

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const green  = s => `\x1b[32m${s}\x1b[0m`
const red    = s => `\x1b[31m${s}\x1b[0m`
const yellow = s => `\x1b[33m${s}\x1b[0m`
const dim    = s => `\x1b[2m${s}\x1b[0m`
const bold   = s => `\x1b[1m${s}\x1b[0m`
const pass   = l  => `${green('✓')} ${l}`
const fail   = l  => `${red('✗')} ${l}`
const warn   = l  => `${yellow('⚠')} ${l}`

// ─── Stats ────────────────────────────────────────────────────────────────────

function mean(arr) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length
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

// ─── Run simulation, collect events + time series ─────────────────────────────

function simulate(seed) {
  const series = {}
  let state = createInitialState(seed)

  for (const sp of state.species) series[sp.id] = [sp.population]

  const events = []
  for (let i = 0; i < CYCLES; i++) {
    const prev = state
    state = simulateCycle(state)
    events.push(...checkThresholds(prev, state))
    if (i % 5 === 0) {
      for (const sp of state.species) series[sp.id].push(sp.population)
    }
  }

  return { finalState: state, events, series }
}

// ─── Analyse one run ──────────────────────────────────────────────────────────

function analyse(seed, runIndex) {
  const { finalState, events, series } = simulate(seed)

  const stats = finalState.species.map(sp => ({
    id:           sp.id,
    name:         sp.name,
    finalPop:     sp.population,
    extinct:      sp.population === 0,
    extinctCycle: sp.history.extinctCycle,
    peakPop:      sp.history.peakPopulation,
    maxStable:    sp.history.stableCycles,
    earlyExtinct: sp.history.extinctCycle !== null && sp.history.extinctCycle <= EARLY_WINDOW,
  }))

  const extinctions  = stats.filter(s => s.extinct)
  const earlyExt     = extinctions.filter(s => s.earlyExtinct)
  const extBefore100 = extinctions.filter(s => s.extinctCycle !== null && s.extinctCycle <= 100)
  const survivors    = TOTAL_SPECIES - extinctions.length
  const explosions   = stats.filter(s => s.peakPop > POP_MAX)
  // A species is "flat" only if its entire series has very low variance AND
  // it isn't near-extinct (near-extinct species show false-flat near zero).
  const flatLines    = stats.filter(s =>
    !s.extinct &&
    s.finalPop > 10 &&
    cv(series[s.id] || []) < OSC_CV_MIN
  )

  const oscPairs = [
    { pred: 'keth',     prey: 'vellin',  label: 'Keth / Vellin' },
    { pred: 'skethran', prey: 'woldren', label: 'Skethran / Woldren' },
    { pred: 'mordath',  prey: 'brack',   label: 'Mordath / Brack' },
  ].map(({ pred, prey, label }) => {
    const predCV = cv(series[pred] || [])
    const preyCV = cv(series[prey] || [])
    return { label, predCV, preyCV, hasOsc: predCV > OSC_CV_MIN && preyCV > OSC_CV_MIN }
  })

  const checks = {
    noEarlyExtinction:  earlyExt.length === 0,
    notTooManyExt100:   extBefore100.length <= 3,
    noPopExplosion:     explosions.length === 0,
    eventCountOk:       events.length >= EVENT_MIN && events.length <= EVENT_MAX,
    enoughSurvivors:    survivors >= SURVIVE_MIN,
    oscillationVisible: oscPairs.every(o => o.hasOsc),
    noFlatLines:        flatLines.length === 0,
  }

  return {
    seed, runIndex,
    passed:  Object.values(checks).every(Boolean),
    passing: Object.values(checks).filter(Boolean).length,
    total:   Object.keys(checks).length,
    stats, survivors, extinctions, earlyExt, extBefore100,
    explosions, flatLines, events, checks, oscPairs, series,
  }
}

// ─── Per-run report ───────────────────────────────────────────────────────────

function printRun(r) {
  const seedStr = `0x${r.seed.toString(16).padStart(8, '0')}`
  const header = r.passed
    ? green(`Run ${r.runIndex + 1} (${seedStr}): PASS ${r.passing}/${r.total}`)
    : red(`Run ${r.runIndex + 1} (${seedStr}): FAIL ${r.passing}/${r.total}`)
  console.log('\n' + bold(header))

  const c = r.checks
  console.log(`  ${c.noEarlyExtinction
    ? pass('No extinction in first 50 cycles')
    : fail(`Early extinctions: ${r.earlyExt.map(s => s.name).join(', ')}`)}`)
  console.log(`  ${c.notTooManyExt100
    ? pass('≤3 extinctions before cycle 100')
    : fail(`Extinctions before c100: ${r.extBefore100.map(s => s.name).join(', ')}`)}`)
  console.log(`  ${c.noPopExplosion
    ? pass('No population above 10 000')
    : fail(`Explosions: ${r.explosions.map(s => `${s.name}=${Math.round(s.peakPop)}`).join(', ')}`)}`)
  console.log(`  ${c.eventCountOk
    ? pass(`${r.events.length} events (within 30–100)`)
    : fail(`${r.events.length} events (outside 30–100 range)`)}`)
  console.log(`  ${c.enoughSurvivors
    ? pass(`${r.survivors}/${TOTAL_SPECIES} species alive at c${CYCLES}`)
    : fail(`Only ${r.survivors}/${TOTAL_SPECIES} survivors (need ≥${SURVIVE_MIN})`)}`)
  console.log(`  ${c.oscillationVisible
    ? pass('Predator/prey oscillation visible')
    : fail(`Flat: ${r.oscPairs.filter(o => !o.hasOsc).map(o => o.label).join(', ')}`)}`)
  console.log(`  ${c.noFlatLines
    ? pass('No species flat for 200+ cycles')
    : warn(`Flat 200+: ${r.flatLines.map(s => s.name).join(', ')}`)}`)

  for (const o of r.oscPairs) {
    const marker = o.hasOsc ? dim('  ~') : yellow('  →')
    console.log(`${marker} ${dim(`${o.label.padEnd(20)} prey CV=${(o.preyCV * 100).toFixed(1).padStart(5)}%  pred CV=${(o.predCV * 100).toFixed(1).padStart(5)}%`)}`)
  }

  if (r.extinctions.length > 0) {
    console.log(dim(`  Extinctions: ${r.extinctions.map(s => `${s.name} @c${s.extinctCycle}`).join(', ')}`))
  }

  if (!r.passed) {
    console.log(dim('\n  Final populations:'))
    for (const sp of r.stats) {
      const pop  = sp.extinct ? red('EXTINCT') : String(Math.round(sp.finalPop)).padStart(6)
      const peak = String(Math.round(sp.peakPop)).padStart(7)
      const cvPct = `${(cv(r.series[sp.id] || []) * 100).toFixed(1)}%`
      console.log(dim(`    ${sp.name.padEnd(12)} final: ${pop}  peak: ${peak}  CV: ${cvPct}`))
    }
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function printSummary(results) {
  const passed = results.filter(r => r.passed).length
  console.log('\n' + bold('═'.repeat(60)))
  console.log(bold(
    passed === results.length
      ? green(`SUMMARY: ${passed}/${results.length} runs passed ✓`)
      : red(`SUMMARY: ${passed}/${results.length} runs passed`)
  ))

  // Fail mode breakdown
  const failModes = [
    ['Early extinctions (≤50 cycles)',    r => !r.checks.noEarlyExtinction],
    ['Extinctions before c100 (>3)',      r => !r.checks.notTooManyExt100],
    ['Population explosion (>10k)',       r => !r.checks.noPopExplosion],
    ['Event count out of range',          r => !r.checks.eventCountOk],
    ['Too few survivors at c500',         r => !r.checks.enoughSurvivors],
    ['No oscillation',                    r => !r.checks.oscillationVisible],
    ['Flat lines (200+ stable cycles)',   r => !r.checks.noFlatLines],
  ]
  const hasFailures = failModes.some(([, fn]) => results.some(fn))
  if (hasFailures) {
    console.log('\nFail modes:')
    for (const [label, fn] of failModes) {
      const n = results.filter(fn).length
      if (n > 0) console.log(`  ${red('✗')} ${label}: ${n}/${results.length} runs`)
    }
  }

  // Event count stats
  const evCounts = results.map(r => r.events.length)
  console.log(`\nEvent counts — min: ${Math.min(...evCounts)}  max: ${Math.max(...evCounts)}  avg: ${Math.round(mean(evCounts))}`)

  // Event type breakdown (aggregate across all runs)
  const typeCounts = {}
  for (const r of results) {
    for (const ev of r.events) {
      typeCounts[ev.type] = (typeCounts[ev.type] || 0) + 1
    }
  }
  console.log('Event types (total across all runs):')
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(dim(`  ${type.padEnd(24)} ${count}`))
  }

  // Species survival rate
  console.log('\nSpecies survival rate:')
  const survivalCount = {}
  for (const r of results) {
    for (const sp of r.stats) {
      survivalCount[sp.name] = (survivalCount[sp.name] || 0) + (sp.extinct ? 0 : 1)
    }
  }
  for (const [name, count] of Object.entries(survivalCount)) {
    const pct   = Math.round(count / results.length * 100)
    const bar   = '█'.repeat(Math.round(pct / 5)).padEnd(20)
    const color = pct === 100 ? green : pct >= 70 ? yellow : red
    console.log(`  ${name.padEnd(12)} ${color(bar)} ${String(pct).padStart(3)}%`)
  }

  // Average final populations
  console.log('\nAverage final population (surviving runs only):')
  for (const name of Object.keys(survivalCount)) {
    const pops = results.flatMap(r =>
      r.stats.filter(s => s.name === name && !s.extinct).map(s => s.finalPop)
    )
    if (pops.length > 0) {
      console.log(dim(`  ${name.padEnd(12)} avg=${String(Math.round(mean(pops))).padStart(5)}  ` +
        `stddev=${String(Math.round(stddev(pops))).padStart(5)}  ` +
        `CV=${(cv(pops) * 100).toFixed(1)}%`))
    }
  }

  console.log('')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(bold('\nECHOSPHERE — headless simulation test'))
console.log(dim(`${RUNS} runs × ${CYCLES} cycles each\n`))

const results = []
for (let i = 0; i < RUNS; i++) {
  const seed = (0x1a2b3c4d + i * 0x7f3e9a21) >>> 0
  results.push(analyse(seed, i))
  printRun(results.at(-1))
}

printSummary(results)
