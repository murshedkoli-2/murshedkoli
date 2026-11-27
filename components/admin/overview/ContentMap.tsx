'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import type { PipelineSegment } from '@/lib/admin/overview'

export interface ContentTile {
  label: string
  value: number
  detail: string
  href: string
  icon: LucideIcon
  warn?: boolean
}

interface ContentMapProps {
  tiles: ContentTile[]
  pipeline: PipelineSegment[]
  loaded: boolean
}

/** Every content type as a tile, plus the live/draft pipeline of projects. */
export function ContentMap({ tiles, pipeline, loaded }: ContentMapProps) {
  const reduce = useReducedMotion()

  return (
    <section className="ov-tile ov-map" aria-labelledby="ov-map-title">
      <header className="ov-tile-head">
        <h2 id="ov-map-title">Content map</h2>
        <span className="ov-kicker">{tiles.length} types</span>
      </header>

      {pipeline.length > 0 && (
        <div className="ov-pipeline">
          <div className="ov-pipeline-bar" role="img" aria-label={pipeline.map((s) => `${s.count} ${s.label.toLowerCase()}`).join(', ')}>
            {pipeline.map((s, i) => (
              <motion.span
                key={s.key}
                data-key={s.key}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ flexGrow: s.share }}
              />
            ))}
          </div>
          <ul className="ov-pipeline-legend">
            {pipeline.map((s) => (
              <li key={s.key} data-key={s.key}>
                <i aria-hidden="true" />
                {s.label} projects <b>{s.count}</b> <span>{s.share}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ov-map-grid">
        {tiles.map((tile, i) => {
          const Icon = tile.icon
          return (
            <motion.div
              key={tile.label}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={tile.href} className="ov-map-tile" data-warn={tile.warn}>
                <span className="ov-map-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="ov-map-label">{tile.label}</span>
                <span className="ov-map-value">{loaded ? tile.value : '–'}</span>
                <span className="ov-map-detail">{loaded ? tile.detail : ' '}</span>
                <ArrowUpRight size={16} className="ov-map-arrow" aria-hidden="true" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
