'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { ProjectCard } from './ProjectCard'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'

interface ProjectsGridProps {
  projects: FeaturedProject[]
}

const TYPE_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'webapp', label: 'Web apps' },
  { key: 'android', label: 'Mobile' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'api', label: 'APIs' },
]

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const router = useRouter()
  const params = useSearchParams()
  const activeType = params.get('type') || 'all'
  const sort = params.get('sort') || 'recent'

  // Only show type chips that actually have projects.
  const availableTypes = useMemo(() => {
    const present = new Set(projects.map((p) => p.projectType))
    return TYPE_FILTERS.filter((f) => f.key === 'all' || present.has(f.key))
  }, [projects])

  const visible = useMemo(() => {
    let list = activeType === 'all' ? projects : projects.filter((p) => p.projectType === activeType)
    if (sort === 'featured') {
      list = [...list].sort((a, b) => Number(b.isLive) - Number(a.isLive))
    }
    return list
  }, [projects, activeType, sort])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value === 'all' || (key === 'sort' && value === 'recent')) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    router.replace(qs ? `/projects?${qs}` : '/projects', { scroll: false })
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {availableTypes.map((f) => {
            const active = f.key === activeType
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setParam('type', f.key)}
                aria-pressed={active}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line-strong)'}`,
                  background: active ? 'var(--accent)' : 'var(--surface)',
                  color: active ? 'var(--accent-ink)' : 'var(--ink-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 180ms var(--ease), color 180ms var(--ease), border-color 180ms var(--ease)',
                }}
              >
                {f.label.toLowerCase()}
              </button>
            )
          })}
        </div>

        <label className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: '0.8rem' }}>
          sort:
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--line-strong)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <option value="recent">most recent</option>
            <option value="featured">live first</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mono" style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>{'// no projects in this category yet'}</p>
      ) : (
        <RevealGroup stagger={0.08} className="projects-grid">
          {visible.map((p) => (
            <RevealItem key={p.id}>
              <ProjectCard project={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
