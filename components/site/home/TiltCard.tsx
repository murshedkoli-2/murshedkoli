'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

const MAX_TILT_DEG = 7

interface TiltCardProps {
  children: ReactNode
  className?: string
}

/**
 * Tilts its content toward the pointer in 3D and moves a soft highlight with it.
 * Mouse only: touch and reduced-motion users get the flat card.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--tilt-x', `${((0.5 - y) * 2 * MAX_TILT_DEG).toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${((x - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`)
    el.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`)
    el.dataset.tilting = 'true'
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    delete el.dataset.tilting
  }

  return (
    <div className="hm-tilt">
      <div ref={ref} className={`hm-tilt-inner${className ? ` ${className}` : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        {children}
        <span className="hm-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  )
}
