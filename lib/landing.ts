/**
 * Pure helpers for the landing page. Kept free of React so they can be
 * unit-tested in the node test environment.
 */
import type { SocialLinks } from '@/lib/site-data'
import type { ServiceView } from '@/lib/data/portfolio'

export const DEFAULT_PORTRAIT = '/images/hero-portrait.jpg'
/** Older uploads pointed at this low-res file; treat it as "no portrait". */
const LEGACY_PORTRAIT = 'murshed.jpg'

const TYPE_LABELS: Record<string, string> = {
  webapp: 'Web app',
  android: 'Android',
  desktop: 'Desktop',
  api: 'API',
  ios: 'iOS',
}

export function typeLabel(type: string): string {
  const key = type.trim().toLowerCase()
  if (!key) return 'Project'
  if (TYPE_LABELS[key]) return TYPE_LABELS[key]
  const words = key.replace(/[-_]+/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export interface ProjectFilter {
  key: string
  label: string
  count: number
}

interface Typed {
  projectType: string
}

/** Filter chips for the work index. Empty when filtering would be pointless. */
export function projectFilters(projects: readonly Typed[]): ProjectFilter[] {
  const counts = projects.reduce<Record<string, number>>(
    (acc, p) => ({ ...acc, [p.projectType]: (acc[p.projectType] ?? 0) + 1 }),
    {},
  )
  const types = Object.entries(counts)
  if (types.length < 2) return []

  const byCount = [...types]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => ({ key, label: typeLabel(key), count }))

  return [{ key: 'all', label: 'All', count: projects.length }, ...byCount]
}

export function filterProjects<T extends Typed>(projects: readonly T[], key: string): T[] {
  return key === 'all' ? [...projects] : projects.filter((p) => p.projectType === key)
}

export interface Figure {
  label: string
  value: number
}

interface StatsInput {
  projectsShipped: number
  yearsExperience: number
  skills: number
  certificates: number
}

export function buildFigures(stats: StatsInput): Figure[] {
  return [
    { label: 'Projects shipped', value: stats.projectsShipped },
    { label: 'Years building', value: stats.yearsExperience },
    { label: 'Technologies', value: stats.skills },
    { label: 'Certificates', value: stats.certificates },
  ].filter((f) => f.value > 0)
}

export function pickPortrait(profile: { heroPortrait?: string | null }): string {
  const src = profile.heroPortrait
  return src && !src.includes(LEGACY_PORTRAIT) ? src : DEFAULT_PORTRAIT
}

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  website: 'Website',
}

export interface SocialEntry {
  key: string
  label: string
  url: string
}

export function socialEntries(links: SocialLinks | undefined): SocialEntry[] {
  if (!links) return []
  return (Object.entries(links) as [keyof SocialLinks, string | undefined][])
    .filter((entry): entry is [keyof SocialLinks, string] => Boolean(entry[1]))
    .map(([key, url]) => ({ key, label: SOCIAL_LABELS[key] ?? key, url }))
}

/** 1 at distance 0, eased smoothly to 0 at `radius` and beyond. */
export function proximity(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0
  const t = 1 - Math.max(0, distance) / radius
  return t * t * (3 - 2 * t)
}

/** Shown until at least MIN_SERVICES services are published from the admin panel. */
export const DEFAULT_SERVICES: readonly ServiceView[] = [
  { id: 'frontend', icon: null, title: 'Frontend engineering', description: 'Responsive, accessible interfaces in React and Next.js, with strict TypeScript contracts and fluid interactions.' },
  { id: 'backend', icon: null, title: 'Backend systems & APIs', description: 'Node.js services, REST API design, background jobs, webhooks and secure authentication.' },
  { id: 'database', icon: null, title: 'Database architecture', description: 'MongoDB schema modelling, aggregation pipelines, indexing and low-latency caching.' },
  { id: 'dashboards', icon: null, title: 'Admin & operational dashboards', description: 'Internal tools with role-based access, data visualisation, exports and workflow management.' },
  { id: 'saas', icon: null, title: 'SaaS platforms', description: 'Multi-tenant foundations with customer lifecycle flows, subscription billing and transactional email.' },
  { id: 'ai', icon: null, title: 'AI integration', description: 'Generative content pipelines, document analysis and streaming endpoints built into real products.' },
]
const MIN_SERVICES = 3

export function servicesOrDefault(published: readonly ServiceView[]): ServiceView[] {
  return [...(published.length >= MIN_SERVICES ? published : DEFAULT_SERVICES)]
}
