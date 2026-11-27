'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { BdDivision } from '@/lib/data/bd-districts'
import type { DivisionProgress } from '@/lib/travels'
import { TravelMap } from './TravelMap'

interface TravelsExplorerProps {
  visited: string[]
  divisions: DivisionProgress[]
}

/** Large map beside the division list; hovering or tapping a division lights it up on the map. */
export function TravelsExplorer({ visited, divisions }: TravelsExplorerProps) {
  const reduce = useReducedMotion()
  const [focus, setFocus] = useState<BdDivision | null>(null)

  return (
    <div className="tv-explorer">
      <TravelMap visited={visited} highlight={focus} labels className="tv-map-lg" />

      <div className="tv-divisions">
        <p className="tv-kicker">By division</p>
        <ul>
          {divisions.map((d, i) => {
            const pct = Math.round((d.visited / d.total) * 100)
            return (
              <li key={d.division}>
                <button
                  type="button"
                  className="tv-division"
                  aria-pressed={focus === d.division}
                  onPointerEnter={() => setFocus(d.division)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(d.division)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setFocus((f) => (f === d.division ? null : d.division))}
                >
                  <span className="tv-division-top">
                    <span>
                      {d.division} <span className="tv-bn">{d.bn}</span>
                    </span>
                    <span className="tv-division-count">
                      {d.visited}/{d.total}
                    </span>
                  </span>
                  <span className="tv-bar" aria-hidden="true">
                    <motion.span
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: pct / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
