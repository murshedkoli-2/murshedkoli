/**
 * Shared shapes and helpers for the admin overview and the projects table.
 *
 * Both read the same raw /api/* documents, so the types and the small
 * formatting rules live here rather than being duplicated per page.
 */

export interface AdminProject {
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

export interface AdminMessage {
  id: string
  name?: string
  subject?: string
  status: 'unread' | 'read' | 'replied'
  createdAt?: string
  flaggedAsJob?: boolean
}

export interface AdminProfile {
  name?: string
  resume?: string | null
}

export interface AdminSkill { id?: string; isEnabled?: boolean }
export interface AdminCert { id?: string; url?: string | null }
export interface AdminService { id?: string }
export interface AdminExperience { id?: string }

export const MAX_VISIBLE_SKILLS = 16

export function relativeTime(iso?: string): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function stackLabel(p: AdminProject): string {
  const fromTech = p.techStack?.map((t) => t.name).filter(Boolean) ?? []
  const stack = fromTech.length ? fromTech : p.technologies ?? []
  if (!stack.length) return '—'
  return stack.slice(0, 3).join(' · ')
}

export function isLive(p: AdminProject): boolean {
  return p.publishStatus === 'published'
}

/** Per-project readiness, shown in the projects table. */
export function projectCompleteness(p: AdminProject): { ok: boolean; label: string } {
  const missing: string[] = []
  if (!p.coverImage) missing.push('cover')
  const hasStack = (p.techStack?.length ?? 0) > 0 || (p.technologies?.length ?? 0) > 0
  if (!hasStack) missing.push('stack')
  if (missing.length === 0) return { ok: true, label: '✓ Complete' }
  return { ok: false, label: `✗ Missing ${missing.join(' + ')}` }
}

export interface CompletenessCheck {
  ok: boolean
  label: string
  href: string
}

/**
 * Site-wide readiness checks, surfaced on the overview.
 * Each failing check links to the page that fixes it.
 */
export function buildCompleteness(input: {
  projects: AdminProject[]
  skills: AdminSkill[]
  certs: AdminCert[]
  profile: AdminProfile | null
}): { percent: number; issues: CompletenessCheck[] } {
  const { projects, skills, certs, profile } = input
  const published = projects.filter(isLive)
  const visibleSkills = skills.filter((s) => s.isEnabled !== false).length

  const checks: CompletenessCheck[] = [
    {
      ok: published.every((p) => Boolean(p.coverImage)),
      label: `${published.filter((p) => !p.coverImage).length} published project(s) missing a cover image`,
      href: '/admin/projects',
    },
    {
      ok: visibleSkills <= MAX_VISIBLE_SKILLS,
      label: `${visibleSkills} skills visible — trim to ${MAX_VISIBLE_SKILLS} or fewer`,
      href: '/admin/skills',
    },
    {
      ok: certs.length === 0 || certs.every((c) => Boolean(c.url)),
      label: `${certs.filter((c) => !c.url).length} certificate(s) missing a verify link`,
      href: '/admin/certificates',
    },
    {
      ok: Boolean(profile?.resume),
      label: 'No résumé file uploaded',
      href: '/admin/about',
    },
  ]

  const passed = checks.filter((c) => c.ok).length
  return {
    percent: checks.length ? Math.round((passed / checks.length) * 100) : 100,
    issues: checks.filter((c) => !c.ok),
  }
}
