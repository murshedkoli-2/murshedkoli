import { publicProjectSelect, toPublicProject } from '@/lib/projects/public'
import { cached } from '@/lib/cache'
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
 * All functions are server-only and wrapped in `cached` (Next Data Cache +
 * React per-request dedupe), so repeated reads across navigations and renders
 * are served from cache instead of re-hitting the database. See lib/cache.ts.
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
  projectType: string // webapp | android | desktop | api
  status: string // e.g. "SHIPPED · IN PRODUCTION"
  isLive: boolean
  coverImage: string | null
  gallery: string[]
  longDescription: string | null
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
  description: string | null
  fileUrl: string | null
  fileType: string | null
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
    longDescription: string | null
    coverImage: string | null
    gallery: string[]
    technologies: string[]
    techStack: { name: string }[]
    demoUrl: string | null
    clientLiveUrl: string | null
    githubUrl: string | null
    lifecycleStatus: string
    outcome?: string | null
    role?: string | null
    projectType?: string | null
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
    outcome: project.outcome || null,
    stack: stack.slice(0, 6),
    role: project.role || null,
    projectType: project.projectType || 'webapp',
    status: isLive
      ? 'SHIPPED · IN PRODUCTION'
      : `● ${project.lifecycleStatus?.toUpperCase() || 'IN PROGRESS'}`,
    isLive,
    coverImage: project.coverImage,
    gallery: project.gallery ?? [],
    longDescription: project.longDescription || null,
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

export const getProfile = cached('profile', async (): Promise<ProfileView> => {
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

export const getFeaturedProjects = cached('featured-projects', async (max = 4): Promise<FeaturedProject[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published', featured: true },
      select: publicProjectSelect,
      orderBy: publishedOrder,
      take: max,
    })
    return projects.map(toPublicProject).map(mapProjectToSpecSheet)
  } catch (error) {
    console.error('getFeaturedProjects failed:', error)
    return []
  }
})

export const getAllPublishedProjects = cached('all-projects', async (): Promise<FeaturedProject[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published' },
      select: publicProjectSelect,
      orderBy: publishedOrder,
    })
    return projects.map(toPublicProject).map(mapProjectToSpecSheet)
  } catch (error) {
    console.error('getAllPublishedProjects failed:', error)
    return []
  }
})

export const getProjectBySlug = cached('project-by-slug', async (slug: string) => {
  try {
    const project = await prisma.project.findFirst({
      where: { slug, publishStatus: 'published' },
      select: publicProjectSelect,
    })
    return project ? toPublicProject(project) : null
  } catch (error) {
    console.error('getProjectBySlug failed:', error)
    return null
  }
})

export const getAllPublishedSlugs = cached('all-slugs', async (): Promise<string[]> => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published' },
      select: { slug: true },
    })
    return projects.map((p) => p.slug)
  } catch (error) {
    console.error('getAllPublishedSlugs failed:', error)
    return []
  }
})

// ── Skills (grouped into the three Blueprint columns) ───────────────

const SKILL_COLUMNS: { key: string; label: string; categories: string[] }[] = [
  { key: 'frontend', label: 'Frontend', categories: ['frontend', 'ui', 'design'] },
  { key: 'backend', label: 'Backend & Data', categories: ['backend', 'database', 'devops'] },
  { key: 'ai', label: 'AI & Workflow', categories: ['ai', 'ai-workflow', 'tools', 'other'] },
]

export const getSkillsGrouped = cached('skills-grouped', async (max = 16): Promise<SkillColumn[]> => {
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

export const getCertificates = cached('certificates', async (): Promise<CertificateView[]> => {
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
      description: (c as unknown as { description?: string }).description || null,
      fileUrl: (c as unknown as { fileUrl?: string }).fileUrl || null,
      fileType: (c as unknown as { fileType?: string }).fileType || null,
    }))
  } catch (error) {
    console.error('getCertificates failed:', error)
    return []
  }
})

// ── Experience & Education ──────────────────────────────────────────

export const getExperience = cached('experience', async (): Promise<TimelineEntry[]> => {
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

export const getEducation = cached('education', async (): Promise<TimelineEntry[]> => {
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

// ── Services ────────────────────────────────────────────────────────

export interface ServiceView {
  id: string
  title: string
  description: string
  icon: string | null
}

export const getServices = cached('services', async (): Promise<ServiceView[]> => {
  try {
    const services = await prisma.service.findMany({
      where: { isEnabled: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })
    return services.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
    }))
  } catch (error) {
    console.error('getServices failed:', error)
    return []
  }
})

// ── Hero stats (never zero on public paint) ─────────────────────────

export const getHeroStats = cached('hero-stats', async (): Promise<HeroStats> => {
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
