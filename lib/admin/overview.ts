/** Pure helpers for the admin overview (unit-tested in node). */

export interface PipelineSegment {
  key: 'live' | 'draft'
  label: string
  count: number
  /** Whole-number percentage; all segments sum to exactly 100. */
  share: number
}

interface PublishState {
  publishStatus?: string
}

/** Live vs draft split, with shares rounded by largest remainder so they total 100. */
export function pipelineSegments(projects: readonly PublishState[]): PipelineSegment[] {
  const total = projects.length
  if (total === 0) return []
  const live = projects.filter((p) => p.publishStatus === 'published').length
  const raw = [
    { key: 'live' as const, label: 'Live', count: live },
    { key: 'draft' as const, label: 'Draft', count: total - live },
  ].filter((s) => s.count > 0)

  const exact = raw.map((s) => (s.count / total) * 100)
  const floors = exact.map(Math.floor)
  let remainder = 100 - floors.reduce((a, b) => a + b, 0)
  const order = exact.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac)
  const shares = [...floors]
  for (const { i } of order) {
    if (remainder <= 0) break
    shares[i] += 1
    remainder -= 1
  }
  return raw.map((s, i) => ({ ...s, share: shares[i] }))
}

export function initials(name: string | undefined): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}
