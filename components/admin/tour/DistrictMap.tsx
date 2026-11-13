'use client'

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { BD_DISTRICTS, type BdDistrict } from '@/lib/data/bd-districts'
import { BD_DISTRICT_SHAPES, BD_MAP_VIEWBOX } from '@/lib/data/bd-district-paths'
import { paletteVars, type MapPalette } from './map-palettes'

export interface DistrictInfo {
  spotCount: number
  cheapest: number | null
}

interface DistrictMapProps {
  visited: ReadonlySet<string>
  palette: MapPalette
  showLabels: boolean
  title: string
  owner: string
  /** Districts outside the current filter render dimmed. */
  focus?: ReadonlySet<string> | null
  info: (districtId: string) => DistrictInfo
  onToggle: (districtId: string) => void
}

interface Hover { district: BdDistrict; x: number; y: number }

export function DistrictMap({ visited, palette, showLabels, title, owner, focus, info, onToggle }: DistrictMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)

  const place = (district: BdDistrict, clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({ district, x: clientX - rect.left, y: clientY - rect.top })
  }

  const onPointer = (district: BdDistrict) => (e: PointerEvent<SVGPathElement>) => place(district, e.clientX, e.clientY)

  const onFocus = (district: BdDistrict) => (e: { currentTarget: SVGPathElement }) => {
    const box = e.currentTarget.getBoundingClientRect()
    place(district, box.left + box.width / 2, box.top + box.height / 2)
  }

  const onKey = (id: string) => (e: KeyboardEvent<SVGPathElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(id)
    }
  }

  const hoverInfo = hover ? info(hover.district.id) : null
  const percent = Math.round((visited.size / BD_DISTRICTS.length) * 100)

  return (
    <div className="trv-poster" style={paletteVars(palette) as CSSProperties}>
      <div className="trv-poster-head">
        <div>
          <div className="trv-poster-kicker">{owner ? `${owner} · ` : ''}Travel map</div>
          <h2 className="trv-poster-title">{title || 'My Bangladesh'}</h2>
        </div>
        <div className="trv-poster-score" aria-live="polite">
          <b>{visited.size}</b><span>/64</span>
        </div>
      </div>

      <div className="trv-map-wrap" ref={wrapRef} onPointerLeave={() => setHover(null)}>
        <svg className="trv-map" viewBox={BD_MAP_VIEWBOX} role="group" aria-label="Map of Bangladesh districts. Select a district to mark it visited.">
          {BD_DISTRICTS.map((d) => {
            const isVisited = visited.has(d.id)
            return (
              <path
                key={d.id}
                className="trv-district"
                d={BD_DISTRICT_SHAPES[d.id].d}
                data-visited={isVisited}
                data-dim={focus ? !focus.has(d.id) : undefined}
                role="button"
                tabIndex={0}
                aria-pressed={isVisited}
                aria-label={`${d.name}, ${d.division} division`}
                onClick={() => onToggle(d.id)}
                onKeyDown={onKey(d.id)}
                onPointerMove={onPointer(d)}
                onFocus={onFocus(d)}
                onBlur={() => setHover(null)}
              />
            )
          })}
          {showLabels && BD_DISTRICTS.map((d) => {
            const { cx, cy } = BD_DISTRICT_SHAPES[d.id]
            return (
              <text key={d.id} className="trv-district-label" x={cx} y={cy} data-visited={visited.has(d.id)}>
                {d.name}
              </text>
            )
          })}
        </svg>

        {hover && hoverInfo && (
          <div className="trv-tooltip" style={{ left: hover.x, top: hover.y }} role="status">
            <b>{hover.district.name} · {hover.district.bn}</b>
            <span>{hover.district.division} division</span>
            <div>
              {hoverInfo.spotCount} spot{hoverInfo.spotCount === 1 ? '' : 's'}
              {hoverInfo.cheapest !== null && <> · from ৳{hoverInfo.cheapest.toLocaleString()}</>}
            </div>
            <div>{visited.has(hover.district.id) ? '✓ Visited — click to undo' : 'Click to mark visited'}</div>
          </div>
        )}
      </div>

      <div className="trv-poster-foot">
        <span>{visited.size} of 64 districts · {percent}%</span>
        <span>Boundaries: geoBoundaries (BBS/OCHA), CC BY 3.0 IGO</span>
      </div>
    </div>
  )
}
