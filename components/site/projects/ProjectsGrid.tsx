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
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--accent-ink)' : 'var(--ink-muted)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 180ms var(--ease), color 180ms var(--ease)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: '0.88rem' }}>
          Sort
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <option value="recent">Most recent</option>
            <option value="featured">Live first</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)' }}>No projects in this category yet.</p>
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
