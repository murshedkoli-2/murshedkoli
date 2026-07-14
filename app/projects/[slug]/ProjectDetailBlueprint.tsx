'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GalleryLightbox } from '@/components/blueprint/GalleryLightbox'

export interface ProjectDetailData {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  coverImage: string | null
  gallery: string[]
  projectType: string
  isLive: boolean
  features: { id: string; title: string; done: boolean }[]
  techStack: { name: string; category: string }[]
  technologies: string[]
  demoUrl: string | null
  githubUrl: string | null
  androidDownloadUrl: string | null
  clientLiveUrl: string | null
  demoUrlEnabled: boolean
  githubUrlEnabled: boolean
  androidDownloadUrlEnabled: boolean
  clientLiveUrlEnabled: boolean
}

const TYPE_LABELS: Record<string, string> = {
  webapp: 'Web App',
  android: 'Android',
  desktop: 'Desktop',
  api: 'API / Backend',
}

export function ProjectDetailBlueprint({ project }: { project: ProjectDetailData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const liveUrl =
    (project.demoUrlEnabled && project.demoUrl) ||
    (project.clientLiveUrlEnabled && project.clientLiveUrl) ||
    null

  const stack = project.techStack?.length
    ? project.techStack.map(t => t.name)
    : project.technologies

  const doneCount = project.features.filter(f => f.done).length

  return (
    <div className="bp-container" style={{ paddingBlock: 56 }}>

      {/* Back */}
      <Link
        href="/#work"
        className="bp-mono"
        style={{ color: 'var(--muted)', fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}
      >
        ← BACK TO WORK
      </Link>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 48 }}>
        {/* Type badge */}
        <span
          className="bp-mono"
          style={{
            fontSize: 10,
            color: 'var(--amber)',
            border: '1px solid var(--amber)',
            padding: '3px 10px',
            display: 'inline-block',
            marginBottom: 16,
            letterSpacing: '0.1em',
          }}
        >
          {TYPE_LABELS[project.projectType] ?? project.projectType.toUpperCase()}
        </span>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--bp-font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 1rem + 4vw, 4rem)',
            color: 'var(--paper)',
            lineHeight: 1.0,
            marginBottom: 20,
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
          {project.description}
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-primary">
              LIVE DEMO ↗
            </a>
          )}
          {project.githubUrlEnabled && project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
              SOURCE ↗
            </a>
          )}
          {project.androidDownloadUrlEnabled && project.androidDownloadUrl && (
            <a href={project.androidDownloadUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
              ↓ DOWNLOAD APK
            </a>
          )}
        </div>
      </div>

      {/* ── Cover image ────────────────────────────────────────────────── */}
      {project.coverImage && (
        <div style={{ marginBottom: 48, border: '1px solid var(--bp-line)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            style={{ width: '100%', height: 'clamp(200px, 40vw, 480px)', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="bp-project-body">

        {/* Main column */}
        <div>

          {/* Long description */}
          {project.longDescription && (
            <section style={{ marginBottom: 48 }}>
              <span className="bp-eyebrow" style={{ display: 'block', marginBottom: 16 }}>About</span>
              {project.longDescription.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 14, fontSize: 15 }}>
                  {para}
                </p>
              ))}
            </section>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <span className="bp-eyebrow" style={{ display: 'block', marginBottom: 16 }}>
                Gallery · {project.gallery.length}
              </span>
              <div className="bp-detail-gallery">
                {project.gallery.map((src, i) => (
                  <button
                    key={i}
                    className="bp-modal-thumb"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{ aspectRatio: '16/9' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Features */}
          {project.features.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <span className="bp-eyebrow">Features</span>
                <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10 }}>
                  {doneCount}/{project.features.length} done
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {project.features.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 0',
                      borderBottom: '1px solid var(--bp-line)',
                    }}
                  >
                    {/* Tick */}
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        border: `1.5px solid ${f.done ? 'var(--shipped)' : 'var(--bp-line)'}`,
                        background: f.done ? 'var(--shipped)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--ink)',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {f.done && '✓'}
                    </span>
                    <span
                      style={{
                        color: f.done ? 'var(--muted)' : 'var(--paper)',
                        fontSize: 14,
                        textDecoration: f.done ? 'line-through' : 'none',
                        textDecorationColor: 'var(--muted)',
                      }}
                    >
                      {f.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        {stack.length > 0 && (
          <aside>
            <div className="bp-cell" style={{ padding: '20px 22px', position: 'sticky', top: 24 }}>
              <span className="bp-eyebrow" style={{ display: 'block', marginBottom: 16 }}>Tech Stack</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stack.map((name) => (
                  <span
                    key={name}
                    className="bp-mono"
                    style={{
                      fontSize: 11,
                      color: 'var(--paper)',
                      border: '1px solid var(--bp-line)',
                      padding: '4px 10px',
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={project.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
