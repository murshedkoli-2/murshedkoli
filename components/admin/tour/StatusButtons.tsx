'use client'

import { useState } from 'react'
import type { TripStatus } from './useTourData'

interface StatusButtonsProps {
  status: TripStatus
  label: string
  onChange: (next: TripStatus) => Promise<unknown> | unknown
}

/** Two toggles — "Plan" and "Been there" — pressing the active one clears it. */
export function StatusButtons({ status, label, onChange }: StatusButtonsProps) {
  const [busy, setBusy] = useState(false)

  const set = async (target: Exclude<TripStatus, 'none'>) => {
    setBusy(true)
    try {
      await onChange(status === target ? 'none' : target)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="trv-row-actions">
      <button
        type="button"
        className="trv-toggle-btn"
        data-kind="plan"
        aria-pressed={status === 'planned'}
        aria-label={`${status === 'planned' ? 'Remove' : 'Add'} ${label} ${status === 'planned' ? 'from' : 'to'} plans`}
        disabled={busy}
        onClick={() => set('planned')}
      >
        {status === 'planned' ? '★ Planned' : '☆ Plan'}
      </button>
      <button
        type="button"
        className="trv-toggle-btn"
        data-kind="visited"
        aria-pressed={status === 'visited'}
        aria-label={`Mark ${label} as ${status === 'visited' ? 'not visited' : 'visited'}`}
        disabled={busy}
        onClick={() => set('visited')}
      >
        {status === 'visited' ? '✓ Been there' : 'Been there'}
      </button>
    </div>
  )
}
