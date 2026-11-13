'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { BD_DISTRICTS, getDistrict } from '@/lib/data/bd-districts'
import { BANGLADESH_SPOTS } from '@/lib/data/bangladesh-destinations'
import { WORLD_COUNTRIES, getCountryByName } from '@/lib/data/world-countries'
import { TRIP_NOTES_MAX, clampNotes, tripEstimate } from '@/lib/tour/catalog'
import type { TourData, TourLocation } from './useTourData'

const SORTED_DISTRICTS = [...BD_DISTRICTS].sort((a, b) => a.name.localeCompare(b.name))
const SORTED_COUNTRIES = WORLD_COUNTRIES.filter((c) => c.code !== 'BD').sort((a, b) => a.name.localeCompare(b.name))

const blank = (order: number): TourLocation => ({
  name: '', region: 'bangladesh', country: null, district: null, catalogId: null, notes: '', visited: false, order,
})

export function MyTripsTab({ data, editing, setEditing }: {
  data: TourData
  editing: TourLocation | null
  setEditing: (l: TourLocation | null) => void
}) {
  const { locations, saveLocation, deleteLocation } = data
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return locations.filter((l) => !q || [l.name, l.country ?? '', l.notes ?? ''].some((v) => v.toLowerCase().includes(q)))
  }, [locations, query])
  const planned = filtered.filter((l) => !l.visited)
  const visited = filtered.filter((l) => l.visited)

  const remove = async (l: TourLocation) => {
    const ok = await confirmDialog({
      title: 'Remove this trip?',
      description: <><strong>{l.name}</strong> will be removed from your list.</>,
      confirmLabel: 'Remove',
      tone: 'danger',
    })
    if (ok && await deleteLocation(l)) toast.success('Removed.')
  }

  const toggleVisited = (l: TourLocation) => saveLocation({ ...l, visited: !l.visited, visitedAt: l.visited ? null : new Date().toISOString() })

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {editing && <TripEditor key={editing.id ?? 'new'} draft={editing} onCancel={() => setEditing(null)} onSave={async (d) => { if (await saveLocation(d)) { setEditing(null); toast.success('Saved.') } }} />}

      <section className="trv-card" aria-labelledby="trv-trips-title">
        <div className="trv-card-head">
          <h2 className="trv-card-title" id="trv-trips-title">My trips</h2>
          <div className="trv-toolbar">
            <input className="trv-search" type="search" placeholder="Search my trips" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search my trips" />
            <button type="button" className="adm-btn amber" onClick={() => setEditing(blank(locations.length))}>+ Custom trip</button>
          </div>
        </div>
        <TripList title="Planned" items={planned} onEdit={setEditing} onRemove={remove} onToggle={toggleVisited} empty="Nothing planned yet — use ☆ Plan on a spot or country." />
        <TripList title="Been there" items={visited} onEdit={setEditing} onRemove={remove} onToggle={toggleVisited} empty="No completed trips yet." />
      </section>
    </div>
  )
}

function TripList({ title, items, empty, onEdit, onRemove, onToggle }: {
  title: string
  items: TourLocation[]
  empty: string
  onEdit: (l: TourLocation) => void
  onRemove: (l: TourLocation) => void
  onToggle: (l: TourLocation) => void
}) {
  return (
    <div className="trv-tier">
      <div className="trv-tier-head"><h3>{title}</h3><span>{items.length}</span></div>
      {items.length === 0 && <div className="trv-note" style={{ padding: '10px 4px' }}>{empty}</div>}
      {items.map((l) => {
        const country = l.region === 'international' ? getCountryByName(l.country || l.name) : undefined
        const district = l.district ? getDistrict(l.district) : undefined
        return (
          <div key={l.id} className="trv-row" data-visited={l.visited}>
            <div>
              <div className="trv-row-name">
                {country && <span className="trv-flag" aria-hidden="true">{country.flag}</span>}
                {l.name}
              </div>
              <div className="trv-row-meta">
                {l.region === 'international' ? country?.continent ?? 'International' : district ? `${district.name}, ${district.division}` : 'Bangladesh'}
                {l.notes ? ` · ${l.notes.slice(0, 140)}${l.notes.length > 140 ? '…' : ''}` : ''}
              </div>
            </div>
            <span />
            <div className="trv-row-actions">
              <button type="button" className="trv-toggle-btn" aria-pressed={l.visited} onClick={() => onToggle(l)}>{l.visited ? '✓ Been there' : 'Mark visited'}</button>
              <button type="button" className="adm-icon-btn" onClick={() => onEdit(l)} aria-label={`Edit ${l.name}`}>✎</button>
              <button type="button" className="adm-icon-btn danger" onClick={() => onRemove(l)} aria-label={`Remove ${l.name}`}>✕</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Catalogue cost estimate for the trip, if it is a known spot or country. */
function estimateBDT(draft: TourLocation): number | undefined {
  if (draft.region === 'international') {
    const country = getCountryByName(draft.catalogId || draft.country || draft.name)
    return country ? tripEstimate(country).bdt : undefined
  }
  return BANGLADESH_SPOTS.find((s) => s.id === draft.catalogId || s.name === draft.name)?.budget
}

function TripEditor({ draft: initial, onSave, onCancel }: {
  draft: TourLocation
  onSave: (d: TourLocation) => Promise<void>
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(initial)
  const [saving, setSaving] = useState(false)
  const set = (patch: Partial<TourLocation>) => setDraft((d) => ({ ...d, ...patch }))

  const submit = async () => {
    if (!draft.name.trim()) { toast.error('Give the trip a name.'); return }
    setSaving(true)
    try { await onSave({ ...draft, name: draft.name.trim() }) } finally { setSaving(false) }
  }

  return (
    <section className="trv-card adm-editor" aria-labelledby="trv-editor-title">
      <h3 id="trv-editor-title">{draft.id ? 'Edit trip' : 'New custom trip'}</h3>
      <div className="adm-form-grid">
        <div className="adm-field">
          <label className="adm-label" htmlFor="trv-region">Where</label>
          <select id="trv-region" className="adm-input" value={draft.region} onChange={(e) => set(e.target.value === 'international'
            ? { region: 'international', name: SORTED_COUNTRIES[0].name, country: SORTED_COUNTRIES[0].name, catalogId: SORTED_COUNTRIES[0].code, district: null }
            : { region: 'bangladesh', name: '', country: null, catalogId: null })}>
            <option value="bangladesh">Bangladesh</option>
            <option value="international">Abroad</option>
          </select>
        </div>
        {draft.region === 'international' ? (
          <div className="adm-field">
            <label className="adm-label" htmlFor="trv-country">Country</label>
            <select id="trv-country" className="adm-input" value={draft.country ?? ''} onChange={(e) => set({ country: e.target.value, name: e.target.value, catalogId: getCountryByName(e.target.value)?.code ?? null })}>
              {SORTED_COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>
        ) : (
          <>
            <div className="adm-field">
              <label className="adm-label" htmlFor="trv-name">Place</label>
              <input id="trv-name" className="adm-input" value={draft.name} maxLength={160} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Hidden waterfall near Thanchi" />
            </div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="trv-district">District</label>
              <select id="trv-district" className="adm-input" value={draft.district ?? ''} onChange={(e) => set({ district: e.target.value || null })}>
                <option value="">— Not set —</option>
                {SORTED_DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.division})</option>)}
              </select>
            </div>
          </>
        )}
        <div className="adm-field adm-col-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="adm-label" htmlFor="trv-notes" style={{ margin: 0 }}>Notes</label>
            <AIGenerateButton
              label="AI itinerary"
              promptContext={{ field: 'tour-itinerary', contextData: { destination: draft.country || draft.name, region: draft.region, budgetBDT: estimateBDT(draft) } }}
              onGenerate={(text) => set({ notes: clampNotes(text) })}
            />
          </div>
          <textarea id="trv-notes" className="adm-textarea" maxLength={TRIP_NOTES_MAX} value={draft.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} placeholder="Budget, who to go with, best season…" />
        </div>
      </div>
      <label className="adm-toggle" style={{ margin: '10px 0 14px' }}>
        <input type="checkbox" checked={draft.visited} onChange={(e) => set({ visited: e.target.checked, visitedAt: e.target.checked ? new Date().toISOString() : null })} />
        <span className="track" />
        <span>Been there</span>
      </label>
      <div className="adm-editor-actions">
        <button type="button" className="adm-btn amber" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save trip'}</button>
        <button type="button" className="adm-btn" onClick={onCancel}>Cancel</button>
      </div>
    </section>
  )
}
