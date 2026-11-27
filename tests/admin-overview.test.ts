import { describe, expect, test } from 'vitest'
import { initials, pipelineSegments } from '@/lib/admin/overview'

describe('pipelineSegments', () => {
  test('splits projects into live, featured-draft and draft with shares that sum to 100', () => {
    const projects = [
      { publishStatus: 'published', featured: true },
      { publishStatus: 'published' },
      { publishStatus: 'draft' },
      { publishStatus: 'draft', featured: true },
    ]

    const segments = pipelineSegments(projects)

    expect(segments.map((s) => [s.key, s.count])).toEqual([
      ['live', 2],
      ['draft', 2],
    ])
    expect(segments.reduce((sum, s) => sum + s.share, 0)).toBe(100)
  })

  test('returns no segments for no projects', () => {
    expect(pipelineSegments([])).toEqual([])
  })

  test('drops empty segments', () => {
    expect(pipelineSegments([{ publishStatus: 'published' }]).map((s) => s.key)).toEqual(['live'])
  })
})

describe('initials', () => {
  test('takes the first letter of the first two words', () => {
    expect(initials('Ada Lovelace King')).toBe('AL')
  })

  test('handles single names and blanks', () => {
    expect(initials('ada')).toBe('A')
    expect(initials('  ')).toBe('?')
    expect(initials(undefined)).toBe('?')
  })
})
