'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { CategorySummary } from '@/lib/admin/career'

interface SkillMasteryProps {
  categories: CategorySummary[]
  active: string
  onSelect: (key: string) => void
}

/** One bar per skill area; clicking a bar filters the milestones to it. */
export function SkillMastery({ categories, active, onSelect }: SkillMasteryProps) {
  const reduce = useReducedMotion()
  if (categories.length === 0) return null

  return (
    <section className="cr-mastery" aria-label="Skill mastery">
      <div className="cr-track-head">
        <h2>Skill mastery</h2>
        {active !== 'all' && (
          <button type="button" className="cr-link" onClick={() => onSelect('all')}>
            Clear skill filter
          </button>
        )}
      </div>
      <ul className="cr-mastery-list">
        {categories.map((c, i) => (
          <li key={c.key}>
            <button
              type="button"
              className="cr-skill"
              data-active={active === c.key}
              aria-pressed={active === c.key}
              onClick={() => onSelect(active === c.key ? 'all' : c.key)}
              style={{ '--tone': c.color } as React.CSSProperties}
            >
              <span className="cr-skill-top">
                <span className="cr-skill-name">{c.label}</span>
                <span className="cr-skill-pct">{c.percent}%</span>
              </span>
              <span className="cr-skill-bar" aria-hidden="true">
                <motion.span
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: c.percent / 100 }}
                  transition={{ duration: 1, delay: reduce ? 0 : 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
              <span className="cr-skill-meta">
                {c.completed} of {c.total} milestones
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
