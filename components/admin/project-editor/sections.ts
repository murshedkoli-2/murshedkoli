import {
  Type, FileText, Image as ImageIcon, LinkIcon, ListTodo, Hexagon, Radio,
} from 'lucide-react'

export type SectionId =
  | 'identity'
  | 'story'
  | 'media'
  | 'links'
  | 'features'
  | 'techstack'
  | 'status'

export interface SectionMeta {
  id: SectionId
  label: string
  icon: typeof Type
}

export const SECTIONS: SectionMeta[] = [
  { id: 'identity', label: 'Identity', icon: Type },
  { id: 'story', label: 'Story', icon: FileText },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'features', label: 'Features', icon: ListTodo },
  { id: 'techstack', label: 'Tech Stack', icon: Hexagon },
  { id: 'status', label: 'Status', icon: Radio },
]

export function isSectionId(value: string | null): value is SectionId {
  return Boolean(value) && SECTIONS.some(s => s.id === value)
}

interface ProjectLike {
  title?: string
  slug?: string
  description?: string
  longDescription?: string
  outcome?: string
  role?: string
  coverImage?: string
  logoUrl?: string
  gallery?: string[]
  features?: { done?: boolean }[]
  techStack?: { name: string }[]
  publishStatus?: string
  lifecycleStatus?: string
  featured?: boolean
  [key: string]: unknown
}

const LINK_KEYS = [
  'githubUrl', 'demoUrl', 'clientProjectUrl', 'adminProjectUrl',
  'clientLiveUrl', 'adminLiveUrl', 'androidDownloadUrl',
] as const

export interface SectionSummary {
  /** Short status line, e.g. "4 of 7 set". */
  meta: string
  /** Whether this section holds anything yet — drives the amber highlight. */
  filled: boolean
  /** A sentence of actual content, so the card is scannable. */
  preview: string
}

export function summariseSection(id: SectionId, p: ProjectLike): SectionSummary {
  switch (id) {
    case 'identity':
      return {
        meta: p.slug ? `/${p.slug}` : 'no slug',
        filled: Boolean(p.title),
        preview: p.description || 'No short description yet.',
      }

    case 'story': {
      const words = p.longDescription?.trim() ? p.longDescription.trim().split(/\s+/).length : 0
      return {
        meta: words ? `${words} words` : 'empty',
        filled: words > 0,
        preview: p.outcome || p.longDescription || 'No write-up, outcome, or role recorded.',
      }
    }

    case 'media': {
      const count = (p.gallery?.length ?? 0) + (p.coverImage ? 1 : 0) + (p.logoUrl ? 1 : 0)
      const parts = [
        p.coverImage ? 'cover' : null,
        p.logoUrl ? 'logo' : null,
        p.gallery?.length ? `${p.gallery.length} in gallery` : null,
      ].filter(Boolean)
      return {
        meta: count ? `${count} image${count === 1 ? '' : 's'}` : 'no images',
        filled: count > 0,
        preview: parts.length ? parts.join(' · ') : 'No cover image, logo, or screenshots.',
      }
    }

    case 'links': {
      const enabled = LINK_KEYS.filter(k => p[`${k}Enabled`]).length
      const set = LINK_KEYS.filter(k => {
        const v = p[k]
        return typeof v === 'string' && v.trim()
      })
      return {
        meta: `${set.length} of ${LINK_KEYS.length} set`,
        filled: set.length > 0,
        preview: set.length
          ? `${enabled} shown publicly · ${set.map(k => k.replace(/Url$/, '')).join(', ')}`
          : 'No repository or demo links.',
      }
    }

    case 'features': {
      const total = p.features?.length ?? 0
      const done = p.features?.filter(f => f.done).length ?? 0
      return {
        meta: total ? `${done}/${total} done` : 'none',
        filled: total > 0,
        preview: total ? `${total} feature${total === 1 ? '' : 's'} tracked.` : 'No features listed yet.',
      }
    }

    case 'techstack': {
      const names = p.techStack?.map(t => t.name) ?? []
      return {
        meta: names.length ? `${names.length} listed` : 'none',
        filled: names.length > 0,
        preview: names.length ? names.join(', ') : 'No technologies recorded.',
      }
    }

    case 'status':
      return {
        meta: p.publishStatus || 'draft',
        filled: p.publishStatus === 'published',
        preview: [
          `Stage: ${p.lifecycleStatus || 'idea'}`,
          p.featured ? 'Featured on homepage' : 'Not featured',
        ].join(' · '),
      }
  }
}
