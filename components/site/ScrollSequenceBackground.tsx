'use client'

import { useEffect, useRef } from 'react'
import manifest from '@/public/sequence/manifest.json'

/**
 * Full-bleed portrait clip scrubbed by page scroll.
 *
 * A fixed canvas sits behind the page and draws one frame of a pre-rendered
 * WebP sequence, chosen from how far down the document you are. Frames are
 * fetched progressively, so the first paint happens as soon as frame 0 lands
 * and the sequence sharpens up as the rest arrive.
 *
 * Regenerate the frames with `node scripts/build-scroll-frames.mjs`.
 */

/** Below this viewport width we load the small tier — a third of the bytes. */
const SM_BREAKPOINT = 768

/** How far the push-in goes at the midpoint of the page. 0.18 = 118% of cover size. */
const ZOOM_AMOUNT = 0.18

/** Lerp factor from raw scroll position toward the rendered frame. Lower = more glide. */
const SMOOTHING = 0.14

/** Backgrounds don't need retina; capping DPR roughly halves the fill cost. */
const MAX_DPR = 1.5

/** Parallel image requests. Enough to saturate HTTP/2 without starving the page. */
const CONCURRENCY = 6

const { count: FRAME_COUNT } = manifest

/** The clip plays through exactly once: top of page = frame 0, bottom = last frame. */
const LAST_FRAME = FRAME_COUNT - 1

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function frameSrc(tier: string, index: number): string {
  return `/sequence/${tier}/${String(index).padStart(4, '0')}.webp`
}

export function ScrollSequenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tier = window.innerWidth < SM_BREAKPOINT ? 'sm' : 'lg'

    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT)
    let drawnIndex = -1
    let drawnZoom = -1
    let position = 0
    let target = 0
    let rafId = 0
    let disposed = false

    // ── Sizing ──────────────────────────────────────────────────────
    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      drawnIndex = -1
      drawnZoom = -1
      render()
    }

    // ── Drawing ─────────────────────────────────────────────────────
    /** Nearest already-loaded frame, so early scrolling never shows a blank canvas. */
    function nearestLoaded(index: number): number {
      // Search outward without wrapping — the clip is a single pass, so the
      // last frame is not a sensible stand-in for the first.
      for (let offset = 0; offset < FRAME_COUNT; offset++) {
        const back = index - offset
        if (back >= 0 && frames[back]) return back
        const forward = index + offset
        if (forward <= LAST_FRAME && frames[forward]) return forward
      }
      return -1
    }

    /** One cosine breath over the page: 1.0 at either end, peaking in the middle. */
    function zoomAt(pos: number): number {
      const progress = pos / LAST_FRAME
      return 1 + (ZOOM_AMOUNT * (1 - Math.cos(progress * Math.PI * 2))) / 2
    }

    function render() {
      if (!canvas || !ctx) return
      const wanted = clamp(Math.round(position), 0, LAST_FRAME)
      const index = nearestLoaded(wanted)
      const image = index === -1 ? undefined : frames[index]
      if (!image) return

      const zoom = zoomAt(position)
      if (index === drawnIndex && Math.abs(zoom - drawnZoom) < 0.0015) return

      const { width: cw, height: ch } = canvas
      // Cover fit (times the zoom breath), anchored above centre so the face
      // stays in frame on wide viewports. Zoom is never < 1, so the canvas is
      // always fully painted and needs no clear.
      const scale = Math.max(cw / image.naturalWidth, ch / image.naturalHeight) * zoom
      const w = image.naturalWidth * scale
      const h = image.naturalHeight * scale
      ctx.drawImage(image, (cw - w) / 2, (ch - h) * 0.34, w, h)
      drawnIndex = index
      drawnZoom = zoom
    }

    // ── Scroll driving ──────────────────────────────────────────────
    function readScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      target = clamp(progress, 0, 1) * LAST_FRAME
    }

    function tick() {
      position += (target - position) * SMOOTHING
      render()
      if (Math.abs(target - position) < 0.05) {
        position = target
        render()
        rafId = 0
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    function schedule() {
      if (disposed || rafId) return
      rafId = requestAnimationFrame(tick)
    }

    function onScroll() {
      readScroll()
      schedule()
    }

    function onResize() {
      resize()
      readScroll()
      schedule()
    }

    // ── Progressive loading ─────────────────────────────────────────
    let cursor = 0
    function loadNext() {
      if (disposed) return
      const index = cursor++
      if (index >= FRAME_COUNT) return

      const image = new Image()
      image.decoding = 'async'
      const done = () => {
        if (disposed) return
        loadNext()
      }
      image.onload = () => {
        if (disposed) return
        frames[index] = image
        // A newly arrived frame may be a better match than whatever is on screen.
        drawnIndex = -1
        render()
        loadNext()
      }
      image.onerror = done
      image.src = frameSrc(tier, index)
    }

    resize()

    if (prefersReducedMotion) {
      // One still frame, no scroll wiring, no animation loop.
      const still = new Image()
      still.decoding = 'async'
      still.onload = () => {
        if (disposed) return
        frames[0] = still
        render()
      }
      still.src = frameSrc(tier, 0)
      window.addEventListener('resize', resize)
      return () => {
        disposed = true
        window.removeEventListener('resize', resize)
      }
    }

    readScroll()
    position = target
    for (let i = 0; i < CONCURRENCY; i++) loadNext()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="seq-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="seq-bg-canvas" />
      <div className="seq-bg-veil" />
    </div>
  )
}
