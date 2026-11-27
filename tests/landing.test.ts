import { describe, expect, test } from 'vitest'
import {
  buildFigures,
  filterProjects,
  pickPortrait,
  projectFilters,
  proximity,
  servicesOrDefault,
  DEFAULT_SERVICES,
  socialEntries,
  typeLabel,
} from '@/lib/landing'

const project = (id: string, projectType: string) => ({ id, projectType })

describe('typeLabel', () => {
  test('maps known project types to readable labels', () => {
    expect(typeLabel('webapp')).toBe('Web app')
    expect(typeLabel('android')).toBe('Android')
    expect(typeLabel('api')).toBe('API')
  })

  test('title-cases unknown types and falls back for empty input', () => {
    expect(typeLabel('chrome-extension')).toBe('Chrome extension')
    expect(typeLabel('')).toBe('Project')
  })
})

describe('projectFilters', () => {
  test('returns "all" first, then types ordered by count', () => {
    const list = [project('1', 'android'), project('2', 'webapp'), project('3', 'webapp')]

    const filters = projectFilters(list)

    expect(filters).toEqual([
      { key: 'all', label: 'All', count: 3 },
      { key: 'webapp', label: 'Web app', count: 2 },
      { key: 'android', label: 'Android', count: 1 },
    ])
  })

  test('returns no filters when there is only one type', () => {
    expect(projectFilters([project('1', 'webapp'), project('2', 'webapp')])).toEqual([])
  })
})

describe('filterProjects', () => {
  const list = [project('1', 'android'), project('2', 'webapp')]

  test('returns every project for "all"', () => {
    expect(filterProjects(list, 'all')).toHaveLength(2)
  })

  test('returns only matching projects without mutating the input', () => {
    const result = filterProjects(list, 'webapp')

    expect(result.map((p) => p.id)).toEqual(['2'])
    expect(list).toHaveLength(2)
  })
})

describe('buildFigures', () => {
  test('drops zero values and keeps labelled order', () => {
    const figures = buildFigures({ projectsShipped: 9, yearsExperience: 0, skills: 24, certificates: 3 })

    expect(figures.map((f) => f.label)).toEqual(['Projects shipped', 'Technologies', 'Certificates'])
    expect(figures[0].value).toBe(9)
  })
})

describe('pickPortrait', () => {
  test('uses the profile portrait when present', () => {
    expect(pickPortrait({ heroPortrait: '/uploads/me.jpg' })).toBe('/uploads/me.jpg')
  })

  test('falls back to the default portrait for missing or legacy images', () => {
    expect(pickPortrait({ heroPortrait: null })).toBe('/images/hero-portrait.jpg')
    expect(pickPortrait({ heroPortrait: '/murshed.jpg' })).toBe('/images/hero-portrait.jpg')
  })
})

describe('socialEntries', () => {
  test('keeps only links that have a url, with readable labels', () => {
    const entries = socialEntries({ github: 'https://github.com/x', twitter: '', linkedin: 'https://l.in/x' })

    expect(entries).toEqual([
      { key: 'github', label: 'GitHub', url: 'https://github.com/x' },
      { key: 'linkedin', label: 'LinkedIn', url: 'https://l.in/x' },
    ])
  })

  test('returns an empty list when no links are given', () => {
    expect(socialEntries(undefined)).toEqual([])
  })
})

describe('proximity', () => {
  test('is 1 at the centre and 0 at or beyond the radius', () => {
    expect(proximity(0, 100)).toBe(1)
    expect(proximity(100, 100)).toBe(0)
    expect(proximity(250, 100)).toBe(0)
  })

  test('eases smoothly in between', () => {
    const half = proximity(50, 100)
    expect(half).toBeGreaterThan(0)
    expect(half).toBeLessThan(1)
  })
})

describe('servicesOrDefault', () => {
  const svc = (id: string) => ({ id, title: id, description: '', icon: null })

  test('falls back to the default list when fewer than three are published', () => {
    expect(servicesOrDefault([svc('a')])).toEqual(DEFAULT_SERVICES)
  })

  test('uses published services once there are enough', () => {
    const published = [svc('a'), svc('b'), svc('c')]
    expect(servicesOrDefault(published).map((s) => s.id)).toEqual(['a', 'b', 'c'])
  })
})
