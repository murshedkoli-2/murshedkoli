'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GalleryLightbox } from '@/components/blueprint/GalleryLightbox'

interface Feature {
  id: string
  title: string
  description?: string | null
  status: string
  storyPoints?: number
  priorityScore?: number
}

interface RoadmapPhase {
  id: string
  phaseName: string
  description?: string | null
  progress: number
  order: number
}

interface TechItem {
  name: string
  category: string
}

interface Module {
  id: string
  name: string
  description?: string | null
  status: string
  tasks: { id: string; title: string; status: string }[]
}

interface DeploymentInfo {
  platform?: string | null
  domain?: string | null
  environment?: string | null
  ciCd?: string | null
}

export interface ProjectDetailData {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  outcome: string | null
  role: string | null
  coverImage: string | null
  gallery: string[]
  lifecycleStatus: string
  projectType: string
  overallProgress: number
  isLive: boolean
  features: Feature[]
  roadmap: RoadmapPhase[]
  techStack: TechItem[]
  technologies: string[]
  modules: Module[]
  deployment: DeploymentInfo | null
  createdAt: string
  updatedAt: string
  demoUrl: string | null
  githubUrl: string | null
  clientLiveUrl: string | null
  demoUrlEnabled: boolean
  githubUrlEnabled: boolean
  clientLiveUrlEnabled: boolean
}

function priorityDot(score: number) {
  if (score >= 7) return '#63d6a3'
  if (score >= 4) return '#f2b33d'
  return '#e55'
}

function statusIcon(status: string) {
  if (status === 'completed') return '✓'
  if (status === 'in_progress') return '◐'
  return '○'
}

type FeatureFilter = 'all' | 'planned' | 'in_progress' | 'completed'

function statusBorderColor(s: string) {
  if (s === 'completed') return 'var(--shipped)'
  if (s === 'in_progress') return 'var(--amber)'
  return 'rgba(146,180,215,0.25)'
}

function statusLabel(s: string) {
  if (s === 'completed') return 'COMPLETED'
  if (s === 'in_progress') return 'IN PROGRESS'
  return 'PLANNED'
}

function statusTextColor(s: string) {
  if (s === 'completed') return 'var(--shipped)'
  if (s === 'in_progress') return 'var(--amber)'
  return 'var(--muted)'
}

export function ProjectDetailBlueprint({ project }: { project: ProjectDetailData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [featureFilter, setFeatureFilter] = useState<FeatureFilter>('all')

  const toggleModule = (id: string) =>
    setExpandedModules((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const totalSP = project.features.reduce((sum, f) => sum + (f.storyPoints ?? 1), 0)
  const quickWins = project.features.filter(
    (f) => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) <= 3
  ).length

  const stack =
    project.techStack?.length
      ? project.techStack
      : project.technologies.map((t) => ({ name: t, category: 'other' }))

  const grouped = stack.reduce<Record<string, string[]>>((acc, t) => {
    const cat = t.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t.name)
    return acc
  }, {})

  const liveUrl =
    (project.demoUrlEnabled && project.demoUrl) ||
    (project.clientLiveUrlEnabled && project.clientLiveUrl) ||
    null

  return (
    <div className="bp-container" style={{ paddingBlock: 48 }}>
      {/* Breadcrumb */}
      <div className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 32 }}>
        <Link href="/#work" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
          WORK
        </Link>
        {' / '}
        <span style={{ color: 'var(--amber)' }}>PROJECT</span>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        {project.role && (
          <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>
            {project.role}
          </span>
        )}
        <h1
          style={{
            fontFamily: 'var(--bp-font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 1.2rem + 3vw, 3.5rem)',
            color: 'var(--paper)',
            lineHeight: 1.05,
            marginBottom: 12,
          }}
        >
          {project.title}
        </h1>
        {project.outcome && (
          <p className="bp-mono" style={{ color: 'var(--amber)', fontSize: 14, marginBottom: 16 }}>
            ✦ {project.outcome}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span
            className="bp-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
              fontSize: 12,
            }}
          >
            <span
              className={`bp-dot${project.isLive ? ' bp-dot-live' : ''}`}
              style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
            />
            {project.lifecycleStatus.toUpperCase()}
          </span>
          <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
            {project.projectType.toUpperCase()}
          </span>
          <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
            {project.overallProgress}% COMPLETE
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-primary">
              LIVE DEMO ↗
            </a>
          )}
          {project.githubUrlEnabled && project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
              SOURCE ↗
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bp-detail-grid">
        {/* Main column */}
        <div className="bp-detail-main">
          {project.longDescription && (
            <section style={{ marginBottom: 40 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>About</span>
              {project.longDescription.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>
                  {para}
                </p>
              ))}
            </section>
          )}

          {project.gallery.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>
                Gallery · {project.gallery.length}
              </span>
              <div className="bp-detail-gallery">
                {project.gallery.map((src, i) => (
                  <button
                    key={i}
                    className="bp-modal-thumb"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {project.features.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span className="bp-eyebrow">Features</span>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10 }}>
                    <span style={{ color: 'var(--paper)', fontWeight: 700 }}>{totalSP}</span> SP
                  </span>
                  <span className="bp-mono" style={{ color: 'var(--shipped)', fontSize: 10 }}>
                    <span style={{ fontWeight: 700 }}>{quickWins}</span> QUICK WINS
                  </span>
                  <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10 }}>
                    <span style={{ color: 'var(--paper)', fontWeight: 700 }}>
                      {project.features.filter(f => f.status === 'completed').length}
                    </span>/{project.features.length} DONE
                  </span>
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--bp-line)', marginBottom: 0 }}>
                {(['all', 'planned', 'in_progress', 'completed'] as FeatureFilter[]).map((filter) => {
                  const labels: Record<FeatureFilter, string> = { all: 'ALL', planned: 'PLANNED', in_progress: 'IN PROGRESS', completed: 'COMPLETED' }
                  const count = filter === 'all' ? project.features.length : project.features.filter(f => f.status === filter).length
                  const active = featureFilter === filter
                  return (
                    <button
                      key={filter}
                      onClick={() => setFeatureFilter(filter)}
                      className="bp-mono"
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        fontSize: 10,
                        color: active ? 'var(--amber)' : 'var(--muted)',
                        marginBottom: -1,
                        transition: 'color 140ms ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {labels[filter]}{count > 0 ? ` (${count})` : ''}
                    </button>
                  )
                })}
              </div>

              {/* BOM list */}
              <div>
                {(featureFilter === 'all' ? project.features : project.features.filter(f => f.status === featureFilter))
                  .map((f) => {
                    const globalIdx = project.features.indexOf(f)
                    const sp = f.storyPoints ?? 1
                    const priority = f.priorityScore ?? 5
                    const pFill = priority >= 7 ? 'var(--shipped)' : priority >= 4 ? 'var(--amber)' : '#e55'
                    return (
                      <div
                        key={f.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '44px 1fr 72px',
                          gap: '0 14px',
                          padding: '18px 16px 18px 0',
                          borderBottom: '1px solid var(--bp-line)',
                          borderLeft: `3px solid ${statusBorderColor(f.status)}`,
                          paddingLeft: 14,
                          alignItems: 'start',
                        }}
                      >
                        {/* Sequence number */}
                        <div style={{ paddingTop: 2 }}>
                          <span
                            className="bp-mono"
                            style={{ color: 'var(--amber)', fontSize: 18, fontWeight: 800, lineHeight: 1, display: 'block' }}
                          >
                            {String(globalIdx + 1).padStart(2, '0')}
                          </span>
                          <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 9, marginTop: 4, display: 'block' }}>
                            SP·{sp}
                          </span>
                        </div>

                        {/* Content */}
                        <div>
                          <span
                            style={{
                              color: 'var(--paper)',
                              fontSize: 14,
                              fontWeight: 700,
                              fontFamily: 'var(--bp-font-display)',
                              display: 'block',
                              marginBottom: f.description ? 5 : 8,
                              lineHeight: 1.2,
                            }}
                          >
                            {f.title}
                          </span>
                          {f.description && (
                            <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.55, marginBottom: 8 }}>
                              {f.description}
                            </p>
                          )}
                          <span
                            className="bp-mono"
                            style={{ color: statusTextColor(f.status), fontSize: 9, letterSpacing: '0.08em' }}
                          >
                            {statusIcon(f.status)} {statusLabel(f.status)}
                          </span>
                        </div>

                        {/* Priority meter */}
                        <div style={{ paddingTop: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 9 }}>PRIORITY</span>
                            <span className="bp-mono" style={{ color: pFill, fontSize: 10, fontWeight: 800 }}>{priority}</span>
                          </div>
                          <div style={{ height: 2, background: 'var(--bp-line)' }}>
                            <div style={{ height: '100%', width: `${(priority / 10) * 100}%`, background: pFill }} />
                          </div>
                          {/* 5-segment signal bars */}
                          <div style={{ display: 'flex', gap: 2, marginTop: 5 }}>
                            {[2, 4, 6, 8, 10].map((threshold) => (
                              <div
                                key={threshold}
                                style={{
                                  flex: 1,
                                  height: 4,
                                  background: priority >= threshold ? pFill : 'var(--bp-line)',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>
          )}

          {project.roadmap.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 16, display: 'block' }}>Roadmap</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...project.roadmap].sort((a, b) => a.order - b.order).map((phase) => (
                  <div key={phase.id} className="bp-cell" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: 'var(--paper)', fontSize: 13, fontWeight: 600 }}>{phase.phaseName}</span>
                      <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 11 }}>{phase.progress}%</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--bp-line)', position: 'relative' }}>
                      <div style={{ height: '100%', width: `${phase.progress}%`, background: 'var(--amber)', transition: 'width 400ms ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.modules.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 16, display: 'block' }}>Modules & Tasks</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.modules.map((mod) => (
                  <div key={mod.id} className="bp-cell">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--paper)' }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{mod.name}</span>
                      <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
                        {mod.tasks.length} tasks {expandedModules.has(mod.id) ? '▲' : '▼'}
                      </span>
                    </button>
                    {expandedModules.has(mod.id) && (
                      <div style={{ borderTop: '1px solid var(--bp-line)', padding: '8px 16px 12px' }}>
                        {mod.tasks.map((task) => (
                          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                            <span style={{ color: task.status === 'completed' ? 'var(--shipped)' : 'var(--muted)', fontSize: 12 }}>
                              {statusIcon(task.status)}
                            </span>
                            <span style={{ color: 'var(--muted)', fontSize: 12 }}>{task.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="bp-detail-sidebar">
          {Object.keys(grouped).length > 0 && (
            <div className="bp-cell" style={{ padding: '18px 20px', marginBottom: 16 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Tech Stack</span>
              {Object.entries(grouped).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10, marginBottom: 6 }}>{cat.toUpperCase()}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {names.map((name) => (
                      <span key={name} className="bp-mono" style={{ fontSize: 10, color: 'var(--paper)', border: '1px solid var(--bp-line)', padding: '2px 8px' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.deployment && (
            <div className="bp-cell" style={{ padding: '18px 20px', marginBottom: 16 }}>
              <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Deployment</span>
              {(
                [
                  ['Platform', project.deployment.platform],
                  ['Environment', project.deployment.environment],
                  ['Domain', project.deployment.domain],
                  ['CI/CD', project.deployment.ciCd],
                ] as [string, string | null | undefined][]
              ).filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</span>
                  <span className="bp-mono" style={{ color: 'var(--paper)', fontSize: 11 }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bp-cell" style={{ padding: '18px 20px' }}>
            <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Project Info</span>
            {(
              [
                ['Type', project.projectType],
                ['Created', new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })],
                ['Updated', new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</span>
                <span className="bp-mono" style={{ color: 'var(--paper)', fontSize: 11 }}>{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={project.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
