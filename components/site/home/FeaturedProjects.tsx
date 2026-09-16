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
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ececea',
              fontSize: '0.84rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'all 200ms ease',
            }}
            className="view-all-btn"
          >
            <span>VIEW ALL ARCHIVES</span>
            <ArrowRight size={15} style={{ color: '#f5b04c' }} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
