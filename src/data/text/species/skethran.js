// ─── Skethran observation pool ────────────────────────────────────────────────
//
// Ranging predator. Highgrowth primary, Understory border.
// Hunts: Vellin (Highgrowth, lag 1 cycle), Woldren (Understory, lag 8 cycles).
// 563 surge events / 20 reference runs — most of any predator.
//
// The most ecologically connected species. {species} distribution is a running
// commentary on the state of both biomes. The researcher's relationship shifts
// from "nothing unusual" to using {species} as their primary system indicator
// before checking any direct population numbers.
//
// Physical: long-bodied, four-limbed, fluid. Dusty amber in the Highgrowth,
// darker and less saturated in the Understory — researcher initially thought
// these were two different species before tracking one individual across the
// border. "Nothing unusual" in early notes — almost apologetic. Hunts by
// waiting and following rather than pursuit; tracked one individual for half
// a cycle before it committed. Does not hesitate at biome transitions.
//
// Writing rules:
//   sighted   — "nothing unusual"; fluid, medium, forgettable at first
//   known     — biome distribution starting to read as information
//   understood — indicator species; watching {species} to understand everything else
//   modeled   — reading {species} distribution before checking direct counts
//   always note biome concentration. Skethran entries usually contain a second species.
//   1-cycle Highgrowth lag vs 8-cycle Understory lag — different timescales in one animal.

import { OBSERVATION_POOLS } from '../tokens.js'

OBSERVATION_POOLS['skethran'] = {

  sighted: {
    any: [
      "Long-bodied, four-limbed. Moving at ground level through the {homeBiome} base.",
      "Nothing unusual. A medium-sized predator at the canopy floor. I noted it and moved on.",
      "Fluid movement, low, patient. It didn't seem to be actively hunting — just moving.",
      "Dusty amber coloring. Hard to track visually in the mid-canopy light.",
      "Watched it hold position for most of an hour before moving again. I couldn't determine what it was waiting for.",
      "Ground level at the {homeBiome} base. I thought briefly it was a different species until I tracked the movement pattern.",
    ],
  },

  known: {
    any: [
      "{species} concentrated in {homeBiome} today. The usual distribution when Vellin is available.",
      "Observed a hunting sequence — half a cycle of patient following before any commitment. Methodical.",
      "Crossed into {borderBiome} during my afternoon survey. Didn't hesitate at the transition.",
      "Three individuals in the same {homeBiome} section without apparent competition. Range overlap, no tension.",
      "The coloring shifts at the border — amber in the {homeBiome} goes darker in the {borderBiome}. Same individual.",
      "Movement quality changes in the {borderBiome} — slower, more deliberate, closer to the floor.",
      "Hunting by waiting, not pursuit. I've been following the same individual for most of this cycle.",
    ],
    high: [
      "{species} concentrated in {homeBiome}. Vellin must be building — I check next.",
      "Multiple individuals in the same survey area. The Vellin situation is clearly supporting the density.",
      "Heavy {homeBiome} concentration. The prey situation here is active enough to hold them.",
    ],
    low: [
      "Sparse in both biomes today. Both prey populations may be simultaneously low.",
      "Only one sighting across the full survey. {species} density has dropped significantly.",
      "Absent from the Fringe — the usual concentration point. Something has shifted in the prey distribution.",
    ],
  },

  understood: {
    any: [
      "I've started reading {species} distribution before I check prey numbers. The distribution tells the story first.",
      "Heavy {homeBiome} concentration means Vellin is under pressure or building fast. Heavy {borderBiome} concentration means Woldren is the active target.",
      "The 8-cycle {borderBiome} lag versus the 1-cycle {homeBiome} lag — {species} responds to these pressures on very different timescales.",
      "When {species} is absent from the Fringe, that's the signal. The Fringe is its natural position. Absence is data.",
      "The amber-to-dark shift is consistent across all individuals at the border. Not camouflage — more like the biome registering in the surface.",
    ],
    high: [
      "{species} dense in {homeBiome}. Vellin is building or already elevated. The lag is 1 cycle — the response is almost simultaneous.",
      "The {homeBiome} concentration is heavy enough that I don't need to count Vellin directly to know the state.",
      "Multiple individuals active in the same section without conflict. Vellin is abundant enough to remove the spacing pressure.",
    ],
    low: [
      "Sparse in both biomes means both prey populations have contracted. I verify each separately.",
      "The {borderBiome} concentration has dropped. The 8-cycle lag makes this hard to read — what drove them there may have resolved cycles ago.",
      "Light in both biomes. I use {species} absence as a cross-biome signal and go check the numbers.",
    ],
    crash: [
      "Both prey populations must be near floor simultaneously. {species} is ranging wide and finding little.",
      "Absent from both biomes for two survey cycles. I take that seriously now.",
      "The distribution tells me the system is in a trough. I verify with direct counts, but {species} told me first.",
    ],
  },

  modeled: {
    any: [
      "I check {species} distribution before I run any prey count. It's the fastest read on the state of both biomes.",
      "The 1-cycle {homeBiome} lag versus the 8-cycle {borderBiome} lag — I'm always reading two timescales from the same distribution map.",
      "I have more movement data on {species} than on almost anything else, because its movements encode information about every biome it touches.",
    ],
    high: [
      "Dense in {homeBiome}. Vellin is at or approaching peak. One cycle to the pressure event.",
      "Heavy concentration at the Fringe — working both biomes simultaneously. Both prey populations are adequate.",
      "The {homeBiome} concentration confirms what the Vellin count will show. I log the distribution first, the count second.",
    ],
    low: [
      "Sparse and ranging wide. Both prey populations under pressure. The distribution is the fastest confirmation.",
      "Only Fringe sightings — the neutral position. Prey populations balanced in their scarcity.",
      "Low {species} density is the leading indicator for a system in recovery. I watch for the distribution to shift back.",
    ],
    crash: [
      "Absent from both biomes in three consecutive surveys. Both prey populations are at floor.",
      "The distribution is the most informative signal I have across the whole system. When it goes quiet, everything has gone quiet.",
      "Waiting for {species} to return to {homeBiome}. That will be the first signal of prey recovery.",
    ],
  },

}
