'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox, type LightboxImage } from '@/components/site/ui/Lightbox'

interface ProjectGalleryProps {
  images: string[]
  title: string
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState<number | null>(null)
  if (images.length === 0) return null

  const lightboxImages: LightboxImage[] = images.map((src, i) => ({ src, alt: `${title} — image ${i + 1}` }))

  return (
    <>
      <div className="detail-gallery">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              background: 'var(--surface-2)',
              cursor: 'pointer',
              padding: 0,
            }}
            className="site-card--interactive"
          >
            <Image src={src} alt={`${title} — image ${i + 1}`} fill sizes="(max-width: 700px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>
      <Lightbox images={lightboxImages} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </>
  )
}
