// ─── Woldren observation pool ─────────────────────────────────────────────────
//
// Understory browser. Ancient and unknowable.
// Predators: Skethran (main), Mordath (occasional). Food: Nightroot.
// 20/20 extinction warnings across reference runs. CV 138.3%.
//
// The researcher never feels like they understand Woldren. Every tier reveals
// new questions. The 8-cycle predator lag means the researcher often can't trace
// cause to effect in real time. Extinction is quiet — the researcher realizes
// late. "I'm not sure when the decline started" is the right register.
//
// Physical: massive, low-slung, moves like slow water through the dark. First
// size estimate was wrong — much larger than it looks because it keeps its body
// flush to the floor. Hide is dark grey-brown, non-reflective. Scattered pale
// bioluminescent flecks, irregularly distributed, function unknown. Eyes never
// clearly located. Head differentiation is subtle.
//
// Detection: scrape-marks in Nightroot surface (primary), low vibration
// ("substrate conducting something large"), rare direct sighting.
//
// Writing rules:
//   sighted   — shape-and-position in the dark; the pale flecks; wrong size estimate
//   known     — scrape-marks as primary evidence; questions that don't get answered
//   understood — long slow rhythms; 8-cycle lag; indifference still unsettling
//   modeled   — predicted population, still opaque animal; named individuals

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['woldren'] = {

  sighted: {
    any: [
      "Something large in the corridor. Much larger than I'd estimated from the track width.",
      "Pale flecks irregularly distributed across a dark surface. Moving. Very slowly.",
      "The vibration I've been feeling in the floor — it's this. The substrate conducting something large.",
      "Low and flat against the {homeBiome} floor. Still for a long time. Then not quite still.",
      "I had the size wrong. I've had to revise my estimate upward twice now.",
      "The flecks don't pulse. Fixed points of pale light on something that barely moves.",
    ],
  },

  known: {
    any: [
      "Scrape-marks in the {primaryFood} surface — long parallel scores where something pressed and ground along the root mass.",
      "{species} feeds by pressing against the {primaryFood} and grinding. The marks are the primary evidence I work from.",
      "I've surveyed this corridor twice since the last sighting. The scrape-marks are fresh, but no direct observation.",
      "It didn't react to my approach at all. Continued at the same pace. I waited twenty minutes before giving up.",
      "I'm finding scrape-marks in corridors I'd assumed were unused. The range is wider than I mapped.",
      "The low vibration is {species}. I've confirmed it now. More felt than heard.",
      "No two individuals observed in the same corridor in the same session.",
    ],
    high: [
      "Three separate scrape-mark sites today, all fresh. More active across the survey area than my baseline suggests.",
      "Two individuals in this corridor within a short interval. I've never recorded that before.",
      "The {primaryFood} floor is being worked heavily across the survey area. Something is elevated.",
    ],
    low: [
      "Scrape-marks only. No direct sighting this cycle or the previous two.",
      "Older marks — days, by the surface condition. Whatever came through here hasn't been back.",
      "The {primaryFood} floor in the main corridors is mostly undisturbed. {species} isn't working these sections.",
    ],
  },

  understood: {
    any: [
      "I've been trying to locate the eyes for many cycles. Head differentiation is subtle enough that I can't confirm anything.",
      "The 8-cycle lag between {primaryPredator} pressure and {species} response means I often can't trace cause to effect in real time.",
      "{species} doesn't appear to read threats at the pace I'd expect. It moves on its own schedule regardless.",
      "The bioluminescent flecks still have no hypothesis attached. Thermal? Vestigial? I've stopped guessing.",
      "I can predict population movement without understanding the animal at all. That gap has not closed.",
      "The slow grinding at the {primaryFood} surface is the most precise behavioral observation I have. Everything else is inference.",
    ],
    high: [
      "Seeing {species} more often than usual. This feels wrong, not reassuring — high numbers mean {primaryPredator} is low.",
      "The {primaryFood} floor is being worked at an unusually high rate. The scrape-mark density tells the story before I count.",
      "High {species} count means the predator pressure that would normally check this is absent or elsewhere.",
    ],
    low: [
      "Scrape-marks only in all three corridors I surveyed. No direct sighting for several cycles.",
      "The {primaryFood} floor is recovering in sections where I normally expect active grazing. Something has withdrawn.",
      "I track {species} through absence more than presence now. The absence has become clearer than the presence.",
    ],
    crash: [
      "Old marks only. I haven't confirmed a living individual in eight cycles. There may be others deeper in the {homeBiome}.",
      "The floor is quiet in a way that doesn't read as normal low-population silence. It reads as near-empty.",
      "I'm not sure when the decline started. I was watching other things. I was watching {primaryPredator}.",
    ],
  },

  modeled: {
    any: [
      "I can project the population curve. I cannot model the animal. That gap has never closed across all the cycles I've tracked it.",
      "The 8-cycle lag is the defining mechanical fact. By the time {species} responds to {primaryPredator} pressure, the window is often past.",
      "The individual I've been calling the northern individual hasn't appeared in the survey data for three cycles. Still logging its range.",
    ],
    high: [
      "High {species} numbers correlate with low {primaryPredator}. It's thriving in a predator absence, not an abundance. I read it carefully.",
      "The northern individual appeared again. Its range hasn't changed in many cycles. I note the consistency without knowing what it means.",
      "High population and the {primaryFood} floor being worked hard across the survey area. The pressure will arrive eventually.",
    ],
    low: [
      "Low count. {primaryPredator} pressure has been building for several cycles. The lag is running its course.",
      "I track {species} through floor condition at this population level. The scrape-marks are the more reliable signal.",
      "Low enough that I'm watching for the warning. The decline is gradual right until it isn't.",
    ],
    crash: [
      "The last direct sighting was twelve cycles ago. I've continued logging the scrape-mark condition since.",
      "Near-extinction again. The {homeBiome} doesn't announce it. I find out by noticing I've stopped seeing the flecks in the dark.",
      "I don't know how many are left or where. I've never known. The {homeBiome} doesn't give that information easily.",
    ],
  },

}
