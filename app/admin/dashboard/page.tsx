'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'

// ── Types (aligned with the /api/* raw project docs) ────────────────
interface AdminProject {
  id: string
  title: string
  slug: string
  description?: string
  coverImage?: string | null
  logoUrl?: string | null
  technologies?: string[]
  techStack?: { name: string }[]
  publishStatus?: string
  lifecycleStatus?: string
  demoUrl?: string | null
  clientLiveUrl?: string | null
  featured?: boolean
  order?: number
  updatedAt?: string
}

interface AdminMessage {
  id: string
  status: 'unread' | 'read' | 'replied'
  subject?: string
  flaggedAsJob?: boolean
}

interface AdminProfile {
  name?: string
  resume?: string | null
}

interface AdminSkill { id?: string; isEnabled?: boolean }
interface AdminCert { id?: string; url?: string | null }

const MAX_VISIBLE_SKILLS = 16

// ── Helpers ─────────────────────────────────────────────────────────
function relativeTime(iso?: string): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function stackLabel(p: AdminProject): string {
  const fromTech = p.techStack?.map((t) => t.name).filter(Boolean) ?? []
  const stack = fromTech.length ? fromTech : p.technologies ?? []
  if (!stack.length) return '—'
  return stack.slice(0, 3).join(' · ')
}

function isLive(p: AdminProject): boolean {
  return p.publishStatus === 'published'
}

/** Per-project completeness for the table cell. */
function projectCompleteness(p: AdminProject): { ok: boolean; label: string } {
  const missing: string[] = []
  if (!p.coverImage) missing.push('cover')
  const hasStack = (p.techStack?.length ?? 0) > 0 || (p.technologies?.length ?? 0) > 0
  if (!hasStack) missing.push('stack')
  if (missing.length === 0) return { ok: true, label: '✓ Complete' }
  return { ok: false, label: `✗ Missing ${missing.join(' + ')}` }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [skills, setSkills] = useState<AdminSkill[]>([])
  const [certs, setCerts] = useState<AdminCert[]>([])
  const [search, setSearch] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const [projRes, msgRes, profRes, skillRes, certRes] = await Promise.all([
        fetch('/api/projects?all=true'),
        fetch('/api/contact'),
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/certifications'),
      ])
      if (projRes.ok) setProjects(await projRes.json())
      if (msgRes.ok) setMessages(await msgRes.json())
      if (profRes.ok) setProfile(await profRes.json())
      if (skillRes.ok) setSkills(await skillRes.json())
      if (certRes.ok) setCerts(await certRes.json())
    } catch (error) {
      console.error('Dashboard fetch failed:', error)
      toast.error('Could not load dashboard data.')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      router.push('/admin/login')
      return
    }
    setReady(true)
    fetchAll()
  }, [router, fetchAll])

  const unread = useMemo(() => messages.filter((m) => m.status === 'unread').length, [messages])
  const visibleSkills = useMemo(() => skills.filter((s) => s.isEnabled !== false).length, [skills])

  // ── Profile completeness (PRD §7 checker) ─────────────────────────
  const completeness = useMemo(() => {
    const published = projects.filter(isLive)
    const checks: { ok: boolean; label: string; href: string }[] = [
      {
        ok: published.every((p) => Boolean(p.coverImage)),
        label: `${published.filter((p) => !p.coverImage).length} published project(s) missing a cover image`,
        href: '#projects',
      },
      {
        ok: visibleSkills <= MAX_VISIBLE_SKILLS,
        label: `${visibleSkills} skills visible — trim to ${MAX_VISIBLE_SKILLS} or fewer`,
        href: '/admin/manage?tab=skills',
      },
      {
        ok: certs.length === 0 || certs.every((c) => Boolean(c.url)),
        label: `${certs.filter((c) => !c.url).length} certificate(s) missing a verify link`,
        href: '/admin/manage?tab=certifications',
      },
      {
        ok: Boolean(profile?.resume),
        label: 'No résumé file uploaded',
        href: '/admin/manage?tab=profile',
      },
    ]
    const passed = checks.filter((c) => c.ok).length
    const percent = checks.length ? Math.round((passed / checks.length) * 100) : 100
    const issues = checks.filter((c) => !c.ok)
    return { percent, issues }
  }, [projects, visibleSkills, certs, profile])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || stackLabel(p).toLowerCase().includes(q)
    )
  }, [projects, search])

  const resumeName = profile?.resume ? profile.resume.split('/').pop() || 'resume.pdf' : null

  const handleDelete = async (p: AdminProject) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
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
      subtitle="Drag to reorder · changes publish instantly via revalidation"
      badges={{ projects: projects.length, skills: skills.length, certificates: certs.length, messages: unread }}
      actions={
        <>
          <Link href="/" target="_blank" className="adm-btn">
            Preview site ↗
          </Link>
          <Link href="/admin/projects/new" className="adm-btn amber">
            + New project
          </Link>
        </>
      }
    >
      {/* Health strip */}
      <div className="adm-health">
        <div className="adm-card">
          <div className="k">Site status</div>
          <div className="v adm-ok">● Live</div>
          <div className="d adm-ok">Public site is up</div>
        </div>
        <div className="adm-card">
          <div className="k">Profile completeness</div>
          <div className="v">{completeness.percent}%</div>
          <div className={`d ${completeness.issues.length ? 'adm-warn' : 'adm-ok'}`}>
            {completeness.issues.length
              ? `${completeness.issues.length} item(s) need attention`
              : 'All checks passing'}
          </div>
        </div>
        <div className="adm-card">
          <div className="k">New messages</div>
          <div className="v">{unread}</div>
          <div className={`d ${unread ? 'adm-warn' : 'adm-ok'}`}>
            {unread ? 'Awaiting your reply' : `${messages.length} total · inbox clear`}
          </div>
        </div>
        <div className="adm-card">
          <div className="k">Resume</div>
          <div className="v" style={{ fontSize: 15, wordBreak: 'break-all' }}>
            {resumeName || '—'}
          </div>
          <div className="d">
            <Link href="/admin/manage?tab=profile" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {resumeName ? 'replace' : 'upload'}
            </Link>
          </div>
        </div>
      </div>

      {/* Completeness banner */}
      {completeness.issues.length > 0 && (
        <div className="adm-banner">
          <span aria-hidden>⚠</span>
          <div className="fill">
            <b>{completeness.issues.length} item(s) need attention.</b>{' '}
            {completeness.issues[0].label}
            {completeness.issues.length > 1 ? `, +${completeness.issues.length - 1} more.` : '.'}
          </div>
          <Link href={completeness.issues[0].href} className="fix">
            Fix now →
          </Link>
        </div>
      )}

      {/* Projects table */}
      <div className="adm-panel" id="projects">
        <div className="adm-panel-head">
          <h2>All projects ({projects.length})</h2>
          <input
            className="adm-search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 36 }} />
                <th>Project</th>
                <th>Stack</th>
                <th>Status</th>
                <th>Completeness</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="adm-empty">
                    {projects.length === 0 ? 'No projects yet. Create your first one.' : 'No projects match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const done = projectCompleteness(p)
                  const thumb = p.coverImage || p.logoUrl
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="adm-drag" title="Drag to reorder">⠿</span>
                      </td>
                      <td>
                        <div className="adm-proj">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className="adm-thumb" src={thumb} alt="" />
                          ) : (
                            <div className="adm-thumb" />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <b>{p.title}</b>
                            <span>
                              {(p.lifecycleStatus || 'project')}
                              {p.updatedAt ? ` · updated ${relativeTime(p.updatedAt)}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="adm-mono" style={{ fontSize: 12 }}>
                        {stackLabel(p)}
                      </td>
                      <td>
                        <span className={`adm-pill ${isLive(p) ? 'live' : 'draft'}`}>
                          {isLive(p) ? 'Live' : 'Draft'}
                        </span>{' '}
                        {p.featured ? <span className="adm-pill feat">Featured</span> : null}
                      </td>
                      <td style={{ color: done.ok ? 'var(--green)' : 'var(--red)', fontSize: 13 }}>
                        {done.label}
                      </td>
                      <td>
                        <div className="adm-row-actions">
                          <Link className="adm-icon-btn" href={`/admin/projects/${p.id}`} title="Edit">
                            ✎
                          </Link>
                          <Link
                            className="adm-icon-btn"
                            href={`/projects/${p.slug}`}
                            target="_blank"
                            title="View live"
                          >
                            ↗
                          </Link>
                          <button
                            className="adm-icon-btn danger"
                            onClick={() => handleDelete(p)}
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
