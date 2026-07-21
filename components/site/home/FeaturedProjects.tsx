import { ArrowRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Button } from '@/components/site/ui/Button'
import { ProjectCard } from '@/components/site/projects/ProjectCard'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'

interface FeaturedProjectsProps {
  projects: FeaturedProject[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null

  return (
    <Section id="projects" eyebrow="selected work" title="Featured projects">
      <RevealGroup stagger={0.1} className="projects-grid">
        {projects.map((p) => (
          <RevealItem key={p.id}>
            <ProjectCard project={p} />
          </RevealItem>
        ))}
      </RevealGroup>

      <div style={{ marginTop: '2.5rem' }}>
        <Button href="/projects" variant="ghost">
          view all work <ArrowRight size={16} />
        </Button>
      </div>
    </Section>
  )
}
