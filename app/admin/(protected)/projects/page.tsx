'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { ArrowUpRight, FolderKanban, ImageOff, Plus, Rocket, Star, Trash2 } from 'lucide-react'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import {
  relativeTime,
  stackLabel,
  isLive,
  projectCompleteness,
  type AdminProject,
} from '@/lib/admin/portfolio-summary'

type StatusFilter = 'all' | 'live' | 'draft'

export default function ProjectsManager() {
  const ready = useAdminGuard()
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?all=true')
      if (res.ok) setProjects(await res.json())
      else toast.error('Could not load projects.')
    } catch (error) {
      console.error('Projects load failed:', error)
      toast.error('Could not load projects.')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const liveCount = useMemo(() => projects.filter(isLive).length, [projects])
  const featuredCount = useMemo(() => projects.filter((p) => p.featured).length, [projects])
  const incompleteCount = useMemo(() => projects.filter((p) => !projectCompleteness(p).ok).length, [projects])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter((p) => {
      if (status === 'live' && !isLive(p)) return false
      if (status === 'draft' && isLive(p)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        stackLabel(p).toLowerCase().includes(q)
      )
    })
  }, [projects, search, status])

  const handleDelete = async (p: AdminProject) => {
    const ok = await confirmDialog({
      title: 'Delete this project?',
      description: <><strong>{p.title}</strong> and everything in it — features, tech stack, media and links — will be permanently deleted. This cannot be undone.</>,
      confirmLabel: 'Delete project',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects((prev) => prev.filter((x) => x.id !== p.id))
        toast.success('Project deleted.')
      } else {
        toast.error('Could not delete project.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete project.')
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="projects"
      title="Projects"
      subtitle={`${liveCount} live · ${projects.length - liveCount} draft`}
      badges={{ projects: projects.length }}
      actions={
        <>
          <Link href="/" target="_blank" className="adm-btn ghost">
            Preview site <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/admin/projects/new" className="adm-btn amber">
            <Plus size={16} aria-hidden="true" /> New project
          </Link>
        </>
      }
    >
      <StatStrip
        stats={[
          { label: 'Projects', value: projects.length, icon: FolderKanban, tone: 'accent' },
          { label: 'Live', value: liveCount, icon: Rocket, tone: 'good', note: `${projects.length - liveCount} in draft` },
          { label: 'Featured', value: featuredCount, icon: Star, note: 'Shown on the home page' },
          { label: 'Need work', value: incompleteCount, icon: ImageOff, tone: incompleteCount ? 'warn' : undefined, note: incompleteCount ? 'Missing a cover or stack' : 'All complete' },
        ]}
      />

      <Toolbar
        id="projects"
        query={search}
        onQuery={setSearch}
        placeholder="Search title, slug or stack…"
        filters={[
          { value: 'all', label: 'All', count: projects.length },
          { value: 'live', label: 'Live', count: liveCount },
          { value: 'draft', label: 'Draft', count: projects.length - liveCount },
        ]}
        filter={status}
        onFilter={(v) => setStatus(v as StatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="adm-panel">
          <EmptyState
            icon={FolderKanban}
            title={projects.length === 0 ? 'No projects yet' : 'No projects match'}
            body={projects.length === 0 ? 'Create your first case study.' : 'Try a different search or filter.'}
            action={projects.length === 0 && <Link href="/admin/projects/new" className="adm-btn amber">New project</Link>}
          />
        </div>
      ) : (
        <div className="pcard-grid">
          {filtered.map((p) => {
            const done = projectCompleteness(p)
            const cover = p.coverImage || p.logoUrl

            return (
              <article key={p.id} className="pcard">
                <div className={`pcard-media ${cover ? 'has-cover' : ''}`}>
                  {cover ? (
                    // Remote URLs from the uploader; next/image would need per-host config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" loading="lazy" />
                  ) : (
                    <span className="pcard-media-empty" aria-hidden>
                      {p.title.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <div className="pcard-pills">
                    <span className={`adm-pill ${isLive(p) ? 'live' : 'draft'}`}>
                      {isLive(p) ? 'Live' : 'Draft'}
                    </span>
                    {p.featured && <span className="adm-pill feat">Featured</span>}
                  </div>
                </div>

                <div className="pcard-body">
                  <h3 className="pcard-title">
                    {/* Stretched link — the whole card is the click target. */}
                    <Link href={`/admin/projects/${p.id}`} className="pcard-link">
                      {p.title}
                    </Link>
                  </h3>

                  {p.description && <p className="pcard-desc">{p.description}</p>}

                  <div className="pcard-stack adm-mono">{stackLabel(p)}</div>

                  <div className="pcard-foot">
                    <span className={done.ok ? 'pcard-ok' : 'pcard-warn'}>{done.label}</span>
                    {p.updatedAt && <span className="pcard-time">{relativeTime(p.updatedAt)}</span>}
                  </div>
                </div>

                {/* Sits above the stretched link so these stay independently clickable. */}
                <div className="pcard-actions">
                  <Link
                    className="adm-icon-btn"
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    title="View live"
                    aria-label={`View ${p.title} on the public site`}
                  >
                    <ArrowUpRight size={15} />
                  </Link>
                  {/* Deletion is switched off deliberately. The handler stays
                      wired — remove `disabled` to turn it back on. */}
                  <button
                    className="adm-icon-btn danger"
                    onClick={() => handleDelete(p)}
                    disabled
                    title="Deleting projects is disabled"
                    aria-label={`Delete ${p.title} (disabled)`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </AdminShell>
  )
}
