# ECHOSPHERE - Game Design Document
*Version 2.12 - UI model redesigned: log-as-home, sticky header, inline decision records, outcome entries, research events in log, no session summary screen, no species/ecosystem columns*

---

## Overview

**Genre:** Passive / Idle with occasional player intervention
**Platform:** PWA (mobile-first)
**Core Fantasy:** You discovered an alien ecosystem. It lives without you. You return to find a world that has changed in your absence - sometimes thriving, sometimes struggling - shaped by decisions you made long ago.

---

## Core Design Pillars

### 1. The World Has Agency
The ecosystem runs on its own internal logic. Species compete, migrate, evolve, and die regardless of whether the player is watching. The game does not pause. Returning after hours or days should feel like opening a nature documentary that kept filming without you.

### 2. Familiar Rules, Alien Faces
Ecological interactions follow logic players already understand - predator/prey, competition for resources, symbiosis, environmental pressure. But every creature is invented. Strange names, alien appearances, behaviors that feel plausible but foreign. The player learns *this* world's creatures, not Earth's.

### 3. Decisions With Consequences, Not Answers
Player interventions are infrequent and meaningful. There is rarely a clearly correct choice. Introducing a new predator might stabilize one biome and destabilize another. Guiding an evolution solves today's problem and creates tomorrow's. The player is a naturalist who occasionally intervenes - not a god who controls.

### 4. Surprise as the Primary Reward
The core loop reward is not numbers going up. It is returning to find something unexpected: a species crossed a biome border, two populations merged into a hybrid niche, an extinction cascade triggered something dormant. The world generates stories the player didn't script.

---

## The World

### Setting
A single contained region on an alien planet. Not the whole world - one area, geologically isolated, that functions as a complete ecosystem. Think a highland plateau, a coastal basin, or a crater interior. Bounded, knowable, but complex enough to surprise.

### Biomes
The region contains three distinct biomes with sharp but permeable borders. Borders are dynamic - biomes slowly expand and contract over time, creating pressure on border species. The Fringe zones that emerge between biomes are transitional areas, not separate biomes.

**The three biomes:**

| Biome | Character | Base Conditions |
|-------|-----------|-----------------|
| Highgrowth | Dense upper layer, light-rich, fast metabolism, high competition | Abundant energy, rapid growth cycles, high turnover, crowded |
| Understory | Dark lower layer, slow and ancient, decomposers and recyclers | Low light, slow time scale, long-lived creatures, high stability |
| Scorch Flats | Superheated mineral crust, harsh and exposed, armored specialists | Extreme heat, mineral-rich surface, chemosynthetic producers, low diversity but resilient |

### Biome Personalities

**Highgrowth** is the most immediately readable biome - dense, competitive, alive with activity. Events here are frequent and fast-moving. Populations rise and crash quickly. It is the most dynamic part of the ecosystem and the easiest for the researcher to observe early on.

**Understory** moves on a different time scale. Events here are rare but significant. Species are long-lived and slow to change. What happens in the Understory tends to be subtle until it isn't - a shift that has been building for 40 cycles suddenly becoming visible. The researcher learns to pay close attention to quiet signals from this biome.

**Scorch Flats** is the harshest and most alien of the three. Low diversity but extreme resilience - the species here are unlike anything in the other biomes. Events are infrequent but dramatic. Crossings into or out of Scorch Flats are rare and almost always significant.

### The Fringe Zones

The Fringe is not a fixed biome but emerges wherever two biomes border each other. Each Fringe has its own character:

**Highgrowth/Understory Fringe** - the richest border. Where light fades into dark. High biodiversity, frequent crossings, the most porous boundary in the ecosystem.

**Highgrowth/Scorch Flats Fringe** - the volatile border. Dense growth meeting extreme heat. High drama, difficult crossings, most crisis events originate here. The researcher may develop a shorthand name for it over time.

**Understory/Scorch Flats Fringe** - the deep strange border. Rare crossings. Things that move between these two biomes are the most alien creatures in the ecosystem.

### Researcher-Coined Fringe Names
After enough events at a particular border the researcher may coin a shorthand name in the journal:

> *Cycle 22 - I've started calling the southern border where Highgrowth meets Scorch Flats the Char Line. Everything that happens there is either burning or trying not to.*

These names are personal and optional - they appear in the log but do not replace the formal Fringe designations in the UI.

---

## Creatures

### Design Philosophy
Every creature has:
- An invented name (generated or designed)
- A readable ecological role (filter feeder, apex predator, decomposer, etc.)
- One or two distinctive traits that make it memorable
- A biome affiliation (primary habitat + tolerance for others)
- A pool of 8-12 observational detail sentences used in event generation

Creatures are not described with stats. They are described with behaviors. The player learns them through observation, not tooltips.

### Ecological Roles
- **Producers** - energy base, equivalent to plants but alien in form
- **Primary consumers** - graze on producers, high population density
- **Secondary consumers** - hunt primary consumers, population regulated by prey
- **Apex predators** - few in number, large ecological impact
- **Decomposers** - break down dead matter, regulate nutrient cycling
- **Specialists** - narrow niche, highly adapted, fragile but ecologically important

### Extinction
Extinction is permanent. A species that disappears is gone from that world forever. It becomes part of the researcher's log - a record of what existed and what was lost.

Extinct species leave a vacant niche behind. This vacancy creates downstream pressure on the ecosystem: neighboring species face new competitive dynamics, evolutionary pressure accelerates in adjacent roles, and the researcher may introduce a new species to fill the gap. Sometimes nothing fills it, and the ecosystem permanently simplifies - which can cascade toward broader instability.

### Evolution
Species evolve over time based on environmental pressure. Evolution is not instantaneous - it happens across many in-game time cycles. Players can occasionally guide an evolution when a species reaches a threshold, but cannot force it.

**Evolution directions:**
- Physiological adaptation (survive new biome conditions)
- Behavioral shift (change ecological role)
- Speciation (one species splits into two with different niches)
- Trait amplification (an existing trait becomes extreme)

---

## The Researcher

The player has a persistent researcher identity. They have a name, a log, and a recorded history of every intervention they have made. The ecosystem knows them - not literally, but narratively. Events reference past decisions. The log reads like a field journal accumulated over many cycles.

### The Researcher Log
Every decision the player makes is recorded with its cycle number and outcome. Over time the log becomes a personal geological record of the world - what the researcher introduced, what they guided, what they watched die.

Events are addressed to the researcher directly and reference their specific history:

> *Dr. Voss - the Vellin population you introduced in cycle 4 has reached the Highgrowth/Understory Fringe for the first time.*

> *The last Torrak was recorded in cycle 23. The niche it occupied in the Scorch Flats remains vacant.*

---

## Species Book

The species book is empty at the start of the game. It fills entirely through observation - there is no pre-loaded encyclopedia. Each entry is written by the researcher as they encounter and learn about creatures over time.

### Discovery Arc

Species are encountered before they are understood. The first sighting generates a sparse entry. Details accumulate over cycles as the researcher observes more interactions, behaviors, and relationships.

**Cycle 3 - First Sighting:**

> **? ? ?**
> *First observed: Cycle 3, Scorch Flats border*
>
> Saw something today near the southern Scorch Flats border. Low to the ground, pale coloring, moves in groups of four or five. Skittish - scattered when I got closer. I'm calling them Vellin for now. No idea what they eat or what eats them.
>
> *Ecological role: unknown*
> *Biome: unknown*
> *Population: unknown*

**Cycle 11 - Partial Understanding:**

> **Vellin**
> *First observed: Cycle 3, Scorch Flats border*
>
> Confirmed climbers. They move through the Highgrowth canopy grazing on Feltmoss. They seem to need it in large quantities, which explains why they range so widely. The larger forms I've been calling Keth prey on them from above but rarely successfully. Vellin are fast when threatened.
>
> *Ecological role: Primary consumer*
> *Biome: Highgrowth (confirmed), Highgrowth/Understory Fringe (occasional)*
> *Population: Stable, estimated mid-range*

**Cycle 34 - Intimacy:**

> **Vellin**
> *First observed: Cycle 3 - Named: Cycle 11*
>
> I know them well now. Their populations oscillate on roughly a 6-cycle rhythm - up when Feltmoss is abundant, down when Keth follow them into the upper canopy. They've never crossed into the Understory despite the border being close. Something about the darkness seems to repel them. In cycle 28 I watched an entire group of eleven scatter and regroup in under a minute when a Keth appeared above. They communicate somehow. I don't know how.
>
> *Ecological role: Primary consumer, Highgrowth keystone grazer*
> *Biome: Highgrowth (primary), Highgrowth/Understory Fringe (seasonal)*
> *Population: Cyclical, currently ascending*
> *Interactions: Prey of Keth and Skethran. Grazes Feltmoss. Possible relationship with Grubmere under investigation.*

**Cycle 89 - Extinction:**

> **Vellin** *(extinct)*
> *First observed: Cycle 3 - Named: Cycle 11 - Extinct: Cycle 89*
>
> Gone. The second Keth surge was too much. I found no individuals in the Highgrowth this cycle or last. The Feltmoss is already spreading unchecked across the upper canopy - without Vellin grazing it, the biome will change. I watched them for 86 cycles. I knew how they moved, what scared them, what they needed. The Highgrowth is quieter now in a way I can't quite describe.
>
> *Ecological role: Primary consumer, Highgrowth keystone grazer (historic)*
> *Population: Zero*
> *Niche status: Vacant. Feltmoss expanding.*

### Naming
Species are auto-named by the researcher after several sightings. The name appears naturally in the journal entry - not as a popup or prompt. Players can rename any species by tapping its name in the species book. The log records former names with a *(formerly X)* note. Most players will not rename - but the option exists for those who want full ownership.

---

## Player Role

The player is a **naturalist-observer** with limited intervention capacity.

### What the Player Does NOT Do
- Control creatures directly
- Set population targets
- Generate resources through active play
- Play in real time

### What the Player DOES Do
- Read events and the home screen to understand what changed since their last visit
- Initiate and manage research projects — the primary activity of every session
- Make infrequent decisions when events require a response
- Choose where to place research tools — a meaningful spatial decision that shapes what the researcher learns first
- Spend field data and specimens deliberately on projects, interventions, and introductions
- Introduce a new species from the catalog when extinction opens a vacant niche
- Recognize and name an evolved subpopulation as a distinct species when it has diverged far enough
- Monitor biome health and species populations at a glance between events

### Session Structure
A typical player session is short (2-5 minutes):
1. Open the app — the log opens scrolled to the last-read marker
2. Read new entries below the marker
3. Respond to any crisis cards via the decision modal
4. Collect any completed research rewards
5. Close the app — the world continues

Long sessions (10-20 minutes) happen when a complex event chain is unfolding or a major evolution is occurring.

---

## Research Tools

Tools give the player a physical presence in the world without breaking the passive loop. They feel like a naturalist's field equipment - because that is what they are.

### Starting Kit
The researcher arrives with a minimal kit:
- 2 observation posts
- 1 sample collector
- 1 environmental sensor

Four tools. Four placement decisions. Where the player places them shapes what they learn first, which shapes which species they discover first, which shapes their entire early relationship with the ecosystem.

### Tool Types

**Observation Post** - placed in a biome location. Surfaces more frequent and detailed events from that area. Without one, events still arrive but are less specific and less personal. Two players covering different biomes with their posts will have meaningfully different early games.

**Sample Collector** - attached to a specific species rather than a location. Accelerates the discovery arc for that species - fills in the species book faster. Forces an early commitment: which creature do you want to understand first?

**Environmental Sensor** - monitors biome conditions and gives early warning of shifts before they become crises. Buys the researcher reaction time. Particularly valuable near biome borders where conditions change fastest.

**Future Tools** - unlocked through researcher log entries as the researcher decides they need something new. The narrative earns the mechanic. Could include migration trackers, population counters, symbiosis monitors.

### Tool Placement
Placement is a meaningful spatial decision even without a visual map. The researcher knows where their tools are. Events reference tool locations:

> *Your observation post in the Scorch has been active for 34 cycles. Your sensor in the Rift has been quiet.*

### Unlocking New Tools
New tools become available through researcher log entries - not timers or cycle milestones. After enough observations the researcher writes that they need a better way to track something, and the tool becomes available. The narrative earns the mechanic.

### Tool Destruction
Tools do not degrade through routine use. However, environmental hazard events can destroy equipment - thermal vent surges, biome collapses, extreme population events. This is rare but impactful.

> *Cycle 41 - The thermal vent activity in the Rift intensified overnight. The environmental sensor I placed near the eastern border is gone. I didn't anticipate the expansion being that fast.*

When a tool is destroyed a replacement becomes available to place. Not punitive - just a reset of that tool and a small recovery decision. The destroyed tool becomes a log entry. The researcher underestimated something. That is a story, not a punishment.

---

## Events

Events are the primary moment of player engagement. They surface when the ecosystem reaches a notable state that either requires a decision or simply deserves attention.

### Event Types

**Observation Events** (no decision required)
- A species has crossed into a new biome for the first time
- A population has reached an all-time high
- Two species have developed a symbiotic behavior
- A biome border has shifted significantly

**Decision Events** (player chooses a response)
- A population is collapsing - intervene or let it play out?
- A species is ready to evolve - guide the direction
- A new niche has opened - introduce a species from your catalog?
- Two populations are in direct competition - support one, the other, or neither?
- An environmental shift is affecting a biome - accelerate, slow, or ignore?

**Crisis Events** (urgent, consequence if ignored too long)
- Extinction imminent - a species is days from disappearing
- Cascade risk - one extinction is about to trigger others
- Biome collapse - environmental conditions destabilizing
- Invasive pressure - a border species is rapidly consuming a neighbor biome
- Equipment destroyed by environmental hazard

### Observation Event Triggers

Not every change in the simulation generates an event. Events should feel notable, not constant. The trigger system determines which simulation facts are interesting enough to surface.

**Core principles:**
- Thresholds are relative not absolute - a 10% change means different things at population 1000 vs population 20
- Some events are one-time milestones, others are recurring with cooldowns
- Events about well-known species feel more significant than events about unknown ones
- Tools raise the significance of events for the species or biome they cover

### Event Gating by Knowledge Milestone

Not all events fire for all species at all times. Events are gated by the researcher's current knowledge of the species — a crisis event for a creature the researcher has no name for has no emotional weight and no actionable context. The player cannot intervene on behalf of something they don't understand.

Each species has a knowledge tier based on its current milestones. The tier determines which event types can fire:

| Knowledge tier | Milestones | Events that can fire |
|---|---|---|
| Undiscovered | None | None — species exists in sim, invisible to researcher |
| Sighted | First observed | Sighting events only |
| Known | Named + Role identified | Population thresholds, spatial events, basic relationship events, biome crossings |
| Understood | Behavior mapped | Full palette — crisis events, predator/prey dynamics, migration arcs |
| Modeled | Population modeled | Full palette plus population trend events and intervention suggestions |

**Undiscovered** — the species runs in the simulation and affects the ecosystem, but fires no events. The player has no awareness of it.

**Sighted** — only sighting events fire. "Saw something again near the Scorch border." No population data, no role, no name. The researcher notices a presence, not a status. Population changes, predator pressure, and ecological events are all suppressed — they would be meaningless without context.

**Known** — ecological events begin. Population thresholds, biome crossings, first interactions with other named species. The researcher now has enough context for these to be meaningful. Crisis events are still suppressed — the researcher knows what this creature is but not how it behaves under pressure.

**Understood** — the full event palette unlocks. Crisis events, predator surge events, migration arcs, relationship events. The researcher knows how this species moves, what it eats, what threatens it. A population collapse now has weight because the researcher understands what is being lost.

**Modeled** — no new event types, but population trend events fire with greater precision. Intervention suggestions become more specific. The researcher can see patterns the earlier tiers couldn't resolve.

**Implementation note** — the significance score system already exists and runs per event. Milestone gating sits above it: if a species is below the required tier for an event subtype, the event does not fire at all, regardless of significance score. The gating is binary per subtype, not a significance penalty.

```javascript
const eventTierRequirements = {
  // Discovery
  firstSighting:          "undiscovered",
  subsequentSighting:     "sighted",

  // Population
  populationPeak:         "known",
  populationCrash:        "known",
  populationStable:       "known",

  // Spatial
  firstBiomeEntry:        "known",
  subpopulationStable:    "known",
  biomeBorderCrossing:    "known",

  // Relationship
  firstInteraction:       "known",
  predatorAbsence:        "understood",
  symbiosisConfirmed:     "understood",

  // Crisis
  populationCrisis:       "understood",
  extinctionWarning:      "understood",
  cascadeRisk:            "understood",

  // Population modeling
  populationTrend:        "modeled",
  cycleRhythmDetected:    "modeled"
}

function canFireEvent(eventSubtype, species) {
  const requiredTier = eventTierRequirements[eventSubtype]
  return getKnowledgeTier(species) >= TIER_ORDER.indexOf(requiredTier)
}

const TIER_ORDER = ["undiscovered", "sighted", "known", "understood", "modeled"]

function getKnowledgeTier(species) {
  if (!species.milestones.observed)       return TIER_ORDER.indexOf("undiscovered")
  if (!species.milestones.roleIdentified) return TIER_ORDER.indexOf("sighted")
  if (!species.milestones.behaviorMapped) return TIER_ORDER.indexOf("known")
  if (!species.milestones.populationModeled) return TIER_ORDER.indexOf("understood")
  return TIER_ORDER.indexOf("modeled")
}
```

### Trigger Categories

**Discovery triggers:**
- First sighting threshold crossed for an undiscovered species (see Discovery System)
- Subsequent sighting cooldown fired for an unstudied species
- Posthumous discovery on extinction of a never-sighted species

**Population thresholds:**
- Population crossed above historic peak
- Population dropped below previous low
- Population changed more than 25% in a single cycle
- Population stable for N consecutive cycles (unusually calm)

**Relationship events:**
- Two species observed interacting for the first time
- Symbiotic relationship confirmed between two species
- Species no longer being hunted by its known predator
- Predation rate between two species shifted significantly

**Spatial events:**
- Species observed in a biome for the first time (fires once, never again)
- Species absent from home biome for N cycles
- Biome border shifted by more than threshold amount
- Subpopulation stabilized in new biome after migration attempt

**Knowledge milestones:**
- Species ecological role confirmed
- Species behavior pattern established
- Species named by researcher
- Research milestone unlocked

**Ecosystem state:**
- Biome health crossed a notable threshold
- Food web connection discovered between two species
- Total ecosystem diversity reached a new high

### Code Model

Each trigger is a pure function that takes the current and previous simulation state and returns an array of event objects. The event checker runs after every cycle and collects all fired events.

```javascript
// Each trigger returns an array - multiple events can fire per trigger per cycle
const triggers = [
  checkPopulationPeak,
  checkPopulationCrash,
  checkFirstBiomeEntry,
  checkPredatorAbsence,
  checkBiomeHealthThreshold,
  checkSubpopulationStabilized,
]

// Run all triggers after each cycle
function checkThresholds(prevState, nextState) {
  const events = []
  for (const trigger of triggers) {
    const triggerEvents = trigger(prevState, nextState)
    events.push(...triggerEvents)
  }
  return events
}
```

Each trigger collects all matches across all species and returns them as an array. State mutations (cooldowns, history updates) are returned as instructions and applied externally after all triggers have run - preserving the pure function contract.

```javascript
// Example: population peak trigger - collects all matches
function checkPopulationPeak(prev, next) {
  const events = []
  const mutations = []

  for (const species of next.species) {
    const prevSpecies = getSpecies(prev, species.id)
    if (
      species.population > species.history.peakPopulation &&
      canFireEvent(species, "populationPeak", next.cycle)
    ) {
      events.push({
        type: "observation",
        subtype: "populationPeak",
        speciesId: species.id,
        magnitude: species.population - prevSpecies.history.peakPopulation,
        cycle: next.cycle,
        mutations: [
          { speciesId: species.id, path: "history.peakPopulation", value: species.population },
          { speciesId: species.id, path: "eventCooldowns.populationPeak", value: next.cycle }
        ]
      })
    }
  }
  return events
}

// Example: first biome entry - collects all new entries this cycle
function checkFirstBiomeEntry(prev, next) {
  const events = []

  for (const species of next.species) {
    for (const subpop of species.subpopulations) {
      const alreadySeen = species.history.biomesVisited.includes(subpop.biome)
      if (!alreadySeen && subpop.population > 0) {
        events.push({
          type: "observation",
          subtype: "firstBiomeEntry",
          speciesId: species.id,
          biome: subpop.biome,
          cycle: next.cycle,
          mutations: [
            { speciesId: species.id, path: "history.biomesVisited", append: subpop.biome }
          ]
        })
      }
    }
  }
  return events
}
```

### Cooldown System

Each event type per species tracks when it last fired. Different types have different cooldown periods. One-time events are permanently locked after firing.

```javascript
const cooldownPeriods = {
  populationPeak:        10,
  populationCrash:       5,
  predatorAbsence:       8,
  biomeHealthThreshold:  15,
  firstBiomeEntry:       Infinity,
  speciesNamed:          Infinity,
  subpopulationStable:   Infinity
}

function canFireEvent(species, eventType, currentCycle) {
  const lastFired = species.eventCooldowns[eventType]
  const minCycles = cooldownPeriods[eventType]
  if (minCycles === Infinity) return lastFired === null
  if (lastFired === null) return true
  return currentCycle - lastFired > minCycles
}
```

### Significance Score

Each potential event has a significance score calculated before deciding whether to surface it. The magnitude term is normalized per event subtype since not all events have population-based magnitudes.

```javascript
const SIGNIFICANCE_THRESHOLD = 0.4

function calculateSignificance(event, species) {
  let score = 0

  // Magnitude normalized per subtype - not all events use population change
  if (event.magnitude !== undefined && species.history.peakPopulation > 0) {
    score += Math.abs(event.magnitude / species.history.peakPopulation) * 0.4
  } else {
    // Spatial and relationship events get a flat magnitude contribution
    score += 0.2
  }

  score += Math.min(1 / cooldownPeriods[event.subtype], 1) * 0.3
  score += Math.min(species.history.cyclesObserved / 100, 1) * 0.2
  score += species.hasToolAttached ? 0.1 : 0

  return score
}

function shouldSurfaceEvent(event, species) {
  return calculateSignificance(event, species) >= SIGNIFICANCE_THRESHOLD
}
```

### Event Object Structure

```javascript
{
  id: "evt_0047",
  type: "observation",
  subtype: "populationPeak",
  cycle: 34,
  speciesId: "vellin",
  biome: "highgrowth",
  magnitude: 127,
  significance: 0.72,
  relatedSpecies: [],
  dismissed: false,
  requiresDecision: false,
  decisionDeadline: null,
  mutations: []             // state changes to apply after all triggers run
}
```


The game does not pause for decisions. If the player ignores a decision event, the world continues and the situation resolves on its own - sometimes in the player's favor, sometimes not. Unresolved decisions transform into outcome entries in the log:

> *Cycle 14: The Vorrith population was collapsing. You were asked whether to intervene.*
> *Cycle 34: You never responded. The Vorrith are gone. The niche they occupied in the Scorch is now vacant.*

This is not a punishment. The world has agency. It does not wait.

### Event Pacing
Events should not be constant. The ecosystem should have quiet periods where the player observes without being asked to decide. Rough target: 1-2 decision events per day, with observation events surfacing more frequently as background texture.

### Dashboard Between Events
Even with no pending events, the dashboard always shows something interesting - current population trends, which biome is expanding, which species is thriving. Populations always show directionality:

*Vorrith population: 847, up 12% this cycle*

The ecosystem never fully stabilizes - populations oscillate constantly, biome borders always creep. A healthy ecosystem is not a flat line, it is a stable oscillation.

---

## Event Writing System

Events are generated from simulation data combined with a procedural text system. No AI generation — all text is assembled from authored pools combined at runtime. The simulation generates facts. The writing system turns them into text.

### Template Structure

Every event is built from four slots:

```
[observation_detail] [fact] [context?] [researcher_reaction]
```

Context only appears if relevant history exists. It should be empty most of the time — its power comes from scarcity. When it fires with a specific cycle reference it lands much harder than if it appeared on every event. The system rewards long playthroughs by generating richer, more personal text as history accumulates.

### Relationship-Based Tokens

Templates never hardcode species names or relationships. Instead they use tokens that resolve dynamically from the species' current simulation state. This means the writing system works for every species — including catalog introductions and evolved species that didn't exist at authoring time.

**Available tokens:**

| Token | Resolves to |
|---|---|
| `{species}` | Species name |
| `{homeBiome}` | Primary biome name |
| `{borderBiome}` | Border biome name if applicable |
| `{primaryPredator}` | Highest-population known predator |
| `{primaryFood}` | Primary food source name |
| `{declinePct}` | Population change percentage |
| `{lastCrashCycle}` | Cycle number of most recent crash |
| `{cyclesSinceLow}` | Cycles since population low |
| `{predatorRiseCycles}` | Cycles predator population has been rising |

Tokens resolve at render time:

```javascript
function resolveTokens(template, species, state) {
  const primaryPredator = getPrimaryPredator(species, state)
  const primaryFood = getPrimaryFood(species, state)

  return template
    .replace("{species}", species.name)
    .replace("{homeBiome}", species.homeBiome)
    .replace("{primaryPredator}",
      primaryPredator?.milestones.roleIdentified
        ? primaryPredator.name
        : "something in the " + species.homeBiome)
    .replace("{primaryFood}",
      primaryFood?.milestones.roleIdentified
        ? primaryFood.name
        : "its food source")
    .replace("{declinePct}", Math.abs(getPopulationChangePct(species, state)))
    .replace("{lastCrashCycle}", species.history.lastCrashCycle)
    .replace("{cyclesSinceLow}", getCyclesSinceLow(species, state))
    .replace("{predatorRiseCycles}", getPredatorRiseCycles(primaryPredator, state))
}
```

The knowledge check on `primaryPredator` is important — if the predator hasn't been named yet, the text falls back to a vague description. The researcher doesn't know what's hunting the Vellin yet. The text reflects that.

Relationship resolution picks the most narratively relevant predator or food source from the species' relationship list — highest population, weighted toward species the researcher already knows:

```javascript
function getPrimaryPredator(species, state) {
  return species.eatenBy
    .map(id => getSpecies(state, id))
    .filter(s => s.exists)
    .sort((a, b) => {
      const aScore = a.population * (a.milestones.roleIdentified ? 1.5 : 0.5)
      const bScore = b.population * (b.milestones.roleIdentified ? 1.5 : 0.5)
      return bScore - aScore
    })[0] ?? null
}
```

### Template Pools

Each event subtype has authored pools for each slot. Selections rotate to prevent repetition — the same sentence never fires twice in the same session.

**Example — population crash:**

```javascript
const crashTemplates = {
  observationDetail: [
    "The {homeBiome} was quiet this cycle.",
    "Saw fewer {species} near the {primaryFood} today.",
    "{species} have pulled back toward the northern {homeBiome}.",
    "Scattered groups only. Nothing like their usual density.",
    "The {primaryFood} is barely being touched.",
  ],
  fact: [
    "{species} down {declinePct}%, {primaryPredator} pressure from above.",
    "Numbers down {declinePct}% this cycle.",
    "{primaryPredator} ranging further in. Down {declinePct}% this cycle.",
    "Down {declinePct}% from last cycle.",
    "Population down {declinePct}%. Lowest in {cyclesSinceLow} cycles.",
  ],
  context: [
    "This is the same pattern that preceded the crash in cycle {lastCrashCycle}.",
    "Third consecutive decline.",
    "They recovered last time. Barely.",
    "{primaryPredator} numbers have been rising for {predatorRiseCycles} cycles.",
  ],
  reaction: [
    "Still learning what {primaryPredator} pressure means for them.",
    "They usually recover. Usually.",
    "I know this pattern. I don't like it.",
    "Something has shifted.",
    "I'm not confident they do it again.",
  ]
}
```

### Observation Detail Pools

The observation detail pool is the soul of each species. It is the one place where species-specific authoring is essential and irreplaceable — this is where Vellin feels like Vellin and not just "primary consumer, Highgrowth." Templates handle mechanical facts. Observation details carry the creature's personality and the researcher's growing intimacy with it.

Each pool is divided by knowledge tier. Early entries feel sparse and uncertain. Later entries feel intimate and specific. The pool uses the same token system as templates so relationship names stay dynamic.

**What the pool should contain:**
- Behavioral observations — how they move, rest, feed, react to threat
- Physical details — what they look like in motion, at rest, up close. Alien but specific.
- Unanswered questions — especially in early tiers, things the researcher doesn't know yet
- Relationship glimpses — brief observations of interactions with other species, using tokens
- Temporal details — time of cycle activity, seasonal patterns, changes noticed over many cycles

**Example — Vellin observation pool:**

```javascript
const vellinObservationPool = {
  sighted: [
    "Something moving through the upper growth. Groups of four or five.",
    "Pale coloring. Hard to see against the {primaryFood}.",
    "Skittish. Scattered before I could get close.",
    "Saw them again near the canopy edge. Fast movers.",
  ],
  known: [
    "They move in loose groups, always faster near the canopy edge.",
    "The way they graze — methodical, almost ritualistic. Same patches in the same order.",
    "Resting in clusters in the mid-canopy today. Hard to count when they're still.",
    "A {primaryPredator} shadow crossed above. The whole group scattered in under a minute.",
    "Found one separated from its group near the {homeBiome} border. Moved differently alone.",
    "They communicate when threatened. I still don't know how.",
    "The young ones stay near the center of the group. The larger ones range further.",
  ],
  understood: [
    "The {primaryPredator} pressure is changing how they move. More time in the lower canopy than usual.",
    "Watched a group of eleven navigate around a {primaryPredator} territory for most of a cycle. Methodical.",
    "They don't sleep the way I expected. Short rest cycles, never all at once. Someone is always watching.",
    "The grazing rhythm has shifted — heavier feeding early cycle, almost nothing by midday. Following the {primaryFood} growth patterns.",
    "Saw two groups merge at the northern edge and separate again later. Some kind of exchange. Couldn't determine what.",
    "The older individuals move differently. Slower but more deliberate. They seem to know where the {primaryPredator} will be.",
  ],
  modeled: [
    "The 6-cycle population rhythm is holding. Up when {primaryFood} is abundant, down when {primaryPredator} follows them into the upper canopy.",
    "Their ranging patterns are more predictable than I initially thought. The same routes, slightly adjusted each cycle.",
    "I can estimate group size now from sound alone. The specific frequency of their communication changes with density.",
    "The relationship between {species} density and {primaryFood} coverage is almost perfectly inverse. They regulate each other.",
  ]
}
```

Every species pool should contain details that could only apply to that creature. Each pool is a portrait. Below are the simulation-informed pools and writing notes for all eleven species.

---

### Species Observation Pools and Writing Notes

All pools and notes are grounded in actual simulation behaviour across 20 runs × 200 cycles. Population figures and patterns cited here reflect real output from the headless audit.

---

**VELLIN** — primaryConsumer, Highgrowth

*Writing notes:* The most volatile species in the simulation. CV 103.5%, living range 9–818, median only 77. Only 42% of crashes recover within 200 cycles — the researcher's optimism should erode across the late tier. Keth and Skethran are both predators; Skethran is the more frequent crash driver at 12.65 compound events per run vs Keth at 8.25. The predator lag is median 1 cycle — almost simultaneous. The researcher can see the connection forming in real time. Crashes start as early as cycle 14.

```javascript
const vellinObservationPool = {
  sighted: [
    "Something moving through the upper growth. Groups of four or five.",
    "Pale coloring. Hard to see against the {primaryFood}.",
    "Skittish. Scattered before I could get close.",
    "Saw them again near the canopy edge. Fast movers.",
  ],
  known: [
    "They move in loose groups, always faster near the canopy edge.",
    "The way they graze — methodical, almost ritualistic. Same patches in the same order.",
    "Resting in clusters in the mid-canopy today. Hard to count when they're still.",
    "A {primaryPredator} shadow crossed above. The whole group scattered in under a minute.",
    "Found one separated from its group near the {homeBiome} border. Moved differently alone.",
    "They communicate when threatened. I still don't know how.",
    "The young ones stay near the center of the group. The larger ones range further.",
    "Population near 77 — their typical level. Keth pressure is moderate.",
    "At 440 they're crowding the canopy edge. I can hear them from camp.",
  ],
  understood: [
    "The {primaryPredator} pressure is changing how they move. More time in the lower canopy than usual.",
    "Watched a group of eleven navigate around a {primaryPredator} territory for most of a cycle. Methodical.",
    "They don't sleep the way I expected. Short rest cycles, never all at once. Someone is always watching.",
    "The grazing rhythm has shifted — heavier feeding early cycle, almost nothing by midday. Following the {primaryFood} growth patterns.",
    "Saw two groups merge at the northern edge and separate again later. Some kind of exchange. Couldn't determine what.",
    "The older individuals move differently. Slower but more deliberate. They seem to know where the {primaryPredator} will be.",
    "Down to around 23 — low end of what I've recorded. {primaryPredator} still active above.",
    "Pre-crash signature: clustered, skittish, not ranging. Last time I saw this they dropped sharply the next cycle.",
    "At 440 the {primaryFood} is going to feel this. The cycle is about to turn.",
  ],
  modeled: [
    "The oscillation is consistent: floor around 23, ceiling around 440. We're at the start of an upswing.",
    "Classic post-crash setup — {primaryPredator} numbers still dropping. Vellin should rebound in 80–90 cycles.",
    "The {primaryFood} crash is going to reach them. I'd put a Vellin crisis at 4–6 cycles out.",
    "Both predator lines are suppressed. They have a clear window — they'll take it to the canopy ceiling before this is over.",
    "I've mapped this oscillation across many reference periods. The relationship between Vellin density and {primaryFood} coverage is almost perfectly inverse.",
    "Holding at 77 while {primaryPredator} is high — {secondaryPredator} must be drawing off the pressure.",
  ]
}
```

---

**KETH** — secondaryConsumer, Highgrowth

*Writing notes:* A surge species. 394 populationSurge events across 20 runs, almost no crashes. Population ranges 2–270, median 51. Its story is booming when Vellin is abundant and going quiet when it isn't. It cannot enter Understory. The researcher notices it primarily as an aerial presence — hunting from above, diving through the canopy. The lag to Vellin crisis is median 1 cycle: the Keth surge and the Vellin crash happen almost simultaneously. Extinction warnings are rare (only 3 events, all after cycle 133) — Keth almost never dies, it just ebbs.

Pool should feel: territorial, aerial, present as pressure rather than as individual animals. The researcher sees its effects more than it directly.

```javascript
const kethObservationPool = {
  sighted: [
    "Something large moving through the upper canopy. Not {primaryFood}.",
    "Aerial. Fast. Gone before I could track it properly.",
    "A shadow across the upper growth — the {prey} scattered instantly.",
  ],
  known: [
    "{species} ranging widely today — {prey} have compressed to the upper growth.",
    "Counted four in the northern canopy this morning. Territory seems fixed for now.",
    "The diving pattern is distinctive — straight down through the growth, no hesitation.",
    "At 92 they're visible everywhere in the upper {homeBiome}. Pressure on {prey} will show within a cycle.",
    "Quiet today. Either full or the {prey} have moved somewhere I'm not watching.",
  ],
  understood: [
    "The {species} boom always follows the {prey} surge by a cycle or two. Textbook lag.",
    "At 156 — well above their baseline of 60. {prey} won't sustain this pressure long.",
    "They've pushed deeper into {prey} territory than I've seen before. The southern canopy is under constant watch.",
    "Numbers dropping. The {prey} correction is catching up to them.",
  ],
  modeled: [
    "The {species}/{prey} oscillation is the primary rhythm of the {homeBiome}. Everything else moves around it.",
    "At 270 the {prey} population is already in crisis. The {species} surge will peak and collapse within 10 cycles.",
    "Keth quiet, Vellin recovering — this is the stable phase of the cycle. It won't last.",
  ]
}
```

---

**SKETHRAN** — secondaryConsumer, Highgrowth/Understory

*Writing notes:* The most ecologically connected species in the starting roster. Hunts both Vellin and Woldren. 563 surge events across 20 runs. The Skethran→Vellin lag is median 1 cycle (fast, visible), but Skethran→Woldren lag is median 8 cycles (slow, requires the researcher to have been watching long enough to connect it). This is the species that makes the Highgrowth/Understory relationship legible. It is also the only regular check on Woldren besides Mordath. Border position 0.5 — genuinely split between both biomes.

Pool should feel: patient, ranging, the researcher always slightly uncertain which biome it's in today.

```javascript
const skethranObservationPool = {
  sighted: [
    "Something at the {homeBiome}/{borderBiome} border. Ground level, moving slow.",
    "Larger than I expected. Moving between the biomes without hesitation.",
    "Tracks near the Fringe. Something is ranging through here regularly.",
  ],
  known: [
    "{species} in the upper {homeBiome} today. Yesterday they were in the {borderBiome}.",
    "Patient hunters. They wait longer than the {primaryPredator} does before committing.",
    "Saw one follow a {primaryPrey} group for most of a cycle before striking.",
    "They move differently in {borderBiome} — slower, more cautious. The darkness changes them.",
  ],
  understood: [
    "{species} heavy in {homeBiome} right now. {primaryPrey} are going to feel this within a cycle.",
    "The {borderBiome} population of {secondaryPrey} hasn't seen {species} pressure in a while. That's changing.",
    "Counted 139 — well above their median. Both prey populations are under simultaneous pressure.",
    "They're ranging further into {borderBiome} than usual. The {primaryPrey} pressure in {homeBiome} must be easing.",
  ],
  modeled: [
    "{species} is the thread connecting {homeBiome} and {borderBiome} dynamics. When it moves, both biomes shift.",
    "The {secondaryPrey} crash in {borderBiome} is running 8 cycles behind the {species} surge here. Right on schedule.",
    "At 97 — median. Balanced pressure on both prey populations. This is what ecosystem equilibrium looks like.",
  ]
}
```

---

**MORDATH** — apexPredator, all biomes

*Writing notes:* Low population (2–41, median 10), enormous ecological impact. 2.5 biome entries per run, 1.1 cascade risk events per run. The most ecologically active species by event density relative to population. Never crashes (only 6 crisis events across 20 runs, all late cycle). Moves with apparent intention — follows prey. When it leaves a biome, secondary consumers boom. Cannot enter deep Scorch Flats. The researcher takes many cycles to name it.

Pool should feel: rare, significant, each sighting deliberate. The researcher is always slightly awed. Short entries, never casual.

```javascript
const mordathObservationPool = {
  sighted: [
    "Something large. Not Keth. Different movement entirely.",
    "Saw it briefly at the {homeBiome}/{borderBiome} border. Gone before I could confirm.",
    "The other species went quiet. Something moved through.",
  ],
  known: [
    "{species} in the eastern {homeBiome}. Everything within range knew immediately.",
    "It moved slowly. It didn't need to move fast.",
    "Three {primaryPrey} gone from the southern territory. {species} was there yesterday.",
    "Watched it for an hour from distance. It covered ground I've never seen {primaryPrey} cross.",
  ],
  understood: [
    "{species} has shifted toward {borderBiome}. The {secondaryConsumer} populations in {homeBiome} will notice within a few cycles.",
    "It hasn't been in {homeBiome} for twelve cycles. The {prey} are ranging more freely. They shouldn't.",
    "Population at 10 — typical. Its impact has nothing to do with its numbers.",
    "Returned to {homeBiome}. The {secondaryConsumer} surge that built up in its absence will correct quickly.",
  ],
  modeled: [
    "The {species} moves on prey availability, not territory. When it arrives somewhere, something has been building there.",
    "Every time it leaves {homeBiome} the secondary consumers boom. Every time it returns they crash. It is the cycle.",
    "At 25 — above its median of 10. A {species} surge is one of the rarest events in this ecosystem. Something is very right or very wrong.",
  ]
}
```

---

**TORRAK** — primaryConsumer, Scorch Flats

*Writing notes:* 14 extinctions out of 20 runs. Crisis warnings from cycle 19 onward. CV 149.1% — the most volatile species in the simulation. Eats only Scaleweed. Almost no predator pressure except occasional Mordath. Population regulated almost entirely by food availability. Moves like geology — slow, solitary, alien. The researcher senses early that this one is precarious.

Pool should feel: heavy, slow, geological. The researcher's tone should carry quiet fatalism from the mid tier onward. Sightings should feel like observing something ancient that doesn't know it's endangered.

```javascript
const torrakObservationPool = {
  sighted: [
    "Something large and low in the Scorch. Moved so slowly I almost mistook it for terrain.",
    "Armored. Heavy. No apparent awareness of me at all.",
    "Single individual. No others visible across the entire southern flat.",
  ],
  known: [
    "{species} moving across the {primaryFood} field. Takes the same path each cycle.",
    "Solitary. I've never seen two in the same area. They seem to avoid each other.",
    "The carapace reflects the heat. Up close it's almost uncomfortable to watch.",
    "Feeding for hours on a single {primaryFood} patch. Methodical. Slow. Thorough.",
    "Population around 9 — this is normal for them. They've always been sparse.",
  ],
  understood: [
    "{primaryFood} is thinning in the southern flat. {species} population will follow within a few cycles.",
    "Down to 3. They were at 26 when I first named them. The math isn't good.",
    "Saw one moving north — further than I've recorded them ranging. The southern {primaryFood} must be nearly gone.",
    "The {species} and the {primaryFood} are entangled completely. One goes, the other follows.",
  ],
  modeled: [
    "At 109 — the highest I've recorded. The {primaryFood} surplus won't last and neither will this.",
    "The extinction warnings started at cycle 19 in my reference data. They arrive early and often for {species}.",
    "{species} population is a direct readout of {primaryFood} health, with a few cycles lag. Nothing more, nothing less.",
    "Down to 1. I've watched this before. Sometimes they recover from here. Not usually.",
  ]
}
```

---

**WOLDREN** — primaryConsumer, Understory

*Writing notes:* Living range 1–240, median 12. CV 138.3%. 20 extinction warnings across 20 runs, 2 actual extinctions. Never triggers populationCrisis (the crash is too gradual). The researcher barely sees them — they live in permanent darkness and the research tools that cover Understory are different from Highgrowth. Long-lived, slow, genuinely alien. The Skethran→Woldren predation lag is median 8 cycles — slow enough to be invisible without sustained observation.

Pool should feel: rare, dark, ancient. The researcher encounters them infrequently and never feels like they fully understand what they're seeing. Questions outnumber observations.

```javascript
const wolrdrenObservationPool = {
  sighted: [
    "Movement in the deep {homeBiome}. Heavy. Slow. Something large.",
    "First confirmed sighting — floor level, near the {primaryFood} root mass.",
    "Solitary. Barely reacted to my presence. Either it didn't notice or didn't care.",
  ],
  known: [
    "{species} at the root level again. Same location as last cycle. They don't range like the {homeBiome} species do.",
    "Moves on a different time scale. I watched it for two hours and it covered perhaps thirty meters.",
    "Population at 12 — this seems to be their typical density. Very spread across the {homeBiome} floor.",
    "No reaction to the {primaryPredator} passing overhead. Either it didn't register or it knows something I don't.",
  ],
  understood: [
    "{species} at 2. I'm not sure when the decline started — they're hard to count at the best of times.",
    "The {primaryPredator} has been ranging more heavily through {homeBiome}. The {species} numbers are following.",
    "Long-lived. I think some of the individuals I'm seeing now were here when I arrived. That makes the decline harder to watch.",
    "The {primaryFood} is healthy. The pressure is predation, not starvation. That's different.",
  ],
  modeled: [
    "The {primaryPredator}→{species} lag is long — around 8 cycles. By the time I see the crash, the cause is cycles old.",
    "At 240 — the highest recorded. {primaryPredator} must be absent or distracted. This surge won't persist.",
    "The Understory runs on a different clock. What looks stable here can be weeks into a slow collapse already.",
  ]
}
```

---

**BRACK** — primaryConsumer, Scorch Flats/Highgrowth Fringe

*Writing notes:* Lives at the border. Eats both Feltmoss (border-scaled) and Scaleweed. Only Mordath hunts it. 7 extinctions across 20 runs, 15 extinction warnings. The entanglement species — always one producer crash away from a crisis. CV 93.9%. Border position 0.3, so primarily Scorch but opportunistically Highgrowth. The researcher probably finds Brack unglamorous — armored, tough, not particularly dramatic until suddenly it is. The surge events are all very late cycle (156+), suggesting long slow recovery arcs.

Pool should feel: tough, unglamorous, enduring. The researcher respects it without romanticising it. Notes should feel practical until the crisis tier when real concern surfaces.

```javascript
const brackObservationPool = {
  sighted: [
    "Something armored at the {homeBiome}/{borderBiome} Fringe. Heavy.",
    "Moves like the {primaryFood} terrain — slow, low, hard to distinguish at distance.",
    "Single individual. Heading toward the {borderBiome} edge.",
  ],
  known: [
    "{species} working the Fringe today — grazing the {primaryFood} edge near the heat boundary.",
    "Armored heavily. I've watched {primaryPredator} ignore it entirely on most passes.",
    "They seem to exist between two worlds without fully belonging to either.",
    "Population around 13. Sparse but consistent. They don't need large numbers to function.",
  ],
  understood: [
    "The {primaryFood} crash in {borderBiome} is going to find {species} next. They can't graze {secondaryFood} alone.",
    "Down to 9 — close to the floor of what I've recorded. The Fringe is thin right now.",
    "{species} have moved deeper into {homeBiome} than usual. The border {primaryFood} must be exhausted.",
    "Tough species. They've been in crisis three times already and pulled through.",
  ],
  modeled: [
    "{species} population is a trailing indicator of {primaryFood} health in both biomes simultaneously.",
    "At 68 — near their ceiling. The Fringe conditions are favorable on both sides right now. Rare.",
    "The {species} crash always follows a dual producer dip — {primaryFood} and {secondaryFood} both down. Watch for that combination.",
  ]
}
```

---

**GRUBMERE** — decomposer, Understory

*Writing notes:* The invisible species. 20 extinction warnings across 20 runs — every single run. But no populationCrisis events before cycle 60 and no direct sightings in normal observation. The researcher doesn't notice the Grubmere until it's in trouble. Population range 8–273, median 31, CV 95.9%. The pool should reflect that the researcher barely sees them — most entries are indirect evidence, effects rather than sightings. When the extinction warning fires it should feel like a discovery, not a status update.

Pool should feel: almost entirely invisible. Indirect. The researcher observes effects and infers presence. The late tier should feel like suddenly realising how much was depending on something you never really saw.

```javascript
const grubmereObservationPool = {
  sighted: [
    "Movement in the root system — subsurface. Something is down there.",
    "Brief surface appearance near the {homeBiome} floor. Gone before I could get closer.",
    "Tracks in the substrate. Something ranges through here regularly at depth.",
  ],
  known: [
    "Rarely visible. I know they're here from the {primaryFood} recovery rates more than direct observation.",
    "The {homeBiome} floor processes dead matter faster when their population is healthy. Slower now.",
    "Saw one briefly in the root mass. Smaller than expected.",
    "Population at 31 — estimated. They're impossible to count accurately. This is inference.",
  ],
  understood: [
    "The {primaryFood} recovery has slowed noticeably. Grubmere numbers must be down.",
    "Population warning at 29. I've been watching the {homeBiome} health indicators — this was coming.",
    "They don't surface much, but the ecosystem feels different when they're struggling. Harder to define. Heavier.",
    "Realising now how much I've been taking them for granted.",
  ],
  modeled: [
    "The Grubmere extinction warning arrives at cycle 70–90 in most reference runs. It arrives without much warning even then.",
    "Everything that dies in this ecosystem passes through the Grubmere eventually. When they falter, the debt accumulates.",
    "At 273 — the highest recorded. The {homeBiome} has had heavy mortality recently. They're thriving on it.",
    "The {homeBiome} health is directly tied to their population in a way that only becomes obvious when it breaks.",
  ]
}
```

---

**FELTMOSS** — producer, Highgrowth

*Writing notes:* CV 51.5%, 411 surge events across 20 runs. The most abundant energy source in the ecosystem. Surge events dominate — it mostly thrives. Crashes are rare (11 populationCrisis events) but impactful. The researcher notices it everywhere and takes it for granted until a crash. Population range 65–1,194, median 672. It is the foundation the Highgrowth is built on.

Pool should feel: ubiquitous, easy to overlook, the background of everything. When it appears in observation details it should feel like noting the air quality — noticed mainly when something is wrong.

```javascript
const feltmossObservationPool = {
  sighted: [
    "Dense coverage across the upper {homeBiome}. The baseline here.",
    "Covers every available surface in the upper growth. Hard to imagine this biome without it.",
  ],
  known: [
    "{species} at 1,006 — well above baseline. The {homeBiome} is rich right now.",
    "Coverage thinning in the northern section. The {primaryConsumer} pressure is showing.",
    "Recovery underway after the grazing pressure eased. Growing back fast.",
  ],
  understood: [
    "The {species} crash will reach the {primaryConsumer} within a few cycles. The Highgrowth food web runs on this.",
    "At 65 — lowest recorded. If it doesn't recover, the whole upper {homeBiome} shifts.",
    "Unchecked coverage spreading — {primaryConsumer} numbers must be down. The balance is off.",
  ],
  modeled: [
    "{species} is the Highgrowth. Everything else is downstream of it.",
    "The oscillation here is driven by {primaryConsumer} grazing cycles. Predictable once you know the rhythm.",
  ]
}
```

---

**NIGHTROOT** — producer, Understory

*Writing notes:* CV 27.4% — the most stable species in the simulation. 518 surge events, zero populationCrisis events. Almost never threatened. Grows in permanent darkness from mineral seepage. The quiet foundation of the deep layer. The researcher probably forgets about it for long stretches.

Pool should feel: stable, ancient, barely observed. The researcher checks in occasionally and finds it unchanged.

```javascript
const nightrootObservationPool = {
  sighted: [
    "Pale root mass covering the {homeBiome} floor. Has to be old — it's everywhere.",
    "Barely visible in the low light. Slow growth. This has been here a long time.",
  ],
  known: [
    "{species} at 384 — close to its median. Stable as ever.",
    "The {homeBiome} floor is healthy when {species} is healthy. It usually is.",
    "Grows slowly enough that I rarely notice change. That's not a problem. That's what it does.",
  ],
  understood: [
    "The {primaryConsumer} pressure on {species} has been light. It's thriving quietly.",
    "At 136 — lower than I've seen it. Something is different in the deep {homeBiome}.",
  ],
  modeled: [
    "{species} is the bedrock of the {homeBiome}. It almost never fails. Almost.",
    "The stability here is deceptive — it's slow to damage and slow to recover.",
  ]
}
```

---

**SCALEWEED** — producer, Scorch Flats

*Writing notes:* CV 24.8%, the second most stable producer. 1,781 surge events across 20 runs — by far the most of any species. Crashes are real (8 populationCrisis events) but recovery is reliable (100% recovered within run). The only energy source that can survive the Scorch heat. Irreplaceable. The researcher might initially mistake it for geological formation.

Pool should feel: harsh, mineral, alien. Not lush like Feltmoss — sparse, armored, almost inorganic in appearance.

```javascript
const scaleweedObservationPool = {
  sighted: [
    "Mineral-crusted patches across the southern flat. Initially thought it was geology.",
    "Sparse. Very sparse. But covering more area than it first appears.",
    "The only living thing in the southern {homeBiome} that looks like it belongs here.",
  ],
  known: [
    "{species} at 258 — typical for the {homeBiome}. Never abundant but always present.",
    "The armored surface survives the heat that would kill anything from the other biomes.",
    "Recovery after the last grazing pressure was slower than Feltmoss would manage. The Scorch doesn't hurry anything.",
  ],
  understood: [
    "Coverage thinning in the eastern flat. The {primaryConsumer} pressure is consistent and the {species} can only recover so fast.",
    "At 73 — lowest recorded. The Scorch Flats food web depends entirely on this.",
    "{species} recovery underway. Slow but reliable. It always comes back.",
  ],
  modeled: [
    "{species} has crashed 8 times across reference runs. It has recovered every single time. The Scorch is harsh but stable.",
    "The {primaryConsumer} populations of the Scorch Flats oscillate around {species} availability. Everything here does.",
  ]
}
```

### Species History Flags

Each species tracks flags that shape slot selection — particularly which reaction tier fires and whether the context slot is available:

- `cyclesObserved` — total time since first sighting, drives tonal register
- `cyclesSinceRoleIdentified` — time since named, drives reaction tier selection
- `eventsInvolving` — total surfaced events, proxy for researcher familiarity
- `previousCrashes` — number of past population crises
- `lastCrashCycle` — cycle number of most recent crisis, used in context slot
- `crossedBiome` — whether they have migrated before
- `symbioticPartners` — known relationships with other species

### Researcher Reaction Tiers

The reaction slot selects from different pools based on relationship length. Three tiers:

- **Early** (`cyclesSinceRoleIdentified` < 10) — uncertainty, observation, not yet sure what things mean
- **Mid** (`cyclesSinceRoleIdentified` 10–30) — familiarity, pattern recognition, tentative predictions
- **Late** (`cyclesSinceRoleIdentified` > 30) — intimacy, history references, emotional investment

The same population crash at each tier:

**Early:**
> *Saw fewer {species} near the {primaryFood} today. Numbers down {declinePct}% - {primaryPredator} pressure from above. Still learning what this means for them.*

**Mid:**
> *The {species} have pulled back toward the northern {homeBiome}. {primaryPredator} ranging further in. Down {declinePct}% this cycle. They usually recover. Usually.*

**Late:**
> *The upper {homeBiome} was quiet this cycle. {species} taking heavy losses. {declinePct}% decline, {primaryPredator} deep in their range. This is the same pattern that preceded the crash in cycle {lastCrashCycle}. I know this pattern. I don't like it.*

### Authored vs Dynamic

| Component | Authored | Dynamic |
|---|---|---|
| Template strings | Yes — written once per event subtype | No |
| Species names | No | Resolved from state |
| Predator and food names | No | Resolved from relationships |
| Population numbers | No | Resolved from simulation |
| Cycle references | No | Resolved from history |
| Observation detail pool | Yes — per species, per tier | Rotated at runtime |
| Researcher reactions | Yes — per subtype, per tier | Selected by history flags |

### Compound Events

The standard template system treats each event as isolated — one trigger, one text. But the most interesting ecological moments are when multiple things happen simultaneously and are causally related. A Keth population boom and a Vellin population crisis in the same cycle aren't two events — they're one story.

A compound event detection layer runs after the standard trigger pass. It looks at all events generated in the current cycle and checks for causal relationships between them:

```javascript
function detectCompoundEvents(events, state) {
  const compounds = []

  const predatorBooms = events.filter(e => e.subtype === "populationPeak")
  const preyCrashes = events.filter(e => e.subtype === "populationCrash")

  for (const boom of predatorBooms) {
    for (const crash of preyCrashes) {
      const predator = getSpecies(state, boom.speciesId)
      const prey = getSpecies(state, crash.speciesId)
      if (predator.eats.includes(prey.id)) {
        compounds.push({
          type: "compound",
          subtype: "predatorBoomPreyCrash",
          predatorId: predator.id,
          preyId: prey.id,
          cycle: boom.cycle,
          absorbedEvents: [boom.id, crash.id]
        })
      }
    }
  }

  return compounds
}
```

Absorbed events don't surface individually — the compound replaces them. One card, one story.

Compound templates gain a relationship slot that bridges the two events:

```
[observation_detail] [fact_A] [relationship] [fact_B] [researcher_reaction]
```

**Example — predator boom / prey crash:**
> *The upper {homeBiome} is busy with {primaryPredator} activity. {prey} numbers are down {declinePct}% — lowest this season. The two things are not unrelated. The {primaryPredator} have been ranging deeper into {prey} territory for three cycles now. This is what that looks like.*

**Example — apex predator departure / secondary consumer boom:**
> *The {apexPredator} moved on sometime in the last two cycles. The {species} have noticed. Up {growthPct}% already — they expand fast when the pressure lifts. This won't last once the {apexPredator} returns, but for now the upper {homeBiome} belongs to them.*

**Compound event candidates worth authoring** — identified by co-occurrence frequency rather than guesswork:
- Predator boom + prey crash (same biome, predator eats prey)
- Apex predator departure + secondary consumer boom
- Producer crash + primary consumer crisis
- Grubmere collapse + biome health decline
- Biome border shift + species stress event at the new boundary

### Simulation-Informed Authoring

The observation pools and compound event templates should be written with knowledge of what actually happens in the simulation, not what is imagined to happen. Before authoring text, run 50-100 world seeds to cycle 500 and analyse the event logs.

**Two applications:**

**Informing the observation pools** — real simulation runs reveal how each species actually behaves in the ecosystem. Which species crash early and recover? How does Keth pressure actually manifest in numbers? What does a Vellin population look like at 6-cycle rhythm? This gives the authored pool sentences genuine grounding rather than invented behaviour.

**Identifying compound event frequency** — clustering co-occurring events across many world runs shows which compound situations are worth authoring templates for. The top 8-10 compounds by frequency are the ones to write. Less common compounds fall back to individual event cards.

**Stress testing the writing** — pipe a simulation run's event sequence through the template system and read the resulting text as a player would. Does it feel repetitive by cycle 100? Does the researcher voice stay consistent? Does the crisis escalation land correctly given the observations that preceded it? This turns simulation runs into a playtesting tool for writing quality before any real players see it.

### Context Slot

The context slot is where the researcher's memory lives. It connects the present moment to specific past events in that world — not generic awareness, but precise references. Without context the researcher is always experiencing things for the first time. With it they are a person with history.

Context should be empty most of the time. Its power comes from scarcity. When it fires with a specific cycle reference it lands much harder than if it appeared on every event.

**Context types:**

**nearExtinctionRecovery** — the species previously dropped to near-extinction levels and survived. The most emotionally weighted context type. Makes current danger feel more consequential because the researcher knows how close it can get.
> *They were at {lowestPop} individuals in cycle {lowestCycle}. Came back from that.*

**priorDecision** — the researcher made a decision involving this species before. References what was chosen and what happened.
> *I supported them directly in cycle {decisionCycle}. It worked then. Conditions are different now.*

**priorSameEvent** — the same event type has fired for this species before. References the prior occurrence and its outcome.
> *This is the same pattern that preceded the crash in cycle {priorCycle}. They recovered.*
> *Saw this before at cycle {priorCycle}. Came back from it.*

**consecutivePattern** — the same event type has fired for N consecutive cycles without recovery. Not a single past reference but an observed trend.
> *Third consecutive decline.*
> *{n} cycles of contraction now.*

**Context detection:**

```javascript
function selectContext(event, species, state) {
  const candidates = [
    getNearExtinctionContext(event, species),
    getPriorDecisionContext(event, species, state),
    getPriorSameEventContext(event, species),
    getConsecutivePatternContext(event, species)
  ].filter(Boolean)

  if (candidates.length === 0) return null

  return candidates.sort((a, b) =>
    getContextWeight(b, state) - getContextWeight(a, state)
  )[0]
}

function getContextWeight(context, state) {
  let weight = 0
  if (context.type === "nearExtinctionRecovery") weight += 3
  if (context.type === "priorDecision")          weight += 2
  if (context.type === "priorSameEvent")         weight += 1
  if (context.type === "consecutivePattern")     weight += 1
  // Recency bonus — more recent history feels more relevant
  if (context.cycle) {
    weight += Math.max(0, 1 - (state.cycle - context.cycle) / 50)
  }
  return weight
}
```

**Context cooldowns:**

A context cooldown prevents the same context type from firing too frequently. Each type has its own cooldown period tracked per species:

```javascript
const contextCooldowns = {
  priorSameEvent:          8,   // don't reference the same past crash twice in 8 cycles
  consecutivePattern:      3,   // can fire more often — pattern is actively developing
  nearExtinctionRecovery: 20,   // rare and weighty — don't dilute it
  priorDecision:          12,
}
```

**Context template pools:**

```javascript
const contextTemplates = {
  priorSameEvent: [
    "This is the same pattern that preceded the crash in cycle {priorCycle}.",
    "Saw this before at cycle {priorCycle}. They recovered. Usually.",
    "The numbers looked like this in cycle {priorCycle} too.",
  ],
  consecutivePattern: [
    "Third consecutive decline.",
    "{n} cycles of contraction now.",
    "The population has been falling since cycle {startCycle}.",
  ],
  nearExtinctionRecovery: [
    "They were at {lowestPop} individuals in cycle {lowestCycle}. Came back from that.",
    "I've watched them recover from worse. Cycle {lowestCycle}, {lowestPop} left.",
    "Lowest I've seen them was cycle {lowestCycle}. They pulled through.",
  ],
  priorDecision: [
    "I intervened in cycle {decisionCycle}. {decisionOutcome}.",
    "Direct support worked in cycle {decisionCycle}. Conditions are different now.",
    "Last time I stepped in was cycle {decisionCycle}. Worth considering again.",
  ]
}
```

All context templates use the same token system as the rest of the writing. Additional context-specific tokens: `{priorCycle}`, `{lowestPop}`, `{lowestCycle}`, `{decisionCycle}`, `{decisionOutcome}`, `{n}`, `{startCycle}`.

**History fields required on species to support context:**
- `history.lowestPopulation` — lowest recorded population
- `history.lowestPopulationCycle` — cycle when lowest was recorded
- `history.events` — array of past events with subtype and cycle
- `history.decisions` — array of past researcher decisions with cycle and outcome
- `history.contextCooldowns` — per-type cycle tracking, same structure as event cooldowns

### Avoiding Repetition
- Observation details rotate from the pool for the current knowledge tier, never repeating the same sentence twice in the same session
- Template slot selections track recent usage and avoid repeating within N events
- Context slot fires only when relevant history exists and cooldown has cleared — scarcity is the point
- Specific simulation numbers make templated text feel fresh because the numbers are always different
- Quiet cycles between events make eventful ones land harder
- Early game leans on uncertainty and sparse observation details as natural variety
- Rare high-quality event texts that fire infrequently — a beautifully written once-per-era observation feels more alive than constant mediocre variety
- Milestone moments (first extinction, first speciation) warrant fully hand-authored text that fires once and is never repeated

---

## Cross-Biome Dynamics

The most interesting events emerge at biome borders and across biomes.

### Border Pressure
As biomes expand and contract, border creatures face novel conditions. This triggers:
- Adaptation attempts (some succeed, most fail)
- Population stress (creatures outside their optimal conditions)
- Opportunity (new resources accessible if tolerance develops)

### Migration Events
Species can migrate across biome borders when:
- Their home biome is under stress
- A neighboring biome has a resource surplus
- A predator is absent from an adjacent area
- Population pressure pushes them outward

Migration is not automatic success. A species entering a new biome faces new pressures. Most migrations fail. The ones that succeed reshape both biomes.

### Cross-Biome Species
Over time, some species adapt to live in multiple biomes. These become ecologically crucial - they transfer energy and nutrients across biomes, and their removal can cascade across the whole ecosystem.

---

## Time Model

The game runs on an accelerated internal clock. One in-game cycle represents a meaningful period of ecological change.

- **Cycle length:** 30 minutes real time = 1 cycle in-game
- **Cycle calculation:** Cycles are calculated client-side on app open. The simulation runs in batch for all elapsed cycles since last visit, then saves the new state to IndexedDB.
- **Cap:** The simulation runs a full batch up to a maximum of 200 elapsed cycles. Beyond 200 cycles the simulation stops and the world is presented as it was at cycle 200. No approximation is attempted. If the player was away long enough to exceed the cap, the writing acknowledges it directly:

> *You were away for a long time. The station could only track reliably up to 200 cycles ahead. The world you return to reflects that point - what happened after is unknown.*

JavaScript can run hundreds of Lotka-Volterra iterations in milliseconds so the 200 cycle full simulation is not a performance concern.

- **Visible time:** The app shows current cycle and approximate time since last visit.

Long absences should feel significant but not punishing. The world does not collapse because the player was gone. But things will have happened.

### Event Frequency

Most cycles generate no surfaced events. The simulation ticks quietly - populations shift, borders drift, nothing crosses a significance threshold worth reporting. Event frequency varies by game stage:

- **Early game:** One observation event every 3-5 cycles. The ecosystem is simple and the player lacks context for small changes to feel significant.
- **Mid game:** An event every 1-3 cycles. The food web is complex enough that something is always shifting.
- **Late game:** Variable. Long quiet periods punctuated by dramatic bursts during cascade events or succession arcs.

The significance score system controls event frequency. Recently surveyed biomes generate more events temporarily - the player can tune their own event frequency through research choices.

### Pacing Philosophy

The goal is pull not push. Players should want to open the app because something interesting might have happened - not feel obligated to open it to avoid losing progress. There is no penalty for absence beyond the world having continued without you.

Natural return points are created by:
- Research projects completing in hours that map to real daily rhythms
- Events that escalate over cycles creating their own urgency
- Notifications that report genuinely interesting things in researcher voice

**Project pacing targets:**
- Short projects (1-2 cycles): 30-60 minutes. Always available early game.
- Medium projects (4-6 cycles): 2-3 hours. The workhorse of mid game.
- Long projects (10-15 cycles): 5-8 hours. Overnight or work-day commitments.

### Project Time Display

Research projects display approximate real time remaining rather than cycle counts. Calculated from cycles in the background but presented in human terms:

```javascript
function cyclesToApproxTime(cyclesRemaining, cycleMinutes = 30) {
  const minutesRemaining = cyclesRemaining * cycleMinutes

  if (minutesRemaining < 60) return "less than an hour"
  if (minutesRemaining < 90) return "about an hour"
  if (minutesRemaining < 150) return "a couple of hours"
  if (minutesRemaining < 300) return "a few hours"
  if (minutesRemaining < 480) return "several hours"
  if (minutesRemaining < 720) return "about half a day"
  return "about a day"
}
```

In the UI:
> *Vellin behavioral study - results in a few hours*
> *Highgrowth initial survey - results in about an hour*
> *Mordath long-term monitoring - results in about half a day*

Deliberately imprecise. Feels like the researcher's own estimate rather than a system readout. Maps naturally to how people think about their day. No ticking countdown - no compulsion to stay in the app.

---

## Onboarding

### Philosophy
The game explains itself through experience, not instruction. No tutorial prompts, no feature explanations, no difficulty selection. The player arrives at an unknown world and the world reveals itself over time.

The first 10 cycles are scripted and happen entirely within the first session - one after another without waiting for real time. This gives the player a complete introduction to the ecosystem in a single sitting of 15-20 minutes. After cycle 10 the game transitions to real-time cycles at 30 minutes each.

### The First Screen
Just the researcher name input. Sparse, understated:

> *ECHOSPHERE*
> *A research station has been established.*
> *Enter your name to begin.*

One text input. The player types their name. The scripted onboarding begins immediately.

### Scripted Onboarding - Cycles 1 to 10

These cycles happen in sequence during the first session. Each one advances automatically after the player reads and interacts with the current state. The player is never waiting for real time to pass.

**Cycle 1 - Arrival:**
> *I've reached the site. The region is larger than the survey suggested. Three distinct environmental zones visible - a dense upper layer to the north, something darker and lower beneath it, and exposed harsh terrain to the east. No signs of life from this distance. Starting tomorrow.*

The player places their first two observation posts. No instruction - just two empty tool slots and three biome names to choose from.

**Cycle 2-3 - First sightings:**
First unknown species appears in the zone covered by an observation post. Sparse event, no name, no detail. The species book gets its first near-empty entry.

The player is prompted to place their sample collector. Again no instruction - just the tool and the unknown species entry in the book.

**Cycle 4-5 - Environment:**
First biome readings from the environmental sensor. A brief characterization of conditions. The player begins to understand the three zones have different characters.

**Cycle 6-7 - More sightings, first suggestion:**
Second unknown species spotted. The ecosystem generates the first research project suggestion: an initial study of the first observed species. The player sees the project screen for the first time.

**Cycle 8-9 - First project completes:**
The initial study project completes. The first species gets a name and role confirmed. The species book entry fills in. This is the first moment of genuine satisfaction - you studied something and learned what it is.

**Cycle 10 - Transition:**
A brief log entry marks the transition:

> *Ten cycles in. The station is establishing itself. I'm starting to understand this place - barely. The real work starts now.*

Real-time cycles begin. The next cycle will take 30 minutes. The player closes the app knowing something is happening without them.

### What the Player Should Feel After Session One

Not informed. Not tutored. Just curious and slightly attached. They named something. They have a project result sitting in their log. They know there are two more unknown species out there.

They should close the app thinking: *what is that second thing I spotted? What does the Vellin eat? What's happening while I'm gone?*

Questions, not answers. Attachment, not obligation. That is the correct emotional state for everything that follows.

### Notifications After Onboarding

Once real-time cycles begin, notifications become the primary pull mechanism. They should feel like messages from a field camera - curious and specific, never pressuring:

> *Something new in Highgrowth. Haven't seen it before.*
> *Vellin behavioral study complete.*
> *The Mordath has moved. Highgrowth secondary consumers are already responding.*
> *Keth numbers are unusual this cycle. Worth checking.*

Notifications fire when significant events occur or projects complete. Never on a timer. Never to remind the player the game exists. Only when something actually happened.

---

## Collapse and Succession

The ecosystem can collapse - cascading extinctions, biome destabilization, the old order falling apart. But collapse is not an ending. It is succession.

When the dominant species and structures of an era fall, new species emerge from the margins. What was suppressed becomes dominant. What was a specialist in a minor niche becomes the foundation of a new food web.

A collapse event is one of the most dramatic moments in the game - not a failure screen but a turning point. The researcher's log records the old era and begins documenting the new one.

### Eras
A long playthrough may contain several distinct ecosystem eras - each shaped by what came before and what collapsed. The researcher's log becomes a geological record across eras. The world transforms indefinitely. There is no ending.

---

## Progression

The game has no traditional win state and no ending. Progression is the ecosystem becoming richer and more complex over time, punctuated by collapse and succession events that reshape it entirely.

### Early Game
- Few species, simple food web
- Player placing tools, learning what each does
- Events are simple and instructive
- Biomes are stable, borders fixed
- Species book mostly empty, full of unknowns

### Mid Game
- Richer food web with specialists and cross-biome species
- Evolution events becoming common
- Biome borders shifting
- First extinction events possible
- Complex multi-species events
- New tools unlocked through log entries

### Late Game
- Mature, complex ecosystem with emergent behaviors
- Cross-biome dynamics dominating events
- Evolution chains creating creatures far from their origins
- Collapse and succession arcs
- Player's early decisions visible in the current state of the world
- Species book dense with history

### Milestones (not objectives)
The game surfaces notable moments as milestones - not required goals, but acknowledgments of what happened:
- First cross-biome migration that succeeded
- First extinction
- First speciation event
- First apex predator emergence
- First collapse and succession event
- First tool destroyed by environmental hazard
- 100 cycles survived

---

## Simulation Model

The ecosystem runs on simple mathematical rules that produce complex emergent behavior. The goal is not accurate biological simulation but believable ecological dynamics that generate surprising stories from predictable logic.

### Core Population Model

Each species has one primary number: population. Every cycle that number changes based on a modified Lotka-Volterra predator/prey model - two equations that have described ecological dynamics since the 1920s.

**Prey population change:**
> new population = current + (growth rate x current) - (predation rate x predator population x current prey population)

**Predator population change:**
> new population = current + (efficiency x predation rate x prey population x predator population) - (death rate x current)

The predation term multiplies both predator and prey populations. This ensures predation scales with actual encounter rates - when prey is scarce predators cannot continue eating at the same rate, preventing populations from being driven into negative numbers.

Run every cycle these equations produce realistic oscillating populations. Predators boom when prey is abundant, crash when prey is depleted, prey recovers in absence of predators, predators follow. The cycle repeats with natural variation.

### Floating Point Extinction Culling

Because population math uses continuous percentage-based calculations, populations rarely hit exactly zero. They decay into decimals (0.04 individuals, 0.001 individuals). After each cycle any population below the culling threshold is forced to zero and triggers the extinction event:

```javascript
const EXTINCTION_THRESHOLD = 1.0

function applyExtinctionCulling(species) {
  if (species.population > 0 && species.population < EXTINCTION_THRESHOLD) {
    species.population = 0
    fireExtinctionEvent(species)
  }
}
```

### Full Food Web

With 9 starting species the model handles a full food web. Each species has a list of what it eats and what eats it. Population change is the sum of all relationships:

```
populationChange =
  + naturalGrowth
  - sum of all predation by species that eat this one
  + sum of all energy gained from species this one eats
  - naturalDeathRate
```

### Biome Comfort

Each species has a comfort rating per biome - a multiplier on their growth rate:

- Home biome: 1.0 (full growth)
- Tolerated biome: 0.6 (reduced growth)
- Hostile biome: 0.2 (struggling)
- Incompatible biome: 0.0 (cannot survive)

When a species exists in a non-home biome their population change is multiplied by their comfort rating. Most migrations fail naturally from this alone.

### Biome Health

Each biome has a health value between 0 and 1, affected by:
- Producer population levels (healthy producers = healthy biome)
- Decomposer activity (nutrient cycling = healthy biome)
- Extreme population events (crashes or explosions stress the biome)

Biome health acts as a global multiplier on all species within it. A biome at 0.5 health means everything in it grows at half rate. This is how cascade failures work - one extinction stresses the biome, which stresses other species, which stresses the biome further.

### Biome Border Drift

Each cycle biomes expand or contract slightly based on health differential with neighbors:

```
borderShift = (biomeA.health - biomeB.health) x driftRate
```

A healthy Highgrowth next to a stressed Understory slowly pushes the border. This creates biome expansion events and puts border species under natural pressure.

### Randomness

Small random noise added each cycle prevents mechanical predictability:

```
populationChange = calculatedChange x (1 + random(-0.1, 0.1))
```

10% random variance per cycle. Enough to break determinism and produce genuine surprises without making the ecosystem feel chaotic or unfair. The random seed is stored in the state object for reproducibility.

### Event Threshold Checks

After running population equations each cycle the system checks thresholds and fires events:

```
if species.population < species.baseline x 0.15
  -> extinction warning event

if species.population dropped > 30% in one cycle
  -> population crisis event

if species.biome != species.homeBiome and species.population > 0
  -> migration event

if biome.health < 0.3
  -> biome stress event

if species.population == 0
  -> extinction event, open vacant niche

if subpopulation.cyclesAdapting > adaptationThreshold
  -> speciation candidate event
```

Every event type maps to a threshold check. The simulation generates the facts. The writing system turns them into text.

---

## Discovery System

The first sighting trigger is the entry point to the entire discovery arc. It has no equivalent in the standard event trigger system — it is not a population threshold, a relationship event, or a spatial event. It is a separate category: the researcher noticing something exists.

### Sighting Score Accumulation

Each undiscovered species accumulates a sighting score each cycle. When the score crosses a threshold the first sighting event fires, the species book gets its first sparse entry, and the species begins appearing in events.

```javascript
function calculateSightingScore(species, biomes, tools) {
  const populationFactor = species.population / species.basePopulation
  const toolBonus = hasToolInBiome(tools, species.homeBiome) ? 2.5 : 1.0
  const biomeDensity = getTotalBiomePopulation(biomes[species.homeBiome])
  const densityPenalty = Math.max(0.3, 1 - (biomeDensity / DENSITY_THRESHOLD))

  return populationFactor * toolBonus * densityPenalty
}
```

**Population factor** — species below 15% of their starting baseline cannot be sighted. A struggling or sparse species is genuinely hard to notice. A species that crashes before reaching the sighting threshold may never be discovered at all.

**Tool bonus** — an observation post in the species' home biome multiplies sighting score by 2.5. Without a tool covering the biome, sightings are slow. Tool placement directly shapes which species the researcher encounters first — two players with posts in different biomes will have meaningfully different early games.

**Density penalty** — a crowded biome makes individual species harder to isolate. Highgrowth, the densest biome, naturally slows discovery of its less prominent species.

### Sighting Event Cadence

After the first sighting fires, subsequent "saw it again" sighting events follow the same score model with a cooldown of 4-6 cycles. These continue until the initial study project completes and the species is named. After naming, sighting events stop and ecological events take over.

The full arc:
1. Sighting score accumulates silently each cycle
2. Threshold crossed → first sighting event fires, sparse species book entry created
3. Sighting events fire on cooldown while species is unstudied
4. Ecosystem suggests initial study project after 3+ sightings
5. Project completes → named and role identified, sighting events stop, ecological events begin

### Never-Discovered Species

A species that goes extinct before its sighting threshold is ever crossed has no narrative representation by default — it simply never existed from the researcher's perspective. The niche opens, the catalog appears, and the researcher has no memory of what was lost.

This is intentional and can be eerie. But it creates a gap in the catalog event: the researcher is presented with a vacant niche and three candidates without any context for what used to fill it.

A posthumous discovery event fires instead when a never-sighted species goes extinct. The researcher finds traces rather than the living creature:

> *Something used to live in the southern Scorch Flats. The traces are clear enough — feeding patterns in the Scaleweed, territorial markings on the rock face. Whatever it was, it's gone before I could find it. The niche is vacant.*

This ensures the catalog event always has narrative grounding, and creates a distinct emotional register — the researcher arriving too late — that is different from witnessing an extinction directly.

### Home Screen — Early Game State

At game start the species column reflects genuine uncertainty rather than appearing broken or empty. Unknown sighted species appear as biome-tagged placeholders:

```
SPECIES              | ECOSYSTEM
                     |
? Highgrowth         | Highgrowth   uncharacterized
? Understory         | Understory   uncharacterized
                     | Scorch Flats uncharacterized
View all →           |
```

Placeholders are tappable and open the sparse species book entry if a first sighting has fired, or show nothing if the species has not yet been noticed. The ecosystem column shows biome names from cycle 1 with health marked as uncharacterized until an environmental sensor is placed or a biome survey begins. The emptiness communicates that the researcher just arrived and doesn't know what's here yet — not that the UI is incomplete.

### What Good Simulation Output Looks Like

All species surviving all the time is not a success - it means the simulation is too stable. Flat stable populations, no extinctions, and no dramatic events indicate predation rates are too weak and the ecosystem is not generating the stories the game depends on.

The target is interesting oscillation with occasional extinction:

- No extinctions in the first 50 cycles - gives the player time to get attached
- Occasional extinctions after cycle 50 from ecological pressure building naturally
- Producers almost never go extinct - losing a producer collapses a whole biome
- Some runs where a species barely survives, others where it goes extinct - that variance is the game
- Visible predator/prey oscillation - populations rising and falling in linked rhythms, not flat lines

A healthy simulation report across 10 runs looks like:

```
Run 1: 11/11 surviving at cycle 500. Vellin crashed to 8 at cycle 71 but recovered.
Run 2: 10/11 surviving. Torrak extinct at cycle 84 after Scaleweed dip. Niche vacant.
Run 3: 11/11 surviving. Keth/Vellin oscillations dramatic but stable. First extinction cycle 91.
Run 4: 9/11 surviving. Woldren lost at cycle 67. Brack followed at cycle 203 after Mordath shifted territory.
Run 5: 10/11 surviving. Brack extinct cycle 58 - started overextended in this world. Ecosystem restabilized.
Run 6: 11/11 surviving. Close call with Torrak at cycle 79, recovered to baseline by cycle 95.
```

That mix - first extinctions clustered in cycles 50-100, mostly surviving to cycle 500, dramatic near-misses, occasional multi-extinction runs - means the coefficients and variance ranges are in the right zone. Tuning from there is about making the stories feel ecologically honest rather than hitting a numerical threshold.

Population explosions (a species exceeding ~10000) are always a failure state. They indicate a predator has become too weak or extinct and its prey is compounding unchecked each cycle. Explosions usually precede total ecosystem collapse.

### World Generation and Variance

Each world is generated from a seed at game start. Starting conditions vary per world — different populations, slightly different coefficients, different biome health. This is the primary source of run-to-run variance. No two worlds play the same way, and extinctions emerge from the specific conditions of that world rather than from scripted pressure.

All variance derives from the seed, so worlds are fully reproducible. The world designation is recorded at the top of the researcher log:

> *Station established. World designation: 8472.*

Players who care will notice it. Most won't. But it quietly communicates that this world is specific and unique.

**What varies at world generation:**

- **Starting populations** — ±20% from baseline per species
- **Growth and death rates** — ±10% per species
- **Predation efficiency** — ±5-8% (tightest variance, most sensitive coefficient)
- **Biome comfort modifiers** — ±8% per species per biome
- **Biome starting health** — small per-biome variance

Base coefficients represent healthy ideal-condition behavior. Variance is a separate tuning concern layered on top — these are not the same problem and should not be solved together.

```javascript
function generateWorld(seed) {
  const rng = createSeededRng(seed)

  return {
    randomSeed: seed,
    biomes: generateBiomes(rng),
    species: BASE_SPECIES.map(species => ({
      ...species,
      population: vary(species.basePopulation, 0.20, rng),
      growthRate: vary(species.baseGrowthRate, 0.10, rng),
      deathRate: vary(species.baseDeathRate, 0.10, rng),
      predationEfficiency: vary(species.basePredationEfficiency, 0.07, rng),
      biomeComfort: varyComfort(species.baseBiomeComfort, 0.08, rng)
    }))
  }
}

function vary(base, range, rng) {
  return base * (1 + (rng() - 0.5) * 2 * range)
}
```

### Extinction Timing Targets

The target window for first extinction is cycles 50–100. This gives the player time to get attached before anything dies, while ensuring the first loss happens before the ecosystem becomes too complex to absorb it cleanly.

- No extinctions before cycle 50 — player needs time to learn the creatures
- At least one extinction before cycle 100 in the majority of runs — ensures the catalog mechanic and first-loss writing are encountered in normal play
- Variance across runs determines which species dies, not a scripted designation

Species most naturally prone to early extinction due to isolated food chains and limited recovery paths: Torrak, Woldren, Brack. World generation variance will cause one of these to start overextended in most worlds without any of them being permanently designated as the tutorial casualty.

### Headless Simulation Audit

Before building any UI, a headless simulation script should be run to verify that world variance produces the target distribution. This script is also the primary tool for verifying coefficient changes don't destabilize the ecosystem.

```javascript
function auditWorldVariance(seedCount) {
  const results = []

  for (let i = 0; i < seedCount; i++) {
    const world = generateWorld(i)
    const { state, events } = runCycles(world, 500)

    results.push({
      seed: i,
      firstExtinction: findFirstExtinction(events),
      survivorsAt100: countSurvivors(state, 100),
      survivorsAt500: countSurvivors(state, 500),
      collapsed: didCollapse(state)
    })
  }

  return summarize(results)
}
```

**Target distribution across 500 runs:**

```
First extinction cycle distribution:
  Before cycle 50:   <5%   ← want this low
  Cycles 50-100:    ~60%   ← want this high
  Cycles 100-200:   ~30%
  After cycle 200:    ~5%
  Never:              0%   ← zero tolerance

Survivors at cycle 500:
  8-11 species:     ~70%   ← healthy variance
  5-7 species:      ~25%   ← collapse arc, still interesting
  Under 5:           <5%   ← too fragile, tighten floor

Collapse rate:        <3%
```

If the distribution is wrong, tune the variance ranges — not the base coefficients. Run the audit again after any new species, trait, or mechanic is added.



When the player opens the app the system runs all elapsed cycles in a loop:

```javascript
function runCycles(state, cycleCount) {
  const events = []
  for (let i = 0; i < cycleCount; i++) {
    state = simulateCycle(state)
    events.push(...checkThresholds(state))
  }
  return { state, events }
}
```

Each cycle is a pure function - takes a state object, returns a new state object. No side effects, no async, no server. The entire simulation is deterministic JavaScript running client-side and stored in IndexedDB.

### State Object Structure

```javascript
{
  cycle: 47,
  randomSeed: 8472,
  researcher: {
    name: "Dr. Voss",
    log: [...],
    tools: [...],
    resources: {
      fieldData: 340,
      specimens: 12
    },
    lastSummaryViewedCycle: 88,       // all events after this cycle appear in the summary
  },
  biomes: {
    highgrowth: { health: 0.82, borderPositions: {...} },
    understory: { health: 0.71, borderPositions: {...} },
    scorchFlats: { health: 0.64, borderPositions: {...} }
  },
  species: [
    {
      id: "vellin",
      name: "Vellin",
      population: 847,
      homeBiome: "highgrowth",
      currentBiome: "highgrowth",
      subpopulations: [],
      eats: ["crust-growth"],
      eatenBy: ["ridge-walkers"],
      growthRate: 0.12,
      deathRate: 0.05,
      biomeComfort: {
        highgrowth: 1.0,
        understory: 0.6,
        scorchFlats: 0.2
      },
      milestones: {
        observed: true,
        named: true,
        roleIdentified: true,
        behaviorMapped: false,
        populationModeled: false
      },
      history: {
        cyclesObserved: 34,
        cyclesSinceRoleIdentified: 12,  // cycles elapsed since named + role confirmed
        previousCrashes: 1,
        lastCrashCycle: 58,
        peakPopulation: 1240,
        eventsInvolving: 7,             // total surfaced events involving this species
        sightings: 3,                   // sighting events fired before initial study
        ancestor: null
      },
      observationPool: [...]
    }
  ],
  catalog: [...],
  events: [...]
}
```

Everything the game needs lives in this object. The whole game state is portable, inspectable, and serializes cleanly to IndexedDB.

---

## Migration

Migration emerges entirely from simulation state - no scripted events, no random triggers. A species migrates because conditions pushed them out or pulled them toward something better.

### Push Factors

A species is pushed out of their home biome when conditions deteriorate:

**Overpopulation pressure** - population exceeds carrying capacity relative to food supply.
```
if species.population > foodSource.population x carryingCapacityRatio
  -> migration pressure builds
```

**Predator pressure** - predator population is critically high relative to prey.
```
if predator.population > species.population x predatorPressureThreshold
  -> migration pressure builds
```

**Biome health collapse** - home biome health drops below a critical threshold.
```
if homeBiome.health < 0.4
  -> migration pressure builds
```

### Pull Factors

A species is pulled toward a neighboring biome when conditions there are favorable:
- Resource surplus in the neighboring biome with low competition
- Absence of known predators in the neighboring biome
- Neighboring biome significantly healthier than home biome

### Migration Pressure Score

Each species accumulates a migration pressure score each cycle from combined push and pull factors. When pressure exceeds a threshold a migration attempt fires - not immediately but after building over multiple cycles. Migration feels gradual, not sudden.

```javascript
function calculateMigrationPressure(species, biomes) {
  let pressure = 0
  if (isOverpopulated(species)) pressure += 0.3
  if (highPredatorPressure(species)) pressure += 0.4
  if (homeBiome.health < 0.4) pressure += 0.3
  for (const neighbor of getNeighboringBiomes(species.homeBiome)) {
    if (hasResourceSurplus(species, neighbor)) pressure += 0.2
    if (noPredatorsIn(species, neighbor)) pressure += 0.2
    if (neighbor.health > homeBiome.health + 0.3) pressure += 0.1
  }
  return pressure
}
```

### The Migration Attempt

When pressure triggers an attempt a small splinter group crosses - roughly 10% of the population. Success is determined by the species comfort rating in the target biome:

```javascript
function attemptMigration(species, targetBiome) {
  const successChance = species.biomeComfort[targetBiome] x migrationRoll()
  if (successChance > 0.5) {
    const migrantCount = species.population x 0.1
    species.population -= migrantCount
    createSubpopulation(species, targetBiome, migrantCount)
  } else {
    logFailedMigration(species, targetBiome)
  }
}
```

Most attempts fail. The ones that succeed start a subpopulation in the new biome that either grows or dies based on conditions there.

### Subpopulations

A species can have subpopulations in multiple biomes simultaneously. Each subpopulation runs its own population equations with the biome comfort modifier applied. A subpopulation faces different predators, competes for different food, and experiences different conditions than the parent population.

The researcher observes this arc playing out over many cycles:

> *Cycle 34 - A small group of Vorrith have crossed into the Understory Fringe. Maybe twelve individuals. No ridge-walkers there but the conditions are poor for them. Watching to see if they hold.*

> *Cycle 39 - The Vorrith subpopulation in Understory is down to four. I don't think they'll make it.*

> *Cycle 41 - Gone. The Understory crossing failed.*

Or alternatively:

> *Cycle 52 - The Vorrith subpopulation in Understory has stabilized at around 80 individuals. Something has changed in their behavior - they're feeding on decomposer byproduct rather than the producers they normally prefer. Adapting.*

### Migration to Speciation

A subpopulation that survives long enough under different conditions accumulates adaptation cycles. When adaptation crosses a threshold the simulation flags a speciation candidate event. The researcher is asked whether to recognize the diverging population as a new species:

> *Cycle 94 - The Understory Vorrith have been changing for 60 cycles. They move differently, feed differently, look different from their Highgrowth relatives. These are no longer quite Vorrith. Do you want to recognize them as a distinct species?*

If the player confirms, the subpopulation becomes a new species with its own species book entry. The original species entry notes the split. The new species entry notes its ancestor. The researcher names it - the same auto-name with rename option as all species.

This arc - migration attempt, subpopulation struggles, adaptation, eventual speciation - can play out over 50-100 cycles entirely from simulation rules with no scripted content. It is one of the most compelling long-form stories the game can tell.

---

## Decision System

Decisions are the most important interactive moment in the game. They should feel meaningful without feeling like puzzles with correct answers. The player should never feel like they failed because they picked wrong - just that they made a choice and the world responded.

### Core Philosophy

Options are never framed as good or bad. They are framed as different. Each option has a cost and a benefit. The player picks based on their values and priorities, not by finding the right answer. Consequences are described with honest uncertainty - the researcher is smart but not omniscient.

**Too certain - feels like a puzzle:**
> *Intervening will stabilize the Vellin population.*

**Right register - feels like a researcher's honest assessment:**
> *The Vellin population is small enough that direct support could help. Whether it's enough depends on what the Keth do next. I can't predict that.*

### Invisible Deadlines

Decisions have no visible timer or countdown. The world moves on regardless. The situation evolves each cycle and the event card updates with the current state. The writing communicates urgency naturally:

**Cycle 34:**
> *The Vellin population is declining under Keth pressure. Down 23% this cycle. Worth watching.*

**Cycle 38 if unaddressed:**
> *The Vellin situation is worsening. Down 61% from baseline. I should decide whether to intervene.*

**Cycle 41:**
> *The Vellin are critical. A few individuals remain. This may resolve itself one way or another soon.*

The player who checks in regularly sees the progression. The player who was away for several days opens the app to find it already resolved. This is consistent with the game's core principle - the world has agency and does not wait.

### Decision Screen Structure

When the player taps a decision event card the decision screen opens as a focused modal.

**Header** - species name and current status. Tappable link to species page for full context.

**Situation text** - researcher voice, current cycle, what is happening right now with specific numbers from the simulation.

**History context** - relevant history if it exists. Surfaces automatically if the species has prior events of this type.

**Options** - 2 or 3 cards each containing:
- A short action label
- A description in researcher voice with honest uncertainty
- A cost if any (specimens, field data, or ecological risk)
- A consequence hint - the researcher's best read, not a guarantee

**Implicit do-nothing** - closing the screen without deciding is always an option. The world moves on.

### Option Generation

Options are assembled from intervention types matched to the event subtype rather than hand-authored for every situation:

```javascript
const interventionTypes = {
  populationCrisis: [
    "directSupport",        // spend specimens to boost population
    "relocate",             // spend more specimens to create subpopulation elsewhere
    "introduceCompetitor"   // only available if competitor exists in catalog
  ],
  evolutionCandidate: [
    "guideTraitA",          // first available evolution direction
    "guideTraitB",          // second available evolution direction
    "letDevelop"            // no cost, unknown outcome
  ],
  vacantNiche: [
    "introduceCandidateA",
    "introduceCandidateB",
    "introduceCandidateC",
    "waitAndResearch"       // spend field data to learn more first
  ],
  predatorSurge: [
    "supportPrey",          // protect the prey species
    "disruptPredator",      // spend specimens to reduce predator pressure
    "observe"               // let predator/prey dynamics resolve naturally
  ]
}
```

Option descriptions are assembled from the same pool system as event text - simulation data and species history generate specific honest language rather than generic templates.

### After a Decision

The decision is recorded in the researcher log with cycle number and chosen option. The simulation applies the intervention effect. The event card is replaced by an outcome card a few cycles later:

**If it worked:**
> *Cycle 47 - You supported the Vellin population directly. They stabilized at 340 individuals - lower than before the crisis but holding. The Keth pressure hasn't changed. Worth watching.*

**If it didn't:**
> *Cycle 47 - The direct support wasn't enough. The Vellin continued declining despite the intervention. They are gone now. The niche is vacant.*

**If the decision fired and expired while the player was offline:**
> *Cycle 47 - A crisis occurred while you were away. The Vellin collapsed under Keth pressure before anyone could intervene. They are gone now. The niche is vacant.*

The offline framing is distinct from the ignored decision framing. The player is never told they were asked and ignored it when the event fired and resolved entirely during background batch processing. The writing system checks whether a decision expired during an offline batch and selects the appropriate text variant. Outcome cards are permanent log entries regardless of how the situation resolved.

### Priority Ordering

When multiple decision events are pending simultaneously the home screen surfaces the most urgent first - determined by how fast the situation is deteriorating rather than how old it is. A crisis accelerating toward extinction outranks a slower-moving competition event regardless of when each one fired.

```javascript
function prioritizeDecisions(pendingDecisions, species) {
  return pendingDecisions.sort((a, b) => {
    const urgencyA = calculateUrgency(a, species)
    const urgencyB = calculateUrgency(b, species)
    return urgencyB - urgencyA
  })
}

function calculateUrgency(decision, species) {
  const sp = getSpecies(species, decision.speciesId)
  const declineRate = sp.history.populationChangeLastCycle
  const currentRisk = 1 - (sp.population / sp.history.peakPopulation)
  return (currentRisk * 0.6) + (Math.abs(declineRate) * 0.4)
}
```

The player who opens the app after a long absence sees the most critical situation first, not the oldest one.

---

## Resources

Two resources drive the active session layer. They come from different sources and are spent on different things, creating a natural tension between patient research and direct intervention.

### Field Data
Generated passively by active tools - observation posts and environmental sensors produce it slowly over time. Also generated by long-term monitoring and resource extraction research projects. Spent on:
- Research projects (species studies, biome surveys, hazard assessments)
- Station upgrades
- Researching catalog candidates before introduction

Field Data is the patient researcher's resource. It rewards having tools well placed, running active projects, and checking in regularly.

### Specimens
Generated by sample collectors, resource extraction projects, and specific events - a successful migration, a population milestone, a rare interaction observed. Rarer and more valuable than field data. Spent on direct interventions:
- Introducing a catalog species to fill a vacant niche
- Guiding an evolution when the opportunity arises
- Supporting a collapsing population during a crisis

Specimens are the interventionist's resource. They are precious and every spend is a commitment.

### Resource Tension
Some players will hoard specimens and intervene constantly. Others will spend everything on field data running research projects and building station infrastructure. Both are valid and produce different worlds.

---

## Research Projects

Research projects are the primary active layer of the game. They give the player something meaningful to do every session beyond reading events. Projects are suggested by the ecosystem based on current simulation state - not self-assigned busywork but responses to things the world has noticed.

### Core Rules
- One project active at a time
- The player can queue additional projects to run after the current one completes
- Queued projects are validated against current simulation state when they reach the front of the queue. A project whose target no longer meets its relevance condition is silently dropped and the next item in the queue starts instead
- Projects cost field data at the time they are initiated, not when queued
- Station upgrades reduce cost and duration across all project tiers
- Research can also be triggered directly from decision events — the vacant niche decision includes a "wait and research" option that spends field data to learn more about catalog candidates before committing to an introduction

### Queue Validation

Each queued project carries the condition that made it relevant when the player added it. This condition is checked when the project is about to start:

```javascript
{
  type: "speciesStudy",
  targetId: "vellin",
  queuedCycle: 40,
  relevanceCondition: "species.exists && !species.milestones.behaviorMapped",
}
```

If the condition fails — species extinct, milestone already advanced by some other means, biome already surveyed — the project is dropped silently. No notification, no refund (nothing was spent yet). The next queued item is checked immediately. If the queue empties the project slot opens and the ecosystem generates fresh suggestions.

This means the queue is a statement of intent, not a commitment. The player lines up what they want to study. The world decides whether that's still possible.

### Mid-Run Extinction

If a species goes extinct while a study of it is actively running, the project completes immediately rather than cancelling. The study ran for however many cycles it had before the subject disappeared. The milestone advances as normal. The findings are written in past tense:

```
Study terminated — subject lost at cycle 47.
Five cycles of behavioral data recovered.

The Vellin moved through the upper Highgrowth in loose groups,
always faster near the canopy edge. I was beginning to understand
their rhythm. I won't get the chance to finish.
```

Field data is not refunded. The researcher did the work. The world ended the study early.

The milestone advancing for an extinct species has no gameplay consequence — there is nothing left to intervene on — but it completes the researcher's record of them. A species page with fully completed milestones and an extinction marker has its own weight. The researcher knew them well. That counts for something.

### Project Types

**Species Studies**
Study individual species to advance their knowledge milestones. The primary driver of species book progression - milestones do not advance through passive observation alone.

Four tiers corresponding to the four non-automatic milestones:

| Tier | Milestone | Base Cost | Base Duration | Reward |
|------|-----------|-----------|---------------|--------|
| Initial study | Role identified + Named | 40 field data | 3 cycles | Name coined, role confirmed, sample collector slot unlocked |
| Behavioral study | Behavior mapped | 120 field data | 6 cycles | Movement patterns, predator relationships, evolution guidance unlocked |
| Population analysis | Population modeled | 280 field data | 12 cycles | Full population dynamics, intervention cost reduced for this species |

The ecosystem suggests species studies when unknown species have been observed multiple times or when a known species reaches a threshold that warrants deeper study.

Unknown species appear in events immediately but are described without name or role:
> *Something in the upper Highgrowth again. Third sighting this week. Moves in groups. I don't know what it is yet.*

After the initial study project completes:
> *Study complete. The canopy species are grazers - feeding on Feltmoss across the upper growth. Fast-moving, group behavior, likely prey of something larger. I'm calling them Vellin.*

**Ecological Surveys**
Study a biome to advance its survey milestones and fill the biome book. Reveals hidden hazards seeded at world creation. Applies a temporary significance boost to events from that biome.

| Tier | Milestone | Base Cost | Base Duration | Reward |
|------|-----------|-----------|---------------|--------|
| Initial survey | Characterized | 60 field data | 4 cycles | Basic conditions documented, significance boost 20 cycles |
| Deep survey | Mapped | 180 field data | 10 cycles | Subzones identified, moderate hazards revealed, significance boost 30 cycles |
| Monitoring setup | Monitored | 400 field data | 20 cycles | Passive field data income, hazard early warning active, significance boost permanent |

**Long-term Monitoring**
Extended projects that generate passive field data income while running and produce a detailed report at completion. Used for tracking rare or important species like the Mordath.

- High upfront cost, long duration (20-40 cycles)
- Generates small field data income each cycle while active
- Completion report surfaces patterns invisible to normal observation
- Tracking data added to species page as a historical record

Example: A Mordath tracking program running for 30 cycles produces:
> *Monitoring complete. The Mordath spent 63% of observed cycles in Highgrowth, moving to Understory when Keth population exceeded 280. Three previously unobserved hunting behaviors documented.*

**Resource Extraction**
Deploy collection equipment to gather specimens directly. Simpler and more predictable than waiting for event-triggered specimen generation.

- Moderate cost, moderate duration (6-10 cycles)
- Returns a fixed specimen amount on completion
- Biome-specific - different biomes yield different amounts based on health and diversity
- Suggested when specimen reserves are low or a major intervention is upcoming

**Hazard Assessment**
Survey a specific fringe zone or biome area for environmental risks. Provides early warning capability for equipment-destroying events.

- Low to moderate cost, short duration (3-6 cycles)
- Reveals hazard rating for the assessed zone
- For the next N cycles tool destruction events in that zone are telegraphed one cycle in advance
- Rating decays over time, encouraging repeat assessments

### Project Suggestion Logic

The ecosystem generates project suggestions based on current simulation state. Suggestions are contextually relevant - they reflect what is actually happening:

```javascript
function generateProjectSuggestions(state) {
  const suggestions = []

  // Suggest species study if unknown species observed 3+ times
  for (const species of state.species) {
    if (!species.milestones.roleIdentified &&
        species.history.sightings >= 3) {
      suggestions.push(createSpeciesStudyProject(species, "initial"))
    }
  }

  // Suggest behavioral study if species has been known long enough and generated enough events
  for (const species of state.species) {
    if (species.milestones.roleIdentified &&
        !species.milestones.behaviorMapped &&
        species.history.cyclesSinceRoleIdentified >= 5 &&
        species.history.eventsInvolving >= 4) {
      suggestions.push(createSpeciesStudyProject(species, "behavioral"))
    }
  }

  // Suggest biome survey once at least one species has been sighted there
  for (const biome of Object.values(state.biomes)) {
    if (!biome.milestones.characterized &&
        getSpeciesSightedInBiome(biome.id, state).length >= 1) {
      suggestions.push(createBiomeSurveyProject(biome, "initial"))
    }
  }

  // Suggest resource extraction if specimens below threshold
  if (state.researcher.resources.specimens < 5) {
    suggestions.push(createResourceExtractionProject(state))
  }

  // Suggest hazard assessment if tool was recently destroyed
  if (hasRecentToolDestruction(state)) {
    suggestions.push(createHazardAssessmentProject(state))
  }

  // Return top 3 by relevance score, always keep queue at 2-3
  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
}
```

### Project Data Model

```javascript
{
id: "proj_0012",
type: "speciesStudy",           // speciesStudy | ecologicalSurvey | monitoring | extraction | hazardAssessment
targetId: "vellin",             // species id, biome id, or fringe id
targetMilestone: "roleIdentified",
startCycle: 34,
duration: 3,                    // cycles to complete
fieldDataCost: 40,
passiveIncomePerCycle: 0,       // non-zero for monitoring projects, e.g. 4 field data per cycle
completionEffects: [
    { type: "advanceMilestone", targetId: "vellin", milestone: "roleIdentified" },
    { type: "addBookEntry", targetId: "vellin", text: "..." },
    { type: "coinName", targetId: "vellin", suggestedName: "Vellin" }
  ],
  completed: false,
  completedCycle: null
}
```

---

## Biome Book

The biome book parallels the species book. Each biome starts with almost no information and fills through ecological survey projects. The knowledge accumulated has practical consequences - it improves event quality, reveals hazards, and provides genuine intelligence about future risks.

### Discovery Arc

**Located - automatic:**
> **Highgrowth** - *First observed: Cycle 1*
> Dense canopy growth, light-rich. Estimated large area. Multiple species present. Conditions appear favorable but I haven't characterized them properly yet.
>
> *Survey milestones:*
> Located - - - -

**Characterized - after initial survey:**
> **Highgrowth**
> Fast growth cycles, high competition for light. Feltmoss dominates surface coverage. Temperature moderate, moisture high. The canopy layers are denser than I initially estimated - there may be species I'm missing in the upper sections.
>
> *Survey milestones:*
> Located - Characterized - - -

**Mapped - after deep survey:**
> **Highgrowth**
> Full characterization complete. Three distinct vertical zones within the biome. Species distribution follows light gradient precisely. Biome health closely tied to Feltmoss coverage. Thermal vents detected in the southern section - minor activity currently but worth monitoring.
>
> *Survey milestones:*
> Located - Characterized - Mapped -

**Monitored - after monitoring setup:**
> **Highgrowth**
> Long-term monitoring active. Continuous readings across all zones. The thermal vent activity in the south has been stable for 12 cycles but the readings are trending upward. I'm watching it.
>
> *Survey milestones:*
> Located - Characterized - Mapped - Monitored

### Hazard System

**Seeding at game start:**
Each biome is seeded with 2-4 hidden hazards when the world is created. These are permanent features of that world, unique per playthrough. Hazard severity determines which survey milestone reveals them:

- Critical hazards: revealed at Characterized (second tier)
- Moderate hazards: revealed at Mapped (third tier)
- Minor hazards: revealed at Monitored (fourth tier)

More severe hazards are revealed earlier - the system ensures dangerous things are findable without requiring complete research.

```javascript
function seedBiomeHazards(biome, randomSeed) {
  const hazardPool = getHazardPoolForBiome(biome.id)
  const count = 2 + Math.floor(seededRandom(randomSeed) * 3)

  biome.hiddenHazards = hazardPool
    .sort(() => seededRandom(randomSeed) - 0.5)
    .slice(0, count)
    .map(hazard => ({
      ...hazard,
      revealedByMilestone: assignRevealMilestone(hazard.severity),
      triggered: false
    }))
}

function assignRevealMilestone(severity) {
  if (severity === "critical") return "characterized"
  if (severity === "moderate") return "mapped"
  return "monitored"
}
```

**Hazard trigger checking:**
Each cycle the hazard system checks trigger conditions against current state:

```javascript
function checkHazards(state) {
  const events = []

  for (const biome of state.biomes) {
    // Check known hazards - player has warning capability
    for (const hazard of biome.knownHazards) {
      if (!hazard.triggered && evaluateTrigger(hazard.triggerCondition, state)) {
        hazard.triggered = true
        events.push(createHazardEvent(hazard, biome, state, false))
      }
    }

    // Check hidden hazards - no warning, surprise impact
    for (const hazard of biome.hiddenHazards) {
      if (!hazard.triggered && evaluateTrigger(hazard.triggerCondition, state)) {
        hazard.triggered = true
        biome.knownHazards.push({...hazard, discoveredCycle: state.cycle})
        biome.hiddenHazards = biome.hiddenHazards.filter(h => h.id !== hazard.id)
        events.push(createHazardEvent(hazard, biome, state, true))
      }
    }
  }

  return events
}
```

**Known hazard event (surveyed):**
> *Cycle 67 - The southern Highgrowth thermal vents have become active. You noted their presence in cycle 34. Equipment in that zone is at risk.*

**Hidden hazard event (unsurveyed):**
> *Cycle 67 - Unexpected thermal activity in southern Highgrowth. Equipment destroyed. The station had no data on this.*

**Biome state object:**
```javascript
{
  id: "highgrowth",
  name: "Highgrowth",
  health: 0.82,
  borderPositions: {},

  milestones: {
    located: true,
    characterized: false,
    mapped: false,
    monitored: false
  },

  activeEffects: [
    {
      type: "significanceBoost",
      multiplier: 1.5,
      expiresAtCycle: 54
    }
  ],

  knownHazards: [
    {
      id: "thermal_vents_south",
      name: "Southern thermal vents",
      discoveredCycle: 34,
      severity: "moderate",
      triggerCondition: "biomeHealth < 0.4",
      triggered: false
    }
  ],

  hiddenHazards: [
    {
      id: "root_instability",
      revealedByMilestone: "mapped",
      severity: "low",
      triggerCondition: "understoryHealth < 0.3 && cycle > 100",
      triggered: false
    }
  ],

  bookEntries: [
    {
      cycle: 1,
      text: "Dense canopy growth, light-rich..."
    }
  ]
}
```

---

## Knowledge Milestones

Species do not have a visible level number. Instead each species entry in the species book shows a set of research milestones that fill in over time. Milestones are both a progress indicator and an intervention unlock system - no separate UI needed.

Milestones do not advance through passive observation alone. They require deliberate research projects. Passive observation generates the events and context that make research projects feel meaningful and timely - but the knowledge itself is earned through active study.

### Milestone Progression

> *First observed - Named - Role identified - Behavior mapped - Population modeled*

Each milestone is either greyed out or filled in. Greyed out milestones are as interesting as filled ones - they tell the researcher what is still unknown.

**First observed** - automatic on first sighting. Basic species book entry created. Species appears in events as unknown.

**Named + Role identified** - unlocked together by completing an initial species study project. The researcher coins the name in the project result. Sample collector can now be attached.

**Behavior mapped** - unlocked by completing a behavioral study project. Movement patterns, predator relationships, biome preferences confirmed. Evolution guidance now possible.

**Population modeled** - unlocked by completing a population analysis project. Full population dynamics understood, cycle rhythms mapped. Full intervention options unlocked. Specimens cost reduced for this species.

### How Milestones Advance
- Species appearing in events
- Sample collector attached and active
- Player making decisions involving the species
- Species reaching ecological milestones - first migration, surviving a crisis, forming a symbiosis

Progress is earned through relationship, not grinding. A species the researcher has ignored for 40 cycles will still be at early milestones even if it has been in the ecosystem the whole time.

---

## Species Catalog

### Starting Ecosystem
The researcher arrives at an ecosystem already in progress. Starting species are discovered through observation - the species book is empty and fills as creatures are encountered. The starting roster contains 11 species:

- 3 producers (one per biome)
- 1 Highgrowth grazer
- 1 Understory browser
- 1 cross-biome feeder (Highgrowth/Scorch Flats Fringe)
- 1 Scorch specialist
- 1 Highgrowth predator
- 1 ranging predator (Highgrowth/Understory Fringe)
- 1 apex predator
- 1 decomposer

11 species. Enough for real ecological dynamics but small enough that each one can be individually known and cared about.

### How New Species Enter the World
Three ways a species can exist in the ecosystem:

**Starting species** - already present when the researcher arrives. Discovered through observation.

**Catalog species** - introduced by the researcher from an external catalog. Costs specimens. Only becomes available after an extinction creates a vacant niche.

**Evolved species** - emerge from existing species through the evolution system. Nobody introduced them. They happened.

### The Catalog and Extinction
Catalog species only become available when a vacant niche opens through extinction. Every catalog entry exists because something died. The researcher knows this. The writing reflects it:

> *The Vorrith are gone. The southern Scorch grazing niche is vacant. Three candidate species have been identified from surrounding regions that might fill it. Introducing any of them is irreversible.*

Loss and renewal as a mechanic, not just a narrative beat.

### Three Candidates Per Niche
When a niche opens, three candidates appear. They are not equivalent:

**Candidate A** - close ecological analog to what was lost. Lower risk, predictable behavior, but the ecosystem gets roughly what it had before.

**Candidate B** - fills the niche but originates from a different biome. Higher risk, unpredictable cross-biome interactions, potentially more interesting dynamics.

**Candidate C** - a specialist that partially fills the niche. Leaves some vacancy but opens a new ecological possibility.

The choice is irreversible. The player is deciding what kind of world comes next, not just replacing what was lost.

### Candidates Are Initially Unknown
Catalog candidates arrive with almost no information - just a brief field note, as unknown as the starting species were on first sighting:

> *Candidate A - observed in outer Shallows region. Moves alone. Pale, larger than Vorrith. Behavior unclear.*

### Researching Candidates
Before committing, the researcher can spend field data to learn more about each candidate. Research advances their milestones without them being in the ecosystem:

**After initial field data spend:**
> *Candidate A - confirmed grazer, Shallows origin. Solitary. Appears to compete aggressively for territory.*
> *Research milestones: Located - Role identified - - -*

**After further research:**
> *Candidate A - Shallows grazer, solitary, territorial. Known predator: ridge-walkers. Estimated population pressure: high.*
> *Research milestones: Located - Role identified - Behavior mapped - -*

The final milestone - population modeled - only unlocks after the species has lived in the ecosystem for many cycles. There is always residual uncertainty before introduction.

### The Cost of Patience
Researching candidates takes time. Cycles pass while the researcher deliberates. The vacant niche creates downstream pressure - producers spreading unchecked, competing species affected. The player faces a real dilemma: introduce quickly with limited knowledge, or research thoroughly while the ecosystem suffers.

### Catalog Size
Fixed per ecological role. Three candidates per role, six roles, eighteen total catalog species to design and write. A manageable creative scope that can be extended in future updates.

The six roles are: producer, primary consumer, secondary consumer, apex predator, decomposer, and specialist. Note that the starting roster contains no specialist species - the Scorch Flats specialist role (Torrak) is a highly adapted primary consumer rather than a true specialist in the catalog sense. The first true specialist species can only enter the ecosystem via the catalog when a specialist niche opens. This means the specialist role and its ecological possibilities are entirely absent from the early game and only emerge through play.

---

## Multiplayer
Single player only. Each researcher has their own world. The researcher identity and personal log only work if the world belongs entirely to the player.

---

## UI Structure

### Philosophy
The interface is a field journal. The log is the primary and only main surface — the researcher's continuous record of everything that has happened in the ecosystem. There is no separate home screen. There is no session summary screen. There is only the log, with a compact sticky header showing current status.

Everything that names a species, biome, or tool is a tappable link. The whole game is hypertext — a living cross-referenced document the player navigates by curiosity.

### The Log

The log is the app. It opens on every session scrolled to the last-read marker. New entries appear below the marker. The player reads down, responds to anything that requires a response, and closes the app.

The log is a continuous chronological feed of researcher-voice entries — observations, crisis cards, decision records, outcome entries, research completions. All event types appear here in a single unified feed.

```
────────────────────────────────
ECHOSPHERE
Cycle 94 · Away 6h · FD 340 · SP 12
Vellin behavioral study  [====  ]
────────────────────────────────

  Cycle 94
  The upper Highgrowth was quiet
  today. Vellin pulling back from
  the northern canopy.

  Cycle 91 — CRISIS
  The Vellin are collapsing. Keth
  pressure has been building for
  three cycles. Numbers down 23%.
  [Respond →]

  Cycle 91 — DECISION
  Direct support
  Spent 8 specimens.

── last read ──────────────────

  Cycle 88
  Keth ranging further than usual.
  The upper Highgrowth is quieter
  than it should be.

  Cycle 85 — RESEARCH COMPLETE
  Vellin behavioral study complete.
  The canopy routes are more
  deliberate than I expected...
  + 120 field data
  [Collect →]

  Cycle 82
  ...
────────────────────────────────
```

**Sticky header** — always visible at the top regardless of scroll position.
- Line 1: App name
- Line 2: Cycle count, time away, field data, specimens
- Line 3: Active research project name and compact progress bar — tappable, opens the project screen

When no project is active the research line shows "No active project →" which routes to the project screen.

**Last-read marker** — a subtle dividing line in the log at `lastSummaryViewedCycle`. Everything above has been read. Everything below is new. The marker advances automatically when the player opens the app — no Continue button, no blocking. The modal decision gate replaces the need for the marker to block.

```javascript
// On app open: advance marker then scroll to previous position
function onAppOpen(state) {
  const previousMarker = state.researcher.lastSummaryViewedCycle
  return {
    updatedState: {
      ...state,
      researcher: {
        ...state.researcher,
        lastSummaryViewedCycle: state.cycle
      }
    },
    scrollToCycle: previousMarker
  }
}
```

**Early game** — with no named species and all organisms unknown, the log is a sparse series of sighting entries. The researcher just arrived. The world is revealing itself. There are no empty columns or dashboard placeholders to explain away. The log communicates the emptiness honestly.

### Log Entry Types

All entries appear inline in the log in chronological order. Visual weight varies by type.

**Observation entries** — the most common entry type. Researcher voice, first person, no action required. Lower visual weight. The log's resting state.

**Crisis cards** — filled background, left border accent. Structurally distinct from observations. Carry an actionable CTA that escalates with urgency relative to rate of decline, not elapsed time:

- Fresh crisis: *I should respond →*
- Mid-escalation: *I need to decide →*
- Near-expiry: *Can't ignore this →*

A fast-collapsing population may escalate through all three tiers in 4-5 cycles. A slow-burning competition event may stay at tier one for 8 or more.

When a crisis resolved naturally while the player was away the CTA is replaced by a past-tense line: *resolved while you were away.* The card shape stays the same; the active voice drains out of it.

Tapping the CTA opens the decision modal over the log.

**Decision records** — appear immediately below the crisis card they belong to, at the same cycle number. Record what was chosen and what was spent. Factual, no researcher voice. Permanent.

```
Cycle 91 — DECISION
Direct support
Spent 8 specimens.
```

**Outcome entries** — appear at the cycle the outcome is determined, wherever that falls in the log. Written in researcher voice as a natural continuation of the story. No mechanical link back to the original crisis card — the connection is implicit through subject matter and voice.

> *Cycle 97 — The Vellin held. Whatever the direct support did it was enough to get them through the Keth pressure. Down to 340 but stable. Lower than I'd like. Watching.*

If the outcome cycle is far from where the player is currently reading, the entry appears at its correct position in the log. The next time they scroll past it the story is concluded.

**Research completion entries** — project completions appear as log entries with researcher findings in voice, the mechanical outcome, and a Collect button.

```
Cycle 85 — Vellin behavioral study complete.

The canopy routes are more deliberate than I
expected. They follow Feltmoss growth patterns
almost exactly, adjusting each cycle. The Keth
pressure shapes everything.

+ 120 field data collected
[Collect →]
```

Tapping Collect adds the resources and removes the button. The entry remains. Project starts also appear as brief log entries.

**Research start entries** — brief, factual.

```
Cycle 79 — Starting behavioral study on Vellin.
```

### Secondary Screens

These are not tabs. They are detail views that open from home and return to home. They appear when something demands focused attention.

**Species Page** - opens by tapping any species name anywhere in the game. Shows the full species book entry - journal text accumulated over time, research milestones, ecological role, biome, population history, known interactions. All referenced species and biomes are linked. Rename option available by tapping the species name at the top.

**Biome Page** - opens by tapping any biome name. Shows biome health history, current conditions, species present, active tools, survey milestones, biome book entries, and known hazards. Recent events in that biome listed at the bottom.

**Project Screen** - opens by tapping the research card on the home screen. Always accessible whether a project is active or not.

When a project is active:
- Shows project name, type, target species or biome
- Cycles remaining and expected completion
- Expected rewards on completion
- Below the active project: 2-3 queued suggestions shown as browsable cards with cost, duration, and reward. Informational only - cannot initiate while another project is running.

When no project is active:
- Shows 2-3 suggestion cards directly
- Each card shows project name, type, cost, duration, and expected reward
- Tap any suggestion card to initiate it

**Decision Modal** — opens when the player taps a crisis card CTA. Full screen overlay over the log. Contains situation text in researcher voice, relevant history context, and 2-3 option cards with honest uncertainty descriptions and costs. Cannot be dismissed without making a choice — the player must select an option or choose Observe (always available, no cost). After deciding the modal closes and a decision record appears immediately below the crisis card in the log at the same cycle number.

**Catalog / Introduction Screen** — opens when a vacant niche event fires as a log entry. Shows the three candidate species, their current knowledge milestone status, field notes from pre-introduction research, and the introduction button. Irreversible action requires a confirmation step.

**Researcher Log** — the log is the researcher log. It is not a separate screen. Species pages and biome pages surface relevant log entries automatically when viewed, making species- or biome-specific history findable without scrolling the full log.

### Linking Convention

Every named entity in the game is a tappable link wherever it appears:
- Species names in log entries, species pages, tool labels
- Biome names in log entries, species pages
- Tool names in log entries
- Ancestor species referenced in evolved species entries

The player navigates by curiosity, not by menu. A session might start in the log, follow a link to a species page, follow a link to another species mentioned in interactions, and return to the log — all without touching any navigation element.

---

## Known Development Challenges

These are not design problems - the design is sound. These are implementation problems that will require significant development time and iteration to solve correctly.

### 1. Balancing the Simulation Coefficients

Lotka-Volterra equations are notoriously chaotic. A predator 1% too efficient eats all prey and starves. A predator 1% too weak allows prey to explode unchecked. Finding the growth rates, death rates, predation efficiencies, and carrying capacities that produce stable interesting oscillations rather than immediate ecosystem collapse is not a design task - it is a testing task.

**The solution:** Build a headless simulation script before building any UI. This script has two jobs. First, find base coefficients that produce stable interesting oscillations across all 11 species over at least 500 cycles - running thousands of coefficient sets in seconds and reporting whether any species went extinct in the first 20 cycles, whether any population exploded, whether the ecosystem flatlined. Second, once base coefficients are established, run the `auditWorldVariance` function across 500+ world seeds to verify that starting condition variance produces the target extinction distribution (first extinction in cycles 50-100 in ~60% of runs, collapse rate under 3%). Only when both checks pass should UI development begin.

This script is the primary tool for verifying any future change. Any time a new species, trait, or mechanic is added, both the coefficient check and the variance audit should be run before it ships.

### 2. Invisible Rubber-Banding

Pure mathematics does not care about the player's experience. A mathematically valid simulation will happily collapse the entire ecosystem in cycle 8 or produce a boring monoculture that never changes. To make it a game rather than a math exercise, hidden stabilizing forces will almost certainly be needed.

Examples of rubber-banding mechanisms:
- A hidden growth bonus applied to any species whose population drops below 10% of baseline - giving it a fighting chance to recover before extinction
- A hidden predation penalty when prey populations are critically low - predators become slightly less efficient when food is scarce, preventing the final wipeout
- A minimum viable population floor above the extinction threshold where the simulation subtly protects a species from the final decline, creating more dramatic near-extinction events rather than sudden disappearances
- Biome health recovery bonuses during extended stable periods - the ecosystem slowly heals itself if left undisturbed

These mechanisms should be invisible to the player and never referenced in the writing or UI. The goal is not to prevent all extinctions - extinctions are core to the game. The goal is to make the ecosystem feel like it has a will to survive rather than a tendency to self-destruct.

### 3. Procedural Text Fatigue

Human brains are exceptional pattern-matching machines. Even with slot-based templates, history flags, and rotating observation pools, players will start recognizing the underlying structure of event text by cycle 100 or sooner. The illusion of a living world breaks the moment the player thinks "I've seen this sentence before."

**The scale of the problem:** With 11 species, multiple event types per species, and sessions potentially running for hundreds of cycles, the text system needs an enormous amount of authored variation to stay fresh. A rough estimate:

- 11 species x 8-12 observation sentences each = ~110 sentences
- Each event subtype needs 5-8 fact variants, 4-6 context variants, 4-6 reaction variants
- Reaction variants need to cover at least 3 relationship length tiers and 3 history states
- Crisis events need distinct language from observation events from decision events

This adds up to several thousand authored sentences before the game feels genuinely alive across a long playthrough.

**Mitigation strategies:**
- Prioritize variety in the researcher reaction slot since that is what players read most carefully
- Use specific simulation numbers heavily - exact population figures make templated text feel fresh because the numbers are always different
- Rotate observation detail pools aggressively and never repeat the same sentence twice in the same session
- Add rare high-quality event texts that fire infrequently - a beautifully written once-per-era observation feels more alive than constant mediocre variety
- Consider whether certain late-game events warrant fully hand-authored text rather than procedural assembly - milestone moments like first extinction or first speciation could have curated writing that fires once and is never repeated

This is primarily a content authoring challenge, not a technical one. Budget significant time for writing during development.

---

The ecosystem begins with 11 species across three biomes. They are not introduced to the player all at once - the researcher discovers them gradually based on where observation posts are placed.

### Roster Overview

| # | Role | Name | Traits | Home Biome | Border Biome | Border Position |
|---|------|------|--------|------------|--------------|-----------------|
| 1 | Highgrowth producer | Feltmoss | - | Highgrowth | - | 0 |
| 2 | Understory producer | Nightroot | - | Understory | - | 0 |
| 3 | Scorch producer | Scaleweed | - | Scorch Flats | - | 0 |
| 4 | Highgrowth grazer | Vellin | climber | Highgrowth | - | 0 |
| 5 | Understory browser | Woldren | walker | Understory | - | 0 |
| 6 | Cross-biome feeder | Brack | walker, armored | Scorch Flats | Highgrowth | 0.3 |
| 7 | Scorch specialist | Torrak | walker, armored | Scorch Flats | - | 0 |
| 8 | Highgrowth predator | Keth | flyer | Highgrowth | - | 0 |
| 9 | Ranging predator | Skethran | walker, climber | Highgrowth | Understory | 0.5 |
| 10 | Apex predator | Mordath | walker, climber, flyer | Highgrowth, Understory, Scorch Fringe | - | - |
| 11 | Decomposer | Grubmere | walker, burrower | Understory | - | 0 |

### Species Descriptions

**Feltmoss** - dense, fast-growing, covers every available surface in Highgrowth. The most abundant energy source in the ecosystem. When it thrives everything in Highgrowth thrives. When it crashes the effects are immediate. The researcher names it early - it's impossible to miss.

**Nightroot** - slow-growing, pale, feeds off mineral seepage from above. Grows in the permanent dark of the Understory floor. Extremely stable but very slow to recover if damaged. The quiet foundation of the deep layer.

**Scaleweed** - armored, mineral-crusted, grows in sparse patches across Scorch Flats. The only energy source that can survive the heat. Irreplaceable - nothing else in the ecosystem performs its function. The researcher may initially mistake it for geological formation.

**Vellin** - climber, moves through the Highgrowth canopy in groups. Fast, skittish, high population density. The most visible and relatable species. The researcher's gateway creature. Grazes Feltmoss. Primary prey of Keth and Skethran.

**Woldren** - walker, solitary, heavy. Lives on the Understory floor in permanent darkness. Long-lived, rarely seen, moves on a different time scale than everything in Highgrowth. Genuinely alien in behavior. Grazes Nightroot. Primary prey of Skethran and Mordath.

**Brack** - walker, armored. Lives at the Highgrowth/Scorch Flats Fringe with a border position of 0.3 - genuinely split between Scorch interior and edge, weighted toward Scorch. Feeds on both Feltmoss at the border and Scaleweed in Scorch Flats interior. Mechanically a Scorch-dominant creature that opportunistically accesses Highgrowth resources at the fringe. Because it has no climbing or flying capability it cannot push deeper into Highgrowth without evolving - it is permanently limited to the border zone unless evolution unlocks new traits. The entanglement species - always one producer crash away from a crisis. Tough and unglamorous. Only the Mordath hunts it.

**Torrak** - walker, armored. Lives exclusively in Scorch Flats. Solitary, slow, heavily adapted to heat. The most alien-looking creature in the starting roster. Almost no predator pressure except rare Mordath visits. Its population is regulated almost entirely by Scaleweed availability. Moves like geology.

**Keth** - flyer. Hunts Vellin from above in the Highgrowth canopy, diving through the growth. Cannot enter Understory - the darkness makes flight impossible. Its aerial hunting style explains the Vellin's perpetual skittishness. Mid-sized, territorial.

**Skethran** - walker, climber. Ranges between Highgrowth and Understory through the Fringe with a border position of 0.5. The only secondary consumer that hunts both Vellin and Woldren. Ecologically crucial - the only regular check on Woldren population besides the Mordath. Patient, deliberate, moves between light and dark.

**Mordath** - walker, climber, flyer. The only creature in the starting roster with all three movement types. Ranges across all biomes. Low population, enormous ecological impact. The only thing that hunts Brack and Torrak in their respective territories. When it disappears from a biome the secondary consumers there boom unchecked. The researcher takes many cycles to name it - it earns the name slowly.

**Grubmere** - walker, burrower. Lives in the Understory, moves through root systems and soil. Breaks down dead matter that filters down from Highgrowth and Scorch Flats. Rarely seen. Its population tracks overall ecosystem mortality - high death rates across all species means abundant food for the Grubmere. Its population affects both producer recovery rates and Understory biome health. The player may ignore it for many cycles until its collapse reveals how much everything depended on it.

### Built-in Stories

The roster creates several compelling arcs from day one:
- The Brack is always one producer crash away from a crisis
- The Woldren is so slow and alien the player takes a long time to understand it
- The Grubmere is invisible until something goes wrong
- The Mordath is dramatic and rare - every sighting feels significant
- The Skethran connects Highgrowth and Understory narratively from the start
- The Keth can never follow the Vellin into Understory if they migrate down
- The Torrak builds slowly and almost unchecked - a slow crisis accumulating in the background

---

## Movement Trait System

Each species has a set of movement traits that determine which biomes it can migrate to. Each biome has a set of accepted traits. Migration is only possible if the species has at least one trait the target biome accepts.

### Trait Definitions

- **walker** - ground movement. Standard locomotion on the forest floor or terrain surface.
- **climber** - can move between ground and canopy layers within Highgrowth, and access the Highgrowth/Understory transition.
- **flyer** - aerial movement. Can range across Highgrowth and toward Scorch Flats horizontally. Cannot enter Understory - flight is impossible in permanent darkness.
- **armored** - heat-adapted physiology. Required to survive extended time in Scorch Flats.
- **burrower** - subsurface movement through soil and root systems. Can access deep Understory zones.

### Biome Accepted Traits

```
Highgrowth:   climber, flyer
Understory:   walker, climber, burrower
Scorch Flats: armored
```

Highgrowth does not accept pure walkers - the canopy environment requires climbing or flight capability. Scorch Flats accepts only armored species - the heat is lethal to anything without heat-adapted physiology. A non-armored species can exist near the Scorch Flats border via border position but cannot migrate into the biome proper.

### Migration Check

```javascript
function canMigrateTo(species, targetBiome, targetBorderPosition = 0) {
  // Scorch Flats requires armored regardless of border position
  // Non-armored species can only exist at the fringe via border position
  // but cannot actively migrate into the biome
  if (targetBiome === "scorch_flats") {
    return species.movementTraits.includes("armored")
  }
  return species.movementTraits.some(trait =>
    targetBiome.requiredTraits.includes(trait)
  )
}
```

A species like the Mordath (walker, climber, flyer) can exist near the Scorch Flats border through its ranging behavior but cannot migrate into Scorch Flats - it lacks armored. This is enforced by the migration check, not just the narrative.

### Evolvable Traits

Beyond the starting movement traits, evolution can grant species entirely new ecological capabilities. These change not just where a species can go but what it can do - how it hunts, defends itself, reproduces, and interacts with the ecosystem.

**Movement traits** (covered above)
- walker, climber, flyer, armored, burrower

**Predation traits**
- **ambush** - increases predation efficiency dramatically but only at low population densities
- **pack hunter** - predation efficiency scales with population size, changes the whole dynamic of a predator species

**Defense traits**
- **venomous** - reduces predator effectiveness against this species, predators take a population hit when hunting them
- **nocturnal** - active only in certain cycle phases, harder to hunt, harder to observe
- **mimicry** - borrows characteristics from another species, reduces predation pressure

**Ecological traits**
- **nitrogen fixer** - species begins contributing to biome health similarly to the Grubmere, becomes a secondary decomposer
- **symbiont** - attaches to another species in a mutual dependency, both benefit but extinction of either becomes more catastrophic
- **keystone behavior** - species actively shapes its environment, affecting producer growth rates in its biome

**Reproductive traits**
- **r-strategist** - high reproductive rate with boom and bust population dynamics. Populations overshoot carrying capacity and crash repeatedly. Fast to recover from extinction pressure but unstable.
- **k-strategist** - slow reproductive rate but grows close to carrying capacity with minimal overshoot. Stable and resilient but slow to recover from population crashes.

**Behavioral traits**
- **migration trigger** - species becomes much more sensitive to biome health changes, migrates earlier under pressure
- **habitat engineer** - species modifies biome health directly through behavior

### Open Question: Evolution Constraints

Whether evolution is fully open (any species can evolve any trait) or constrained by existing traits and ecological role is an unresolved design question. A Vellin evolving venomous feels wrong. A Vellin evolving nocturnal or r-strategist feels plausible. The right answer likely involves some constraint system that makes evolution feel organic rather than arbitrary - but this requires its own dedicated design session closer to building the evolution system.

---

## Border Position Model

Species that live at biome edges rather than inside a single biome are modeled with a border position value.

```javascript
species.homeBiome = "scorch_flats"    // primary identity, used for events and log
species.borderBiome = "highgrowth"    // the biome it borders
species.borderPosition = 0.3          // 0 = fully inside home, 1 = fully at border
                                      // Brack at 0.3: 70% Scorch, 30% Highgrowth
```

Growth equations blend conditions from both biomes proportionally:

```javascript
growthRate =
  (homeBiomeConditions x (1 - borderPosition)) +
  (borderBiomeConditions x borderPosition)
```

Species with no border living have borderBiome set to null and borderPosition of 0. Border position can evolve over time, gradually pushing a species further into one biome or retreating toward the other.

---

## Decomposer Mechanics

The Grubmere does not fit the standard predator/prey model. It feeds on dead matter rather than living creatures.

**Dead matter proxy** - the Grubmere population tracks overall ecosystem mortality as a proxy for dead matter. Each cycle total deaths across all species are summed. This value determines Grubmere food availability and drives its population growth. A baseline natural death rate floor is guaranteed across all species regardless of population stability - this ensures the Grubmere always has a minimum food supply even during highly stable ecosystem periods. Without this floor a peaceful stable ecosystem could starve the Grubmere, collapsing producer recovery rates and triggering a cascade failure caused by the ecosystem being too healthy.

**Ecosystem effects** - Grubmere population affects two things simultaneously:
- **Producer recovery rates** - high Grubmere population means producers recover faster after being grazed. Low Grubmere means producers recover slowly even when consumer pressure is low.
- **Understory biome health** - Grubmere population directly contributes to Understory health, which cascades to everything living there.

**Collapse consequences** - if the Grubmere population collapses, dead matter accumulates unprocessed, producer growth rates drop across all biomes, and Understory health deteriorates. The effects spread slowly but are difficult to reverse.

---

## Apex Predator Movement

The Mordath is the only species that moves with apparent intention rather than migrating under pressure. It follows prey actively.

Each cycle the Mordath's territory is updated based on prey availability:

```javascript
function updateMordathTerritory(mordath, biomes) {
  const currentPrey = getPreyInBiome(mordath, mordath.territory)
  if (currentPrey < mordath.minimumPreyThreshold) {
    mordath.territory = getBiomeWithMostPrey(mordath, biomes)
    fireMordathMovementEvent(mordath)
  }
}
```

When the Mordath moves a movement event fires. Secondary consumers in the abandoned biome begin to boom. The Mordath cannot penetrate deep into Scorch Flats - it lacks the armored trait. It can visit the Highgrowth/Scorch Fringe to hunt Brack but cannot reach Torrak in the interior. This makes the Torrak population almost entirely self-regulating.

---

## Visual Direction

**Approach:** Text-based UI with strong typography and color. No canvas, no sprites. The writing carries the world. The interface reads like a researcher's instrument panel and field journal combined.

**Tone:** Alien but legible. Strange but not hostile. The world should feel genuinely discovered.

**Biome color coding:** Each biome has a distinct color identity used consistently across the UI to orient the player spatially without a map.

**Typography:** To be defined. Font pairing and type scale are the primary visual design tool.

**UI philosophy:** Minimal. The log is the interface. Status lives in the sticky header. Detail lives in secondary screens reached by tapping links. Data surfaces on demand. Notifications are sparse and meaningful — they feel like messages from a field camera, not urgency prompts.

---

*This document is a living design artifact. All names, numbers, and mechanics are subject to revision.*
