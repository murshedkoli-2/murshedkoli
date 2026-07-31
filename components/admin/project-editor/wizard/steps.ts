import type { CreateProjectInput } from '@/lib/validations/project'

export type StepId =
  | 'type'
  | 'identity'
  | 'story'
  | 'media'
  | 'links'
  | 'features'
  | 'techstack'
  | 'review'

export interface StepMeta {
  id: StepId
  label: string
  hint: string
  /** Steps the user may skip entirely; only Identity holds required fields. */
  optional: boolean
}

export const STEPS: StepMeta[] = [
  { id: 'type', label: 'Type', hint: 'What kind of thing is this?', optional: false },
  { id: 'identity', label: 'Identity', hint: 'Name it and give it a URL.', optional: false },
  { id: 'story', label: 'Story', hint: 'The full write-up. Skippable for now.', optional: true },
  { id: 'media', label: 'Media', hint: 'Cover, logo, and screenshots.', optional: true },
  { id: 'links', label: 'Links', hint: 'Where people can see or clone it.', optional: true },
  { id: 'features', label: 'Features', hint: 'What it does, as a checklist.', optional: true },
  { id: 'techstack', label: 'Tech Stack', hint: 'What it is built with.', optional: true },
  { id: 'review', label: 'Review', hint: 'Check it over, then create.', optional: false },
]

/** Everything the wizard collects, shaped to hand straight to createProject(). */
export type WizardData = Pick<
  CreateProjectInput,
  | 'title' | 'slug' | 'description' | 'longDescription' | 'outcome' | 'role'
  | 'projectType' | 'lifecycleStatus' | 'publishStatus'
  | 'coverImage' | 'logoUrl' | 'gallery'
  | 'techStack' | 'features'
  | 'githubUrl' | 'demoUrl' | 'clientProjectUrl' | 'adminProjectUrl'
  | 'clientLiveUrl' | 'adminLiveUrl' | 'androidDownloadUrl'
  | 'githubUrlEnabled' | 'demoUrlEnabled' | 'clientProjectUrlEnabled'
  | 'adminProjectUrlEnabled' | 'clientLiveUrlEnabled' | 'adminLiveUrlEnabled'
  | 'androidDownloadUrlEnabled'
  | 'featured' | 'order'
>

export const INITIAL_DATA: WizardData = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  outcome: '',
  role: '',
  projectType: 'webapp',
  lifecycleStatus: 'idea',
  publishStatus: 'draft',
  coverImage: '',
  logoUrl: '',
  gallery: [],
  techStack: [],
  features: [],
  githubUrl: '',
  demoUrl: '',
  clientProjectUrl: '',
  adminProjectUrl: '',
  clientLiveUrl: '',
  adminLiveUrl: '',
  androidDownloadUrl: '',
  githubUrlEnabled: true,
  demoUrlEnabled: true,
  clientProjectUrlEnabled: false,
  adminProjectUrlEnabled: false,
  clientLiveUrlEnabled: false,
  adminLiveUrlEnabled: false,
  androidDownloadUrlEnabled: false,
  featured: false,
  order: 0,
}

export const DRAFT_KEY = 'admin:project-wizard-draft'

/** A step counts as "touched" once it holds anything worth keeping. */
export function isStepComplete(id: StepId, d: WizardData): boolean {
  switch (id) {
    case 'type': return Boolean(d.projectType)
    case 'identity': return Boolean(d.title.trim() && d.slug.trim() && d.description.trim())
    case 'story': return Boolean(d.longDescription?.trim() || d.outcome?.trim() || d.role?.trim())
    case 'media': return Boolean(d.coverImage || d.logoUrl || (d.gallery?.length ?? 0) > 0)
    case 'links': return Boolean(d.githubUrl || d.demoUrl || d.clientProjectUrl || d.adminProjectUrl || d.clientLiveUrl || d.adminLiveUrl || d.androidDownloadUrl)
    case 'features': return (d.features?.length ?? 0) > 0
    case 'techstack': return (d.techStack?.length ?? 0) > 0
    case 'review': return false
  }
}

/** Blocks Continue. Only Identity can actually fail. */
export function stepError(id: StepId, d: WizardData): string | null {
  if (id !== 'identity') return null
  if (!d.title.trim()) return 'A project title is required.'
  if (!d.slug.trim()) return 'A URL slug is required.'
  if (!/^[a-z0-9-]+$/.test(d.slug)) return 'Slug may only contain lowercase letters, numbers and hyphens.'
  if (!d.description.trim()) return 'A short description is required.'
  return null
}
