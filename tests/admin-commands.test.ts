import { describe, expect, test } from 'vitest'
import { scoreCommand, searchCommands, type CommandEntry } from '@/lib/admin/commands'

const cmd = (id: string, label: string, keywords: string[] = []): CommandEntry => ({ id, label, group: 'Go to', keywords })

const ALL = [
  cmd('projects', 'Projects', ['work', 'portfolio']),
  cmd('new-project', 'New project', ['create', 'add']),
  cmd('skills', 'Skills', ['tech', 'stack']),
  cmd('settings', 'Settings', ['config']),
]

describe('scoreCommand', () => {
  test('returns 0 when the query is not a subsequence of label or keywords', () => {
    expect(scoreCommand('xyz', ALL[0])).toBe(0)
  })

  test('ranks a prefix match above a scattered match', () => {
    expect(scoreCommand('pro', ALL[0])).toBeGreaterThan(scoreCommand('pjs', ALL[0]))
  })

  test('matches keywords, case-insensitively', () => {
    expect(scoreCommand('STACK', ALL[2])).toBeGreaterThan(0)
  })
})

describe('searchCommands', () => {
  test('returns everything in original order for an empty query', () => {
    expect(searchCommands(ALL, '  ').map((c) => c.id)).toEqual(['projects', 'new-project', 'skills', 'settings'])
  })

  test('orders by score and drops non-matches', () => {
    expect(searchCommands(ALL, 'se').map((c) => c.id)).toEqual(['settings'])
    expect(searchCommands(ALL, 'proj').map((c) => c.id)).toEqual(['projects', 'new-project'])
  })

  test('respects the limit', () => {
    expect(searchCommands(ALL, '', 2)).toHaveLength(2)
  })
})
