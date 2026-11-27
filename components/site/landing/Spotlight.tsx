'use client'

import type { PointerEvent, ReactNode } from 'react'

/**
 * Sets --mx / --my on whichever [data-spot] tile the pointer is over, so CSS
 * can paint a soft light that follows the cursor across a bento grid.
 */
export function Spotlight({ className, children }: { className?: string; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('[data-spot]')
    if (!tile) return
    const r = tile.getBoundingClientRect()
    tile.style.setProperty('--mx', `${e.clientX - r.left}px`)
    tile.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div className={className} onPointerMove={onMove}>
      {children}
    </div>
  )
}
