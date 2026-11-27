'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { proximity } from '@/lib/landing'

const REACH = 240

/**
 * Oversized wordmark whose letters lift and warm toward the accent colour as
 * the pointer approaches. Decorative: the name is announced elsewhere.
 */
export function KineticName({ name }: { name: string }) {
  const wrapRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(wrap.querySelectorAll<HTMLElement>('[data-k]'))
    let raf = 0
    let px = -1e4
    let py = -1e4

    const update = () => {
      raf = 0
      for (const letter of letters) {
        const r = letter.getBoundingClientRect()
        const p = proximity(Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2)), REACH)
        letter.style.setProperty('--p', p.toFixed(3))
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <p
      ref={wrapRef}
      className="ld-kinetic"
      aria-hidden="true"
      style={{ '--chars': Math.max(name.length, 6) } as CSSProperties}
    >
      {Array.from(name).map((ch, i) => (
        <span key={`${ch}-${i}`} data-k style={{ '--i': i } as CSSProperties}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </p>
  )
}
