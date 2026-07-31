/**
 * Shared shape for every field group.
 *
 * Field groups render inputs and nothing else — no card, no heading, no save
 * button. The wizard renders one per step; the edit form renders one per
 * section. Chrome belongs to the caller.
 */
export interface FieldGroupProps<T> {
  value: T
  onChange: (patch: Partial<T>) => void
}

export interface IdentityValue {
  title: string
  slug: string
  description: string
}

export interface StoryValue {
  longDescription: string
  outcome: string
  role: string
}

export interface MediaValue {
  coverImage: string
  logoUrl: string
  gallery: string[]
}

/** Mirrors the unions in CreateProjectSchema so field groups stay assignable to it. */
export type LifecycleStatus =
  | 'idea' | 'planning' | 'design' | 'development' | 'testing' | 'deployment' | 'live'

export type PublishStatus = 'draft' | 'published' | 'archived'

export interface StatusValue {
  lifecycleStatus: LifecycleStatus
  publishStatus: PublishStatus
  featured: boolean
  order: number
}

/** The seven optional project URLs, each with its own enable toggle. */
export interface LinksValue {
  githubUrl: string
  demoUrl: string
  clientProjectUrl: string
  adminProjectUrl: string
  clientLiveUrl: string
  adminLiveUrl: string
  androidDownloadUrl: string
  githubUrlEnabled: boolean
  demoUrlEnabled: boolean
  clientProjectUrlEnabled: boolean
  adminProjectUrlEnabled: boolean
  clientLiveUrlEnabled: boolean
  adminLiveUrlEnabled: boolean
  androidDownloadUrlEnabled: boolean
}

export const LIFECYCLE_OPTIONS = [
  { value: 'idea', label: '💡 Idea' },
  { value: 'planning', label: '📋 Planning' },
  { value: 'design', label: '🎨 Design' },
  { value: 'development', label: '💻 Development' },
  { value: 'testing', label: '🧪 Testing' },
  { value: 'deployment', label: '🚀 Deployment' },
  { value: 'live', label: '✅ Live' },
]

export const PUBLISH_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const PROJECT_TYPE_OPTIONS = [
  { value: 'webapp', label: 'Web Application' },
  { value: 'android', label: 'Android App' },
  { value: 'desktop', label: 'Desktop App' },
  { value: 'api', label: 'API / Backend' },
]

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
