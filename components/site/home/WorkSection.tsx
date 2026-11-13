import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'
import { TiltCard } from './TiltCard'

const STACK_SHOWN = 4

interface WorkSectionProps {
  projects: FeaturedProject[]
}

/** Selected projects as cards that tilt toward the pointer. */
export function WorkSection({ projects }: WorkSectionProps) {
  if (projects.length === 0) return null

  return (
    <section id="projects" className="hm-section">
      <Container>
        <HomeSectionHeader title="Selected" accent="work" meta={`${String(projects.length).padStart(2, '0')} projects`} />

        <div className="hm-work-grid">
          {projects.map((project) => (
            <TiltCard key={project.id}>
              <Link href={project.links.caseStudy} className="hm-work-card" aria-label={`${project.title} — case study`}>
                <div className="hm-work-media">
                  {project.coverImage ? (
                    <Image src={project.coverImage} alt="" fill sizes="(max-width: 860px) 100vw, 560px" className="hm-work-img" />
                  ) : (
                    <span className="hm-work-placeholder" aria-hidden="true">{project.number}</span>
                  )}
                </div>
                <div className="hm-work-body">
                  <div className="hm-work-meta">
                    <span>{project.number}</span>
                    <span>{project.isLive ? 'Live' : project.projectType}</span>
                  </div>
                  <h3 className="hm-work-title">
                    {project.title}
                    <ArrowUpRight size={18} aria-hidden="true" className="hm-work-arrow" />
                  </h3>
                  <p className="hm-work-summary">{project.summary}</p>
                  {project.stack.length > 0 && (
                    <p className="hm-work-stack">{project.stack.slice(0, STACK_SHOWN).join(' · ')}</p>
                  )}
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>

        <div className="hm-section-foot">
          <Link href="/projects" className="hm-btn hm-btn-quiet">
            All projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
