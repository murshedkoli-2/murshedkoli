'use client'

import { useEffect, useRef, useState } from 'react'
import { SHAPES, buildShape, type ShapeKey } from '@/lib/home/point-shapes'

const POINTS_DESKTOP = 1700
const POINTS_MOBILE = 950
const MOBILE_WIDTH = 720
const CAMERA_DISTANCE = 3.2
const AUTO_SPIN = 0.0026
const DRAG_SENSITIVITY = 0.008
const KEY_STEP = 0.18
const MAX_TILT = 1.15
const MORPH_EASE = 0.055
const REPEL_RADIUS = 90
const REPEL_PUSH = 16
const ACCENT_EVERY = 9

interface SceneColors {
  ink: string
  accent: string
}

function readColors(): SceneColors {
  const style = getComputedStyle(document.documentElement)
  return {
    ink: style.getPropertyValue('--ink').trim() || '#222225',
    accent: style.getPropertyValue('--accent').trim() || '#c26a0b',
  }
}

/**
 * Starts the point-cloud renderer on the canvas and returns its cleanup.
 * `getShape` is read every frame so the cloud eases toward the chosen shape.
 */
function startScene(canvas: HTMLCanvasElement, getShape: () => ShapeKey): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const count = window.innerWidth < MOBILE_WIDTH ? POINTS_MOBILE : POINTS_DESKTOP
  const targets = Object.fromEntries(SHAPES.map((s) => [s.key, buildShape(s.key, count)])) as Record<ShapeKey, Float32Array>
  const points = Float32Array.from(targets[getShape()])

  let colors = readColors()
  let width = 0
  let height = 0
  let rotY = 0.6
  let rotX = -0.32
  let velY = reduceMotion ? 0 : AUTO_SPIN
  let velX = 0
  let dragging = false
  let lastX = 0
  let lastY = 0
  let pointerX = -9999
  let pointerY = -9999
  let leanX = 0
  let leanY = 0
  let visible = true
  let frame = 0

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const draw = () => {
    const target = targets[getShape()]
    const ease = reduceMotion ? 1 : MORPH_EASE
    for (let i = 0; i < points.length; i++) points[i] += (target[i] - points[i]) * ease

    if (!dragging) {
      rotY += velY
      rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX + velX))
      velY += ((reduceMotion ? 0 : AUTO_SPIN) - velY) * 0.03
      velX *= 0.93
    }

    // The cloud leans slightly toward the pointer.
    const hasPointer = pointerX > -9000
    const wantLeanX = hasPointer && !reduceMotion ? (pointerY / height - 0.5) * 0.35 : 0
    const wantLeanY = hasPointer && !reduceMotion ? (pointerX / width - 0.5) * 0.45 : 0
    leanX += (wantLeanX - leanX) * 0.06
    leanY += (wantLeanY - leanY) * 0.06

    const sinY = Math.sin(rotY + leanY)
    const cosY = Math.cos(rotY + leanY)
    const sinX = Math.sin(rotX + leanX)
    const cosX = Math.cos(rotX + leanX)
    const scale = Math.min(width, height) * 0.43
    const centerX = width / 2
    const centerY = height / 2
    const repelSq = REPEL_RADIUS * REPEL_RADIUS

    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < count; i++) {
      const x = points[i * 3]
      const y = points[i * 3 + 1]
      const z = points[i * 3 + 2]
      const x1 = x * cosY + z * sinY
      const z1 = z * cosY - x * sinY
      const y1 = y * cosX - z1 * sinX
      const z2 = z1 * cosX + y * sinX

      const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - z2)
      let sx = centerX + x1 * scale * perspective
      let sy = centerY - y1 * scale * perspective

      // Points near the pointer are pushed aside and brighten.
      let lift = 0
      const dx = sx - pointerX
      const dy = sy - pointerY
      const distSq = dx * dx + dy * dy
      if (distSq < repelSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq)
        lift = 1 - dist / REPEL_RADIUS
        sx += (dx / dist) * lift * REPEL_PUSH
        sy += (dy / dist) * lift * REPEL_PUSH
      }

      const depth = (z2 + 1) / 2 // 0 at the back, 1 at the front
      const size = 0.55 + depth * 1.5 + lift * 1.6
      ctx.globalAlpha = Math.min(1, 0.14 + depth * 0.7 + lift * 0.4)
      ctx.fillStyle = i % ACCENT_EVERY === 0 ? colors.accent : colors.ink
      if (size < 1.3) {
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size)
      } else {
        ctx.beginPath()
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }

  const loop = () => {
    draw()
    frame = visible ? requestAnimationFrame(loop) : 0
  }
  const wake = () => {
    if (!frame && visible) frame = requestAnimationFrame(loop)
  }

  const local = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
    canvas.dataset.dragging = 'true'
  }
  const onMove = (e: PointerEvent) => {
    const p = local(e)
    pointerX = p.x
    pointerY = p.y
    if (!dragging) return
    velY = (e.clientX - lastX) * DRAG_SENSITIVITY
    velX = (e.clientY - lastY) * DRAG_SENSITIVITY
    rotY += velY
    rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX + velX))
    lastX = e.clientX
    lastY = e.clientY
  }
  const onUp = (e: PointerEvent) => {
    dragging = false
    delete canvas.dataset.dragging
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    if (e.pointerType !== 'mouse') pointerX = pointerY = -9999
  }
  const onLeave = () => {
    if (!dragging) pointerX = pointerY = -9999
  }
  const onKey = (e: KeyboardEvent) => {
    const turn: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0], ArrowRight: [KEY_STEP, 0], ArrowUp: [0, -KEY_STEP], ArrowDown: [0, KEY_STEP],
    }
    const step = turn[e.key]
    if (!step) return
    e.preventDefault()
    rotY += step[0]
    rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX + step[1]))
  }

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('keydown', onKey)

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    wake()
  })
  visibilityObserver.observe(canvas)
  const themeObserver = new MutationObserver(() => { colors = readColors() })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] })

  resize()
  wake()

  return () => {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    themeObserver.disconnect()
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onUp)
    canvas.removeEventListener('pointerleave', onLeave)
    canvas.removeEventListener('keydown', onKey)
  }
}

/** Interactive 3D point cloud: drag to spin it, hover to disturb it, pick a shape to morph it. */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapeRef = useRef<ShapeKey>('sphere')
  const [shape, setShape] = useState<ShapeKey>('sphere')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return startScene(canvas, () => shapeRef.current)
  }, [])

  const choose = (key: ShapeKey) => {
    shapeRef.current = key
    setShape(key)
  }

  return (
    <div className="hm-scene">
      <div className="hm-scene-stage">
        <canvas
          ref={canvasRef}
          className="hm-scene-canvas"
          tabIndex={0}
          role="img"
          aria-label={`Interactive 3D point cloud shaped as a ${shape}. Drag or use the arrow keys to rotate it.`}
        />
      </div>
      <div className="hm-scene-bar">
        <div className="hm-scene-shapes" role="group" aria-label="Shape">
          {SHAPES.map((s) => (
            <button key={s.key} type="button" className="hm-scene-shape" aria-pressed={shape === s.key} onClick={() => choose(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
        <span className="hm-scene-hint" aria-hidden="true">Drag to rotate</span>
      </div>
    </div>
  )
}
