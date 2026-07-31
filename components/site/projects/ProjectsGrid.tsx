'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { ProjectRow } from '@/components/site/home/ProjectRow'

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
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
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
                className="mono"
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line-strong)'}`,
                  background: 'transparent',
                  color: active ? 'var(--accent)' : 'var(--ink-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 180ms var(--ease), border-color 180ms var(--ease)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <label className="hp-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          sort
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="mono"
            style={{
              padding: '7px 12px',
              borderRadius: 999,
              border: '1px solid var(--line-strong)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              colorScheme: 'dark',
            }}
          >
            <option value="recent">most recent</option>
            <option value="featured">live first</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="hp-meta">no projects in this category yet</p>
      ) : (
        <div>
          {visible.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} thumbFirst />
          ))}
        </div>
      )}
    </div>
  )
}
