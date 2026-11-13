import { describe, expect, it } from 'vitest'
import { BD_DISTRICTS, BD_DISTRICT_IDS } from '@/lib/data/bd-districts'
import { BD_DISTRICT_SHAPES } from '@/lib/data/bd-district-paths'
import { BANGLADESH_SPOTS } from '@/lib/data/bangladesh-destinations'
import { WORLD_COUNTRIES } from '@/lib/data/world-countries'
import {
  expenseTier, sortSpotsByExpense, parseMinCostBDT, rankCountriesByEase, mergeVisitedDistricts, tripEstimate,
  findCatalogTrip, savingsInBDT, clampNotes,
} from '@/lib/tour/catalog'
import { ZONE_BY_CODE } from '@/lib/tour/travel-zones'

const byCode = (code: string) => WORLD_COUNTRIES.find((c) => c.code === code)!

describe('tripEstimate', () => {
  it('assigns every country to a travel zone', () => {
    expect(WORLD_COUNTRIES.filter((c) => !ZONE_BY_CODE.has(c.code)).map((c) => c.code)).toEqual([])
  })

  it('keeps researched figures and replaces the generic placeholder with a zone estimate', () => {
    expect(tripEstimate(byCode('NP'))).toEqual({ bdt: 35000, source: 'researched' })
    expect(tripEstimate(byCode('IN')).source).toBe('zone')
    expect(tripEstimate(byCode('IN')).bdt).toBeLessThan(tripEstimate(byCode('BB')).bdt)
  })
})

describe('Bangladesh reference data', () => {
  it('has 64 unique districts across 8 divisions, each with map geometry', () => {
    expect(BD_DISTRICTS).toHaveLength(64)
    expect(BD_DISTRICT_IDS.size).toBe(64)
    expect(new Set(BD_DISTRICTS.map((d) => d.division)).size).toBe(8)
    for (const d of BD_DISTRICTS) expect(BD_DISTRICT_SHAPES[d.id]?.d, d.id).toMatch(/^M/)
  })

  it('lists at least one tourist spot in every district, with unique ids', () => {
    const covered = new Set(BANGLADESH_SPOTS.map((s) => s.districtId))
    expect(BD_DISTRICTS.filter((d) => !covered.has(d.id)).map((d) => d.id)).toEqual([])
    expect(new Set(BANGLADESH_SPOTS.map((s) => s.id)).size).toBe(BANGLADESH_SPOTS.length)
  })
})

describe('expense helpers', () => {
  it('buckets per-person budgets into tiers at the boundaries', () => {
    expect(expenseTier(3000).key).toBe('daytrip')
    expect(expenseTier(3001).key).toBe('budget')
    expect(expenseTier(7000).key).toBe('budget')
    expect(expenseTier(12000).key).toBe('moderate')
    expect(expenseTier(18000).key).toBe('comfortable')
    expect(expenseTier(18001).key).toBe('premium')
  })

  it('sorts spots cheapest first, then by name, without mutating the input', () => {
    const input = [
      { name: 'B', budget: 5000 }, { name: 'A', budget: 5000 }, { name: 'C', budget: 1000 },
    ]
    expect(sortSpotsByExpense(input).map((s) => s.name)).toEqual(['C', 'A', 'B'])
    expect(sortSpotsByExpense(input, 'desc').map((s) => s.name)).toEqual(['A', 'B', 'C'])
    expect(input.map((s) => s.name)).toEqual(['B', 'A', 'C'])
  })

  it('parses the minimum BDT figure from cost strings', () => {
    expect(parseMinCostBDT('BDT 35,000 - 55,000 (5-7 days)')).toBe(35000)
    expect(parseMinCostBDT('$1,200 total')).toBe(1200 * 122)
    expect(parseMinCostBDT('Varies')).toBeNull()
  })
})

describe('rankCountriesByEase', () => {
  const ranked = rankCountriesByEase(WORLD_COUNTRIES)

  it('excludes Bangladesh itself', () => {
    expect(ranked.some((c) => c.code === 'BD')).toBe(false)
    expect(ranked).toHaveLength(WORLD_COUNTRIES.length - 1)
  })

  it('puts visa-free before e-visa before embassy visas', () => {
    const order = { visa_free: 0, evisa_easy: 1, embassy_visa: 2 }
    const ranks = ranked.map((c) => order[c.visaCategory])
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks)
  })

  it('orders cheaper (closer) trips first within a visa category', () => {
    const free = ranked.filter((c) => c.visaCategory === 'visa_free').map((c) => tripEstimate(c).bdt)
    expect([...free].sort((a, b) => a - b)).toEqual(free)
    const names = ranked.map((c) => c.name)
    expect(names.indexOf('Bhutan')).toBeLessThan(names.indexOf('Barbados'))
  })
})

describe('mergeVisitedDistricts', () => {
  it('unions explicit districts with districts of visited spots, ignoring unknown ids', () => {
    const result = mergeVisitedDistricts(['sylhet', 'atlantis'], ['coxs-bazar', 'sylhet'])
    expect([...result].sort()).toEqual(['coxs-bazar', 'sylhet'])
  })
})

describe('findCatalogTrip', () => {
  const trips = [
    { id: 'a', region: 'bangladesh', name: 'My renamed fort trip', catalogId: 'lalbagh-fort' },
    { id: 'b', region: 'bangladesh', name: 'Panam City', catalogId: null },
    { id: 'c', region: 'international', name: 'Nepal', country: 'Nepal', catalogId: 'NP' },
    { id: 'd', region: 'bangladesh', name: 'Nepal', catalogId: null },
  ]

  it('keeps a renamed trip linked through its catalogue id', () => {
    expect(findCatalogTrip(trips, 'bangladesh', 'lalbagh-fort', 'Lalbagh Fort')?.id).toBe('a')
  })

  it('falls back to the name for rows saved before catalogue ids existed', () => {
    expect(findCatalogTrip(trips, 'bangladesh', 'panam-city', ' panam city ')?.id).toBe('b')
  })

  it('matches country codes case-insensitively and never crosses regions', () => {
    expect(findCatalogTrip(trips, 'international', 'np', 'Nepal')?.id).toBe('c')
    expect(findCatalogTrip(trips, 'international', 'BT', 'Bhutan')).toBeUndefined()
  })
})

describe('savingsInBDT', () => {
  it('converts known currencies and leaves out ones without a rate', () => {
    const result = savingsInBDT([
      { currency: 'BDT', amount: 1000 }, { currency: 'usd', amount: 10 },
      { currency: 'SAR', amount: 500 }, { currency: 'INR', amount: 500 }, { currency: null, amount: 5 },
    ])
    expect(result.totalBDT).toBe(1000 + 10 * 122 + 5)
    expect(result.skippedCurrencies).toEqual(['INR', 'SAR'])
  })

  it('returns zero with nothing skipped for no accounts', () => {
    expect(savingsInBDT([])).toEqual({ totalBDT: 0, skippedCurrencies: [] })
  })
})

describe('clampNotes', () => {
  it('leaves short text alone and cuts long text at a sentence end', () => {
    expect(clampNotes('  Day 1: Dhaka.  ')).toBe('Day 1: Dhaka.')
    const long = `${'A'.repeat(60)}. ${'B'.repeat(60)}. ${'C'.repeat(60)}.`
    const cut = clampNotes(long, 150)
    expect(cut.length).toBeLessThanOrEqual(150)
    expect(cut.endsWith('.')).toBe(true)
    expect(cut).not.toContain('C')
  })
})

describe('tourCreateSchema', () => {
  it('accepts a catalogue id and long notes, and rejects unsafe ids and oversized notes', async () => {
    const { tourCreateSchema } = await import('@/lib/validations/tour')
    expect(tourCreateSchema.safeParse({ name: 'Nepal', region: 'international', catalogId: 'NP', notes: 'x'.repeat(2000) }).success).toBe(true)
    expect(tourCreateSchema.safeParse({ name: 'Nepal', catalogId: 'NP$ne' }).success).toBe(false)
    expect(tourCreateSchema.safeParse({ name: 'Nepal', notes: 'x'.repeat(2001) }).success).toBe(false)
  })
})

describe('visitedDistrictsSchema', () => {
  it('accepts known districts, de-duplicates, and rejects unknown ids', async () => {
    const { visitedDistrictsSchema } = await import('@/lib/validations/tour')
    expect(visitedDistrictsSchema.parse({ districtIds: ['sylhet', 'sylhet', 'dhaka'] }).districtIds).toEqual(['sylhet', 'dhaka'])
    expect(visitedDistrictsSchema.safeParse({ districtIds: ['atlantis'] }).success).toBe(false)
  })
})
