'use client'

import { useMemo, useState } from 'react'
import { WORLD_COUNTRIES, VISA_CATEGORY_META, type CountryData, type VisaEaseCategory } from '@/lib/data/world-countries'
import { rankCountriesByEase, tripEstimate } from '@/lib/tour/catalog'
import { statusOf, type TourData } from './useTourData'
import { StatusButtons } from './StatusButtons'
import { CountryDetails } from './CountryDetails'

const RANKED = rankCountriesByEase(WORLD_COUNTRIES)
const RANK = new Map(RANKED.map((c, i) => [c.code, i + 1]))
const CONTINENTS = [...new Set(RANKED.map((c) => c.continent))].sort()
const CATEGORIES = Object.keys(VISA_CATEGORY_META) as VisaEaseCategory[]
const PILL: Record<VisaEaseCategory, string> = { visa_free: 'live', evisa_easy: 'feat', embassy_visa: 'draft' }

export function WorldTab({ data }: { data: TourData }) {
  const { findCountry, setCountryStatus, totalSavingsBDT } = data
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<ReadonlySet<VisaEaseCategory>>(new Set())
  const [continent, setContinent] = useState('all')
  const [hideVisited, setHideVisited] = useState(false)
  const [affordable, setAffordable] = useState(false)
  const [selected, setSelected] = useState<CountryData | null>(null)

  const base = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RANKED.filter((c) => {
      if (continent !== 'all' && c.continent !== continent) return false
      if (hideVisited && statusOf(findCountry(c)) === 'visited') return false
      if (affordable && tripEstimate(c).bdt > totalSavingsBDT) return false
      if (q && ![c.name, c.code, c.capital, c.visaLabel, ...c.touristSpots].some((v) => v.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, continent, hideVisited, affordable, totalSavingsBDT, findCountry])

  const counts = useMemo(() => {
    const m = new Map<VisaEaseCategory, number>()
    for (const c of base) m.set(c.visaCategory, (m.get(c.visaCategory) ?? 0) + 1)
    return m
  }, [base])

  const shown = base.filter((c) => categories.size === 0 || categories.has(c.visaCategory))

  const toggleCategory = (cat: VisaEaseCategory) => setCategories((prev) => {
    const next = new Set(prev)
    if (next.has(cat)) next.delete(cat)
    else next.add(cat)
    return next
  })

  return (
    <section className="trv-card" aria-labelledby="trv-world-title">
      <div className="trv-card-head">
        <div>
          <h2 className="trv-card-title" id="trv-world-title">Countries, easiest to visit first</h2>
          <p className="trv-note" style={{ margin: '4px 0 0' }}>
            Ranked for a Bangladeshi passport: visa-free / on-arrival first, then e-visa, then embassy visas — and within each, the cheapest estimated trip from Dhaka.
            Visa rules change often; confirm with the embassy or IATA Timatic before booking.
          </p>
        </div>
      </div>

      <div className="trv-toolbar" style={{ marginBottom: 10 }}>
        <input className="trv-search" type="search" placeholder="Search country, capital or attraction" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search countries" />
        <select className="adm-input" value={continent} onChange={(e) => setContinent(e.target.value)} aria-label="Continent">
          <option value="all">All continents</option>
          {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="trv-chips" role="group" aria-label="Visa type" style={{ marginBottom: 16 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} type="button" className="trv-chip" aria-pressed={categories.has(cat)} onClick={() => toggleCategory(cat)}>
            {VISA_CATEGORY_META[cat].label} <small>{counts.get(cat) ?? 0}</small>
          </button>
        ))}
        <button type="button" className="trv-chip" aria-pressed={affordable} onClick={() => setAffordable((v) => !v)} disabled={totalSavingsBDT <= 0} title={totalSavingsBDT <= 0 ? 'Add savings first' : undefined}>
          Within my savings
        </button>
        <button type="button" className="trv-chip" aria-pressed={hideVisited} onClick={() => setHideVisited((v) => !v)}>
          Hide visited
        </button>
      </div>

      {shown.map((c) => {
        const cost = tripEstimate(c)
        const status = statusOf(findCountry(c))
        return (
          <div key={c.code} className="trv-row" data-visited={status === 'visited'}>
            <div>
              <div className="trv-row-name">
                <span className="trv-rank">#{RANK.get(c.code)}</span>
                <span className="trv-flag" aria-hidden="true">{c.flag}</span>
                <button type="button" className="trv-link" onClick={() => setSelected(c)} aria-label={`${c.name} — visa and cost details`}>
                  {c.name}
                </button>
                <span className={`adm-pill ${PILL[c.visaCategory]}`}>{c.visaLabel}</span>
              </div>
              <div className="trv-row-meta">
                {c.continent} · Best {c.bestTime} · {c.visaNotes}
              </div>
            </div>
            <div className="trv-row-price">
              {cost.source === 'zone' ? '≈' : ''}৳{cost.bdt.toLocaleString()}+
              <small title={cost.source === 'zone' ? 'Regional estimate from Dhaka — no country-specific figure yet' : 'Country-specific estimate'}>
                {cost.source === 'zone' ? 'regional est.' : 'est. trip'}
              </small>
            </div>
            <StatusButtons status={status} label={c.name} onChange={(next) => setCountryStatus(c, next)} />
          </div>
        )
      })}
      {shown.length === 0 && <div className="adm-empty">No countries match these filters.</div>}

      {selected && <CountryDetails country={selected} rank={RANK.get(selected.code) ?? 0} onClose={() => setSelected(null)} />}
    </section>
  )
}
