'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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

/** Landing screen for the admin panel: the state of the whole site at a glance. */
export default function AdminOverview() {
  const ready = useAdminGuard()
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [skills, setSkills] = useState<AdminSkill[]>([])
  const [certs, setCerts] = useState<AdminCert[]>([])
  const [services, setServices] = useState<AdminService[]>([])
  const [experience, setExperience] = useState<AdminExperience[]>([])
  const [education, setEducation] = useState<AdminExperience[]>([])

  const fetchAll = useCallback(async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/projects?all=true'),
        fetch('/api/contact'),
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/certifications'),
        fetch('/api/services'),
        fetch('/api/experience'),
        fetch('/api/education'),
      ])
      const [projRes, msgRes, profRes, skillRes, certRes, svcRes, expRes, eduRes] = responses
      if (projRes.ok) setProjects(await projRes.json())
      if (msgRes.ok) setMessages(await msgRes.json())
      if (profRes.ok) setProfile(await profRes.json())
      if (skillRes.ok) setSkills(await skillRes.json())
      if (certRes.ok) setCerts(await certRes.json())
      if (svcRes.ok) setServices(await svcRes.json())
      if (expRes.ok) setExperience(await expRes.json())
      if (eduRes.ok) setEducation(await eduRes.json())
    } catch (error) {
      console.error('Overview fetch failed:', error)
      toast.error('Could not load overview data.')
    }
  }, [])

  useEffect(() => {
    if (ready) fetchAll()
  }, [ready, fetchAll])

  const unread = useMemo(() => messages.filter((m) => m.status === 'unread').length, [messages])
  const visibleSkills = useMemo(() => skills.filter((s) => s.isEnabled !== false).length, [skills])
  const liveProjects = useMemo(() => projects.filter(isLive).length, [projects])
  const completeness = useMemo(
    () => buildCompleteness({ projects, skills, certs, profile }),
    [projects, skills, certs, profile]
  )

  const resumeName = profile?.resume ? profile.resume.split('/').pop() || 'resume.pdf' : null

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
        .slice(0, 5),
    [projects]
  )

  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 4),
    [messages]
  )

  /** One card per content type — count, a qualifying stat, and a way in. */
  const inventory = [
    {
      label: 'Projects',
      value: projects.length,
      detail: `${liveProjects} live · ${projects.length - liveProjects} draft`,
      href: '/admin/projects',
    },
    {
      label: 'Skills',
      value: skills.length,
      detail: `${visibleSkills} visible`,
      href: '/admin/skills',
      warn: visibleSkills > MAX_VISIBLE_SKILLS,
    },
    {
      label: 'Services',
      value: services.length,
      detail: services.length ? 'offered' : 'none yet',
      href: '/admin/services',
    },
    {
      label: 'Certificates',
      value: certs.length,
      detail: certs.some((c) => !c.url)
        ? `${certs.filter((c) => !c.url).length} missing a link`
        : certs.length ? 'all verifiable' : 'none yet',
      href: '/admin/certificates',
      warn: certs.some((c) => !c.url),
    },
    {
      label: 'Experience',
      value: experience.length,
      detail: experience.length === 1 ? 'role' : 'roles',
      href: '/admin/experience',
    },
    {
      label: 'Education',
      value: education.length,
      detail: education.length === 1 ? 'qualification' : 'qualifications',
      href: '/admin/education',
    },
    {
      label: 'Messages',
      value: messages.length,
      detail: unread ? `${unread} unread` : 'inbox clear',
      href: '/admin/messages',
      warn: unread > 0,
    },
  ]

  if (!ready) return null

  return (
    <AdminShell
      active="overview"
      title="Overview"
      subtitle={profile?.name ? `Signed in as ${profile.name}` : 'Portfolio at a glance'}
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
            <Link href="/admin/about" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {resumeName ? 'replace' : 'upload'}
            </Link>
          </div>
        </div>
      </div>

      {/* Attention banner */}
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

      {/* Content inventory */}
      <div className="ovw-grid">
        {inventory.map((item) => (
          <Link key={item.label} href={item.href} className="ovw-tile">
            <span className="ovw-tile-label">{item.label}</span>
            <span className="ovw-tile-value">{item.value}</span>
            <span className={`ovw-tile-detail ${item.warn ? 'warn' : ''}`}>{item.detail}</span>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="ovw-columns">
        <div className="adm-panel">
          <div className="adm-panel-head">
            <h2>Recently updated</h2>
            <Link href="/admin/projects" className="adm-linkbtn">All projects →</Link>
          </div>
          <div className="adm-rows">
            {recentProjects.length === 0 ? (
              <div className="adm-empty">No projects yet. Create your first one.</div>
            ) : (
              recentProjects.map((p) => (
                <Link key={p.id} href={`/admin/projects/${p.id}`} className="adm-list-row ovw-row">
                  <div className="grow">
                    <b>{p.title}</b>
                    <div className="sub">
                      {p.lifecycleStatus || 'project'}
                      {p.updatedAt ? ` · updated ${relativeTime(p.updatedAt)}` : ''}
                    </div>
                  </div>
                  <span className={`adm-pill ${isLive(p) ? 'live' : 'draft'}`}>
                    {isLive(p) ? 'Live' : 'Draft'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="adm-panel">
          <div className="adm-panel-head">
            <h2>Latest messages</h2>
            <Link href="/admin/messages" className="adm-linkbtn">Inbox →</Link>
          </div>
          <div className="adm-rows">
            {recentMessages.length === 0 ? (
              <div className="adm-empty">No messages yet.</div>
            ) : (
              recentMessages.map((m) => (
                <Link key={m.id} href="/admin/messages" className="adm-list-row ovw-row">
                  {m.status === 'unread' && <span className="ovw-dot" aria-label="Unread" />}
                  <div className="grow">
                    <b>{m.name || 'Anonymous'}</b>
                    <div className="sub">{m.subject || 'No subject'}</div>
                  </div>
                  <span className="adm-cat">{relativeTime(m.createdAt) || 'just now'}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
