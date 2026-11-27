'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, FileText, Maximize2 } from 'lucide-react'
import type { CertificateView } from '@/lib/data/portfolio'
import { Lightbox, type LightboxImage } from '@/components/site/ui/Lightbox'
import { SectionHead } from './SectionHead'

/** Pixels of pointer travel before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 6

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const [progress, setProgress] = useState(0)

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 1)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    drag.current = { active: true, startX: e.clientX, startLeft: ref.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!drag.current.active || !el) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      drag.current.moved = true
      el.dataset.dragging = 'true'
    }
    el.scrollLeft = drag.current.startLeft - dx
  }
  const end = () => {
    drag.current.active = false
    if (ref.current) delete ref.current.dataset.dragging
  }
  /** Swallow the click that ends a drag so cards don't open by accident. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }
  const step = (dir: 1 | -1) => {
    const el = ref.current
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return {
    ref,
    progress,
    step,
    handlers: { onPointerDown, onPointerMove, onPointerUp: end, onPointerLeave: end, onClickCapture, onScroll: sync },
  }
}

/** Certificates on a draggable, snapping rail with a progress bar. */
export function CertificateRail({ certificates }: { certificates: CertificateView[] }) {
  const { ref, progress, step, handlers } = useDragScroll()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const images = useMemo(() => certificates.filter((c) => c.fileUrl && c.fileType === 'image'), [certificates])
  const lightboxImages: LightboxImage[] = images.map((c) => ({ src: c.fileUrl as string, alt: c.title }))

  if (certificates.length === 0) return null

  return (
    <section id="certificates" className="ld-section ld-section-alt" aria-labelledby="ld-cert-title">
      <div className="ld-wrap">
        <SectionHead
          id="ld-cert-title"
          index="05"
          label="Credentials"
          title={
            <>
              Always <em>learning</em>
            </>
          }
          aside={
            <div className="ld-rail-nav">
              <button type="button" className="ld-round" onClick={() => step(-1)} aria-label="Previous certificates">
                <ArrowLeft size={18} />
              </button>
              <button type="button" className="ld-round" onClick={() => step(1)} aria-label="Next certificates">
                <ArrowRight size={18} />
              </button>
            </div>
          }
        />
      </div>

      <div ref={ref} className="ld-rail" {...handlers}>
        {certificates.map((c) => {
          const imageIndex = images.findIndex((img) => img.id === c.id)
          const isPdf = Boolean(c.fileUrl && c.fileType === 'pdf')
          return (
            <article key={c.id} className="ld-cert">
              <div className="ld-cert-media">
                {imageIndex >= 0 ? (
                  <button
                    type="button"
                    className="ld-cert-zoom"
                    onClick={() => setLightbox(imageIndex)}
                    aria-label={`View ${c.title} certificate`}
                  >
                    <Image src={c.fileUrl as string} alt="" fill sizes="340px" className="ld-cover-img" draggable={false} />
                    <Maximize2 size={18} className="ld-cert-zoom-icon" aria-hidden="true" />
                  </button>
                ) : (
                  <Award size={44} strokeWidth={1.25} aria-hidden="true" />
                )}
              </div>
              <p className="ld-cert-meta">
                <span>{c.issuer}</span>
                <span>{c.date}</span>
              </p>
              <h3 className="ld-cert-title">{c.title}</h3>
              <div className="ld-cert-links">
                {c.verifyUrl && (
                  <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" draggable={false}>
                    Verify <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {isPdf && (
                  <a href={c.fileUrl as string} target="_blank" rel="noopener noreferrer" draggable={false}>
                    <FileText size={14} aria-hidden="true" /> PDF
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div className="ld-wrap">
        <div className="ld-rail-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.06, progress)})` }} />
        </div>
      </div>

      {lightboxImages.length > 0 && (
        <Lightbox images={lightboxImages} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
      )}
    </section>
  )
}
