'use client'

import { useMemo, useState } from 'react'
import { BD_DIVISIONS, BD_DISTRICTS, type BdDivision } from '@/lib/data/bd-districts'
import {
  BANGLADESH_SPOTS, SPOT_CATEGORY_LABEL, SEASON_LABEL, type BangladeshSpot, type SpotCategory,
} from '@/lib/data/bangladesh-destinations'
import { EXPENSE_TIERS, expenseTier, sortSpotsByExpense, type ExpenseTierKey } from '@/lib/tour/catalog'
import { statusOf, type TourData, type TripStatus } from './useTourData'
import { StatusButtons } from './StatusButtons'

type StatusFilter = 'all' | 'open' | 'planned' | 'visited'

export function BangladeshTab({ data }: { data: TourData }) {
  const { findBangladesh, setSpotStatus, totalSavingsBDT } = data
  const [query, setQuery] = useState('')
  const [division, setDivision] = useState<'all' | BdDivision>('all')
  const [district, setDistrict] = useState('all')
  const [category, setCategory] = useState<'all' | SpotCategory>('all')
  const [tiers, setTiers] = useState<ReadonlySet<ExpenseTierKey>>(new Set())
  const [status, setStatus] = useState<StatusFilter>('all')
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [affordable, setAffordable] = useState(false)

  const districtOptions = useMemo(
    () => BD_DISTRICTS.filter((d) => division === 'all' || d.division === division).slice().sort((a, b) => a.name.localeCompare(b.name)),
    [division],
  )

  // Everything except the tier filter, so tier chip counts reflect the other filters.
  const base = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BANGLADESH_SPOTS.filter((s) => {
      if (division !== 'all' && s.division !== division) return false
      if (district !== 'all' && s.districtId !== district) return false
      if (category !== 'all' && s.category !== category) return false
      if (affordable && s.budget > totalSavingsBDT) return false
      const st = statusOf(findBangladesh(s))
      if (status === 'open' && st !== 'none') return false
      if (status === 'planned' && st !== 'planned') return false
      if (status === 'visited' && st !== 'visited') return false
      if (q && ![s.name, s.district, s.division, s.description].some((v) => v.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, division, district, category, affordable, totalSavingsBDT, status, findBangladesh])

  const tierCounts = useMemo(() => {
    const counts = new Map<ExpenseTierKey, number>()
    for (const s of base) counts.set(expenseTier(s.budget).key, (counts.get(expenseTier(s.budget).key) ?? 0) + 1)
    return counts
  }, [base])

  const grouped = useMemo(() => {
    const sorted = sortSpotsByExpense(base.filter((s) => tiers.size === 0 || tiers.has(expenseTier(s.budget).key)), direction)
    const order = direction === 'asc' ? EXPENSE_TIERS : [...EXPENSE_TIERS].reverse()
    return order
      .map((tier) => ({ tier, spots: sorted.filter((s) => expenseTier(s.budget).key === tier.key) }))
      .filter((g) => g.spots.length > 0)
  }, [base, tiers, direction])

  const shown = grouped.reduce((n, g) => n + g.spots.length, 0)

  const toggleTier = (key: ExpenseTierKey) => setTiers((prev) => {
    const next = new Set(prev)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })

  return (
    <section className="trv-card" aria-labelledby="trv-bd-title">
      <div className="trv-card-head">
        <div>
          <h2 className="trv-card-title" id="trv-bd-title">Tourist spots in Bangladesh</h2>
          <p className="trv-note" style={{ margin: '4px 0 0' }}>
            {BANGLADESH_SPOTS.length} spots in all 64 districts, sorted by estimated cost per person from Dhaka (transport, stay, food). Estimates, not quotes.
          </p>
        </div>
        <button type="button" className="adm-btn" onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}>
          {direction === 'asc' ? 'Cheapest first ↑' : 'Priciest first ↓'}
        </button>
      </div>

      <div className="trv-toolbar" style={{ marginBottom: 10 }}>
        <input className="trv-search" type="search" placeholder="Search spot, district or description" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search spots" />
        <select className="adm-input" value={division} onChange={(e) => { setDivision(e.target.value as 'all' | BdDivision); setDistrict('all') }} aria-label="Division">
          <option value="all">All divisions</option>
          {BD_DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="adm-input" value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District">
          <option value="all">All districts</option>
          {districtOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="adm-input" value={category} onChange={(e) => setCategory(e.target.value as 'all' | SpotCategory)} aria-label="Category">
          <option value="all">All types</option>
          {(Object.keys(SPOT_CATEGORY_LABEL) as SpotCategory[]).map((c) => <option key={c} value={c}>{SPOT_CATEGORY_LABEL[c]}</option>)}
        </select>
        <select className="adm-input" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} aria-label="Status">
          <option value="all">Any status</option>
          <option value="open">Not saved</option>
          <option value="planned">Planned</option>
          <option value="visited">Visited</option>
        </select>
      </div>

      <div className="trv-chips" role="group" aria-label="Budget tiers" style={{ marginBottom: 16 }}>
        {EXPENSE_TIERS.map((tier) => (
          <button key={tier.key} type="button" className="trv-chip" aria-pressed={tiers.has(tier.key)} onClick={() => toggleTier(tier.key)}>
            {tier.label} <small>{tierCounts.get(tier.key) ?? 0}</small>
          </button>
        ))}
        <button type="button" className="trv-chip" aria-pressed={affordable} onClick={() => setAffordable((v) => !v)} disabled={totalSavingsBDT <= 0} title={totalSavingsBDT <= 0 ? 'Add savings first' : undefined}>
          Within my savings
        </button>
      </div>

      {grouped.map(({ tier, spots }) => (
        <div key={tier.key} className="trv-tier">
          <div className="trv-tier-head">
            <h3>{tier.label}</h3>
            <span>{spots.length} spot{spots.length === 1 ? '' : 's'}</span>
          </div>
          {spots.map((spot) => (
            <SpotRow key={spot.id} spot={spot} status={statusOf(findBangladesh(spot))} onChange={(next) => setSpotStatus(spot, next)} />
          ))}
        </div>
      ))}
      {shown === 0 && <div className="adm-empty">No spots match these filters.</div>}
    </section>
  )
}

function SpotRow({ spot, status, onChange }: { spot: BangladeshSpot; status: TripStatus; onChange: (s: TripStatus) => void }) {
  return (
    <div className="trv-row" data-visited={status === 'visited'}>
      <div>
        <div className="trv-row-name">
          {spot.name}
          <span className="adm-cat">{SPOT_CATEGORY_LABEL[spot.category]}</span>
        </div>
        <div className="trv-row-meta">
          {spot.district}, {spot.division} · {SEASON_LABEL[spot.season]} — {spot.description}
        </div>
      </div>
      <div className="trv-row-price">
        ৳{spot.budget.toLocaleString()}
        <small>per person</small>
      </div>
      <StatusButtons status={status} onChange={onChange} label={spot.name} />
    </div>
  )
}
