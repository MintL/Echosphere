# Session Analysis

## Workflow

Run `app-sim.js` to generate a session summary, then paste it into the prompt below to evaluate writing quality.

```
node scripts/app-sim.js [cycles] [seeds] [options]
```

| Argument | Default | Description |
|---|---|---|
| `cycles` | `200` | Number of cycles to simulate |
| `seeds` | `12345` | Single seed or comma-separated list (e.g. `42` or `12345,99,7`) |
| `--filter <type>` | — | Show only events of this type (e.g. `populationSurge`) |
| `--species <id>` | — | Show only events involving this species (e.g. `vellin`) |
| `--text-only` | — | Skip the stats section, output narrative log only |

**Examples:**
```
node scripts/app-sim.js 300
node scripts/app-sim.js 200 42,99,7
node scripts/app-sim.js 500 --filter populationSurge
node scripts/app-sim.js 200 --species vellin --text-only
node scripts/app-sim.js 200 42,99 --filter populationCrisis --text-only
```

---

## Analysis Prompt

This is a session summary from Echosphere — a passive ecosystem game where events are written in researcher voice (first person, field journal tone).

Analyse this summary and report on the following:

**1. Coherence**
Identify event pairs that should feel causally connected but don't. Note the cycle numbers.

**2. Emotional Arc**
For any species that appears in 5+ events, does the researcher's tone develop over the run? Flag species where late-cycle writing sounds the same as early-cycle.

**3. Repetition**
List any sentence structures or phrases that appear 3+ times and feel formulaic.

**4. Mechanical Text**
Flag events that read like status readouts rather than researcher observations.

**5. Tonal Breaks**
Flag any sentence that doesn't sound like a field researcher writing in a journal.

**6. Highlights**
Note 2–3 moments where the writing actually works well and should be protected.

Be specific with cycle numbers. This output will be used to rewrite specific template variants.

---

## After Analysis

Fixes are surgical: rewrite only the specific template variants flagged, then regenerate the summary using the **same seed** and compare.

Same seed → same events fire in the same order → direct before/after comparison for each flagged cycle.

Running the same seed multiple times after rewrites also stress-tests the dedup system: noticeably different text each run means the rotation is working; identical text means something is stuck.