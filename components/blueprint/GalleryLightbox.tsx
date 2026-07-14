'use client'

import { useEffect, useState, useCallback } from 'react'

interface GalleryLightboxProps {
  images: string[]
  startIndex: number
  onClose: () => void
}

export function GalleryLightbox({ images, startIndex, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  // Preload adjacent images
  useEffect(() => {
    const preload = (src: string) => { const img = new Image(); img.src = src }
    if (images[current - 1]) preload(images[current - 1])
    if (images[current + 1]) preload(images[current + 1])
  }, [current, images])

  // Touch swipe
  useEffect(() => {
    let startX = 0
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      if (dx > 50) prev()
      else if (dx < -50) next()
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [prev, next])

  return (
    <div className="bp-lightbox" role="dialog" aria-modal aria-label="Image viewer">
      {/* Backdrop */}
      <div className="bp-lightbox-backdrop" onClick={onClose} />

      {/* Top bar */}
      <div className="bp-lightbox-topbar">
        <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 12 }}>
          {current + 1} / {images.length}
        </span>
        <button className="bp-modal-close" onClick={onClose} aria-label="Close lightbox">✕</button>
      </div>

      {/* Main image */}
      <div className="bp-lightbox-main">
        {current > 0 && (
          <button className="bp-lightbox-arrow bp-lightbox-prev" onClick={prev} aria-label="Previous">←</button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="bp-lightbox-img"
        />
        {current < images.length - 1 && (
          <button className="bp-lightbox-arrow bp-lightbox-next" onClick={next} aria-label="Next">→</button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="bp-lightbox-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`bp-lightbox-thumb ${i === current ? 'active' : ''}`}
              aria-label={`Go to image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
