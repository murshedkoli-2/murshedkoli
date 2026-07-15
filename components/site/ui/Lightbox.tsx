'use client'

import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface LightboxImage {
  src: string
  alt: string
}

interface LightboxProps {
  images: LightboxImage[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Fullscreen image viewer with keyboard + arrow navigation. Controlled via `index`. */
export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null && index >= 0 && index < images.length

  const go = useCallback(
    (dir: number) => {
      if (index === null) return
      const next = (index + dir + images.length) % images.length
      onNavigate(next)
    },
    [index, images.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, go, onClose])

  const current = open ? images[index as number] : null

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'color-mix(in oklch, black 88%, transparent)',
          }}
          onClick={onClose}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={iconBtn({ top: 20, right: 20 })}
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                style={iconBtn({ left: 16 })}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); go(1) }}
                style={iconBtn({ right: 16 })}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: 'min(92vw, 1100px)', height: '82vh' }}
          >
            <Image src={current.src} alt={current.alt} fill sizes="92vw" style={{ objectFit: 'contain' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function iconBtn(pos: React.CSSProperties): React.CSSProperties {
  return {
    position: 'absolute',
    top: pos.top ?? '50%',
    transform: pos.top ? undefined : 'translateY(-50%)',
    ...pos,
    zIndex: 1,
    width: 46,
    height: 46,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff',
    cursor: 'pointer',
  }
}
