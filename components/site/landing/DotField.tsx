'use client'

import { useEffect, useRef } from 'react'
import { proximity } from '@/lib/landing'

const SPACING = 26
const BASE_RADIUS = 1
const MAX_GROW = 2.4
const REACH = 170
const PUSH = 12
const POINTER_EASE = 0.14
const MAX_DPR = 2

interface Palette {
  dot: string
  accent: string
}

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement)
  return {
    dot: styles.getPropertyValue('--ink-muted').trim() || '#888',
    accent: styles.getPropertyValue('--accent').trim() || '#c26a0b',
  }
}

/**
 * Canvas dot grid that breathes with a slow wave and swells, brightens and
 * parts around the pointer. Pauses off-screen; draws one still frame when the
 * visitor prefers reduced motion.
 */
export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let palette = readPalette()
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 }

    const draw = (time: number) => {
      pointer.x += (pointer.tx - pointer.x) * POINTER_EASE
      pointer.y += (pointer.ty - pointer.y) * POINTER_EASE
      pointer.strength += (pointer.target - pointer.strength) * 0.08
      ctx.clearRect(0, 0, width, height)

      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const dist = Math.hypot(dx, dy)
          const near = proximity(dist, REACH) * pointer.strength
          const wave = reduce ? 0.3 : (Math.sin(x * 0.011 + y * 0.007 - time * 0.0011) + 1) / 2
          const push = dist > 0 ? (near * PUSH) / dist : 0

          ctx.globalAlpha = Math.min(1, 0.14 + wave * 0.16 + near * 0.75)
          ctx.fillStyle = near > 0.04 ? palette.accent : palette.dot
          ctx.beginPath()
          ctx.arc(x + dx * push, y + dy * push, BASE_RADIUS + wave * 0.45 + near * MAX_GROW, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (time: number) => {
      draw(time)
      raf = visible ? requestAnimationFrame(loop) : 0
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce) draw(0)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom
      pointer.tx = e.clientX - rect.left
      pointer.ty = e.clientY - rect.top
      if (pointer.target === 0 && inside) {
        pointer.x = pointer.tx
        pointer.y = pointer.ty
      }
      pointer.target = inside ? 1 : 0
    }
    const onPointerOut = () => {
      pointer.target = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop)
    })
    const themeWatch = new MutationObserver(() => {
      palette = readPalette()
      if (reduce) draw(0)
    })

    resize()
    io.observe(canvas)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    window.addEventListener('resize', resize)
    if (!reduce) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerOut)
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      themeWatch.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerOut)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
