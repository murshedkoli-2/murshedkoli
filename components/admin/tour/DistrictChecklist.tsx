'use client'

import { useMemo, useState } from 'react'
import { districtsByDivision, BD_DIVISION_BN } from '@/lib/data/bd-districts'

interface DistrictChecklistProps {
  visited: ReadonlySet<string>
  onToggle: (districtId: string) => void
  onSetMany: (districtIds: string[], visited: boolean) => void
}

const GROUPS = districtsByDivision()

export function DistrictChecklist({ visited, onToggle, onSetMany }: DistrictChecklistProps) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GROUPS
    return GROUPS
      .map((g) => ({ ...g, districts: g.districts.filter((d) => d.name.toLowerCase().includes(q) || d.bn.includes(q)) }))
      .filter((g) => g.districts.length > 0)
  }, [query])

  return (
    <section className="trv-card" aria-labelledby="trv-checklist-title">
      <div className="trv-card-head">
        <h2 className="trv-card-title" id="trv-checklist-title">Districts I&apos;ve visited</h2>
        <span className="adm-pill live">{visited.size} / 64</span>
      </div>
      <input
        className="trv-search"
        type="search"
        placeholder="Find a district — English or বাংলা"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Filter districts"
        style={{ width: '100%', marginBottom: 12 }}
      />
      <div className="trv-checklist">
        {groups.map(({ division, districts }) => {
          const done = districts.filter((d) => visited.has(d.id)).length
          const allDone = done === districts.length
          return (
            <div key={division}>
              <div className="trv-division-head">
                <span>{division} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{BD_DIVISION_BN[division]} · {done}/{districts.length}</span></span>
                <button type="button" onClick={() => onSetMany(districts.map((d) => d.id), !allDone)}>
                  {allDone ? 'Clear' : 'Select all'}
                </button>
              </div>
              <div className="trv-chips">
                {districts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="trv-chip"
                    aria-pressed={visited.has(d.id)}
                    onClick={() => onToggle(d.id)}
                    title={d.bn}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        {groups.length === 0 && <div className="adm-empty">No district matches “{query}”.</div>}
      </div>
    </section>
  )
}
