import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { getPublicProfile, getSettingsMap } from '@/lib/site-data'
import type { PublicProfile } from '@/lib/site-data'

/**
 * PRD-shaped, server-only data-access layer (PRD §5/§9 Prompt 2).
 *
 * Every public page reads portfolio content through these functions and
 * nowhere else. Today they map the existing Prisma/MongoDB collections into
 * the "Blueprint" view models; when the Mongoose migration lands, only this
 * file changes — the components stay untouched.
 *
 * All functions are server components only and wrapped in React `cache` so a
 * single request de-dupes repeated reads.
 */

export type ProjectStatus = 'draft' | 'published'

export interface SpecSheetLinks {
  live?: string
  github?: string
  caseStudy: string
}

export interface FeaturedProject {
  id: string
  number: string // "01", "02" …
  title: string
  slug: string
  summary: string
  outcome: string | null
  stack: string[]
  role: string | null
  status: string // e.g. "SHIPPED · IN PRODUCTION"
  isLive: boolean
  coverImage: string | null
  links: SpecSheetLinks
}

export interface SkillColumn {
  key: string
  label: string
  skills: { id: string; name: string }[]
}

export interface CertificateView {
  id: string
  title: string
  issuer: string
  date: string // formatted
  credentialId: string | null
  verifyUrl: string | null
}

export interface TimelineEntry {
  id: string
  title: string
  subtitle: string
  period: string
  current: boolean
  detail: string | null
}

export interface HeroStats {
  projectsShipped: number
  skills: number
  certificates: number
  yearsExperience: number
}

// ── Formatting helpers ──────────────────────────────────────────────

function truncate(text: string, max = 160): string {
  const clean = text.trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

function formatMonthYear(date: Date | null | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function projectIsLive(demoUrl?: string | null, clientLiveUrl?: string | null): boolean {
  return Boolean(demoUrl || clientLiveUrl)
}

function mapProjectToSpecSheet(
  project: {
    id: string
    title: string
    slug: string
    description: string
    coverImage: string | null
    technologies: string[]
    techStack: { name: string }[]
    demoUrl: string | null
    clientLiveUrl: string | null
    githubUrl: string | null
    lifecycleStatus: string
  },
  index: number
): FeaturedProject {
  const stackFromTech = project.techStack?.map((t) => t.name).filter(Boolean) ?? []
  const stack = (stackFromTech.length ? stackFromTech : project.technologies) ?? []
  const live = project.demoUrl || project.clientLiveUrl || undefined
  const isLive = projectIsLive(project.demoUrl, project.clientLiveUrl)

  return {
    id: project.id,
    number: String(index + 1).padStart(2, '0'),
    title: project.title,
    slug: project.slug,
    summary: truncate(project.description, 160),
    // No `outcome` field exists in the legacy schema yet — surfaced as null so
    // the UI shows a clear placeholder instead of inventing a result.
    outcome: null,
    stack: stack.slice(0, 6),
    role: null,
    status: isLive
      ? 'SHIPPED · IN PRODUCTION'
      : `● ${project.lifecycleStatus?.toUpperCase() || 'IN PROGRESS'}`,
    isLive,
    coverImage: project.coverImage,
    links: {
      live,
      github: project.githubUrl || undefined,
      caseStudy: `/projects/${project.slug}`,
    },
  }
}

// ── Profile ─────────────────────────────────────────────────────────

export interface ProfileView extends PublicProfile {
  availability: boolean
  subheadline: string
}

export const getProfile = cache(async (): Promise<ProfileView> => {
  const [profile, settings] = await Promise.all([getPublicProfile(), getSettingsMap()])
  const availabilityRaw = settings.availability ?? settings.availableForWork
  const availability = availabilityRaw === undefined ? true : Boolean(availabilityRaw)
  const subheadline = String(settings.heroSubheadline || profile.description || '')

  return { ...profile, availability, subheadline }
})

// ── Projects ────────────────────────────────────────────────────────

const publishedOrder = [
  { featured: 'desc' as const },
  { order: 'asc' as const },
  { createdAt: 'desc' as const },
]

export const getFeaturedProjects = cache(async (max = 4): Promise<FeaturedProject[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published', featured: true },
      orderBy: publishedOrder,
      take: max,
    })
    return projects.map(mapProjectToSpecSheet)
  } catch (error) {
    console.error('getFeaturedProjects failed:', error)
    return []
  }
})

export const getAllPublishedProjects = cache(async (): Promise<FeaturedProject[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published' },
      orderBy: publishedOrder,
    })
    return projects.map(mapProjectToSpecSheet)
  } catch (error) {
    console.error('getAllPublishedProjects failed:', error)
    return []
  }
})

// ── Skills (grouped into the three Blueprint columns) ───────────────

const SKILL_COLUMNS: { key: string; label: string; categories: string[] }[] = [
  { key: 'frontend', label: 'Frontend', categories: ['frontend', 'ui', 'design'] },
  { key: 'backend', label: 'Backend & Data', categories: ['backend', 'database', 'devops'] },
  { key: 'ai', label: 'AI & Workflow', categories: ['ai', 'ai-workflow', 'tools', 'other'] },
]

export const getSkillsGrouped = cache(async (max = 16): Promise<SkillColumn[]> => {
  try {
    const skills = await prisma.skill.findMany({
      where: { isEnabled: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      take: max,
    })

    return SKILL_COLUMNS.map((col) => ({
      key: col.key,
      label: col.label,
      skills: skills
        .filter((s) => col.categories.includes((s.category || 'other').toLowerCase()))
        .map((s) => ({ id: s.id, name: s.name })),
    })).filter((col) => col.skills.length > 0)
  } catch (error) {
    console.error('getSkillsGrouped failed:', error)
    return []
  }
})

// ── Certificates ────────────────────────────────────────────────────

export const getCertificates = cache(async (): Promise<CertificateView[]> => {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: [{ date: 'desc' }, { order: 'asc' }],
    })
    return certs.map((c) => ({
      id: c.id,
      title: c.name,
      issuer: c.issuer,
      date: formatMonthYear(c.date),
      credentialId: null,
      verifyUrl: c.url || null,
    }))
  } catch (error) {
    console.error('getCertificates failed:', error)
    return []
  }
})

// ── Experience & Education ──────────────────────────────────────────

export const getExperience = cache(async (): Promise<TimelineEntry[]> => {
  try {
    const rows = await prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
    })
    return rows.map((r) => ({
      id: r.id,
      title: r.position,
      subtitle: r.company,
      period: `${formatMonthYear(r.startDate)} — ${r.current ? 'Present' : formatMonthYear(r.endDate)}`,
      current: r.current,
      detail: r.description || null,
    }))
  } catch (error) {
    console.error('getExperience failed:', error)
    return []
  }
})

export const getEducation = cache(async (): Promise<TimelineEntry[]> => {
  try {
    const rows = await prisma.education.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
    })
    return rows.map((r) => ({
      id: r.id,
      title: r.degree,
      subtitle: [r.institution, r.field].filter(Boolean).join(' · '),
      period: `${formatMonthYear(r.startDate)} — ${r.current ? 'Present' : formatMonthYear(r.endDate)}`,
      current: r.current,
      detail: r.description || null,
    }))
  } catch (error) {
    console.error('getEducation failed:', error)
    return []
  }
})

// ── Hero stats (never zero on public paint) ─────────────────────────

export const getHeroStats = cache(async (): Promise<HeroStats> => {
  try {
    const [projectsShipped, skills, certificates, firstExperience] = await Promise.all([
      prisma.project.count({ where: { publishStatus: 'published' } }),
      prisma.skill.count({ where: { isEnabled: true } }),
      prisma.certification.count(),
      prisma.experience.findFirst({ orderBy: { startDate: 'asc' } }),
    ])

    const yearsExperience = firstExperience
      ? Math.max(1, new Date().getFullYear() - firstExperience.startDate.getFullYear())
      : 0

    return { projectsShipped, skills, certificates, yearsExperience }
  } catch (error) {
    console.error('getHeroStats failed:', error)
    return { projectsShipped: 0, skills: 0, certificates: 0, yearsExperience: 0 }
  }
})
