'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const format = (n: number, pad: number) => String(Math.round(n)).padStart(pad, '0')

/** Number that counts up from zero the first time it scrolls into view. */
export function CountUp({ value, pad = 2 }: { value: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    // Until it is seen, keep the real value so the number is never stuck at zero.
    if (!el || reduce || !inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(v, pad)
      },
    })
    return () => controls.stop()
  }, [inView, value, pad, reduce])

  return <span ref={ref}>{format(value, pad)}</span>
}
