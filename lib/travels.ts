/**
 * Pure helpers that turn the admin travel atlas into what the public site may
 * show: visited districts and visited trips only. Notes and planned trips are
 * never part of the output.
 */
import { BD_DISTRICTS, BD_DIVISIONS, BD_DIVISION_BN, type BdDivision } from '@/lib/data/bd-districts'
import { BANGLADESH_SPOTS } from '@/lib/data/bangladesh-destinations'

export interface TripRow {
  id: string
  name: string
  region: string
  country: string | null
  district: string | null
  /** Atlas catalogue spot id, when the trip was picked from the spot list. */
  catalogId?: string | null
  visited: boolean
  visitedAt: Date | null
}

export interface PublicSpot {
  id: string
  name: string
  districtId: string | null
  districtName: string | null
  division: BdDivision | null
  year: number | null
}

export interface PublicCountry {
  name: string
  places: string[]
  year: number | null
}

export interface DivisionProgress {
  division: BdDivision
  bn: string
  visited: number
  total: number
}

export function divisionProgress(visitedIds: readonly string[]): DivisionProgress[] {
  const visited = new Set(visitedIds)
  return BD_DIVISIONS.map((division) => {
    const inDivision = BD_DISTRICTS.filter((d) => d.division === division)
    return {
      division,
      bn: BD_DIVISION_BN[division],
      visited: inDivision.filter((d) => visited.has(d.id)).length,
      total: inDivision.length,
    }
  })
}

const yearOf = (date: Date | null): number | null => (date ? date.getUTCFullYear() : null)
const newestFirst = (a: { time: number | null }, b: { time: number | null }) => (b.time ?? -Infinity) - (a.time ?? -Infinity)

export function summarizeTrips(rows: readonly TripRow[]): { spots: PublicSpot[]; countries: PublicCountry[] } {
  const visited = rows.filter((r) => r.visited)

  const spots = visited
    .filter((r) => r.region !== 'international')
    .map((r) => {
      // Catalogue picks store their district on the spot, not on the trip.
      const districtId = r.district ?? BANGLADESH_SPOTS.find((s) => s.id === r.catalogId || s.name === r.name)?.districtId
      const district = districtId ? BD_DISTRICTS.find((d) => d.id === districtId) : undefined
      return {
        time: r.visitedAt?.getTime() ?? null,
        spot: {
          id: r.id,
          name: r.name,
          districtId: district?.id ?? null,
          districtName: district?.name ?? null,
          division: district?.division ?? null,
          year: yearOf(r.visitedAt),
        },
      }
    })
    .sort(newestFirst)
    .map((x) => x.spot)

  const byCountry = new Map<string, { places: { name: string; time: number | null }[] }>()
  for (const r of visited.filter((v) => v.region === 'international' && v.country)) {
    const entry = byCountry.get(r.country as string) ?? { places: [] }
    entry.places.push({ name: r.name, time: r.visitedAt?.getTime() ?? null })
    byCountry.set(r.country as string, entry)
  }
  const countries = Array.from(byCountry, ([name, { places }]) => {
    const sorted = [...places].sort(newestFirst)
    const latest = sorted[0]?.time ?? null
    return { time: latest, country: { name, places: sorted.map((p) => p.name), year: latest === null ? null : new Date(latest).getUTCFullYear() } }
  })
    .sort((a, b) => newestFirst(a, b) || a.country.name.localeCompare(b.country.name))
    .map((x) => x.country)

  return { spots, countries }
}
