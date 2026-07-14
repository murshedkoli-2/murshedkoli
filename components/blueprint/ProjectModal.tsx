'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { GalleryLightbox } from './GalleryLightbox'

interface ProjectModalProps {
  project: FeaturedProject
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, lightboxIndex])

  const galleryUrls = project.gallery.map((key) =>
    key.startsWith('http') ? key : `/api/upload/certificate/view?key=${encodeURIComponent(key)}`
  )

  return (
    <>
      {/* Backdrop */}
      <div className="bp-modal-backdrop" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="bp-modal-panel" role="dialog" aria-modal aria-label={project.title}>
        {/* Header */}
        <div className="bp-modal-header">
          <div>
            <span className="bp-eyebrow" style={{ marginBottom: 4, display: 'block' }}>
              {project.role || 'Project'}
            </span>
            <h2
              style={{
                fontFamily: 'var(--bp-font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.3rem, 1rem + 1.2vw, 1.8rem)',
                color: 'var(--paper)',
                lineHeight: 1.1,
              }}
            >
              {project.title}
            </h2>
          </div>
          <button className="bp-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="bp-modal-body">
          {/* Cover image */}
          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt={project.title} className="bp-modal-cover" />
          )}

          {/* Outcome */}
          {project.outcome && (
            <p className="bp-mono" style={{ color: 'var(--amber)', fontSize: 13, marginBottom: 12 }}>
              ✦ {project.outcome}
            </p>
          )}

          {/* Summary */}
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16, fontSize: 14 }}>
            {project.summary}
          </p>

          {/* Gallery thumbnails */}
          {galleryUrls.length > 0 && (
            <div className="bp-modal-gallery">
              {galleryUrls.slice(0, 4).map((url, i) => (
                <button
                  key={i}
                  className="bp-modal-thumb"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View gallery image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${project.title} screenshot ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Stack */}
          {project.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="bp-mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--muted)',
                    border: '1px solid var(--bp-line)',
                    padding: '2px 8px',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span
              className="bp-dot"
              style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
              aria-hidden
            />
            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
              {project.status}
            </span>
          </div>

          {/* Actions */}
          <div className="bp-modal-actions">
            <Link href={project.links.caseStudy} className="bp-btn bp-btn-primary" onClick={onClose}>
              VIEW FULL DETAILS →
            </Link>
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                LIVE ↗
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                SOURCE ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={galleryUrls}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
