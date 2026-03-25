// ─── Biome definitions ───────────────────────────────────────────────────────

export const BIOME_DEFS = {
  highgrowth: {
    id: 'highgrowth',
    name: 'Highgrowth',
    acceptedTraits: ['climber', 'flyer'],
  },
  understory: {
    id: 'understory',
    name: 'Understory',
    acceptedTraits: ['walker', 'climber', 'burrower'],
  },
  scorchFlats: {
    id: 'scorchFlats',
    name: 'Scorch Flats',
    acceptedTraits: ['armored'],
  },
}

// ─── Species template definitions ────────────────────────────────────────────
//
// These are read-only blueprints. createInitialState() in engine.js turns them
// into live state objects. Do NOT mutate these.
//
// Coefficient notes:
//   attackRate  – how efficiently the predator encounters prey (LV α)
//   efficiency  – fraction of consumed prey converted to predator population (LV ε)
//   borderScaled – true if this predation is scaled by the predator's borderPosition
//                  (applies when a border species only partially accesses a biome)
//
// Tuning targets (run scripts/simulate.js to check):
//   – No extinction in first 50 cycles
//   – No population above 10 000
//   – 30–100 events per 500 cycles
//   – ≥ 8/11 species surviving at cycle 500
//   – Visible predator/prey oscillation (not flat lines)

export const SPECIES_DEFS = [
  // ── Producers ──────────────────────────────────────────────────────────────

  {
    id: 'feltmoss',
    name: 'Feltmoss',
    catalogRole: 'producer',
    role: 'producer',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 800,
    carryingCapacity: 1500,
    naturalGrowthRate: 0.18,
    naturalDeathRate: 0.005,
    movementTraits: [],
    biomeComfort: { highgrowth: 1.0, understory: 0.0, scorchFlats: 0.0 },
    eats: [],
  },
  {
    id: 'nightroot',
    name: 'Nightroot',
    catalogRole: 'producer',
    role: 'producer',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 400,
    carryingCapacity: 700,
    naturalGrowthRate: 0.08,
    naturalDeathRate: 0.003,
    movementTraits: [],
    biomeComfort: { highgrowth: 0.0, understory: 1.0, scorchFlats: 0.0 },
    eats: [],
  },
  {
    id: 'scaleweed',
    name: 'Scaleweed',
    catalogRole: 'producer',
    role: 'producer',
    homeBiome: 'scorchFlats',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 200,
    carryingCapacity: 350,
    naturalGrowthRate: 0.18,
    naturalDeathRate: 0.003,
    movementTraits: [],
    biomeComfort: { highgrowth: 0.0, understory: 0.0, scorchFlats: 1.0 },
    eats: [],
  },

  // ── Primary consumers ──────────────────────────────────────────────────────

  {
    id: 'vellin',
    name: 'Vellin',
    catalogRole: 'primaryConsumer',
    role: 'grazer',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 500,
    naturalDeathRate: 0.015,
    movementTraits: ['climber'],
    biomeComfort: { highgrowth: 1.0, understory: 0.6, scorchFlats: 0.0 },
    eats: [
      { preyId: 'feltmoss', attackRate: 0.0002, efficiency: 0.40 },
    ],
  },
  {
    id: 'woldren',
    name: 'Woldren',
    catalogRole: 'primaryConsumer',
    role: 'browser',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 150,
    naturalDeathRate: 0.038,
    movementTraits: ['walker'],
    biomeComfort: { highgrowth: 0.0, understory: 1.0, scorchFlats: 0.0 },
    eats: [
      { preyId: 'nightroot', attackRate: 0.00025, efficiency: 0.60 },
    ],
  },
  {
    id: 'brack',
    name: 'Brack',
    catalogRole: 'primaryConsumer',
    role: 'crossBiomeFeeder',
    homeBiome: 'scorchFlats',
    borderBiome: 'highgrowth',
    borderPosition: 0.3,   // 70 % Scorch, 30 % Highgrowth border access
    startingPopulation: 75,
    naturalDeathRate: 0.065,
    movementTraits: ['walker', 'armored'],
    biomeComfort: { highgrowth: 0.6, understory: 0.0, scorchFlats: 1.0 },
    eats: [
      // borderScaled: attack rate multiplied by borderPosition at runtime
      { preyId: 'feltmoss',  attackRate: 0.0002, efficiency: 0.30, borderScaled: true },
      { preyId: 'scaleweed', attackRate: 0.0004, efficiency: 0.50 },
    ],
  },
  {
    id: 'torrak',
    name: 'Torrak',
    catalogRole: 'primaryConsumer',
    role: 'scorchSpecialist',
    homeBiome: 'scorchFlats',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 170,
    naturalDeathRate: 0.076,
    movementTraits: ['walker', 'armored'],
    biomeComfort: { highgrowth: 0.0, understory: 0.0, scorchFlats: 1.0 },
    eats: [
      { preyId: 'scaleweed', attackRate: 0.0006, efficiency: 0.40 },
    ],
  },

  // ── Predators ──────────────────────────────────────────────────────────────

  {
    id: 'keth',
    name: 'Keth',
    catalogRole: 'secondaryConsumer',
    role: 'predator',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 60,
    naturalDeathRate: 0.017,
    movementTraits: ['flyer'],
    biomeComfort: { highgrowth: 1.0, understory: 0.0, scorchFlats: 0.3 },
    eats: [
      { preyId: 'vellin', attackRate: 0.00018, efficiency: 0.65 },
    ],
  },
  {
    id: 'skethran',
    name: 'Skethran',
    catalogRole: 'secondaryConsumer',
    role: 'rangingPredator',
    homeBiome: 'highgrowth',
    borderBiome: 'understory',
    borderPosition: 0.5,   // split equally between Highgrowth and Understory
    startingPopulation: 80,
    naturalDeathRate: 0.012,
    movementTraits: ['walker', 'climber'],
    biomeComfort: { highgrowth: 1.0, understory: 0.8, scorchFlats: 0.0 },
    eats: [
      { preyId: 'vellin',  attackRate: 0.00015, efficiency: 0.60 },
      { preyId: 'woldren', attackRate: 0.00022, efficiency: 0.60 },
    ],
  },
  {
    id: 'mordath',
    name: 'Mordath',
    catalogRole: 'apexPredator',
    role: 'apexPredator',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 15,
    naturalDeathRate: 0.007,
    movementTraits: ['walker', 'climber', 'flyer'],
    biomeComfort: { highgrowth: 1.0, understory: 0.8, scorchFlats: 0.4 },
    eats: [
      { preyId: 'woldren', attackRate: 0.00025, efficiency: 0.55 },
      { preyId: 'brack',   attackRate: 0.00024, efficiency: 0.55 },
      { preyId: 'torrak',  attackRate: 0.00025, efficiency: 0.55 },
    ],
  },

  // ── Decomposer ─────────────────────────────────────────────────────────────

  {
    id: 'grubmere',
    name: 'Grubmere',
    catalogRole: 'decomposer',
    role: 'decomposer',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 200,
    carryingCapacity: 500,
    naturalGrowthRate: 0.15,   // relative to dead-matter supply
    naturalDeathRate: 0.04,
    movementTraits: ['walker', 'burrower'],
    biomeComfort: { highgrowth: 0.0, understory: 1.0, scorchFlats: 0.0 },
    eats: [],   // eats dead matter — handled specially in engine
  },
]
