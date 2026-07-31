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
        background: '#0b0b0c',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
      }}
    >
      <Container>
        <HomeSectionHeader title="Selected" accent="work" meta={`${String(projects.length).padStart(2, '0')} projects`} />

        <div>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Link
            href="/projects"
            className="mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '13px 24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ececea',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            VIEW ALL WORK <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
