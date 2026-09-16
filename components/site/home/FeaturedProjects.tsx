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
        background: '#ffffff',
        color: '#1d1d1f',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
      }}
    >
      <Container>
        <HomeSectionHeader
          title="Selected"
          accent="work"
          meta={`${String(projects.length).padStart(2, '0')} SHOWCASES`}
        />

        {/* 2-Column Visual Studio Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: '2rem',
            marginTop: '2rem',
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
              background: '#f5f5f7',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: '#1d1d1f',
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
            <ArrowRight size={15} style={{ color: '#d97706' }} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
