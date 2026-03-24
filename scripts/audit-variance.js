#!/usr/bin/env node
// World variance audit — run with:  node scripts/audit-variance.js [seedCount]
//
// Runs N simulations across sequential seeds and reports whether first-extinction
// timing and survival distributions match the GDD targets. Use this to verify
// coefficient or variance changes don't break the target distribution.
//
// Usage:
//   node scripts/audit-variance.js        # 500 runs (default)
//   node scripts/audit-variance.js 100    # quicker smoke check
//   node scripts/audit-variance.js 1000   # full statistical confidence

import { createInitialState, runCycles } from '../src/simulation/engine.js'

const SEED_COUNT    = parseInt(process.argv[2] || '500', 10)
const CYCLES        = 500
const TOTAL_SPECIES = 11
const COLLAPSE_FLOOR = 5   // survivors at c500 below this = collapsed

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const green  = s => `\x1b[32m${s}\x1b[0m`
const red    = s => `\x1b[31m${s}\x1b[0m`
const yellow = s => `\x1b[33m${s}\x1b[0m`
const dim    = s => `\x1b[2m${s}\x1b[0m`
const bold   = s => `\x1b[1m${s}\x1b[0m`
const pass   = l  => `${green('✓')} ${l}`
const fail   = l  => `${red('✗')} ${l}`
const warn   = l  => `${yellow('⚠')} ${l}`

function pct(n, total) { return (n / total * 100).toFixed(1) }
function bar(frac, width = 30) {
  const filled = Math.round(frac * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

// ─── Per-run helpers ──────────────────────────────────────────────────────────

// Cycle of the first extinction event, or null if none occurred.
function findFirstExtinction(events) {
  const ev = events.find(e => e.type === 'extinction')
  return ev ? ev.cycle : null
}

// Count species alive at or past `atCycle`.
// Uses extinctCycle recorded in each species history.
function countSurvivors(state, atCycle) {
  return state.species.filter(sp =>
    sp.history.extinctCycle === null || sp.history.extinctCycle > atCycle
  ).length
}

function didCollapse(state) {
  return countSurvivors(state, CYCLES) < COLLAPSE_FLOOR
}

// ─── Audit runner ─────────────────────────────────────────────────────────────

function runAudit(seedCount) {
  const results = []

  process.stdout.write(`Running ${seedCount} simulations`)
  const tick = Math.max(1, Math.floor(seedCount / 40))

  for (let i = 0; i < seedCount; i++) {
    if (i % tick === 0) process.stdout.write('.')

    const state0 = createInitialState(i)
    const { state, events } = runCycles(state0, CYCLES)

    results.push({
      seed:             i,
      firstExtinction:  findFirstExtinction(events),
      survivorsAt100:   countSurvivors(state, 100),
      survivorsAt500:   countSurvivors(state, CYCLES),
      collapsed:        didCollapse(state),
    })
  }

  process.stdout.write('\n')
  return results
}

// ─── Distribution report ──────────────────────────────────────────────────────

function report(results) {
  const n = results.length

  // ── First extinction timing ──────────────────────────────────────────────

  const extBefore50  = results.filter(r => r.firstExtinction !== null && r.firstExtinction < 50)
  const ext50to100   = results.filter(r => r.firstExtinction !== null && r.firstExtinction >= 50 && r.firstExtinction < 100)
  const ext100to200  = results.filter(r => r.firstExtinction !== null && r.firstExtinction >= 100 && r.firstExtinction < 200)
  const extAfter200  = results.filter(r => r.firstExtinction !== null && r.firstExtinction >= 200)
  const extNever     = results.filter(r => r.firstExtinction === null)

  // ── Survivors at c500 ───────────────────────────────────────────────────

  const surv8to11  = results.filter(r => r.survivorsAt500 >= 8)
  const surv5to7   = results.filter(r => r.survivorsAt500 >= 5 && r.survivorsAt500 < 8)
  const survUnder5 = results.filter(r => r.survivorsAt500 < 5)
  const collapsed  = results.filter(r => r.collapsed)

  // ── Check targets ───────────────────────────────────────────────────────

  const checks = {
    extBefore50:  extBefore50.length  / n < 0.05,
    ext50to100:   ext50to100.length   / n >= 0.50,  // target ~60%, accept ≥50%
    extNever:     extNever.length     === 0,
    surv8to11:    surv8to11.length    / n >= 0.60,  // target ~70%, accept ≥60%
    survUnder5:   survUnder5.length   / n < 0.05,
    collapseRate: collapsed.length    / n < 0.03,
  }

  // ── Print ────────────────────────────────────────────────────────────────

  console.log('\n' + bold('First extinction timing') + dim(` (${n} runs)`))

  const extRows = [
    { label: 'Before cycle 50',  count: extBefore50.length,  target: '< 5%',  pass: checks.extBefore50 },
    { label: 'Cycles 50–100',    count: ext50to100.length,   target: '~60%',  pass: checks.ext50to100 },
    { label: 'Cycles 100–200',   count: ext100to200.length,  target: '~30%',  pass: null },
    { label: 'After cycle 200',  count: extAfter200.length,  target: ' ~5%',  pass: null },
    { label: 'Never',            count: extNever.length,     target: '  0%',  pass: checks.extNever },
  ]
  for (const row of extRows) {
    const f = row.count / n
    const b = bar(f)
    const p = pct(row.count, n)
    const marker = row.pass === null ? dim('  ') : row.pass ? green('✓ ') : red('✗ ')
    console.log(`  ${marker}${row.label.padEnd(18)} ${dim(b)} ${String(p).padStart(5)}%  ${dim('target ' + row.target)}`)
  }

  if (extNever.length > 0) {
    // Show first few seeds with no extinction for debugging
    const seeds = extNever.slice(0, 5).map(r => r.seed).join(', ')
    console.log(dim(`    No-extinction seeds: ${seeds}${extNever.length > 5 ? ` (+${extNever.length - 5} more)` : ''}`))
  }

  console.log('\n' + bold('Survivors at cycle 500'))

  const survRows = [
    { label: '8–11 species',  count: surv8to11.length,  target: '~70%',  pass: checks.surv8to11 },
    { label: '5–7 species',   count: surv5to7.length,   target: '~25%',  pass: null },
    { label: 'Under 5',       count: survUnder5.length, target: ' <5%',  pass: checks.survUnder5 },
  ]
  for (const row of survRows) {
    const f = row.count / n
    const b = bar(f)
    const p = pct(row.count, n)
    const marker = row.pass === null ? dim('  ') : row.pass ? green('✓ ') : red('✗ ')
    console.log(`  ${marker}${row.label.padEnd(18)} ${dim(b)} ${String(p).padStart(5)}%  ${dim('target ' + row.target)}`)
  }

  // Survivor distribution histogram
  console.log('\n' + dim('  Survivor count distribution:'))
  const survHist = {}
  for (const r of results) survHist[r.survivorsAt500] = (survHist[r.survivorsAt500] || 0) + 1
  for (let k = TOTAL_SPECIES; k >= 0; k--) {
    if (!survHist[k]) continue
    const f = survHist[k] / n
    const b = bar(f, 20)
    console.log(dim(`    ${String(k).padStart(2)} species  ${b} ${pct(survHist[k], n)}%`))
  }

  // ── Collapse rate ─────────────────────────────────────────────────────────

  const collapseMarker = checks.collapseRate ? green('✓') : red('✗')
  console.log(`\n  ${collapseMarker} Collapse rate  ${pct(collapsed.length, n)}%  ${dim('target <3%')}`)

  // ── Early exit survivors at c100 ──────────────────────────────────────────

  const avg100 = results.reduce((s, r) => s + r.survivorsAt100, 0) / n
  console.log(dim(`\n  Avg survivors at c100: ${avg100.toFixed(1)} / ${TOTAL_SPECIES}`))

  // ── Summary ───────────────────────────────────────────────────────────────

  const allPass = Object.values(checks).every(Boolean)
  console.log('\n' + bold('═'.repeat(60)))
  if (allPass) {
    console.log(bold(green('Distribution targets met ✓')))
  } else {
    console.log(bold(red('Distribution targets NOT met')))
    const failing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
    console.log(red(`  Failed: ${failing.join(', ')}`))
    console.log(dim('  Tune variance ranges in worldgen.js — not base coefficients.'))
  }
  console.log('')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(bold('\nECHOSPHERE — world variance audit'))
const results = runAudit(SEED_COUNT)
report(results)
