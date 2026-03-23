# ECHOSPHERE - Game Design Document
*Version 1.6 - Second Review Fixes Applied*

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
- Manage resources manually
- Play in real time

### What the Player DOES Do
- Observe the ecosystem through a passive view
- Receive event notifications when significant things happen
- Make infrequent decisions when events require a response
- Place and manage research tools
- Occasionally introduce species from a limited catalog
- Guide evolutions when they occur
- Monitor biome health and species populations at a glance

### Session Structure
A typical player session is short (2-5 minutes):
1. Open the app - see what changed since last visit
2. Read any pending events
3. Make a decision (or defer it)
4. Check tool status, replace any destroyed equipment
5. Observe the current state briefly
6. Close the app - the world continues

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

### Trigger Categories

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

Events are generated from simulation data combined with a procedural text system. No AI generation - all text is assembled from authored pools combined at runtime.

### Template Structure

Every event is built from slots:

```
[observation_detail] [fact] [context?] [researcher_reaction]
```

Context only appears if relevant history exists. The system rewards long playthroughs by generating richer, more personal text as history accumulates.

### Species History Flags
Each species tracks flags that shape event text:
- `cyclesObserved` - how long the researcher has known them
- `previousCrashes` - number of past population crises
- `lastCrashCycle` - cycle number of most recent crisis
- `crossedBiome` - whether they have migrated before
- `symbioticPartners` - known relationships with other species

### Example - Same Event, Three Outputs

Simulation data: Vellin population declined 23%, cause is predator pressure from Keth.

**Cycle 8** (newly named, no crash history):
> *Saw fewer Vellin near the Feltmoss today. Numbers down 12% - Keth pressure from above. Still learning what Keth pressure means for them.*

**Cycle 34** (well known, no crash history):
> *The Vellin have pulled back toward the northern Highgrowth. Keth ranging further down. Vellin down 23% this cycle. They usually recover. Usually.*

**Cycle 67** (well known, one previous crash at cycle 58):
> *The upper Highgrowth was quiet this cycle. Vellin taking heavy losses. 23% decline, Keth are deep in their range. This is the same pattern that preceded the crash in cycle 58. I know this pattern. I don't like it.*

### Avoiding Repetition
- Events reference specific numbers from the simulation - specificity prevents generic feel
- Observation details rotate from a species-specific pool of 8-12 sentences
- Context slot references real history - the word "again" does enormous work
- Researcher reaction varies by relationship length and history flags
- Quiet cycles between events make eventful ones land harder
- Early game leans on uncertainty as a natural source of variety

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

The game runs on an accelerated internal clock. One in-game cycle represents a meaningful period of ecological change - roughly equivalent to a season.

- **Real time to in-game time:** Approximately 1 hour real = 1 cycle in-game
- **Cycle calculation:** Cycles are calculated client-side on app open. The simulation runs in batch for all elapsed cycles since last visit, then saves the new state to IndexedDB.
- **Cap:** The simulation runs a full batch up to a maximum of 200 elapsed cycles. Beyond 200 cycles the simulation stops and the world is presented as it was at cycle 200. No approximation is attempted - approximating an 11+ species food web produces misleading results. If the player was away long enough to exceed the cap, the writing acknowledges it directly:

> *You were away for a long time. The station could only track reliably up to 200 cycles ahead. The world you return to reflects that point - what happened after is unknown.*

JavaScript can run hundreds of Lotka-Volterra iterations in milliseconds so the 200 cycle full simulation is not a performance concern.
- **Visible time:** The app shows current cycle, season analog, and approximate time since last visit.

Long absences should feel significant but not punishing. The world does not collapse because the player was gone. But things will have happened.

---

## Onboarding

### Philosophy
The game explains itself through experience, not instruction. No tutorial prompts, no feature explanations, no difficulty selection. The player arrives at an unknown world and the world reveals itself over time.

### The First Screen
Just the researcher name input. Sparse, understated:

> *ECHOSPHERE*
> *A research station has been established.*
> *Enter your name to begin.*

One text input. The player types their name. Cycle 1 begins immediately.

### The First Session

**Cycle 1 - Arrival:**
> *Cycle 1*
> *I've reached the site. The region is larger than the survey suggested. Three distinct environmental zones visible from the ridge - a dense low-lying area to the north, exposed and bright to the south, and something darker further east that I can't make out yet. No signs of life from this distance. Starting tomorrow.*

No ecosystem overview. No species list. No biome map. The player sees what the researcher sees.

**Cycle 2 - First Sighting:**
> *Something in the southern zone today. Pale, low to the ground, moving in a group. Gone before I could get closer. Made a note.*

The species book gets its first entry - unnamed, almost empty. The emptiness is exciting rather than frustrating because the writing sells the mystery.

### Early Game Structure
The first several real-time hours follow a natural arc:

- **Cycle 1:** Arrive, name researcher, see the three zones, place first observation posts
- **Cycle 2-3:** First creature sighting, place sample collector on first noticed creature
- **Cycle 4-6:** Place environmental sensor, first biome readings arrive
- **Cycle 7-10:** First naming event, species book begins filling
- **Cycle 10+:** First decision events, enough context to care

### The First Naming
After three or four sightings of the same creature, the journal entry shifts:

> *Cycle 7*
> *The pale group again - fifth sighting now. They seem to favor the southern border in the early cycles. I keep calling them "the pale ones" in my notes which is getting tedious. Vorrith. That feels right. I'll call them Vorrith.*

No popup. No prompt. The name appears in the narrative. The player can tap it to rename if they want.

### What the Player Should Feel After Session One
Not informed. Not tutored. Just curious. They should close the app thinking: *what was that thing in the southern zone? What's in that dark eastern area? What do the Vorrith eat?*

Questions, not answers. That is the correct emotional state for everything that follows.

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

### Batch Calculation

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
    }
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
        previousCrashes: 1,
        lastCrashCycle: 58,
        peakPopulation: 1240,
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

Two resources drive the active session layer. They come from different sources and are spent on different things, creating a natural tension between patient research and direct intervention.

### Field Data
Generated passively by active tools - observation posts and environmental sensors produce it slowly over time. Spent on infrastructure and information:
- Unlocking and placing new tools
- Researching catalog candidates before introduction
- Tool upgrades (future expansion)

Field Data is the patient researcher's resource. It rewards having tools well placed and sessions that check in regularly.

### Specimens
Generated by sample collectors and triggered by specific events - a successful migration, a population milestone, a rare interaction observed. Rarer and more valuable than field data. Spent on direct interventions:
- Introducing a catalog species to fill a vacant niche
- Guiding an evolution when the opportunity arises
- Supporting a collapsing population during a crisis

Specimens are the interventionist's resource. They are precious and every spend is a commitment.

### Resource Tension
Some players will hoard specimens and intervene constantly. Others will spend everything on field data researching candidates thoroughly before ever introducing anything. Both are valid and produce different worlds.

---

## Knowledge Milestones

Species do not have a visible level number. Instead each species entry in the species book shows a set of research milestones that fill in over time. Milestones are both a progress indicator and an intervention unlock system - no separate UI needed.

### Milestone Progression

> *First observed - Named - Role identified - Behavior mapped - Population modeled*

Each milestone is either greyed out or filled in. Greyed out milestones are as interesting as filled ones - they tell the researcher what is still unknown.

**First observed** - unlocked on first sighting. Basic species book entry created.

**Named** - unlocked after several sightings. The researcher coins a name in the journal. Player can rename by tapping the name.

**Role identified** - ecological role confirmed through observation. Sample collector can now be attached.

**Behavior mapped** - movement patterns, predator/prey relationships, biome preferences understood. Evolution guidance now possible.

**Population modeled** - population dynamics understood, cycle rhythms mapped. Full intervention options unlocked. Specimens cost reduced for this species.

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
The interface reads like a researcher's instrument panel and field journal combined. One home screen handles the majority of every session. Secondary screens are detail views or focused decision moments - they open from home and return to home. There are no persistent tabs.

Everything that names a species, biome, or tool is a tappable link. The whole game is hypertext - a living cross-referenced document the player navigates by curiosity.

### Home Screen

The home screen is the game. Most sessions never leave it. Information is organized top to bottom by urgency.

```
---------------------------------
ECHOSPHERE                  [Log]
Dr. Voss - Cycle 94
Away 6 hours - 6 cycles passed
---------------------------------
RESOURCES
Field Data: 340    Specimens: 12
---------------------------------
EVENTS  (2 pending)

[Event card - urgent]
The [Vellin] population is
collapsing in [Highgrowth].
Keth pressure severe.
[Intervene]  [Observe]

[Event card - observation]
A small group of [Vellin] have
crossed into [Understory] for
the first time.
---------------------------------
ECOSYSTEM
Highgrowth    [||||||||  ]  stable
Understory    [||||||    ]  rising
Scorch Flats  [||||      ]  stress

SPECIES
[Vellin]         847   up 12%
[Keth]           203   down 8%
[Feltmoss]      1840   stable
---------------------------------
TOOLS
Obs. Post - [Highgrowth]     active
Obs. Post - [Scorch Flats]   active
Sample Collector - [Vellin]  active
Env. Sensor - [Understory]   active
---------------------------------
```

**Return header** - "Away 6 hours - 6 cycles passed" immediately orients the player before they read a single event. Reinforces that the world kept running without them.

**Resources** - field data and specimens always visible, always current.

**Events** - shown above ecosystem because events are why the player opened the app. Most urgent first. Each card contains the event text with linked species and biome names, and any available action buttons inline.

**Ecosystem** - biome health as a simple text indicator (stable, rising, stress, critical) with a visual bar requiring no canvas. Species listed with current population and cycle-over-cycle directionality. Everything linked.

**Tools** - four lines, status at a glance. Tap any tool to manage it.

### Secondary Screens

These are not tabs. They are detail views that open from home and return to home. They appear when something demands focused attention.

**Species Page** - opens by tapping any species name anywhere in the game. Shows the full species book entry - journal text accumulated over time, research milestones, ecological role, biome, population history, known interactions. All referenced species and biomes are linked. Rename option available by tapping the species name at the top.

**Biome Page** - opens by tapping any biome name. Shows biome health history, current conditions, species present, active tools, recent events in that biome.

**Decision Screen** - opens when a significant decision event fires. Full event text, context from researcher history, two or three clearly labeled choices with described consequences. Returns to home after decision is made. Designed to feel weighty - this is an irreversible or significant moment.

**Catalog / Introduction Screen** - opens when a vacant niche event fires. Shows the three candidate species with their current knowledge milestone status, field notes accumulated through research, and the introduction button. Costs and consequences clearly shown. Irreversible action requires a confirmation step.

**Researcher Log** - opens from the [Log] button in the header. A drawer or full screen of chronological log entries - decisions made, species named, extinctions recorded, eras marked. Fully linked. Read-only reference.

### Linking Convention

Every named entity in the game is a tappable link wherever it appears:
- Species names in event text, log entries, species pages, tool labels
- Biome names in events, species pages, ecosystem section
- Tool names in events and log entries
- Ancestor species referenced in evolved species entries
- Era markers in the researcher log

The player navigates by curiosity, not by menu. A session might start on the home screen, follow a link to a species page, follow a link to another species mentioned in interactions, and return home - all without touching any navigation element.

---

## Known Development Challenges

These are not design problems - the design is sound. These are implementation problems that will require significant development time and iteration to solve correctly.

### 1. Balancing the Simulation Coefficients

Lotka-Volterra equations are notoriously chaotic. A predator 1% too efficient eats all prey and starves. A predator 1% too weak allows prey to explode unchecked. Finding the growth rates, death rates, predation efficiencies, and carrying capacities that produce stable interesting oscillations rather than immediate ecosystem collapse is not a design task - it is a testing task.

**The solution:** Build a hidden headless simulation script before building any UI. This script runs thousands of cycles in seconds with different coefficient sets and reports outcomes - did any species go extinct in the first 20 cycles, did any population explode to infinity, did the ecosystem reach a boring flat line. Run it repeatedly until a coefficient set produces interesting oscillating behavior across all 11 species over at least 500 cycles. Only then start building the game around those numbers.

This script will also be invaluable for testing future changes. Any time a new species, trait, or mechanic is added the headless simulation verifies it doesn't destabilize the ecosystem before it ships.

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

**UI philosophy:** Minimal. Event cards, status indicators, decision screens, tool status, and the researcher log. Data surfaces on demand. Notifications are sparse and meaningful. The game never panics - notifications feel like field camera alerts, not urgency prompts.

---

*This document is a living design artifact. All names, numbers, and mechanics are subject to revision.*
