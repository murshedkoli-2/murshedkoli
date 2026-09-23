import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'
import { ProjectRow } from './ProjectRow'

interface FeaturedProjectsProps {
  projects: FeaturedProject[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null

  return (
    <section
      id="projects"
      style={{
        background: 'var(--canvas)',
        color: 'var(--ink)',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid var(--line)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <div style={{ marginBottom: '2.5rem' }}>
          <HomeSectionHeader
            title="Selected"
            accent="work"
            meta={`${String(projects.length).padStart(2, '0')} SHOWCASES`}
          />
          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: '1.05rem',
              maxWidth: '36rem',
              lineHeight: 1.5,
              marginTop: '-1.5rem',
              marginBottom: '2rem',
            }}
          >
            Some products and systems I’ve recently designed and built.
          </p>
        </div>

        {/* 2-Column Visual Studio Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: '2rem',
          }}
        >
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              borderRadius: 999,
              background: 'var(--btn-secondary-bg)',
              border: '1px solid var(--btn-secondary-border)',
              color: 'var(--btn-secondary-ink)',
              fontSize: '0.84rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'all 200ms ease',
            }}
            className="apple-secondary-btn"
          >
            <span>VIEW ALL ARCHIVES</span>
            <ArrowRight size={15} style={{ color: 'var(--accent)' }} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
