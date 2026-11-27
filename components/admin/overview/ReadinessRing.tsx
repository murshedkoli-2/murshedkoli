'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { CompletenessCheck } from '@/lib/admin/portfolio-summary'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ReadinessRingProps {
  percent: number
  issues: CompletenessCheck[]
  loaded: boolean
}

/** Animated completeness ring with the open issues, each linking to its fix. */
export function ReadinessRing({ percent, issues, loaded }: ReadinessRingProps) {
  const reduce = useReducedMotion()
  const shown = loaded ? percent : 0

  return (
    <section className="ov-tile ov-ready" aria-labelledby="ov-ready-title">
      <header className="ov-tile-head">
        <h2 id="ov-ready-title">Site readiness</h2>
        <span className="ov-kicker">{issues.length ? `${issues.length} open` : 'all clear'}</span>
      </header>

      <div className="ov-ring-wrap">
        <svg viewBox="0 0 120 120" className="ov-ring" role="img" aria-label={`${shown}% ready`}>
          <circle cx="60" cy="60" r={RADIUS} className="ov-ring-track" />
          <motion.circle
            cx="60"
            cy="60"
            r={RADIUS}
            className="ov-ring-value"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - shown / 100) }}
            transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <p className="ov-ring-label">
          <b>{shown}</b>
          <small>%</small>
        </p>
      </div>

      {loaded && issues.length === 0 ? (
        <p className="ov-ready-ok">
          <CheckCircle2 size={16} aria-hidden="true" /> Covers, skills, credentials and résumé all check out.
        </p>
      ) : (
        <ul className="ov-issues">
          {issues.map((issue) => (
            <li key={issue.label}>
              <Link href={issue.href} className="ov-issue">
                <span className="ov-issue-dot" aria-hidden="true" />
                <span>{issue.label}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
