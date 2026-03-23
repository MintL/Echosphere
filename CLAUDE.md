# ECHOSPHERE - Claude Code Guidelines

## What This Is

A passive/idle PWA where the player is an alien ecosystem researcher. The world runs without them. They return to find things changed. Rare interventions have lasting consequences. See `ECHOSPHERE_GDD.md` for the full design document.

## Tech Stack

- **React** (PWA, mobile-first)
- **IndexedDB** for all game state persistence (via idb or similar)
- **No backend** — everything runs client-side
- **No AI text generation** — all event text is procedurally assembled from authored pools
- **Vite** for bundling

## Architecture Principles

### Simulation is pure functions
Every cycle is a pure function: `simulateCycle(state) => newState`. No side effects, no async. The simulation is a deterministic loop that runs entirely in memory on app open.

```js
function runCycles(state, cycleCount) {
  const events = []
  for (let i = 0; i < cycleCount; i++) {
    state = simulateCycle(state)
    events.push(...checkThresholds(state))
  }
  return { state, events }
}
```

### State is a single serializable object
One state object. Persisted to IndexedDB. Everything needed to render the game lives in it. No derived state stored — compute it on read.

### Event triggers are pure functions
Each trigger takes `(prevState, nextState)` and returns an array of event objects. State mutations are returned as instructions and applied after all triggers run — triggers never mutate state directly.

### Build headless simulation first
Before any UI: build a script that runs thousands of cycles and reports outcomes (extinctions in first 20 cycles, population explosions, boring flat lines). Find coefficient sets that produce interesting stable oscillations across all 11 species over 500+ cycles. Only then build UI.

## Key Design Constants (from GDD)

- **Extinction threshold:** population < 1.0 → force to zero, fire extinction event
- **Batch cycle cap:** max 200 elapsed cycles simulated on app open
- **Real time ratio:** ~1 hour real = 1 in-game cycle
- **Randomness per cycle:** ±10% noise on population change
- **Biome comfort multipliers:** home 1.0, tolerated 0.6, hostile 0.2, incompatible 0.0
- **Migration splinter size:** 10% of population on attempt
- **Starting species:** 11 (3 producers, 7 consumers/predators, 1 decomposer)

## UI Philosophy

- **Mobile-first.** Design for phone, not desktop.
- **No canvas/maps.** The entire UI is text-based with tappable links. No visual map of biomes.
- **Hypertext navigation.** Every species name, biome name, and tool name is a tappable link. The player navigates by curiosity.
- **One home screen.** Most sessions never leave it. Secondary screens are detail views that open and return to home.
- **Information ordered by urgency.** Events above ecosystem state above tools.
- **No tutorial text, no popups, no feature explanations.** The game explains itself through events and researcher voice.

## Design Tone

- Researcher voice throughout. First person, field journal register.
- Events address the researcher by name and reference their specific history.
- Honest uncertainty in decision descriptions — never frame choices as correct/incorrect.
- Extinctions are permanent and meaningful. The log records what was lost.
- The world has agency. It does not wait for the player.

## Skills to Use

| Situation | Skill |
|-----------|-------|
| Building any UI component or screen | `impeccable:frontend-design` |
| Reviewing finished UI for quality | `impeccable:polish` |
| Making UI less generic/AI-looking | `anti-vibe-code` |
| Adapting layout for mobile | `impeccable:adapt` |
| Adding motion/transitions | `impeccable:animate` |
| Simplifying complex code after writing it | `simplify` |

Always use `impeccable:frontend-design` when building screens. This game's UI should feel like a researcher's instrument — stark, purposeful, slightly alien. Not a typical mobile game.

## File Organization (planned)

```
src/
  simulation/       # pure simulation functions, no React
    engine.js       # simulateCycle, runCycles
    triggers.js     # event threshold checks
    migration.js    # migration pressure and attempts
    evolution.js    # evolution candidate logic
  data/
    species.js      # starting 11 species definitions
    catalog.js      # 18 catalog species
    text/           # authored text pools per species and event type
  storage/
    db.js           # IndexedDB read/write
  ui/
    components/     # React components
    screens/        # Home, Species, Biome, Decision, Catalog, Log
  App.jsx
```

## Known Hard Problems (from GDD)

1. **Simulation coefficient balancing** — Lotka-Volterra is chaotic. Solve in the headless script, not in the UI.
2. **Rubber-banding** — Hidden stabilizing forces will be needed. Keep them invisible. Never reference them in writing or UI.
3. **Procedural text fatigue** — Budget serious authoring time. Several thousand sentences needed for a long playthrough to feel alive.

## What NOT to Do

- Don't add a visual map. The GDD explicitly specifies text-based spatial representation.
- Don't add a tutorial or tooltip system.
- Don't store derived state — compute from the single state object.
- Don't add multiplayer. Single player only.
- Don't make decisions feel like puzzles with correct answers.
- Don't add a win state or ending.
