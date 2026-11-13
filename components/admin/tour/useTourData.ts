'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { adminFetch } from '@/lib/admin/adminFetch'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { findCatalogTrip, savingsInBDT } from '@/lib/tour/catalog'
import type { BangladeshSpot } from '@/lib/data/bangladesh-destinations'
import type { CountryData } from '@/lib/data/world-countries'

export interface TourLocation {
  id?: string
  name: string
  region: 'bangladesh' | 'international'
  country?: string | null
  district?: string | null
  /** Bangladesh spot id or ISO country code; null for custom trips. */
  catalogId?: string | null
  notes?: string | null
  visited: boolean
  visitedAt?: string | null
  order: number
}

export type TripStatus = 'none' | 'planned' | 'visited'

interface SavingsAccount { currency: string; amount: number }

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export function statusOf(location: TourLocation | undefined): TripStatus {
  if (!location) return 'none'
  return location.visited ? 'visited' : 'planned'
}

async function ensureOk(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res
}

const sameText = (a: string | null | undefined, b: string | null | undefined) => (a ?? '').trim() === (b ?? '').trim()

export function useTourData(enabled: boolean) {
  const [locations, setLocations] = useState<TourLocation[]>([])
  const [districtIds, setDistrictIds] = useState<string[]>([])
  const [savings, setSavings] = useState<SavingsAccount[]>([])
  const [savingsFailed, setSavingsFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // District saves replace the whole set, so they run one at a time and only the newest is sent.
  const confirmedDistricts = useRef<string[]>([])
  const districtQueue = useRef<Promise<void>>(Promise.resolve())
  const districtSeq = useRef(0)

  const load = useCallback(async () => {
    try {
      const [tours, districts, savingsRes] = await Promise.all([
        adminFetch('/api/tours').then(ensureOk),
        adminFetch('/api/tours/districts').then(ensureOk),
        adminFetch('/api/savings'),
      ])
      setLocations(await tours.json())
      const ids: string[] = (await districts.json()).districtIds ?? []
      confirmedDistricts.current = ids
      setDistrictIds(ids)
      if (savingsRes.ok) {
        setSavings(await savingsRes.json())
      } else {
        setSavingsFailed(true)
        toast.error('Could not load your savings, so “Within my savings” is unavailable.')
      }
    } catch {
      toast.error('Could not load your travel data.')
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (enabled) load()
  }, [enabled, load])

  const findBangladesh = useCallback(
    (spot: BangladeshSpot) => findCatalogTrip(locations, 'bangladesh', spot.id, spot.name),
    [locations],
  )
  const findCountry = useCallback(
    (country: CountryData) => findCatalogTrip(locations, 'international', country.code, country.name),
    [locations],
  )

  const { totalBDT: totalSavingsBDT, skippedCurrencies } = useMemo(() => savingsInBDT(savings), [savings])

  const saveLocation = useCallback(async (draft: TourLocation): Promise<boolean> => {
    try {
      const res = await adminFetch(draft.id ? `/api/tours/${draft.id}` : '/api/tours', {
        method: draft.id ? 'PUT' : 'POST', headers: JSON_HEADERS, body: JSON.stringify(stripId(draft)),
      }).then(ensureOk)
      const saved: TourLocation = await res.json()
      setLocations((prev) => draft.id ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved])
      return true
    } catch {
      toast.error(`Could not save "${draft.name}".`)
      return false
    }
  }, [])

  const deleteLocation = useCallback(async (location: TourLocation): Promise<boolean> => {
    if (!location.id) return true
    try {
      await adminFetch(`/api/tours/${location.id}`, { method: 'DELETE' }).then(ensureOk)
      setLocations((prev) => prev.filter((l) => l.id !== location.id))
      return true
    } catch {
      toast.error(`Could not remove "${location.name}".`)
      return false
    }
  }, [])

  /**
   * Moves a catalogue item between "not saved", "planned" and "visited".
   * `fresh` is the row a first save would create; its notes are the catalogue default.
   */
  const setStatus = useCallback(async (existing: TourLocation | undefined, fresh: TourLocation, status: TripStatus) => {
    if (status === 'none') {
      if (!existing) return true
      const hasOwnNotes = Boolean(existing.notes?.trim()) && !sameText(existing.notes, fresh.notes)
      if (hasOwnNotes) {
        const ok = await confirmDialog({
          title: 'Remove this trip?',
          description: `“${existing.name}” has notes you wrote. Removing it from your list deletes them.`,
          confirmLabel: 'Remove',
          tone: 'danger',
        })
        if (!ok) return false
      }
      return deleteLocation(existing)
    }
    const visited = status === 'visited'
    // Re-saving an older row also stamps it with the catalogue id.
    const base = existing ? { ...existing, catalogId: fresh.catalogId } : fresh
    return saveLocation({ ...base, visited, visitedAt: visited ? new Date().toISOString() : null })
  }, [deleteLocation, saveLocation])

  const setSpotStatus = useCallback((spot: BangladeshSpot, status: TripStatus) => setStatus(
    findBangladesh(spot),
    { name: spot.name, region: 'bangladesh', district: spot.districtId, catalogId: spot.id, country: null, notes: spot.description, visited: false, order: locations.length },
    status,
  ), [findBangladesh, locations.length, setStatus])

  const setCountryStatus = useCallback((country: CountryData, status: TripStatus) => setStatus(
    findCountry(country),
    { name: country.name, region: 'international', country: country.name, catalogId: country.code, notes: `${country.visaLabel}: ${country.visaNotes}`, visited: false, order: locations.length },
    status,
  ), [findCountry, locations.length, setStatus])

  const saveDistricts = useCallback((next: string[]): Promise<void> => {
    setDistrictIds(next)
    const seq = ++districtSeq.current
    districtQueue.current = districtQueue.current.then(async () => {
      if (seq !== districtSeq.current) return // A newer selection is queued and will replace this one.
      try {
        await adminFetch('/api/tours/districts', {
          method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify({ districtIds: next }),
        }).then(ensureOk)
        confirmedDistricts.current = next
      } catch {
        if (seq !== districtSeq.current) return
        setDistrictIds(confirmedDistricts.current)
        toast.error('Could not update the map. Your change was undone.')
      }
    })
    return districtQueue.current
  }, [])

  return {
    loaded, locations, districtIds, totalSavingsBDT, skippedCurrencies, savingsFailed,
    findBangladesh, findCountry, saveLocation, deleteLocation, setSpotStatus, setCountryStatus, saveDistricts,
  }
}

export type TourData = ReturnType<typeof useTourData>

function stripId({ id: _id, ...rest }: TourLocation): Omit<TourLocation, 'id'> {
  return rest
}
