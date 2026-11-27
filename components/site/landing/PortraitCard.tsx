'use client'

import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'

const TILT = 9
const SPRING = { stiffness: 180, damping: 20 }

interface PortraitCardProps {
  src: string
  name: string
  title: string
  available: boolean
}

/** Portrait that tilts toward the pointer, with a slowly spinning status seal. */
export function PortraitCard({ src, name, title, available }: PortraitCardProps) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(px, [0, 1], [-TILT, TILT]), SPRING)
  const rotateX = useSpring(useTransform(py, [0, 1], [TILT, -TILT]), SPRING)
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const seal = available ? 'OPEN TO WORK · OPEN TO WORK · ' : 'BOOKED · BUILDING · BOOKED · BUILDING · '

  return (
    <div className="ld-portrait-stage" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.figure className="ld-portrait" style={{ rotateX, rotateY }}>
        <Image src={src} alt={name} fill priority sizes="(max-width: 900px) 70vw, 360px" className="ld-portrait-img" />
        <motion.span
          className="ld-portrait-glare"
          style={{ '--gx': glareX, '--gy': glareY } as unknown as React.CSSProperties}
          aria-hidden="true"
        />
        <figcaption className="ld-portrait-cap">
          <span>{name}</span>
          <span>{title}</span>
        </figcaption>
      </motion.figure>

      <svg className="ld-seal" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="ld-seal-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" className="ld-seal-disc" />
        <text className="ld-seal-text">
          <textPath href="#ld-seal-path">{seal}</textPath>
        </text>
        <circle cx="60" cy="60" r="7" className="ld-seal-dot" data-on={available} />
      </svg>
    </div>
  )
}
