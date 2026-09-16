import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Globe, Smartphone } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import { Container } from '@/components/site/ui/Container'
import { TechTag } from '@/components/site/ui/TechTag'
import { ProjectGallery } from '@/components/site/projects/ProjectGallery'

export interface ProjectDetailLink {
  label: string
  url: string
  icon: 'github' | 'demo' | 'live' | 'android'
}

export interface ProjectDetailData {
  title: string
  description: string
  longDescription: string | null
  outcome: string | null
  role: string | null
  projectType: string
  isLive: boolean
  coverImage: string | null
  gallery: string[]
  stack: string[]
  links: ProjectDetailLink[]
}

const ICONS = {
  github: Github,
  demo: ExternalLink,
  live: Globe,
  android: Smartphone,
} as const

export function ProjectDetailView({ project }: { project: ProjectDetailData }) {
  return (
    <article>
      {/* Cover (only when the project has one) */}
      {project.coverImage && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '21 / 9', maxHeight: '60vh', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <Image src={project.coverImage} alt={project.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, color-mix(in oklch, var(--canvas) 92%, transparent))' }} />
        </div>
      )}

      <Container
        style={
          project.coverImage
            ? { marginTop: '-4rem', position: 'relative', zIndex: 1 }
            : { paddingTop: 'clamp(3.5rem, 2.5rem + 4vw, 6rem)' }
        }
      >
        <Link
          href="/projects"
          className="hp-meta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.75rem' }}
        >
          <ArrowLeft size={14} /> all work
        </Link>

        <div style={{ maxWidth: '52rem' }}>
          <div className="hp-meta" style={{ display: 'flex', gap: 16 }}>
            <span>{project.projectType}</span>
            {project.isLive && <span style={{ color: '#34d399' }}>live</span>}
          </div>
          <h1 style={{ fontSize: 'var(--text-h2)', marginTop: '0.75rem', marginBottom: '1.25rem' }}>{project.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{project.description}</p>

          {project.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: '1.75rem' }}>
              {project.links.map((l) => {
                const Icon = ICONS[l.icon]
                const primary = l.icon !== 'github'
                return (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '11px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: primary ? 'var(--accent)' : 'var(--surface)',
                      color: primary ? 'var(--accent-ink)' : 'var(--ink)',
                      border: `1px solid ${primary ? 'var(--accent)' : 'var(--line-strong)'}`,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 500,
                      fontSize: '0.82rem',
                    }}
                  >
                    <Icon size={15} /> {l.label.toLowerCase()} ↗
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Body: narrative + meta */}
        <div
          className="detail-body"
          style={{ marginTop: 'clamp(2.5rem, 2rem + 3vw, 4rem)', paddingBottom: 'var(--space-section)' }}
        >
          <div>
            {project.longDescription && (
              <div style={{ fontSize: '1.075rem', lineHeight: 1.75, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                {project.longDescription}
              </div>
            )}
            {project.gallery.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: '1.25rem' }}>Gallery</h2>
                <ProjectGallery images={project.gallery} title={project.title} />
              </div>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {project.role && <MetaBlock label="Role" value={project.role} />}
            {project.outcome && <MetaBlock label="Outcome" value={project.outcome} />}
            {project.stack.length > 0 && (
              <div>
                <div className="hp-meta">tech stack</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                  {project.stack.map((t) => (
                    <TechTag key={t} label={t} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </article>
  )
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="hp-meta">{label}</div>
      <p style={{ marginTop: 8, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{value}</p>
    </div>
  )
}
