// ─── Catalog species ──────────────────────────────────────────────────────────
//
// 18 catalog entries — 3 candidates per ecological role, 6 roles.
// Roles: producer, primaryConsumer, secondaryConsumer, apexPredator,
//        decomposer, specialist.
//
// candidateType:
//   A — close analog to what was lost. Safer, more predictable dynamics.
//   B — fills the role but from a different biome. Higher risk, novel interactions.
//   C — partially fills the role; opens a new ecological possibility.
//
// Candidates list prey that may include other catalog species. The engine
// handles absent prey gracefully (predation = 0 when prey pop = 0).
//
// introPopulation is used when the species is first introduced — smaller than
// the eventual baseline, reflecting a founding cohort rather than an
// established population.

export const CATALOG_SPECIES = [

  // ── Producer ───────────────────────────────────────────────────────────────

  {
    id: 'phaelight',
    name: 'Phaelight',
    catalogRole: 'producer',
    candidateType: 'A',
    introPopulation: 120,
    fieldNote: 'Pale, waxy fronds. Spreads slowly toward light. Single specimens visible from above.',

    role: 'producer',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 300,
    carryingCapacity: 1200,
    naturalGrowthRate: 0.16,
    naturalDeathRate: 0.006,
    movementTraits: [],
    biomeComfort: { highgrowth: 1.0, understory: 0.4, scorchFlats: 0.0 },
    eats: [],
  },

  {
    id: 'moldcap',
    name: 'Moldcap',
    catalogRole: 'producer',
    candidateType: 'B',
    introPopulation: 80,
    fieldNote: 'Fungal-like clusters. Grows in dim conditions. Spreads by spore drift.',

    role: 'producer',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 200,
    carryingCapacity: 550,
    naturalGrowthRate: 0.11,
    naturalDeathRate: 0.004,
    movementTraits: [],
    biomeComfort: { highgrowth: 0.4, understory: 1.0, scorchFlats: 0.0 },
    eats: [],
  },

  {
    id: 'cindermat',
    name: 'Cindermat',
    catalogRole: 'producer',
    candidateType: 'C',
    introPopulation: 60,
    fieldNote: 'Flat heat-resistant mats. Grows very slowly. Survives extreme thermal cycles.',

    role: 'producer',
    homeBiome: 'scorchFlats',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 160,
    carryingCapacity: 280,
    naturalGrowthRate: 0.22,
    naturalDeathRate: 0.003,
    movementTraits: [],
    biomeComfort: { highgrowth: 0.2, understory: 0.0, scorchFlats: 1.0 },
    eats: [],
  },

  // ── Primary consumer ───────────────────────────────────────────────────────

  {
    id: 'lurren',
    name: 'Lurren',
    catalogRole: 'primaryConsumer',
    candidateType: 'A',
    introPopulation: 50,
    fieldNote: 'Stocky, ground-level feeder. Moves in small groups. Calm disposition.',

    role: 'grazer',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 180,
    naturalDeathRate: 0.018,
    movementTraits: ['walker', 'climber'],
    biomeComfort: { highgrowth: 1.0, understory: 0.5, scorchFlats: 0.0 },
    eats: [
      { preyId: 'feltmoss',  attackRate: 0.00019, efficiency: 0.38 },
      { preyId: 'phaelight', attackRate: 0.00019, efficiency: 0.38 },
    ],
  },

  {
    id: 'peltback',
    name: 'Peltback',
    catalogRole: 'primaryConsumer',
    candidateType: 'B',
    introPopulation: 40,
    fieldNote: 'Broad-backed, armored. Crosses biome boundaries regularly. Forages widely.',

    role: 'crossBiomeFeeder',
    homeBiome: 'understory',
    borderBiome: 'highgrowth',
    borderPosition: 0.35,
    startingPopulation: 120,
    naturalDeathRate: 0.032,
    movementTraits: ['walker', 'burrower'],
    biomeComfort: { highgrowth: 0.7, understory: 1.0, scorchFlats: 0.0 },
    eats: [
      { preyId: 'nightroot', attackRate: 0.00022, efficiency: 0.55 },
      { preyId: 'feltmoss',  attackRate: 0.00015, efficiency: 0.35, borderScaled: true },
      { preyId: 'moldcap',   attackRate: 0.00022, efficiency: 0.55 },
    ],
  },

  {
    id: 'thorngrub',
    name: 'Thorngrub',
    catalogRole: 'primaryConsumer',
    candidateType: 'C',
    introPopulation: 40,
    fieldNote: 'Spiny scavenger-grazer. Eats heavily defended plants. Often seen alone.',

    role: 'scorchSpecialist',
    homeBiome: 'scorchFlats',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 110,
    naturalDeathRate: 0.060,
    movementTraits: ['walker', 'armored'],
    biomeComfort: { highgrowth: 0.0, understory: 0.0, scorchFlats: 1.0 },
    eats: [
      { preyId: 'scaleweed', attackRate: 0.00055, efficiency: 0.42 },
      { preyId: 'cindermat', attackRate: 0.00055, efficiency: 0.42 },
    ],
  },

  // ── Secondary consumer ─────────────────────────────────────────────────────

  {
    id: 'vethral',
    name: 'Vethral',
    catalogRole: 'secondaryConsumer',
    candidateType: 'A',
    introPopulation: 20,
    fieldNote: 'Winged hunter. Patrols the high canopy. Fast and territorial.',

    role: 'predator',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 45,
    naturalDeathRate: 0.020,
    movementTraits: ['flyer'],
    biomeComfort: { highgrowth: 1.0, understory: 0.2, scorchFlats: 0.4 },
    eats: [
      { preyId: 'vellin', attackRate: 0.00016, efficiency: 0.60 },
      { preyId: 'lurren', attackRate: 0.00016, efficiency: 0.60 },
    ],
  },

  {
    id: 'rimfang',
    name: 'Rimfang',
    catalogRole: 'secondaryConsumer',
    candidateType: 'B',
    introPopulation: 25,
    fieldNote: 'Low-slung ground predator. Hunts the understory floor. Rarely seen in open light.',

    role: 'rangingPredator',
    homeBiome: 'understory',
    borderBiome: 'highgrowth',
    borderPosition: 0.4,
    startingPopulation: 55,
    naturalDeathRate: 0.014,
    movementTraits: ['walker'],
    biomeComfort: { highgrowth: 0.8, understory: 1.0, scorchFlats: 0.0 },
    eats: [
      { preyId: 'woldren',  attackRate: 0.00020, efficiency: 0.58 },
      { preyId: 'vellin',   attackRate: 0.00014, efficiency: 0.55 },
      { preyId: 'peltback', attackRate: 0.00020, efficiency: 0.58 },
      { preyId: 'lurren',   attackRate: 0.00014, efficiency: 0.55 },
    ],
  },

  {
    id: 'boredge',
    name: 'Boredge',
    catalogRole: 'secondaryConsumer',
    candidateType: 'C',
    introPopulation: 15,
    fieldNote: 'Ambush predator. Motionless for long stretches. Surprising burst of speed.',

    role: 'predator',
    homeBiome: 'scorchFlats',
    borderBiome: 'highgrowth',
    borderPosition: 0.25,
    startingPopulation: 35,
    naturalDeathRate: 0.016,
    movementTraits: ['walker', 'armored'],
    biomeComfort: { highgrowth: 0.5, understory: 0.0, scorchFlats: 1.0 },
    eats: [
      { preyId: 'brack',     attackRate: 0.00026, efficiency: 0.62 },
      { preyId: 'torrak',    attackRate: 0.00026, efficiency: 0.62 },
      { preyId: 'thorngrub', attackRate: 0.00026, efficiency: 0.62 },
    ],
  },

  // ── Apex predator ──────────────────────────────────────────────────────────

  {
    id: 'darreth',
    name: 'Darreth',
    catalogRole: 'apexPredator',
    candidateType: 'A',
    introPopulation: 6,
    fieldNote: 'Broad, heavily muscled. Seen across all biomes. Hunts alone. Leaves clear tracks.',

    role: 'apexPredator',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 12,
    naturalDeathRate: 0.008,
    movementTraits: ['walker', 'climber'],
    biomeComfort: { highgrowth: 1.0, understory: 0.9, scorchFlats: 0.3 },
    eats: [
      { preyId: 'woldren',  attackRate: 0.00024, efficiency: 0.52 },
      { preyId: 'brack',    attackRate: 0.00023, efficiency: 0.52 },
      { preyId: 'torrak',   attackRate: 0.00024, efficiency: 0.52 },
      { preyId: 'peltback', attackRate: 0.00024, efficiency: 0.52 },
      { preyId: 'lurren',   attackRate: 0.00020, efficiency: 0.50 },
    ],
  },

  {
    id: 'vorrith',
    name: 'Vorrith',
    catalogRole: 'apexPredator',
    candidateType: 'B',
    introPopulation: 8,
    fieldNote: 'Moves in coordinated pairs. Approaches from multiple angles simultaneously. Quiet.',

    role: 'apexPredator',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 18,
    naturalDeathRate: 0.010,
    movementTraits: ['walker', 'burrower'],
    biomeComfort: { highgrowth: 0.6, understory: 1.0, scorchFlats: 0.2 },
    eats: [
      { preyId: 'woldren', attackRate: 0.00020, efficiency: 0.50 },
      { preyId: 'vellin',  attackRate: 0.00018, efficiency: 0.48 },
      { preyId: 'lurren',  attackRate: 0.00020, efficiency: 0.50 },
    ],
  },

  {
    id: 'silkwyrm',
    name: 'Silkwyrm',
    catalogRole: 'apexPredator',
    candidateType: 'C',
    introPopulation: 4,
    fieldNote: 'Long, serpentine. Waits in concealment for days. Rarely spotted. High-value sightings.',

    role: 'apexPredator',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 10,
    naturalDeathRate: 0.005,
    movementTraits: ['climber'],
    biomeComfort: { highgrowth: 1.0, understory: 0.7, scorchFlats: 0.0 },
    eats: [
      { preyId: 'vellin',  attackRate: 0.00030, efficiency: 0.70 },
      { preyId: 'woldren', attackRate: 0.00028, efficiency: 0.68 },
      { preyId: 'lurren',  attackRate: 0.00030, efficiency: 0.70 },
    ],
  },

  // ── Decomposer ─────────────────────────────────────────────────────────────

  {
    id: 'siltmite',
    name: 'Siltmite',
    catalogRole: 'decomposer',
    candidateType: 'A',
    introPopulation: 80,
    fieldNote: 'Nearly translucent. Colonies form in damp detritus layers. Moves little.',

    role: 'decomposer',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 160,
    carryingCapacity: 450,
    naturalGrowthRate: 0.14,
    naturalDeathRate: 0.045,
    movementTraits: ['burrower'],
    biomeComfort: { highgrowth: 0.0, understory: 1.0, scorchFlats: 0.0 },
    eats: [],
  },

  {
    id: 'ashveil',
    name: 'Ashveil',
    catalogRole: 'decomposer',
    candidateType: 'B',
    introPopulation: 60,
    fieldNote: 'Grey-tinged, flat-bodied. Common at scorch boundary zones. Indifferent to heat.',

    role: 'decomposer',
    homeBiome: 'scorchFlats',
    borderBiome: 'understory',
    borderPosition: 0.3,
    startingPopulation: 120,
    carryingCapacity: 350,
    naturalGrowthRate: 0.13,
    naturalDeathRate: 0.040,
    movementTraits: ['walker', 'burrower'],
    biomeComfort: { highgrowth: 0.0, understory: 0.7, scorchFlats: 1.0 },
    eats: [],
  },

  {
    id: 'crumbler',
    name: 'Crumbler',
    catalogRole: 'decomposer',
    candidateType: 'C',
    introPopulation: 50,
    fieldNote: 'Heavily segmented. Processes only dried or crystallized matter. Methodical.',

    role: 'decomposer',
    homeBiome: 'understory',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 100,
    carryingCapacity: 300,
    naturalGrowthRate: 0.18,
    naturalDeathRate: 0.050,
    movementTraits: ['burrower'],
    biomeComfort: { highgrowth: 0.2, understory: 1.0, scorchFlats: 0.4 },
    eats: [],
  },

  // ── Specialist (new role — no starting species fills this) ─────────────────
  //
  // Specialist niches open only after the ecosystem has experienced enough loss
  // that genuinely new ecological possibilities emerge. These species do not
  // replace anything directly — they add a role that was absent from the world.

  {
    id: 'quillhorn',
    name: 'Quillhorn',
    catalogRole: 'specialist',
    candidateType: 'A',
    introPopulation: 25,
    fieldNote: 'Spined, territorial. Marks boundaries with chemical deposits. Solitary.',

    role: 'specialist',
    homeBiome: 'scorchFlats',
    borderBiome: 'highgrowth',
    borderPosition: 0.2,
    startingPopulation: 50,
    naturalDeathRate: 0.025,
    movementTraits: ['walker', 'armored'],
    biomeComfort: { highgrowth: 0.4, understory: 0.0, scorchFlats: 1.0 },
    eats: [
      { preyId: 'scaleweed', attackRate: 0.00030, efficiency: 0.35 },
      { preyId: 'cindermat', attackRate: 0.00030, efficiency: 0.35 },
    ],
  },

  {
    id: 'velk',
    name: 'Velk',
    catalogRole: 'specialist',
    candidateType: 'B',
    introPopulation: 60,
    fieldNote: 'Semi-sessile. Attaches to plant matter and forms symbiotic colonies on producers.',

    role: 'specialist',
    homeBiome: 'highgrowth',
    borderBiome: null,
    borderPosition: 0,
    startingPopulation: 130,
    naturalDeathRate: 0.022,
    movementTraits: [],
    biomeComfort: { highgrowth: 1.0, understory: 0.6, scorchFlats: 0.0 },
    eats: [
      { preyId: 'feltmoss',  attackRate: 0.00008, efficiency: 0.25 },
      { preyId: 'phaelight', attackRate: 0.00008, efficiency: 0.25 },
    ],
  },

  {
    id: 'thrennet',
    name: 'Thrennet',
    catalogRole: 'specialist',
    candidateType: 'C',
    introPopulation: 35,
    fieldNote: 'Net-like organism. Spans biome boundaries. Filters moisture and suspended particles.',

    role: 'specialist',
    homeBiome: 'understory',
    borderBiome: 'highgrowth',
    borderPosition: 0.4,
    startingPopulation: 70,
    naturalDeathRate: 0.018,
    movementTraits: ['climber'],
    biomeComfort: { highgrowth: 0.8, understory: 1.0, scorchFlats: 0.0 },
    eats: [
      { preyId: 'nightroot', attackRate: 0.00010, efficiency: 0.28 },
      { preyId: 'moldcap',   attackRate: 0.00010, efficiency: 0.28 },
    ],
  },
]

// ─── Lookup helpers ───────────────────────────────────────────────────────────

const catalogById = Object.fromEntries(CATALOG_SPECIES.map(s => [s.id, s]))

export function getCatalogSpecies(id) {
  return catalogById[id] ?? null
}

export function getCandidatesForRole(catalogRole) {
  return CATALOG_SPECIES.filter(s => s.catalogRole === catalogRole)
}
