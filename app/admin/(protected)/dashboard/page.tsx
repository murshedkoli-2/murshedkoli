'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import {
  relativeTime,
  isLive,
  buildCompleteness,
  MAX_VISIBLE_SKILLS,
  type AdminProject,
  type AdminMessage,
  type AdminProfile,
  type AdminSkill,
  type AdminCert,
  type AdminService,
  type AdminExperience,
} from '@/lib/admin/portfolio-summary'

const RECENT_PROJECTS = 5
const RECENT_MESSAGES = 5

interface OverviewData {
  projects: AdminProject[]
  messages: AdminMessage[]
  profile: AdminProfile | null
  skills: AdminSkill[]
  certs: AdminCert[]
  services: AdminService[]
  experience: AdminExperience[]
  education: AdminExperience[]
}

const EMPTY: OverviewData = {
  projects: [], messages: [], profile: null, skills: [], certs: [], services: [], experience: [], education: [],
}

const ENDPOINTS: Array<[keyof OverviewData, string]> = [
  ['projects', '/api/projects?all=true'],
  ['messages', '/api/contact'],
  ['profile', '/api/profile'],
  ['skills', '/api/skills'],
  ['certs', '/api/certifications'],
  ['services', '/api/services'],
  ['experience', '/api/experience'],
  ['education', '/api/education'],
]

const byNewest = (a?: string, b?: string) => new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime()

/** Landing screen for the admin panel: the state of the whole site at a glance. */
export default function AdminOverview() {
  const ready = useAdminGuard()
  const [data, setData] = useState<OverviewData>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.all(ENDPOINTS.map(async ([key, url]) => {
        const res = await fetch(url)
        return res.ok ? ([key, await res.json()] as const) : null
      }))
      const received = results.filter((r) => r !== null)
      setData((prev) => ({ ...prev, ...Object.fromEntries(received) }))
      if (received.length < ENDPOINTS.length) toast.error('Some overview data could not be loaded.')
    } catch {
      toast.error('Could not load overview data.')
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) fetchAll()
  }, [ready, fetchAll])

  const { projects, messages, profile, skills, certs, services, experience, education } = data

  const unread = useMemo(() => messages.filter((m) => m.status === 'unread').length, [messages])
  const visibleSkills = useMemo(() => skills.filter((s) => s.isEnabled !== false).length, [skills])
  const liveProjects = useMemo(() => projects.filter(isLive).length, [projects])
  const completeness = useMemo(() => buildCompleteness({ projects, skills, certs, profile }), [projects, skills, certs, profile])
  const recentProjects = useMemo(() => [...projects].sort((a, b) => byNewest(a.updatedAt, b.updatedAt)).slice(0, RECENT_PROJECTS), [projects])
  const recentMessages = useMemo(() => [...messages].sort((a, b) => byNewest(a.createdAt, b.createdAt)).slice(0, RECENT_MESSAGES), [messages])

  const certsMissingLink = certs.filter((c) => !c.url).length
  const drafts = projects.length - liveProjects
  /** Open completeness issues, plus one if there is unread mail. */
  const attention = completeness.issues.length + (unread ? 1 : 0)

  /** One row per content type: count, a qualifying note, and a way in. */
  const inventory = [
    { label: 'Projects', value: projects.length, detail: `${liveProjects} live · ${drafts} draft`, href: '/admin/projects' },
    { label: 'Skills', value: skills.length, detail: `${visibleSkills} visible`, href: '/admin/skills', warn: visibleSkills > MAX_VISIBLE_SKILLS },
    { label: 'Services', value: services.length, detail: services.length ? 'offered' : 'none yet', href: '/admin/services' },
    { label: 'Certificates', value: certs.length, detail: certsMissingLink ? `${certsMissingLink} missing a link` : certs.length ? 'all verifiable' : 'none yet', href: '/admin/certificates', warn: certsMissingLink > 0 },
    { label: 'Experience', value: experience.length, detail: experience.length === 1 ? 'role' : 'roles', href: '/admin/experience' },
    { label: 'Education', value: education.length, detail: education.length === 1 ? 'qualification' : 'qualifications', href: '/admin/education' },
    { label: 'Messages', value: messages.length, detail: unread ? `${unread} unread` : 'inbox clear', href: '/admin/messages', warn: unread > 0 },
  ]

  if (!ready) return null

  const firstName = profile?.name?.trim().split(/\s+/)[0]
  const figure = (value: ReactNode) => (loaded ? value : <span className="dash-skeleton" aria-label="Loading" />)

  return (
    <AdminShell
      active="overview"
      title="Overview"
      subtitle="Portfolio at a glance"
      badges={{ projects: projects.length, skills: skills.length, certificates: certs.length, messages: unread }}
      actions={
        <>
          <Link href="/" target="_blank" className="adm-btn">Preview site ↗</Link>
          <Link href="/admin/projects/new" className="adm-btn amber">New project</Link>
        </>
      }
    >
      <div className="dash">
        <p className="dash-lede">
          {firstName ? `Welcome back, ${firstName}. ` : 'Welcome back. '}
          {!loaded ? 'Checking the site…' : attention === 0
            ? <>Everything is <em>in order</em>.</>
            : <>{attention} thing{attention === 1 ? '' : 's'} could use <em>your attention</em>.</>}
        </p>

        <dl className="dash-figures">
          <div className="dash-figure">
            <dt className="dash-label">Live projects</dt>
            <dd className="dash-figure-value">{figure(<>{liveProjects}<small>/ {projects.length}</small></>)}</dd>
            <dd className="dash-figure-note">{drafts ? `${drafts} still in draft` : 'Nothing in draft'}</dd>
          </div>
          <div className="dash-figure">
            <dt className="dash-label">Unread messages</dt>
            <dd className="dash-figure-value">{figure(unread)}</dd>
            <dd className="dash-figure-note" data-tone={unread ? 'warn' : undefined}>
              {unread ? 'Awaiting your reply' : `${messages.length} total · inbox clear`}
            </dd>
          </div>
          <div className="dash-figure">
            <dt className="dash-label">Completeness</dt>
            <dd className="dash-figure-value">{figure(<>{completeness.percent}<small>%</small></>)}</dd>
            <dd className="dash-meter" aria-hidden="true"><i style={{ transform: `scaleX(${loaded ? completeness.percent / 100 : 0})` }} /></dd>
          </div>
          <div className="dash-figure">
            <dt className="dash-label">Résumé</dt>
            <dd className="dash-figure-value">{figure(profile?.resume ? 'On file' : 'None')}</dd>
            <dd className="dash-figure-note"><Link href="/admin/about">{profile?.resume ? 'Replace file' : 'Upload one'}</Link></dd>
          </div>
        </dl>

        {completeness.issues.length > 0 && (
          <section aria-labelledby="dash-attention">
            <div className="dash-section-head">
              <h2 id="dash-attention">Needs attention</h2>
              <span className="dash-label">{completeness.issues.length} open</span>
            </div>
            {completeness.issues.map((issue) => (
              <Link key={issue.label} href={issue.href} className="dash-row">
                <span className="dash-row-main"><span className="dash-dot" aria-hidden="true" /><span className="dash-row-title">{issue.label}</span></span>
                <span className="dash-row-meta">Fix <ArrowRight size={14} className="dash-row-arrow" aria-hidden="true" /></span>
              </Link>
            ))}
          </section>
        )}

        <section aria-labelledby="dash-content">
          <div className="dash-section-head">
            <h2 id="dash-content">Content</h2>
            <span className="dash-label">{inventory.length} types</span>
          </div>
          {inventory.map((item) => (
            <Link key={item.label} href={item.href} className="dash-row">
              <span className="dash-row-main"><span className="dash-row-title">{item.label}</span></span>
              <span className="dash-row-meta" data-tone={item.warn ? 'warn' : undefined}>
                {loaded && item.detail}
                <span className="dash-row-count">{figure(item.value)}</span>
                <ArrowRight size={14} className="dash-row-arrow" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>

        <div className="dash-columns">
          <section aria-labelledby="dash-recent">
            <div className="dash-section-head">
              <h2 id="dash-recent">Recently updated</h2>
              <Link href="/admin/projects" className="dash-more">All projects →</Link>
            </div>
            {loaded && recentProjects.length === 0 && <div className="dash-empty">No projects yet. Create your first one.</div>}
            {recentProjects.map((p) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="dash-row">
                <span style={{ minWidth: 0 }}>
                  <span className="dash-row-title" style={{ display: 'block' }}>{p.title}</span>
                  <span className="dash-row-sub" style={{ display: 'block' }}>
                    {p.lifecycleStatus || 'project'}{p.updatedAt ? ` · updated ${relativeTime(p.updatedAt)}` : ''}
                  </span>
                </span>
                <span className="dash-status" data-live={isLive(p)}>{isLive(p) ? 'Live' : 'Draft'}</span>
              </Link>
            ))}
          </section>

          <section aria-labelledby="dash-messages">
            <div className="dash-section-head">
              <h2 id="dash-messages">Latest messages</h2>
              <Link href="/admin/messages" className="dash-more">Inbox →</Link>
            </div>
            {loaded && recentMessages.length === 0 && <div className="dash-empty">No messages yet.</div>}
            {recentMessages.map((m) => (
              <Link key={m.id} href="/admin/messages" className="dash-row">
                <span className="dash-row-main">
                  {m.status === 'unread' && <span className="dash-dot" role="img" aria-label="Unread" />}
                  <span style={{ minWidth: 0 }}>
                    <span className="dash-row-title" style={{ display: 'block' }}>{m.name || 'Anonymous'}</span>
                    <span className="dash-row-sub" style={{ display: 'block' }}>{m.subject || 'No subject'}</span>
                  </span>
                </span>
                <span className="dash-row-meta">{relativeTime(m.createdAt) || 'just now'}</span>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </AdminShell>
  )
}
