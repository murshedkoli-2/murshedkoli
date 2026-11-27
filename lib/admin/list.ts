/** Shared list helpers for admin manager pages (pure, unit-tested). */

/** True when every word of the query appears in at least one of the fields (case-insensitive). */
export function matchesQuery(query: string, ...fields: Array<string | null | undefined>): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = fields.filter(Boolean).join(' ').toLowerCase()
  return words.every((w) => haystack.includes(w))
}
