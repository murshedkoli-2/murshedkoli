import { describe, expect, test } from 'vitest'
import { divisionProgress, summarizeTrips, type TripRow } from '@/lib/travels'

const trip = (over: Partial<TripRow>): TripRow => ({
  id: 'x',
  name: 'Somewhere',
  region: 'bangladesh',
  country: null,
  district: null,
  visited: true,
  visitedAt: null,
  ...over,
})

describe('divisionProgress', () => {
  test('counts visited districts per division, covering all 8 divisions', () => {
    const rows = divisionProgress(['dhaka', 'gazipur', 'sylhet', 'not-a-district'])

    expect(rows).toHaveLength(8)
    expect(rows.find((r) => r.division === 'Dhaka')).toMatchObject({ visited: 2 })
    expect(rows.find((r) => r.division === 'Sylhet')).toMatchObject({ visited: 1 })
    expect(rows.find((r) => r.division === 'Rangpur')).toMatchObject({ visited: 0 })
    expect(rows.reduce((n, r) => n + r.total, 0)).toBe(64)
  })
})

describe('summarizeTrips', () => {
  test('drops planned trips and never exposes notes', () => {
    const { spots } = summarizeTrips([
      trip({ id: 'a', name: "Cox's Bazar", district: 'coxsbazar', visitedAt: new Date('2025-01-10') }),
      trip({ id: 'b', name: 'Planned', visited: false }),
    ])

    expect(spots.map((s) => s.id)).toEqual(['a'])
    expect(spots[0]).not.toHaveProperty('notes')
    expect(spots[0].year).toBe(2025)
  })

  test('finds the district of a spot picked from the atlas catalogue', () => {
    const { spots } = summarizeTrips([trip({ id: 'j', name: 'Jaflong' })])

    expect(spots[0]).toMatchObject({ districtId: 'sylhet', division: 'Sylhet' })
  })

  test('orders spots newest first, undated last', () => {
    const { spots } = summarizeTrips([
      trip({ id: 'old', visitedAt: new Date('2020-05-01') }),
      trip({ id: 'none' }),
      trip({ id: 'new', visitedAt: new Date('2024-05-01') }),
    ])

    expect(spots.map((s) => s.id)).toEqual(['new', 'old', 'none'])
  })

  test('groups international trips by country with a count and latest year', () => {
    const { countries } = summarizeTrips([
      trip({ id: 'n1', region: 'international', country: 'Nepal', name: 'Pokhara', visitedAt: new Date('2023-03-01') }),
      trip({ id: 'n2', region: 'international', country: 'Nepal', name: 'Kathmandu', visitedAt: new Date('2024-03-01') }),
      trip({ id: 't1', region: 'international', country: 'Thailand', name: 'Bangkok' }),
    ])

    expect(countries).toEqual([
      { name: 'Nepal', places: ['Kathmandu', 'Pokhara'], year: 2024 },
      { name: 'Thailand', places: ['Bangkok'], year: null },
    ])
  })
})
