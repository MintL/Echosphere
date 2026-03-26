// Returns the display name for a species, respecting the named milestone.
export function spName(sp) {
  return sp?.milestones?.named ? sp.name : 'Unknown organism'
}
