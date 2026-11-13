import { BD_DISTRICT_IDS } from '@/lib/data/bd-districts'
import type { CountryData, VisaEaseCategory } from '@/lib/data/world-countries'
import { ZONE_BY_CODE, ZONE_MIN_TRIP_BDT } from '@/lib/tour/travel-zones'

/** Rough conversion used only for comparing estimates, not for money handling. */
export const USD_TO_BDT = 122

/** Rough rates for totalling savings held in other currencies. */
export const RATE_TO_BDT: Readonly<Record<string, number>> = { BDT: 1, USD: USD_TO_BDT, EUR: 132, GBP: 155 }

export interface SavingsTotal {
  totalBDT: number
  /** Currencies with no known rate; their accounts are left out of the total. */
  skippedCurrencies: string[]
}

/** Totals savings in BDT, leaving out currencies it cannot convert instead of guessing. */
export function savingsInBDT(accounts: ReadonlyArray<{ currency?: string | null; amount?: number | null }>): SavingsTotal {
  const skipped = new Set<string>()
  let totalBDT = 0
  for (const account of accounts) {
    const currency = (account.currency || 'BDT').trim().toUpperCase()
    const rate = RATE_TO_BDT[currency]
    if (rate === undefined) skipped.add(currency)
    else totalBDT += (Number(account.amount) || 0) * rate
  }
  return { totalBDT, skippedCurrencies: [...skipped].sort() }
}

export interface CatalogLinked {
  region: string
  name: string
  country?: string | null
  catalogId?: string | null
}

/**
 * The saved trip for a catalogue item. Matches on the stable catalogue id, so a
 * renamed trip stays linked; rows saved before ids existed still match by name.
 */
export function findCatalogTrip<T extends CatalogLinked>(
  trips: readonly T[], region: string, catalogId: string, name: string,
): T | undefined {
  const id = catalogId.toLowerCase()
  const clean = name.trim().toLowerCase()
  const inRegion = trips.filter((t) => t.region === region)
  return inRegion.find((t) => t.catalogId?.toLowerCase() === id)
    ?? inRegion.find((t) => !t.catalogId && (t.country || t.name).trim().toLowerCase() === clean)
}

export const TRIP_NOTES_MAX = 2000

/** Shortens text to the limit at a sentence or line end, so it never stops mid-sentence. */
export function clampNotes(text: string, max: number = TRIP_NOTES_MAX): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max)
  const end = Math.max(cut.lastIndexOf('\n'), cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  return (end > max / 2 ? cut.slice(0, end + 1) : cut).trim()
}

export type ExpenseTierKey = 'daytrip' | 'budget' | 'moderate' | 'comfortable' | 'premium'

export interface ExpenseTier {
  key: ExpenseTierKey
  label: string
  max: number
}

export const EXPENSE_TIERS: readonly ExpenseTier[] = [
  { key: 'daytrip', label: 'Day trip · ≤ ৳3k', max: 3000 },
  { key: 'budget', label: 'Budget · ≤ ৳7k', max: 7000 },
  { key: 'moderate', label: 'Moderate · ≤ ৳12k', max: 12000 },
  { key: 'comfortable', label: 'Comfortable · ≤ ৳18k', max: 18000 },
  { key: 'premium', label: 'Premium · ৳18k+', max: Infinity },
]

export function expenseTier(budget: number): ExpenseTier {
  return EXPENSE_TIERS.find((tier) => budget <= tier.max) ?? EXPENSE_TIERS[EXPENSE_TIERS.length - 1]
}

export function sortSpotsByExpense<T extends { name: string; budget: number }>(
  spots: readonly T[],
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...spots].sort((a, b) => sign * (a.budget - b.budget) || a.name.localeCompare(b.name))
}

/** Minimum BDT figure in strings like "BDT 35,000 - 55,000" or "$1,200". */
export function parseMinCostBDT(text: string | null | undefined): number | null {
  if (!text) return null
  const bdt = text.match(/BDT\s*([\d,]+)/i)
  if (bdt) return Number(bdt[1].replace(/,/g, '')) || null
  const usd = text.match(/(?:USD|\$)\s*([\d,]+)/i)
  if (usd) return (Number(usd[1].replace(/,/g, '')) || 0) * USD_TO_BDT || null
  const plain = text.match(/(\d{1,3}(?:,\d{3})+|\d{4,})/)
  if (plain) return Number(plain[1].replace(/,/g, '')) || null
  return null
}

export const VISA_EASE_RANK: Record<VisaEaseCategory, number> = {
  visa_free: 0,
  evisa_easy: 1,
  embassy_visa: 2,
}

const HOME_COUNTRY_CODE = 'BD'

/** The generic estimate most country entries share; it carries no real cost signal. */
const PLACEHOLDER_ESTIMATE = 'BDT 80,000 - 150,000 (5-7 days)'
const UNKNOWN_TRIP_BDT = 250000

export interface TripEstimate {
  bdt: number
  source: 'researched' | 'zone'
}

/** Minimum trip cost from Dhaka: the country's own figure, or its travel-zone estimate. */
export function tripEstimate(country: CountryData): TripEstimate {
  const own = country.estimatedCost.totalEstimate
  const parsed = own === PLACEHOLDER_ESTIMATE ? null : parseMinCostBDT(own)
  if (parsed !== null) return { bdt: parsed, source: 'researched' }
  const zone = ZONE_BY_CODE.get(country.code)
  return { bdt: zone ? ZONE_MIN_TRIP_BDT[zone] : UNKNOWN_TRIP_BDT, source: 'zone' }
}

/**
 * Countries ordered by how easy they are to visit on a Bangladeshi passport:
 * visa category first, then the cheapest (usually closest) estimated trip,
 * then the shortest application process.
 */
export function rankCountriesByEase(countries: readonly CountryData[]): CountryData[] {
  return countries
    .filter((c) => c.code !== HOME_COUNTRY_CODE)
    .map((country) => ({ country, cost: tripEstimate(country).bdt }))
    .sort((a, b) =>
      VISA_EASE_RANK[a.country.visaCategory] - VISA_EASE_RANK[b.country.visaCategory]
      || a.cost - b.cost
      || a.country.visaProcessSteps.length - b.country.visaProcessSteps.length
      || a.country.name.localeCompare(b.country.name))
    .map(({ country }) => country)
}

/** Districts ticked on the map plus districts of spots marked as visited. */
export function mergeVisitedDistricts(explicit: readonly string[], fromSpots: readonly string[]): Set<string> {
  return new Set([...explicit, ...fromSpots].filter((id) => BD_DISTRICT_IDS.has(id)))
}
