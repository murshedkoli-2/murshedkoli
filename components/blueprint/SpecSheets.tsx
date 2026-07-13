import Link from 'next/link'
import { SectionHeading } from './primitives'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface SpecSheetsProps {
  projects: FeaturedProject[]
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

function SpecSheet({ project }: { project: FeaturedProject }) {
  return (
    <article className="bp-cell bp-spec-sheet">
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

      <div className="bp-spec-links">
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

export function SpecSheets({ projects }: SpecSheetsProps) {
  if (!projects.length) return null

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
    </section>
  )
}
