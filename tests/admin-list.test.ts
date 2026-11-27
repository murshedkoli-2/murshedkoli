import { describe, expect, test } from 'vitest'
import { matchesQuery } from '@/lib/admin/list'

describe('matchesQuery', () => {
  test('matches everything for a blank query', () => {
    expect(matchesQuery('  ', 'anything')).toBe(true)
  })

  test('needs every word, in any field, case-insensitively', () => {
    expect(matchesQuery('next front', 'Next.js', 'frontend')).toBe(true)
    expect(matchesQuery('next back', 'Next.js', 'frontend')).toBe(false)
  })

  test('ignores missing fields', () => {
    expect(matchesQuery('acme', null, undefined, 'Acme Corp')).toBe(true)
  })
})
