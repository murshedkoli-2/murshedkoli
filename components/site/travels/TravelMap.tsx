'use client'

import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { BD_DISTRICTS, type BdDistrict, type BdDivision } from '@/lib/data/bd-districts'
import { BD_DISTRICT_SHAPES, BD_MAP_VIEWBOX } from '@/lib/data/bd-district-paths'

interface TravelMapProps {
  visited: readonly string[]
  /** Dim every district outside this division. */
  highlight?: BdDivision | null
  /** Pin labels for visited districts (full page only). */
  labels?: boolean
  className?: string
}

interface Hover {
  district: BdDistrict
  x: number
  y: number
}

/** Read-only district map: visited districts fill in with a staggered reveal. */
export function TravelMap({ visited, highlight = null, labels = false, className }: TravelMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)
  const visitedSet = useMemo(() => new Set(visited), [visited])
  // Reveal order: north to south, so the map "fills in" like a journey.
  const order = useMemo(() => {
    const ids = [...visited].sort((a, b) => (BD_DISTRICT_SHAPES[a]?.cy ?? 0) - (BD_DISTRICT_SHAPES[b]?.cy ?? 0))
    return new Map(ids.map((id, i) => [id, i]))
  }, [visited])

  const onMove = (district: BdDistrict) => (e: PointerEvent<SVGPathElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (rect) setHover({ district, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div ref={wrapRef} className={`tv-map ${className ?? ''}`} onPointerLeave={() => setHover(null)}>
      <svg viewBox={BD_MAP_VIEWBOX} role="img" aria-label={`Map of Bangladesh: ${visited.length} of 64 districts visited`}>
        <defs>
          <linearGradient id="tv-visited" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 70%, #7a2e00)" />
          </linearGradient>
        </defs>
        {BD_DISTRICTS.map((d) => {
          const shape = BD_DISTRICT_SHAPES[d.id]
          if (!shape) return null
          const isVisited = visitedSet.has(d.id)
          return (
            <path
              key={d.id}
              d={shape.d}
              className="tv-district"
              data-visited={isVisited}
              data-dim={highlight !== null && d.division !== highlight}
              data-hover={hover?.district.id === d.id}
              style={{ '--i': order.get(d.id) ?? 0 } as CSSProperties}
              onPointerMove={onMove(d)}
            >
              <title>{`${d.name} (${d.bn}) · ${d.division}${isVisited ? ' · visited' : ''}`}</title>
            </path>
          )
        })}
        {labels &&
          BD_DISTRICTS.filter((d) => visitedSet.has(d.id)).map((d) => {
            const shape = BD_DISTRICT_SHAPES[d.id]
            return shape ? (
              <text key={d.id} x={shape.cx} y={shape.cy} className="tv-label" data-dim={highlight !== null && d.division !== highlight}>
                {d.name}
              </text>
            ) : null
          })}
      </svg>

      {hover && (
        <div className="tv-tip" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
          <b>{hover.district.name}</b>
          <span className="tv-tip-bn">{hover.district.bn}</span>
          <span className="tv-tip-meta" data-visited={visitedSet.has(hover.district.id)}>
            {hover.district.division} · {visitedSet.has(hover.district.id) ? 'Visited' : 'Not yet'}
          </span>
        </div>
      )}
    </div>
  )
}
