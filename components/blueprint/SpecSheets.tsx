'use client'

import Link from 'next/link'
import { SectionHeading } from './primitives'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface SpecSheetsProps {
  projects: FeaturedProject[]
  allProjects: FeaturedProject[]
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bp-spec-row">
      <span className="bp-mono" style={{ color: 'var(--muted)', minWidth: 72 }}>
        {label}
      </span>
      <span className="bp-mono" style={{ color: 'var(--paper)' }}>
        {value}
      </span>
    </div>
  )
}

function openModal(project: FeaturedProject) {
  window.dispatchEvent(new CustomEvent('open-project-modal', { detail: project }))
}

function SpecSheet({ project }: { project: FeaturedProject }) {
  return (
    <article
      className="bp-cell bp-spec-sheet"
      onClick={() => openModal(project)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div className="bp-spec-header">
        <span
          style={{
            fontFamily: 'var(--bp-font-display)',
            fontWeight: 800,
            fontSize: 'var(--bp-fs-num)',
            color: 'var(--amber)',
            lineHeight: 1,
          }}
        >
          {project.number}
        </span>
        <span
          className="bp-mono"
          style={{
            color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            className="bp-dot"
            style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
            aria-hidden
          />
          {project.status}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--bp-font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 1.1rem + 1.4vw, 2.1rem)',
          color: 'var(--paper)',
          margin: '20px 0 12px',
          lineHeight: 1.05,
        }}
      >
        {project.title}
      </h3>

      <p style={{ color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560, marginBottom: 22 }}>
        {project.summary}
      </p>

      <div className="bp-spec-grid">
        <SpecRow label="Stack" value={project.stack.join(' · ') || '—'} />
        <SpecRow label="Role" value={project.role || 'Solo — plan → ship'} />
        <SpecRow label="Outcome" value={project.outcome || 'Case study →'} />
      </div>

      <div className="bp-spec-links" onClick={(e) => e.stopPropagation()}>
        <Link
          href={project.links.caseStudy}
          className="bp-mono"
          style={{ color: 'var(--amber)', textDecoration: 'none' }}
        >
          CASE STUDY →
        </Link>
        {project.links.live ? (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-mono"
            style={{ color: 'var(--paper)', textDecoration: 'none' }}
          >
            LIVE ↗
          </a>
        ) : null}
        {project.links.github ? (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-mono"
            style={{ color: 'var(--paper)', textDecoration: 'none' }}
          >
            SOURCE ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}

function CompactCard({ project }: { project: FeaturedProject }) {
  return (
    <article
      className="bp-cell bp-compact-card"
      onClick={() => openModal(project)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          className="bp-mono"
          style={{
            color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
            fontSize: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            className="bp-dot"
            style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)', width: 6, height: 6 }}
            aria-hidden
          />
          {project.status}
        </span>
        <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 11 }}>
          VIEW →
        </span>
      </div>
      <h4
        style={{
          fontFamily: 'var(--bp-font-display)',
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--paper)',
          marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
        {project.title}
      </h4>
      {project.role && (
        <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 8 }}>
          {project.role}
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="bp-mono"
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              border: '1px solid var(--bp-line)',
              padding: '2px 7px',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

export function SpecSheets({ projects, allProjects }: SpecSheetsProps) {
  if (!projects.length && !allProjects.length) return null

  const nonFeatured = allProjects.filter((p) => !projects.find((f) => f.id === p.id))

  return (
    <section id="work" aria-labelledby="work-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading
        eyebrow="Featured Work"
        title="Project spec sheets"
        id="work-heading"
      />
      <div className="bp-spec-list" style={{ marginTop: 40, display: 'grid', gap: 20 }}>
        {projects.map((project) => (
          <SpecSheet key={project.id} project={project} />
        ))}
      </div>

      {nonFeatured.length > 0 && (
        <>
          <div style={{ marginTop: 56, marginBottom: 24, borderTop: '1px solid var(--bp-line)', paddingTop: 32 }}>
            <span className="bp-eyebrow">All Projects · {nonFeatured.length}</span>
          </div>
          <div className="bp-all-projects-grid">
            {nonFeatured.map((project) => (
              <CompactCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
