import { openDB } from 'idb'

// ─── Database setup ───────────────────────────────────────────────────────────

const DB_NAME    = 'echosphere'
const DB_VERSION = 1
const STORE      = 'state'
const STATE_KEY  = 'game'

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE)
    },
  })
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Returns the persisted game state, or null if no save exists.
export async function loadState() {
  const db = await getDB()
  return db.get(STORE, STATE_KEY) ?? null
}

// Persists the full game state. Call after every simulated batch.
export async function saveState(state) {
  const db = await getDB()
  await db.put(STORE, state, STATE_KEY)
}

// Wipes all saved data. Used on new game / reset.
export async function clearState() {
  const db = await getDB()
  await db.delete(STORE, STATE_KEY)
}
