'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { StageSummary } from '@/lib/admin/career'

const NODE_R = 26
const NODE_C = 2 * Math.PI * NODE_R
const EASE = [0.16, 1, 0.3, 1] as const

interface StageTrackProps {
  stages: StageSummary[]
  active: number
  onSelect: (stageNumber: number) => void
  overallPercent: number
}

/** The six stages as a connected path; each node is a progress ring and a filter. */
export function StageTrack({ stages, active, onSelect, overallPercent }: StageTrackProps) {
  const reduce = useReducedMotion()
  if (stages.length === 0) return null

  return (
    <section className="cr-track" aria-label="Stages">
      <div className="cr-track-head">
        <h2>The path</h2>
        <button type="button" className="cr-link" onClick={() => onSelect(0)} disabled={active === 0}>
          {active === 0 ? 'Showing every stage' : 'Show every stage'}
        </button>
      </div>

      <ol className="cr-track-list" style={{ '--count': stages.length } as React.CSSProperties}>
        <span className="cr-track-line" aria-hidden="true">
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: overallPercent / 100 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </span>
        {stages.map((s, i) => {
          const done = s.total > 0 && s.completed === s.total
          return (
            <li key={s.stageNumber}>
              <button
                type="button"
                className="cr-node"
                data-active={active === s.stageNumber}
                data-done={done}
                aria-pressed={active === s.stageNumber}
                onClick={() => onSelect(active === s.stageNumber ? 0 : s.stageNumber)}
              >
                <span className="cr-node-ring">
                  <svg viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r={NODE_R} className="cr-node-track" />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r={NODE_R}
                      className="cr-node-value"
                      strokeDasharray={NODE_C}
                      initial={{ strokeDashoffset: NODE_C }}
                      animate={{ strokeDashoffset: NODE_C * (1 - s.percent / 100) }}
                      transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.15 + i * 0.08, ease: EASE }}
                    />
                  </svg>
                  <span className="cr-node-center">{done ? <Check size={18} strokeWidth={2.5} /> : s.stageNumber}</span>
                </span>
                <span className="cr-node-label">{s.name}</span>
                <span className="cr-node-meta">
                  {s.completed}/{s.total}
                  {s.inProgress ? ` · ${s.inProgress} active` : ''}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
