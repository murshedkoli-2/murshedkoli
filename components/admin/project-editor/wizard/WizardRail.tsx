'use client'

import { Check } from 'lucide-react'
import { STEPS, isStepComplete, type WizardData } from './steps'

interface WizardRailProps {
  current: number
  data: WizardData
  /** Only steps already reached are clickable — the rail navigates, it doesn't skip ahead. */
  furthest: number
  onJump: (index: number) => void
}

/**
 * Numbered step rail. Vertical beside the form on desktop; the parent hides it
 * under 900px in favour of the compact progress line.
 */
export function WizardRail({ current, data, furthest, onJump }: WizardRailProps) {
  return (
    <nav aria-label="Steps" className="wiz-rail">
      {STEPS.map((step, i) => {
        const isCurrent = i === current
        // Completeness reflects content, not position — walking past an empty
        // optional step must not make it look filled in.
        const isDone = !isCurrent && isStepComplete(step.id, data)
        const reachable = i <= furthest

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => reachable && onJump(i)}
            disabled={!reachable}
            className={`wiz-step ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="wiz-step-mark" aria-hidden>
              {isDone && !isCurrent ? <Check size={11} strokeWidth={3} /> : i + 1}
            </span>
            <span className="wiz-step-text">
              <span className="wiz-step-label">{step.label}</span>
              {isCurrent && <span className="wiz-step-hint">{step.hint}</span>}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
