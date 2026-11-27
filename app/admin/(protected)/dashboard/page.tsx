'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Award, Briefcase, FolderKanban, GraduationCap, Hexagon, Layers, Mail, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { pipelineSegments } from '@/lib/admin/overview'
import { StatStrip, type Stat } from '@/components/admin/kit/StatStrip'
import { WelcomeTile } from '@/components/admin/overview/WelcomeTile'
import { ReadinessRing } from '@/components/admin/overview/ReadinessRing'
import { ContentMap, type ContentTile } from '@/components/admin/overview/ContentMap'
import { RecentProjects, LatestMessages } from '@/components/admin/overview/ActivityLists'
import {
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

const RECENT_PROJECTS = 6
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
  const pipeline = useMemo(() => pipelineSegments(projects), [projects])

  const tiles: ContentTile[] = [
    { label: 'Projects', value: projects.length, detail: `${liveProjects} live · ${drafts} draft`, href: '/admin/projects', icon: FolderKanban },
    { label: 'Skills', value: skills.length, detail: `${visibleSkills} visible`, href: '/admin/skills', icon: Hexagon, warn: visibleSkills > MAX_VISIBLE_SKILLS },
    { label: 'Services', value: services.length, detail: services.length ? 'offered' : 'none yet', href: '/admin/services', icon: Layers },
    { label: 'Certificates', value: certs.length, detail: certsMissingLink ? `${certsMissingLink} missing a link` : certs.length ? 'all verifiable' : 'none yet', href: '/admin/certificates', icon: Award, warn: certsMissingLink > 0 },
    { label: 'Experience', value: experience.length, detail: experience.length === 1 ? 'role' : 'roles', href: '/admin/experience', icon: Briefcase },
    { label: 'Education', value: education.length, detail: education.length === 1 ? 'qualification' : 'qualifications', href: '/admin/education', icon: GraduationCap },
    { label: 'Messages', value: messages.length, detail: unread ? `${unread} unread` : 'inbox clear', href: '/admin/messages', icon: Mail, warn: unread > 0 },
  ]

  const stats: Stat[] = [
    { label: 'Live projects', value: liveProjects, icon: Rocket, tone: 'good', note: drafts ? `${drafts} still in draft` : 'Nothing in draft' },
    { label: 'Unread', value: unread, icon: Mail, tone: unread ? 'warn' : undefined, note: unread ? 'Awaiting your reply' : 'Inbox clear' },
    { label: 'Visible skills', value: visibleSkills, icon: Hexagon, tone: visibleSkills > MAX_VISIBLE_SKILLS ? 'warn' : undefined, note: `Aim for ${MAX_VISIBLE_SKILLS} or fewer` },
    { label: 'Certificates', value: certs.length, icon: Award, tone: 'accent', note: certsMissingLink ? `${certsMissingLink} missing a link` : 'All verifiable' },
  ]

  if (!ready) return null

  const firstName = profile?.name?.trim().split(/\s+/)[0]

  return (
    <AdminShell
      active="overview"
      title="Overview"
      subtitle="Your portfolio at a glance"
      badges={{ projects: projects.length, skills: skills.length, certificates: certs.length, messages: unread }}
    >
      <div className="ov">
        <WelcomeTile firstName={firstName} loaded={loaded} attention={attention} unread={unread} />
        <ReadinessRing percent={completeness.percent} issues={completeness.issues} loaded={loaded} />
        <div className="ov-stats">
          <StatStrip stats={stats} />
        </div>
        <ContentMap tiles={tiles} pipeline={pipeline} loaded={loaded} />
        <RecentProjects projects={recentProjects} loaded={loaded} />
        <LatestMessages messages={recentMessages} loaded={loaded} />
      </div>
    </AdminShell>
  )
}
