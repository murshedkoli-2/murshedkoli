'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { BANGLADESH_SPOTS } from '@/lib/data/bangladesh-destinations'
import { WORLD_COUNTRIES } from '@/lib/data/world-countries'
import { mergeVisitedDistricts } from '@/lib/tour/catalog'
import { useTourData, type TourLocation } from './useTourData'
import { MapTab } from './MapTab'
import { BangladeshTab } from './BangladeshTab'
import { WorldTab } from './WorldTab'
import { MyTripsTab } from './MyTripsTab'
import './tour.css'

type Tab = 'map' | 'bangladesh' | 'world' | 'trips'

export function TourManager() {
  const ready = useAdminGuard()
  const data = useTourData(ready)
  const [tab, setTab] = useState<Tab>('map')
  const [editing, setEditing] = useState<TourLocation | null>(null)

  const { locations, districtIds, totalSavingsBDT, skippedCurrencies, savingsFailed } = data
  const districtCount = useMemo(() => mergeVisitedDistricts(
    districtIds,
    locations.filter((l) => l.visited && l.district).map((l) => l.district as string),
  ).size, [districtIds, locations])
  const visitedCountries = locations.filter((l) => l.region === 'international' && l.visited).length
  const plannedCount = locations.filter((l) => !l.visited).length

  if (!ready) return null

  const tabs: Array<{ id: Tab; label: string; count: string }> = [
    { id: 'map', label: 'District map', count: `${districtCount}/64` },
    { id: 'bangladesh', label: 'Bangladesh spots', count: String(BANGLADESH_SPOTS.length) },
    { id: 'world', label: 'World · visa ease', count: String(WORLD_COUNTRIES.length - 1) },
    { id: 'trips', label: 'My trips', count: String(locations.length) },
  ]

  return (
    <AdminShell
      active="tour"
      title="Travel atlas"
      subtitle={`${districtCount}/64 districts · ${visitedCountries} countries visited · ${plannedCount} planned`}
      actions={<button type="button" className="adm-btn amber" onClick={() => { setTab('trips'); setEditing({ name: '', region: 'bangladesh', visited: false, order: locations.length }) }}>+ Custom trip</button>}
    >
      <div className="trv">
        <div className="trv-strip">
          <div className="trv-strip-figure">
            <span className="trv-strip-label">Savings · all accounts</span>
            <span className="trv-strip-amount">{savingsFailed ? 'Unavailable' : `৳${Math.round(totalSavingsBDT).toLocaleString()}`}</span>
            {skippedCurrencies.length > 0 && (
              <span className="trv-note" role="status">Not counted: accounts in {skippedCurrencies.join(', ')} (no exchange rate set).</span>
            )}
            <span className="trv-note">Use “Within my savings” on the spot and country lists to see what you can afford now.</span>
          </div>
          <div className="trv-strip-actions">
            <Link href="/admin/savings" className="adm-btn">Manage savings ↗</Link>
          </div>
        </div>

        <div className="trv-tabs" role="tablist" aria-label="Travel sections">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" id={`trv-tab-${t.id}`} aria-controls={`trv-panel-${t.id}`} aria-selected={tab === t.id} className="trv-tab" onClick={() => setTab(t.id)}>
              {t.label} <span className="trv-tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`trv-panel-${tab}`} aria-labelledby={`trv-tab-${tab}`}>
          {!data.loaded ? <div className="adm-empty">Loading your travel data…</div> : (
            <>
              {tab === 'map' && <MapTab data={data} />}
              {tab === 'bangladesh' && <BangladeshTab data={data} />}
              {tab === 'world' && <WorldTab data={data} />}
              {tab === 'trips' && <MyTripsTab data={data} editing={editing} setEditing={setEditing} />}
            </>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
