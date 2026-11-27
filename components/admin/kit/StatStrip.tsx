'use client'

import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface Stat {
  label: string
  value: number
  icon: LucideIcon
  note?: string
  tone?: 'accent' | 'good' | 'warn'
}

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const from = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = String(value)
      return
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v))
      },
    })
    from.current = value
    return () => controls.stop()
  }, [value, reduce])

  return <span ref={ref}>{value}</span>
}

/** Row of headline numbers that count to their new value whenever data changes. */
export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl className="kit-stats">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="kit-stat" data-tone={s.tone}>
            <span className="kit-stat-icon" aria-hidden="true">
              <Icon size={17} strokeWidth={1.75} />
            </span>
            <dt>{s.label}</dt>
            <dd className="kit-stat-value">
              <Count value={s.value} />
            </dd>
            {s.note && <dd className="kit-stat-note">{s.note}</dd>}
          </div>
        )
      })}
    </dl>
  )
}
