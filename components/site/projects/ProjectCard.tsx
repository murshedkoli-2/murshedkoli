import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { Card } from '@/components/site/ui/Card'
import { TechTag } from '@/components/site/ui/TechTag'

interface ProjectCardProps {
  project: FeaturedProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={project.links.caseStudy} aria-label={project.title} style={{ display: 'block', height: '100%' }}>
      <Card interactive style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--surface-2)', overflow: 'hidden' }}>
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: 'var(--ink-muted)',
              }}
            >
              {project.number}
            </div>
          )}
          {project.isLive && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'color-mix(in oklch, var(--canvas) 80%, transparent)',
                backdropFilter: 'blur(6px)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--accent)' }} /> Live
            </span>
          )}
        </div>

        <div style={{ padding: '1.4rem 1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <h3 style={{ fontSize: 'var(--text-h3)' }}>{project.title}</h3>
            <ArrowUpRight size={20} style={{ color: 'var(--ink-muted)', flexShrink: 0, marginTop: 4 }} />
          </div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', flex: 1 }}>{project.summary}</p>
          {project.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {project.stack.slice(0, 4).map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
