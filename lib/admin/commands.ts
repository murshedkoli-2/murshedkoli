/** Fuzzy search for the admin command palette (pure, unit-tested). */

export interface CommandEntry {
  id: string
  label: string
  group: string
  keywords?: string[]
}

const PREFIX_BONUS = 100
const WORD_START_BONUS = 40
const CONSECUTIVE_BONUS = 8

/** Subsequence match score for one haystack; 0 when the query does not fit. */
function scoreText(query: string, text: string): number {
  const hay = text.toLowerCase()
  if (hay.startsWith(query)) return PREFIX_BONUS + query.length * CONSECUTIVE_BONUS - hay.length
  if (hay.split(/\s+/).some((word) => word.startsWith(query))) return WORD_START_BONUS + query.length * CONSECUTIVE_BONUS

  let score = 0
  let from = 0
  let last = -2
  for (const ch of query) {
    const at = hay.indexOf(ch, from)
    if (at === -1) return 0
    score += at === last + 1 ? CONSECUTIVE_BONUS : 1
    last = at
    from = at + 1
  }
  return score
}

export function scoreCommand(rawQuery: string, entry: CommandEntry): number {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return 1
  const labelScore = scoreText(query, entry.label)
  const keywordScore = Math.max(0, ...(entry.keywords ?? []).map((k) => scoreText(query, k) - 1))
  return Math.max(labelScore, keywordScore)
}

export function searchCommands<T extends CommandEntry>(entries: readonly T[], query: string, limit = 50): T[] {
  if (!query.trim()) return entries.slice(0, limit)
  return entries
    .map((entry, index) => ({ entry, index, score: scoreCommand(query, entry) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((r) => r.entry)
}
