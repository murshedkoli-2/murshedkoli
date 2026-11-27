import { cached } from '@/lib/cache'
import { prisma } from '@/lib/prisma'
import { getCountryByName } from '@/lib/data/world-countries'
import { BD_DISTRICTS } from '@/lib/data/bd-districts'
import { summarizeTrips, type PublicCountry, type PublicSpot } from '@/lib/travels'

export interface PublicCountryView extends PublicCountry {
  flag: string | null
}

export interface TravelsView {
  visitedDistricts: string[]
  spots: PublicSpot[]
  countries: PublicCountryView[]
}

const EMPTY: TravelsView = { visitedDistricts: [], spots: [], countries: [] }
const KNOWN_DISTRICTS = new Set(BD_DISTRICTS.map((d) => d.id))

/**
 * Public, read-only view of the admin travel atlas. Selects only the fields
 * the site shows: notes and planned (unvisited) trips are never read here.
 */
export const getTravels = cached('travels', async (): Promise<TravelsView> => {
  try {
    const [districtRows, tripRows] = await Promise.all([
      prisma.visitedDistrict.findMany({ select: { districtId: true } }),
      prisma.tourLocation.findMany({
        where: { visited: true },
        select: { id: true, name: true, region: true, country: true, district: true, catalogId: true, visited: true, visitedAt: true },
      }),
    ])
    const { spots, countries } = summarizeTrips(tripRows)
    return {
      visitedDistricts: districtRows.map((r) => r.districtId).filter((id) => KNOWN_DISTRICTS.has(id)),
      spots,
      countries: countries.map((c) => ({ ...c, flag: getCountryByName(c.name)?.flag ?? null })),
    }
  } catch (error) {
    console.error('getTravels failed:', error)
    return EMPTY
  }
})
