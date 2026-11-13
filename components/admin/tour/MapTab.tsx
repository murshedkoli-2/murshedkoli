'use client'

import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { BD_DIVISIONS, BD_DISTRICTS } from '@/lib/data/bd-districts'
import { BANGLADESH_SPOTS } from '@/lib/data/bangladesh-destinations'
import { mergeVisitedDistricts } from '@/lib/tour/catalog'
import { DistrictMap, type DistrictInfo } from './DistrictMap'
import { DistrictChecklist } from './DistrictChecklist'
import { MAP_PALETTES, type PaletteKey } from './map-palettes'
import { downloadMapPng } from './export-map'
import type { TourData } from './useTourData'

const DISTRICT_INFO: Map<string, DistrictInfo> = new Map(BD_DISTRICTS.map((d) => {
  const spots = BANGLADESH_SPOTS.filter((s) => s.districtId === d.id)
  return [d.id, { spotCount: spots.length, cheapest: spots.length ? Math.min(...spots.map((s) => s.budget)) : null }]
}))
const infoFor = (id: string): DistrictInfo => DISTRICT_INFO.get(id) ?? { spotCount: 0, cheapest: null }

export function MapTab({ data }: { data: TourData }) {
  const { districtIds, locations, saveDistricts } = data
  const [paletteKey, setPaletteKey] = useState<PaletteKey>('forest')
  const [showLabels, setShowLabels] = useState(true)
  const [title, setTitle] = useState('My Bangladesh')
  const [owner, setOwner] = useState('')
  const [exporting, setExporting] = useState(false)

  const spotDistricts = useMemo(
    () => locations.filter((l) => l.region === 'bangladesh' && l.visited && l.district).map((l) => l.district as string),
    [locations],
  )
  const visited = useMemo(() => mergeVisitedDistricts(districtIds, spotDistricts), [districtIds, spotDistricts])
  const fromSpotsOnly = useMemo(() => [...visited].filter((id) => !districtIds.includes(id)), [visited, districtIds])

  const toggle = useCallback((id: string) => {
    if (fromSpotsOnly.includes(id)) {
      toast.info('This district is marked because you visited a spot there. Unmark the spot in the Bangladesh tab to remove it.')
      return
    }
    saveDistricts(districtIds.includes(id) ? districtIds.filter((d) => d !== id) : [...districtIds, id])
  }, [districtIds, fromSpotsOnly, saveDistricts])

  const setMany = useCallback((ids: string[], on: boolean) => {
    const next = on ? [...new Set([...districtIds, ...ids])] : districtIds.filter((d) => !ids.includes(d))
    saveDistricts(next)
  }, [districtIds, saveDistricts])

  const exportPng = async () => {
    setExporting(true)
    try {
      await downloadMapPng({ palette: MAP_PALETTES[paletteKey], visited, title, owner, showLabels })
    } catch {
      toast.error('Could not create the image. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="trv-map-layout">
      <DistrictChecklist visited={visited} onToggle={toggle} onSetMany={setMany} />

      <section className="trv-card" aria-label="Travel map">
        <div className="trv-map-controls">
          <div className="trv-swatches" role="group" aria-label="Map colours">
            {(Object.keys(MAP_PALETTES) as PaletteKey[]).map((k) => (
              <button
                key={k}
                type="button"
                className="trv-swatch"
                aria-pressed={paletteKey === k}
                aria-label={`${MAP_PALETTES[k].label} colours`}
                title={MAP_PALETTES[k].label}
                style={{ background: `linear-gradient(135deg, ${MAP_PALETTES[k].bg} 50%, ${MAP_PALETTES[k].fill} 50%)` }}
                onClick={() => setPaletteKey(k)}
              />
            ))}
          </div>
          <div className="trv-toolbar">
            <input className="adm-input" value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} aria-label="Map title" />
            <input className="adm-input" value={owner} maxLength={40} onChange={(e) => setOwner(e.target.value)} placeholder="Your name (optional)" aria-label="Your name" />
            <label className="adm-toggle" style={{ margin: 0 }}>
              <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
              <span className="track" />
              <span>Names</span>
            </label>
            <button type="button" className="adm-btn amber" onClick={exportPng} disabled={exporting}>
              {exporting ? 'Rendering…' : 'Download PNG'}
            </button>
          </div>
        </div>

        <DistrictMap
          visited={visited}
          palette={MAP_PALETTES[paletteKey]}
          showLabels={showLabels}
          title={title}
          owner={owner}
          info={infoFor}
          onToggle={toggle}
        />

        <div className="trv-progress" aria-label="Progress by division">
          {BD_DIVISIONS.map((division) => {
            const all = BD_DISTRICTS.filter((d) => d.division === division)
            const done = all.filter((d) => visited.has(d.id)).length
            return (
              <div key={division} className="trv-progress-row">
                <span>{division}</span>
                <span className="trv-progress-bar"><i style={{ transform: `scaleX(${done / all.length})` }} /></span>
                <span>{done}/{all.length}</span>
              </div>
            )
          })}
        </div>
        {fromSpotsOnly.length > 0 && (
          <p className="trv-note" style={{ marginTop: 12 }}>
            {fromSpotsOnly.length} district{fromSpotsOnly.length === 1 ? ' is' : 's are'} filled in automatically from spots you marked visited.
          </p>
        )}
      </section>
    </div>
  )
}
