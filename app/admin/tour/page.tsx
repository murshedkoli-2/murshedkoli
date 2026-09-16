'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { adminFetch } from '@/lib/admin/adminFetch'
import {
  WORLD_COUNTRIES,
  VISA_CATEGORY_META,
  getCountryByName,
  type VisaEaseCategory,
  type CountryData,
} from '@/lib/data/world-countries'

interface TourLocation {
  id?: string
  name: string
  region: 'bangladesh' | 'international'
  country?: string | null
  notes?: string | null
  visited: boolean
  order: number
}

interface SavingsAccount {
  id?: string
  name: string
  currency: string
  amount: number
}

/**
 * Calculates the estimated minimum budget in BDT for a destination.
 * Parses strings like "BDT 80,000 - 150,000" or "$1,200".
 */
export function getEstimatedMinCostBDT(
  c?: CountryData | string | null,
  region = 'international',
  notes?: string | null
): number {
  const str = typeof c === 'string' ? c : c?.estimatedCost?.totalEstimate
  if (str) {
    const bdtMatch = str.match(/BDT\s*([\d,]+)/i)
    if (bdtMatch) {
      const val = parseInt(bdtMatch[1].replace(/,/g, ''), 10)
      if (!isNaN(val) && val > 0) return val
    }
    const usdMatch = str.match(/(?:USD|\$)\s*([\d,]+)/i)
    if (usdMatch) {
      const val = parseInt(usdMatch[1].replace(/,/g, ''), 10)
      if (!isNaN(val) && val > 0) return val * 122
    }
    const numMatch = str.match(/([\d]{1,3}(?:,\d{3})+|\d{4,})/)
    if (numMatch) {
      const val = parseInt(numMatch[1].replace(/,/g, ''), 10)
      if (!isNaN(val) && val > 0) return val
    }
  }

  if (region === 'bangladesh') {
    if (notes) {
      const match = notes.match(/(\d[\d,]{3,})/)
      if (match) {
        const val = parseInt(match[1].replace(/,/g, ''), 10)
        if (!isNaN(val) && val > 0) return val
      }
    }
    return 10000 // Standard domestic budget estimate in BDT
  }

  return 90000
}

type ActiveTab = 'bangladesh' | 'international' | 'completed'
type VisaFilter = 'all' | VisaEaseCategory
type ContinentFilter = 'all' | CountryData['continent']

function emptyLocation(region: 'bangladesh' | 'international' | 'completed', order: number): TourLocation {
  if (region === 'international' || region === 'completed') {
    const firstCountry = WORLD_COUNTRIES[0]
    return {
      name: firstCountry.name,
      region: 'international',
      country: firstCountry.name,
      notes: `${firstCountry.flag} ${firstCountry.visaLabel}: ${firstCountry.visaNotes}`,
      visited: region === 'completed',
      order,
    }
  }
  return { name: '', region: 'bangladesh', country: null, notes: '', visited: false, order }
}

export default function TourManager() {
  const ready = useAdminGuard()
  const [locations, setLocations] = useState<TourLocation[]>([])
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([])
  const [editing, setEditing] = useState<TourLocation | null>(null)
  const [saving, setSaving] = useState(false)

  // Country Details Modal State
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [detailsTab, setDetailsTab] = useState<'spots' | 'visa' | 'cost'>('spots')

  // Three Main Tabs
  const [activeTab, setActiveTab] = useState<ActiveTab>('bangladesh')
  
  // International Filters
  const [visaFilter, setVisaFilter] = useState<VisaFilter>('all')
  const [continentFilter, setContinentFilter] = useState<ContinentFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAffordableOnly, setShowAffordableOnly] = useState(false)

  const load = useCallback(async () => {
    try {
      const [toursRes, savingsRes] = await Promise.all([
        adminFetch('/api/tours'),
        adminFetch('/api/savings'),
      ])
      if (toursRes.ok) setLocations(await toursRes.json())
      else toast.error('Could not load tour locations.')

      if (savingsRes.ok) setSavingsAccounts(await savingsRes.json())
    } catch (error) {
      console.error('Tour load failed:', error)
      toast.error('Could not load tour locations.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  // Savings & Currency Aggregation
  const totalSavingsBDT = useMemo(() => {
    return savingsAccounts.reduce((acc, a) => {
      const curr = (a.currency || 'BDT').toUpperCase()
      const amt = Number(a.amount) || 0
      if (curr === 'USD') return acc + amt * 122
      if (curr === 'EUR') return acc + amt * 132
      if (curr === 'GBP') return acc + amt * 155
      return acc + amt
    }, 0)
  }, [savingsAccounts])

  // Affordable Destination Counts
  const affordableIntlCount = useMemo(() => {
    if (totalSavingsBDT <= 0) return 0
    return WORLD_COUNTRIES.filter((c) => {
      const cost = getEstimatedMinCostBDT(c)
      return totalSavingsBDT >= cost
    }).length
  }, [totalSavingsBDT])

  const affordableBDCount = useMemo(() => {
    if (totalSavingsBDT <= 0) return 0
    return locations.filter((l) => {
      if (l.region !== 'bangladesh' || l.visited) return false
      const cost = getEstimatedMinCostBDT(null, 'bangladesh', l.notes)
      return totalSavingsBDT >= cost
    }).length
  }, [locations, totalSavingsBDT])

  // Counts
  const plannedBDCount = useMemo(() => locations.filter((l) => l.region === 'bangladesh' && !l.visited).length, [locations])
  const plannedIntlCount = useMemo(() => locations.filter((l) => l.region === 'international' && !l.visited).length, [locations])
  const completedCount = useMemo(() => locations.filter((l) => l.visited).length, [locations])

  // DB lookup map for international countries
  const dbIntlMap = useMemo(() => {
    const map = new Map<string, TourLocation>()
    locations.forEach((l) => {
      if (l.region === 'international') {
        const key = (l.country || l.name).trim().toLowerCase()
        map.set(key, l)
      }
    })
    return map
  }, [locations])

  // Uncompleted 197 World Countries (Sorted with Easy Visa countries at top!)
  const visibleCountries = useMemo(() => {
    const filtered = WORLD_COUNTRIES.map((c) => {
      const dbMatch = dbIntlMap.get(c.name.toLowerCase()) || dbIntlMap.get(c.code.toLowerCase())
      return {
        country: c,
        dbItem: dbMatch || null,
        isVisited: dbMatch ? dbMatch.visited : false,
        isPlanned: dbMatch ? !dbMatch.visited : false,
      }
    }).filter(({ isVisited, country }) => {
      // Exclude completed tours from planned list!
      if (isVisited) return false

      // Visa Ease Filter
      if (visaFilter !== 'all' && country.visaCategory !== visaFilter) return false

      // Continent Filter
      if (continentFilter !== 'all' && country.continent !== continentFilter) return false

      // Affordable with Savings Filter
      if (showAffordableOnly) {
        const cost = getEstimatedMinCostBDT(country)
        if (totalSavingsBDT <= 0 || totalSavingsBDT < cost) return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = country.name.toLowerCase().includes(q)
        const matchCode = country.code.toLowerCase().includes(q)
        const matchVisa = country.visaLabel.toLowerCase().includes(q)
        const matchNotes = country.visaNotes.toLowerCase().includes(q)
        if (!matchName && !matchCode && !matchVisa && !matchNotes) return false
      }

      return true
    })

    // Priority Sort: Visa Free / VoA (1) -> e-Visa / Easy (2) -> Embassy Visa (3)
    const priorityMap: Record<VisaEaseCategory, number> = {
      visa_free: 1,
      evisa_easy: 2,
      embassy_visa: 3,
    }

    return filtered.sort((a, b) => {
      // If affordable filter is active, sort by lower cost first
      if (showAffordableOnly) {
        const costA = getEstimatedMinCostBDT(a.country)
        const costB = getEstimatedMinCostBDT(b.country)
        if (costA !== costB) return costA - costB
      }

      const pA = priorityMap[a.country.visaCategory] || 99
      const pB = priorityMap[b.country.visaCategory] || 99
      if (pA !== pB) return pA - pB
      return a.country.name.localeCompare(b.country.name)
    })
  }, [dbIntlMap, visaFilter, continentFilter, searchQuery, showAffordableOnly, totalSavingsBDT])

  // Uncompleted Bangladesh Spots (Excludes Completed Tours!)
  const visibleBDLocations = useMemo(() => {
    return locations.filter((l) => {
      if (l.region !== 'bangladesh') return false
      if (l.visited) return false // Exclude completed tours!

      // Affordable with Savings Filter
      if (showAffordableOnly) {
        const cost = getEstimatedMinCostBDT(null, 'bangladesh', l.notes)
        if (totalSavingsBDT <= 0 || totalSavingsBDT < cost) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = l.name.toLowerCase().includes(q)
        const matchNotes = (l.notes || '').toLowerCase().includes(q)
        if (!matchName && !matchNotes) return false
      }
      return true
    })
  }, [locations, searchQuery, showAffordableOnly, totalSavingsBDT])

  // Completed Tours (Displayed ONLY on Completed Page)
  const completedTours = useMemo(() => {
    return locations.filter((l) => {
      if (!l.visited) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = l.name.toLowerCase().includes(q)
        const matchNotes = (l.notes || '').toLowerCase().includes(q)
        if (!matchName && !matchNotes) return false
      }
      return true
    })
  }, [locations, searchQuery])

  // Mark country as Completed (moves directly to Completed page)
  const markCountryCompleted = async (c: CountryData, dbItem: TourLocation | null) => {
    try {
      if (dbItem && dbItem.id) {
        const res = await adminFetch(`/api/tours/${dbItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visited: true, visitedAt: new Date().toISOString() }),
        })
        if (res.ok) {
          setLocations((prev) => prev.map((x) => (x.id === dbItem.id ? { ...x, visited: true } : x)))
          toast.success(`"${c.name}" completed! Moved to Completed page.`)
        } else {
          toast.error('Could not update country.')
        }
      } else {
        const newTour = {
          name: c.name,
          region: 'international' as const,
          country: c.name,
          notes: `${c.flag} ${c.visaLabel}: ${c.visaNotes}`,
          visited: true,
          visitedAt: new Date().toISOString(),
          order: locations.length,
        }
        const res = await adminFetch('/api/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTour),
        })
        if (res.ok) {
          const saved = await res.json()
          setLocations((prev) => [...prev, saved])
          toast.success(`"${c.name}" completed! Moved to Completed page.`)
        } else {
          toast.error('Could not save country.')
        }
      }
    } catch (error) {
      console.error('Complete failed:', error)
      toast.error('Could not complete country.')
    }
  }

  // Add country to Wishlist / Planned
  const addCountryToPlanned = async (c: CountryData) => {
    try {
      const newTour = {
        name: c.name,
        region: 'international' as const,
        country: c.name,
        notes: `${c.flag} ${c.visaLabel}: ${c.visaNotes}`,
        visited: false,
        order: locations.length,
      }
      const res = await adminFetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour),
      })
      if (res.ok) {
        const saved = await res.json()
        setLocations((prev) => [...prev, saved])
        toast.success(`Added "${c.name}" to Planned list!`)
      } else {
        toast.error('Could not add country.')
      }
    } catch (error) {
      console.error('Add failed:', error)
      toast.error('Could not add country.')
    }
  }

  // Toggle BD spot completed
  const markBDCompleted = async (l: TourLocation) => {
    try {
      const res = await adminFetch(`/api/tours/${l.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: true, visitedAt: new Date().toISOString() }),
      })
      if (res.ok) {
        setLocations((prev) => prev.map((x) => (x.id === l.id ? { ...x, visited: true } : x)))
        toast.success(`"${l.name}" completed! Moved to Completed page.`)
      } else {
        toast.error('Could not update spot.')
      }
    } catch (error) {
      console.error('Toggle failed:', error)
      toast.error('Could not update spot.')
    }
  }

  // Unmark completed (move back to Planned / Discovery)
  const unmarkCompleted = async (l: TourLocation) => {
    try {
      const res = await adminFetch(`/api/tours/${l.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: false, visitedAt: null }),
      })
      if (res.ok) {
        setLocations((prev) => prev.map((x) => (x.id === l.id ? { ...x, visited: false } : x)))
        toast.success(`"${l.name}" moved back to Planned list.`)
      } else {
        toast.error('Could not update tour.')
      }
    } catch (error) {
      console.error('Unmark failed:', error)
      toast.error('Could not update tour.')
    }
  }

  // Delete location from DB
  const removeLocation = async (l: TourLocation) => {
    const ok = await confirmDialog({
      title: 'Remove this location?',
      description: <><strong>{l.name}</strong> will be removed from your tour list.</>,
      confirmLabel: 'Remove location',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await adminFetch(`/api/tours/${l.id}`, { method: 'DELETE' })
      if (res.ok) {
        setLocations((prev) => prev.filter((x) => x.id !== l.id))
        toast.success('Location deleted.')
      } else {
        toast.error('Could not delete location.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete location.')
    }
  }

  // Save manual editor form
  const saveForm = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error('Name / Country is required.')
      return
    }
    setSaving(true)
    try {
      const url = editing.id ? `/api/tours/${editing.id}` : '/api/tours'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success(editing.visited ? 'Saved to Completed page!' : 'Saved to Planned list.')
      } else {
        toast.error('Could not save destination.')
      }
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save destination.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="tour"
      title="Tour & Destination Manager"
      subtitle={`${completedCount} completed · ${plannedBDCount + plannedIntlCount} planned · 197 Countries`}
      actions={
        <button
          className="adm-btn amber"
          onClick={() => setEditing(emptyLocation(activeTab, locations.length))}
        >
          + Add Destination
        </button>
      }
    >
      {/* ── SAVINGS & TOUR READINESS BANNER ─────────────────────────────── */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 16,
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#10b981',
              fontWeight: 700,
            }}
          >
            ৳
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
              // SAVINGS & TRAVEL READINESS
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>৳ {totalSavingsBDT.toLocaleString()} BDT Total Savings</span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                🟢 {affordableIntlCount + affordableBDCount} destinations affordable right now
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            className={`adm-btn ${showAffordableOnly ? 'active' : ''}`}
            onClick={() => setShowAffordableOnly(!showAffordableOnly)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: showAffordableOnly ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              borderColor: showAffordableOnly ? '#10b981' : 'var(--line)',
              color: showAffordableOnly ? '#10b981' : 'var(--ink)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: '#10b981',
                boxShadow: showAffordableOnly ? '0 0 6px #10b981' : 'none',
              }}
            />
            <span>{showAffordableOnly ? 'Showing Affordable Only' : 'Filter by Current Savings'}</span>
          </button>

          <Link
            href="/admin/savings"
            className="adm-btn"
            style={{ fontSize: 12, textDecoration: 'none', padding: '6px 12px' }}
          >
            Manage Savings ↗
          </Link>
        </div>
      </div>

      <div className="adm-panel">
        {/* Top Main Navigation Tabs */}
        <div className="adm-editor-tabs" style={{ padding: '0 18px', background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
          <button
            className={`adm-editor-tab ${activeTab === 'bangladesh' ? 'active' : ''}`}
            onClick={() => setActiveTab('bangladesh')}
          >
            <span>🇧🇩 Bangladesh Spots</span>
            <span className="adm-badge">{plannedBDCount}</span>
          </button>
          <button
            className={`adm-editor-tab ${activeTab === 'international' ? 'active' : ''}`}
            onClick={() => setActiveTab('international')}
          >
            <span>✈️ International Destinations</span>
            <span className="adm-badge">{plannedIntlCount}</span>
          </button>
          <button
            className={`adm-editor-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span>✅ Completed Page</span>
            <span className="adm-badge">{completedCount}</span>
          </button>
        </div>

        {/* Editor Drawer */}
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit Destination' : 'New Destination'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Region Type</label>
                <select
                  className="adm-input"
                  value={editing.region}
                  onChange={(e) => {
                    const newRegion = e.target.value as TourLocation['region']
                    if (newRegion === 'international') {
                      const c = WORLD_COUNTRIES[0]
                      setEditing({
                        ...editing,
                        region: 'international',
                        name: c.name,
                        country: c.name,
                        notes: `${c.flag} ${c.visaLabel}: ${c.visaNotes}`,
                      })
                    } else {
                      setEditing({ ...editing, region: 'bangladesh', name: '', country: null, notes: '' })
                    }
                  }}
                >
                  <option value="international">International (Select Country from 197)</option>
                  <option value="bangladesh">Bangladesh (Custom Spot / District)</option>
                </select>
              </div>

              {editing.region === 'international' ? (
                <div className="adm-field">
                  <label className="adm-label">Select Country (197 World Countries)</label>
                  <select
                    className="adm-input"
                    value={editing.country || editing.name}
                    onChange={(e) => {
                      const c = getCountryByName(e.target.value)
                      if (c) {
                        setEditing({
                          ...editing,
                          name: c.name,
                          country: c.name,
                          notes: `${c.flag} ${c.visaLabel}: ${c.visaNotes}`,
                        })
                      }
                    }}
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} — [{c.visaLabel}] ({c.continent})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="adm-field">
                  <label className="adm-label">Tourist Spot / District Name</label>
                  <input
                    className="adm-input"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="e.g. Sajek Valley, Cox's Bazar, Sylhet"
                  />
                </div>
              )}

              <div className="adm-field">
                <label className="adm-label">Display Order</label>
                <input
                  className="adm-input"
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })}
                />
              </div>

              <div className="adm-field adm-col-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="adm-label" style={{ margin: 0 }}>Notes & Visa Details for BD Passport</label>
                  <AIGenerateButton
                    label="AI Travel Itinerary"
                    promptContext={{
                      field: 'tour-itinerary',
                      contextData: { destination: editing.country || editing.name, region: editing.region },
                    }}
                    onGenerate={(text) => setEditing((prev) => prev ? { ...prev, notes: text } : null)}
                  />
                </div>
                <textarea
                  className="adm-textarea"
                  value={editing.notes ?? ''}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  placeholder="Visa requirement, best season, budget, trip notes…"
                />
              </div>
            </div>

            <label className="adm-toggle" style={{ marginBottom: 14, marginTop: 10 }}>
              <input
                type="checkbox"
                checked={editing.visited}
                onChange={(e) => setEditing({ ...editing, visited: e.target.checked })}
              />
              <span className="track" />
              <span>Completed (Visited) — Save directly to Completed page</span>
            </label>

            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={saveForm} disabled={saving}>
                {saving ? 'Saving…' : 'Save Destination'}
              </button>
              <button className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Panel Header & Controls */}
        <div
          className="adm-panel-head"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '16px 18px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Header Title & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 16, margin: 0 }}>
                {activeTab === 'completed'
                  ? `✅ Completed Page (${completedTours.length})`
                  : activeTab === 'international'
                  ? `✈️ International Destinations (${visibleCountries.length})`
                  : `🇧🇩 Bangladesh Spots (${visibleBDLocations.length})`}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {activeTab === 'completed'
                  ? 'All completed tours and visited places'
                  : 'Excludes completed tours. Click country to view visa process, costs & spots.'}
              </div>
            </div>

            <input
              className="adm-search"
              placeholder="Search destination or visa notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: 220 }}
            />
          </div>

          {/* International Visa Filters */}
          {activeTab === 'international' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', width: '100%' }}>
              <span className="adm-label" style={{ fontSize: 11, margin: 0 }}>Filter BD Visa Ease:</span>
              <select
                className="adm-input"
                style={{ padding: '5px 10px', fontSize: 12, width: 'auto' }}
                value={visaFilter}
                onChange={(e) => setVisaFilter(e.target.value as VisaFilter)}
              >
                <option value="all">All Visa Categories</option>
                <option value="visa_free">⚡ Visa Free / On Arrival</option>
                <option value="evisa_easy">📑 e-Visa / Easy Visa</option>
                <option value="embassy_visa">🏛️ Embassy / Standard Visa</option>
              </select>

              <span className="adm-label" style={{ fontSize: 11, margin: 0, marginLeft: 8 }}>Continent:</span>
              <select
                className="adm-input"
                style={{ padding: '5px 10px', fontSize: 12, width: 'auto' }}
                value={continentFilter}
                onChange={(e) => setContinentFilter(e.target.value as ContinentFilter)}
              >
                <option value="all">All Continents</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Africa">Africa</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
          )}
        </div>

        {/* Rows List */}
        <div className="adm-rows">
          {/* TAB 1: BANGLADESH SPOTS */}
          {activeTab === 'bangladesh' && (
            <>
              {visibleBDLocations.length === 0 ? (
                <div className="adm-empty">No unvisited Bangladesh spots found. Add a new spot above!</div>
              ) : (
                visibleBDLocations.map((l) => {
                  const costBDT = getEstimatedMinCostBDT(null, 'bangladesh', l.notes)
                  const isAffordable = totalSavingsBDT > 0 && totalSavingsBDT >= costBDT

                  return (
                    <div className="adm-list-row" key={l.id}>
                      <span className="adm-cat" style={{ fontSize: 13, padding: '3px 8px' }}>
                        🇧🇩 BD
                      </span>

                      <div className="grow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <b style={{ fontSize: 14 }}>{l.name}</b>
                          
                          {isAffordable ? (
                            <span
                              className="adm-pill live"
                              style={{
                                fontSize: 10.5,
                                padding: '2px 8px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                fontWeight: 600,
                              }}
                              title={`Affordable with current savings of ৳${totalSavingsBDT.toLocaleString()} BDT! Estimated: ~৳${costBDT.toLocaleString()} BDT`}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                              <span>🟢 Affordable with Savings</span>
                            </span>
                          ) : (
                            <span className="adm-pill draft" style={{ fontSize: 10, padding: '1px 6px' }}>
                              Planned
                            </span>
                          )}
                        </div>

                        {l.notes ? (
                          <div className="sub" style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>
                            {l.notes}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="adm-btn amber"
                          style={{ padding: '5px 11px', fontSize: 11 }}
                          onClick={() => markBDCompleted(l)}
                          title="Mark Visited (Moves directly to Completed Page)"
                        >
                          ✓ Mark Completed
                        </button>

                        <button className="adm-icon-btn" onClick={() => setEditing(l)} title="Edit Spot">
                          ✎
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}

          {/* TAB 2: INTERNATIONAL DESTINATIONS */}
          {activeTab === 'international' && (
            <>
              {visibleCountries.length === 0 ? (
                <div className="adm-empty">No unvisited international countries match your filters.</div>
              ) : (
                visibleCountries.map(({ country: c, dbItem, isPlanned }) => {
                  const visaMeta = VISA_CATEGORY_META[c.visaCategory]
                  const costBDT = getEstimatedMinCostBDT(c.estimatedCost.totalEstimate)
                  const isAffordable = totalSavingsBDT > 0 && totalSavingsBDT >= costBDT

                  return (
                    <div className="adm-list-row" key={c.code}>
                      <span className="adm-cat" style={{ fontSize: 16, padding: '4px 8px' }}>
                        {c.flag}
                      </span>

                      <div className="grow" style={{ cursor: 'pointer' }} onClick={() => { setSelectedCountry(c); setDetailsTab('spots'); }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <b style={{ fontSize: 14 }}>{c.name}</b>
                          <span className="adm-cat" style={{ fontSize: 10 }}>{c.code}</span>

                          <span className={`adm-pill ${visaMeta.badgeClass}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                            {visaMeta.icon} {visaMeta.label}
                          </span>

                          <span className="adm-cat" style={{ fontSize: 10 }}>{c.continent}</span>

                          {isPlanned ? (
                            <span className="adm-pill feat" style={{ fontSize: 10, padding: '1px 6px' }}>
                              📌 Planned
                            </span>
                          ) : null}

                          {isAffordable ? (
                            <span
                              className="adm-pill live"
                              style={{
                                fontSize: 10.5,
                                padding: '2px 8px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                fontWeight: 600,
                              }}
                              title={`Affordable with current savings of ৳${totalSavingsBDT.toLocaleString()} BDT! Estimated: ~৳${costBDT.toLocaleString()} BDT`}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                              <span>🟢 Affordable (~৳{costBDT.toLocaleString()})</span>
                            </span>
                          ) : (
                            <span
                              className="adm-pill draft"
                              style={{ fontSize: 10, padding: '1px 6px' }}
                              title={`Requires ~৳${costBDT.toLocaleString()} BDT`}
                            >
                              ~৳{costBDT.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="sub" style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>
                          Cap: {c.capital} · Best: {c.bestTime} · Visa: {c.visaNotes} · Est: {c.estimatedCost.totalEstimate}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="adm-btn"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => { setSelectedCountry(c); setDetailsTab('spots'); }}
                          title="View Tour Details, Visa Process & Tourist Spots"
                        >
                          ℹ️ Details
                        </button>

                        {!isPlanned && (
                          <button
                            className="adm-btn"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                            onClick={() => addCountryToPlanned(c)}
                            title="Add to Planned wishlist"
                          >
                            + Wishlist
                          </button>
                        )}

                        <button
                          className="adm-btn amber"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => markCountryCompleted(c, dbItem)}
                          title="Mark Visited (Moves directly to Completed Page)"
                        >
                          ✓ Completed
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}

          {/* TAB 3: COMPLETED PAGE */}
          {activeTab === 'completed' && (
            <>
              {completedTours.length === 0 ? (
                <div className="adm-empty">No completed tours yet. Mark a destination completed to see it here!</div>
              ) : (
                completedTours.map((l) => {
                  const countryInfo = l.region === 'international' ? getCountryByName(l.country || l.name) : null
                  const visaMeta = countryInfo ? VISA_CATEGORY_META[countryInfo.visaCategory] : null

                  return (
                    <div className="adm-list-row" key={l.id} style={{ background: 'color-mix(in oklch, var(--green) 4%, transparent)' }}>
                      <span className="adm-cat" style={{ fontSize: 15, padding: '3px 8px' }}>
                        {l.region === 'bangladesh' ? '🇧🇩 BD' : countryInfo ? countryInfo.flag : '✈️ INTL'}
                      </span>

                      <div className="grow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <b style={{ fontSize: 14 }}>
                            {l.region === 'international' && countryInfo ? `${countryInfo.flag} ${countryInfo.name}` : l.name}
                          </b>

                          <span className="adm-pill live" style={{ fontSize: 10, padding: '1px 6px' }}>
                            ✅ Completed
                          </span>

                          {visaMeta ? (
                            <span className={`adm-pill ${visaMeta.badgeClass}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                              {visaMeta.icon} {visaMeta.label}
                            </span>
                          ) : null}
                        </div>

                        {l.notes ? (
                          <div className="sub" style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>
                            {l.notes}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {countryInfo && (
                          <button
                            className="adm-btn"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                            onClick={() => { setSelectedCountry(countryInfo); setDetailsTab('spots'); }}
                            title="View Country Details"
                          >
                            ℹ️ Details
                          </button>
                        )}

                        <button
                          className="adm-btn"
                          style={{ padding: '5px 11px', fontSize: 11 }}
                          onClick={() => unmarkCompleted(l)}
                          title="Move back to Planned list"
                        >
                          📌 Move to Planned
                        </button>

                        <button className="adm-icon-btn" onClick={() => setEditing(l)} title="Edit Destination">
                          ✎
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* COUNTRY DETAILS MODAL OVERLAY */}
      {selectedCountry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedCountry(null)}
        >
          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              width: '100%',
              maxWidth: 720,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 32 }}>{selectedCountry.flag}</span>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{selectedCountry.name}</h2>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Capital: <b>{selectedCountry.capital}</b> · Continent: <b>{selectedCountry.continent}</b>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="adm-icon-btn"
                style={{ width: 32, height: 32, fontSize: 16 }}
                onClick={() => setSelectedCountry(null)}
              >
                ✕
              </button>
            </div>

            {/* Quick Metadata Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 10,
                background: 'var(--surface-2)',
                padding: 12,
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Bangladeshi Visa</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedCountry.visaLabel}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Currency</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedCountry.currency}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Best Season</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{selectedCountry.bestTime}</div>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="adm-editor-tabs" style={{ margin: 0 }}>
              <button
                className={`adm-editor-tab ${detailsTab === 'spots' ? 'active' : ''}`}
                onClick={() => setDetailsTab('spots')}
              >
                🏖️ Top Tourist Spots ({selectedCountry.touristSpots.length})
              </button>
              <button
                className={`adm-editor-tab ${detailsTab === 'visa' ? 'active' : ''}`}
                onClick={() => setDetailsTab('visa')}
              >
                📑 Visa Process (BD Passport)
              </button>
              <button
                className={`adm-editor-tab ${detailsTab === 'cost' ? 'active' : ''}`}
                onClick={() => setDetailsTab('cost')}
              >
                💰 Travel Costs & Flights
              </button>
            </div>

            {/* Modal Content Sections */}
            <div>
              {/* TAB 1: TOURIST SPOTS */}
              {detailsTab === 'spots' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Must-visit places and major attractions in <b>{selectedCountry.name}</b>:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {selectedCountry.touristSpots.map((spot, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontSize: 13,
                        }}
                      >
                        <span style={{ fontSize: 16 }}>📍</span>
                        <span style={{ fontWeight: 600 }}>{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: VISA PROCESS */}
              {detailsTab === 'visa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className={`adm-banner`} style={{ margin: 0, padding: 12 }}>
                    <div>
                      <b>Visa Category:</b> {VISA_CATEGORY_META[selectedCountry.visaCategory].icon}{' '}
                      {selectedCountry.visaLabel} — {selectedCountry.visaNotes}
                    </div>
                  </div>

                  <h4 style={{ margin: 0, fontSize: 14 }}>Step-by-Step Application Process for Bangladeshi Citizens:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedCountry.visaProcessSteps.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          fontSize: 13,
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, fontSize: 12.5, color: 'var(--ink-muted)' }}>
                    💡 <b>Standard Checklist for BD Travelers:</b> Passport (min 6m validity), 6-month Bank Statement with solvency certificate, Job NOC or Trade License, confirmed return flight & hotel voucher, color passport photos.
                  </div>
                </div>
              )}

              {/* TAB 3: ESTIMATED COSTS & FLIGHTS */}
              {detailsTab === 'cost' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Real-time Savings vs Trip Budget Comparison */}
                  {(() => {
                    const costBDT = getEstimatedMinCostBDT(selectedCountry.estimatedCost.totalEstimate)
                    const isFunded = totalSavingsBDT > 0 && totalSavingsBDT >= costBDT
                    const diff = totalSavingsBDT - costBDT

                    return (
                      <div
                        style={{
                          gridColumn: '1 / -1',
                          background: isFunded ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.06)',
                          border: `1px solid ${isFunded ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.25)'}`,
                          borderRadius: 10,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 18 }}>{isFunded ? '🟢' : '🟡'}</span>
                            <b style={{ fontSize: 14, color: isFunded ? '#10b981' : '#f59e0b' }}>
                              {isFunded ? 'Fully Affordable with Your Current Savings!' : 'Additional Savings Needed for This Trip'}
                            </b>
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 4 }}>
                            {isFunded
                              ? `Your available savings of ৳${totalSavingsBDT.toLocaleString()} BDT cover the estimated minimum budget of ৳${costBDT.toLocaleString()} BDT with a surplus of +৳${diff.toLocaleString()} BDT!`
                              : `Trip minimum estimate is ~৳${costBDT.toLocaleString()} BDT. Current savings: ৳${totalSavingsBDT.toLocaleString()} BDT (Shortfall: -৳${Math.abs(diff).toLocaleString()} BDT).`}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                            Savings Match Status
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isFunded ? '#10b981' : '#ef4444', marginTop: 2 }}>
                            {isFunded ? '✓ 100% Ready to Travel' : `${Math.round(totalSavingsBDT > 0 ? (totalSavingsBDT / costBDT) * 100 : 0)}% Funded`}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                      ✈️ Airfare from Dhaka (DAC)
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                      {selectedCountry.estimatedCost.flight}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                      💳 Visa Fee Estimate
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                      {selectedCountry.estimatedCost.visaFee}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                      🏨 Daily Expense (Hotel & Food)
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                      {selectedCountry.estimatedCost.dailyBudget}
                    </div>
                  </div>

                  <div style={{ background: 'var(--amber-bg)', border: '1px solid color-mix(in oklch, var(--accent) 30%, var(--line))', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>
                      🏷️ Total Trip Estimate (5-7 Days)
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: 'var(--accent)' }}>
                      {selectedCountry.estimatedCost.totalEstimate}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <button
                className="adm-btn"
                onClick={() => {
                  addCountryToPlanned(selectedCountry)
                  setSelectedCountry(null)
                }}
              >
                + Add to Wishlist
              </button>

              <button
                className="adm-btn amber"
                onClick={() => {
                  const dbMatch = dbIntlMap.get(selectedCountry.name.toLowerCase())
                  markCountryCompleted(selectedCountry, dbMatch || null)
                  setSelectedCountry(null)
                }}
              >
                ✓ Mark Completed
              </button>

              <button className="adm-btn" onClick={() => setSelectedCountry(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
