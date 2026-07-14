# Project System Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full end-to-end overhaul of the portfolio project system — new schema fields, feature point system, server-rendered homepage section, quick-look modal, `/projects/[slug]` detail page, and gallery lightbox.

**Architecture:** Server components handle all data fetching and static rendering; two `'use client'` islands (ProjectModal + GalleryLightbox) handle interactivity. A custom DOM event bridges project card clicks (server) to the modal (client) without prop drilling. The detail page uses `generateStaticParams` for build-time pre-rendering.

**Tech Stack:** Next.js 14 App Router, Prisma/MongoDB, TypeScript, Zod, Framer Motion (existing), React context for modal state, CSS custom properties (Blueprint design system).

---

## File Map

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add `outcome`, `role` to Project; add `storyPoints`, `priorityScore` to FeatureItem |
| `lib/validations/project.ts` | Add new fields to FeatureItemSchema + CreateProjectSchema |
| `lib/data/portfolio.ts` | Update `FeaturedProject`, `mapProjectToSpecSheet`, add `getProjectBySlug` |
| `components/admin/project-editor/tabs/OverviewTab.tsx` | Add `outcome`, `role` inputs + gallery manager |
| `components/admin/project-editor/tabs/FeaturesTab.tsx` | Add SP pill selector + priority stepper + summary bar |
| `components/blueprint/SpecSheets.tsx` | Add click handler to cards; add "All Projects" compact tier |
| `components/blueprint/ProjectModalProvider.tsx` | New — context + DOM event listener |
| `components/blueprint/ProjectModal.tsx` | New — client island modal |
| `components/blueprint/GalleryLightbox.tsx` | New — client island lightbox |
| `app/projects/[slug]/page.tsx` | New — detail page with generateStaticParams + generateMetadata |
| `app/projects/[slug]/ProjectDetailBlueprint.tsx` | New — full detail view component |
| `app/page.tsx` | Add `getAllPublishedProjects`, wrap with `ProjectModalProvider` |
| `app/globals.css` | New Blueprint project/modal/lightbox styles |

---

## Task 1: Schema — Add `outcome`, `role`, `storyPoints`, `priorityScore`

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add fields to schema**

In `prisma/schema.prisma`, update the `Project` model to add after `longDescription`:
```prisma
outcome     String?
role        String?
```

Update the `FeatureItem` embedded type to add:
```prisma
type FeatureItem {
  id          String
  title       String
  description String?
  status      FeatureStatus
  storyPoints Int           @default(1)
  priorityScore Int         @default(5)
  order       Int
}
```

- [ ] **Step 2: Regenerate Prisma client**

Stop the dev server first, then run:
```bash
npx prisma generate
```
Expected output: `✔ Generated Prisma Client`

- [ ] **Step 3: Restart dev server and verify no errors**

```bash
npm run dev
```
Expected: server starts without type errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add outcome, role, storyPoints, priorityScore to project schema"
```

---

## Task 2: Validation Schema — New Fields

**Files:**
- Modify: `lib/validations/project.ts`

- [ ] **Step 1: Update `FeatureItemSchema`**

Replace the existing `FeatureItemSchema`:
```ts
export const FeatureItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Feature title is required'),
  description: z.string().optional(),
  status: FeatureStatus,
  storyPoints: z.number().int().min(1).max(13).default(1),
  priorityScore: z.number().int().min(1).max(10).default(5),
  order: z.number().int().default(0)
})
```

- [ ] **Step 2: Add `outcome` and `role` to `CreateProjectSchema`**

Inside `CreateProjectSchema`, add after `longDescription`:
```ts
outcome: z.string().optional(),
role: z.string().optional(),
```

- [ ] **Step 3: Verify types still export correctly**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add lib/validations/project.ts
git commit -m "feat: add outcome, role, storyPoints, priorityScore to validation schemas"
```

---

## Task 3: Data Layer — Update `FeaturedProject` and Add `getProjectBySlug`

**Files:**
- Modify: `lib/data/portfolio.ts`

- [ ] **Step 1: Add `gallery` and `longDescription` to `FeaturedProject` interface**

Update the `FeaturedProject` interface in `lib/data/portfolio.ts`:
```ts
export interface FeaturedProject {
  id: string
  number: string
  title: string
  slug: string
  summary: string
  outcome: string | null
  stack: string[]
  role: string | null
  status: string
  isLive: boolean
  coverImage: string | null
  gallery: string[]
  longDescription: string | null
  links: SpecSheetLinks
}
```

- [ ] **Step 2: Update `mapProjectToSpecSheet` to map new fields**

Replace the `mapProjectToSpecSheet` function:
```ts
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
```

- [ ] **Step 3: Add `getProjectBySlug` for the detail page**

Add after `getAllPublishedProjects`:
```ts
export const getProjectBySlug = cache(async (slug: string) => {
  try {
    const project = await prisma.project.findFirst({
      where: { slug, publishStatus: 'published' },
    })
    return project
  } catch (error) {
    console.error('getProjectBySlug failed:', error)
    return null
  }
})

export const getAllPublishedSlugs = cache(async (): Promise<string[]> => {
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
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add lib/data/portfolio.ts
git commit -m "feat: update FeaturedProject interface and add getProjectBySlug"
```

---

## Task 4: Admin — OverviewTab: Add `outcome`, `role`, Gallery Manager

**Files:**
- Modify: `components/admin/project-editor/tabs/OverviewTab.tsx`

- [ ] **Step 1: Add `outcome` and `role` to formData state**

Inside `OverviewTab`, update the `useState` initial value to include:
```ts
const [formData, setFormData] = useState({
  // ... existing fields ...
  outcome: project?.outcome || '',
  role: project?.role || '',
  gallery: project?.gallery || [] as string[],
  // ... rest of existing fields ...
})
```

- [ ] **Step 2: Add `outcome` and `role` inputs to the "Content & Descriptions" Section**

Inside the `<Section title="Content & Descriptions">`, add after the long description textarea:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Input
    label="Outcome"
    value={formData.outcome}
    onChange={(e) => handleChange('outcome', e.target.value)}
    placeholder="e.g. Shipped to 12K users · Reduced load time 60%"
  />
  <Input
    label="Your Role"
    value={formData.role}
    onChange={(e) => handleChange('role', e.target.value)}
    placeholder="e.g. Lead Full-Stack Engineer"
  />
</div>
```

- [ ] **Step 3: Add Gallery Manager to the "Media" Section**

Inside `<Section title="Media">`, add after the existing ImageUpload fields:
```tsx
{/* Gallery */}
<div>
  <p className="text-xs text-zinc-400 mb-3">Gallery Images</p>
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
    {(formData.gallery as string[]).map((url, i) => (
      <div key={i} className="relative group aspect-video bg-zinc-800 rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => handleChange('gallery', (formData.gallery as string[]).filter((_, idx) => idx !== i))}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
  <GalleryUploadButton
    onUpload={(url) => handleChange('gallery', [...(formData.gallery as string[]), url])}
  />
</div>
```

- [ ] **Step 4: Create `GalleryUploadButton` above the component**

Add this component above the `OverviewTab` definition:
```tsx
function GalleryUploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) onUpload(data.url)
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="text-xs text-zinc-400 border border-dashed border-zinc-700 rounded-lg px-3 py-2 hover:border-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : '+ Add gallery image'}
      </button>
    </>
  )
}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add components/admin/project-editor/tabs/OverviewTab.tsx
git commit -m "feat: add outcome, role, gallery manager to admin OverviewTab"
```

---

## Task 5: Admin — FeaturesTab: Story Points + Priority Score

**Files:**
- Modify: `components/admin/project-editor/tabs/FeaturesTab.tsx`

- [ ] **Step 1: Update `newFeature` state and `addFeature` to include SP + priority**

Update `newFeature` state:
```ts
const [newFeature, setNewFeature] = useState({
  title: '',
  description: '',
  status: 'planned' as FeatureStatusType,
  storyPoints: 1,
  priorityScore: 5,
})
```

Update `addFeature`:
```ts
const addFeature = () => {
  if (!newFeature.title.trim()) return
  const feature: FeatureItemType = {
    id: generateId(),
    title: newFeature.title,
    description: newFeature.description,
    status: newFeature.status,
    storyPoints: newFeature.storyPoints,
    priorityScore: newFeature.priorityScore,
    order: features.length,
  }
  onChange([...features, feature])
  setNewFeature({ title: '', description: '', status: 'planned', storyPoints: 1, priorityScore: 5 })
}
```

- [ ] **Step 2: Add `StoryPointsPills` and `PriorityScoreStepper` micro-components**

Add these components above `FeaturesTab`:
```tsx
const SP_VALUES = [1, 2, 3, 5, 8, 13] as const

function StoryPointsPills({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider">Story Points</p>
      <div className="flex gap-1 flex-wrap">
        {SP_VALUES.map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => onChange(sp)}
            className={`w-8 h-7 text-xs font-bold rounded transition-colors ${
              value === sp
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {sp}
          </button>
        ))}
      </div>
    </div>
  )
}

function priorityColor(score: number): string {
  if (score <= 3) return 'bg-red-500'
  if (score <= 6) return 'bg-amber-500'
  return 'bg-green-500'
}

function PriorityScoreStepper({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider">Priority</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-bold"
        >
          −
        </button>
        <span className="text-sm font-bold text-white w-4 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-bold"
        >
          +
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${priorityColor(value)}`}
            style={{ width: `${(value / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add summary bar and update the "Progress Overview" card**

Replace the `Card` at the top of the return value with:
```tsx
{/* Summary bar */}
<Card className="!p-4">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
        <Target className="text-purple-400" size={20} />
      </div>
      <div>
        <h3 className="font-medium text-white">Features Progress</h3>
        <p className="text-sm text-gray-400">
          {features.filter((f) => f.status === 'completed').length} of {features.length} completed
        </p>
      </div>
    </div>
    <span className="text-2xl font-bold text-white">{progress}%</span>
  </div>
  <ProgressBar value={progress} showLabel={false} colorClass="from-purple-500 to-pink-500" />
  {features.length > 0 && (
    <div className="flex gap-6 mt-3 pt-3 border-t border-white/[0.06] text-xs text-zinc-400">
      <span>
        <span className="text-white font-semibold">
          {features.reduce((sum, f) => sum + (f.storyPoints ?? 1), 0)}
        </span>{' '}
        total SP
      </span>
      <span>
        <span className="text-white font-semibold">
          {features.length > 0
            ? Math.round(features.reduce((sum, f) => sum + (f.priorityScore ?? 5), 0) / features.length * 10) / 10
            : 0}
        </span>{' '}
        avg priority
      </span>
      <span>
        <span className="text-green-400 font-semibold">
          {features.filter((f) => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) <= 3).length}
        </span>{' '}
        quick wins
      </span>
    </div>
  )}
</Card>
```

- [ ] **Step 4: Add SP/priority controls to the "Add New Feature" form**

Inside the `<Card>` for "Add New Feature", add below the grid:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
  <StoryPointsPills
    value={newFeature.storyPoints}
    onChange={(v) => setNewFeature((prev) => ({ ...prev, storyPoints: v }))}
  />
  <PriorityScoreStepper
    value={newFeature.priorityScore}
    onChange={(v) => setNewFeature((prev) => ({ ...prev, priorityScore: v }))}
  />
</div>
```

- [ ] **Step 5: Add SP/priority controls to the editing inline form for each feature**

Inside the `editingId === feature.id` block, add after the `Select` for status:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <StoryPointsPills
    value={feature.storyPoints ?? 1}
    onChange={(v) => updateFeature(feature.id, { storyPoints: v })}
  />
  <PriorityScoreStepper
    value={feature.priorityScore ?? 5}
    onChange={(v) => updateFeature(feature.id, { priorityScore: v })}
  />
</div>
```

- [ ] **Step 6: Show SP + priority badge on the non-editing view**

In the non-editing branch (`editingId !== feature.id`), add after `StatusBadge`:
```tsx
<span className="text-[10px] font-mono text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5">
  SP {feature.storyPoints ?? 1}
</span>
<span
  className={`w-2 h-2 rounded-full ${priorityColor(feature.priorityScore ?? 5)}`}
  title={`Priority: ${feature.priorityScore ?? 5}/10`}
/>
```

- [ ] **Step 7: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add components/admin/project-editor/tabs/FeaturesTab.tsx
git commit -m "feat: add story points and priority score to features tab"
```

---

## Task 6: Homepage — Add All-Projects Tier to SpecSheets + Click Trigger

**Files:**
- Modify: `components/blueprint/SpecSheets.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update `SpecSheets` to accept all projects and emit open-modal event**

Replace `components/blueprint/SpecSheets.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { SectionHeading } from './primitives'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface SpecSheetsProps {
  projects: FeaturedProject[]
  allProjects: FeaturedProject[]
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bp-spec-row">
      <span className="bp-mono" style={{ color: 'var(--muted)', minWidth: 72 }}>
        {label}
      </span>
      <span className="bp-mono" style={{ color: 'var(--paper)' }}>
        {value}
      </span>
    </div>
  )
}

function openModal(project: FeaturedProject) {
  window.dispatchEvent(new CustomEvent('open-project-modal', { detail: project }))
}

function SpecSheet({ project }: { project: FeaturedProject }) {
  return (
    <article
      className="bp-cell bp-spec-sheet"
      onClick={() => openModal(project)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div className="bp-spec-header">
        <span
          style={{
            fontFamily: 'var(--bp-font-display)',
            fontWeight: 800,
            fontSize: 'var(--bp-fs-num)',
            color: 'var(--amber)',
            lineHeight: 1,
          }}
        >
          {project.number}
        </span>
        <span
          className="bp-mono"
          style={{
            color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            className="bp-dot"
            style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
            aria-hidden
          />
          {project.status}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--bp-font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 1.1rem + 1.4vw, 2.1rem)',
          color: 'var(--paper)',
          margin: '20px 0 12px',
          lineHeight: 1.05,
        }}
      >
        {project.title}
      </h3>

      <p style={{ color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560, marginBottom: 22 }}>
        {project.summary}
      </p>

      <div className="bp-spec-grid">
        <SpecRow label="Stack" value={project.stack.join(' · ') || '—'} />
        <SpecRow label="Role" value={project.role || 'Solo — plan → ship'} />
        <SpecRow label="Outcome" value={project.outcome || 'Case study →'} />
      </div>

      <div className="bp-spec-links" onClick={(e) => e.stopPropagation()}>
        <Link
          href={project.links.caseStudy}
          className="bp-mono"
          style={{ color: 'var(--amber)', textDecoration: 'none' }}
        >
          CASE STUDY →
        </Link>
        {project.links.live ? (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-mono"
            style={{ color: 'var(--paper)', textDecoration: 'none' }}
          >
            LIVE ↗
          </a>
        ) : null}
        {project.links.github ? (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-mono"
            style={{ color: 'var(--paper)', textDecoration: 'none' }}
          >
            SOURCE ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}

function CompactCard({ project }: { project: FeaturedProject }) {
  return (
    <article
      className="bp-cell bp-compact-card"
      onClick={() => openModal(project)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openModal(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          className="bp-mono"
          style={{
            color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
            fontSize: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            className="bp-dot"
            style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)', width: 6, height: 6 }}
            aria-hidden
          />
          {project.status}
        </span>
        <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 11 }}>
          VIEW →
        </span>
      </div>
      <h4
        style={{
          fontFamily: 'var(--bp-font-display)',
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--paper)',
          marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
        {project.title}
      </h4>
      {project.role && (
        <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 8 }}>
          {project.role}
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="bp-mono"
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              border: '1px solid var(--bp-line)',
              padding: '2px 7px',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

export function SpecSheets({ projects, allProjects }: SpecSheetsProps) {
  if (!projects.length && !allProjects.length) return null

  const nonFeatured = allProjects.filter((p) => !projects.find((f) => f.id === p.id))

  return (
    <section id="work" aria-labelledby="work-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading
        eyebrow="Featured Work"
        title="Project spec sheets"
        id="work-heading"
      />
      <div className="bp-spec-list" style={{ marginTop: 40, display: 'grid', gap: 20 }}>
        {projects.map((project) => (
          <SpecSheet key={project.id} project={project} />
        ))}
      </div>

      {nonFeatured.length > 0 && (
        <>
          <div style={{ marginTop: 56, marginBottom: 24, borderTop: '1px solid var(--bp-line)', paddingTop: 32 }}>
            <span className="bp-eyebrow">All Projects · {nonFeatured.length}</span>
          </div>
          <div className="bp-all-projects-grid">
            {nonFeatured.map((project) => (
              <CompactCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Update `app/page.tsx` to fetch all projects and pass to SpecSheets**

Replace the imports and data fetch in `app/page.tsx`:
```tsx
import {
  getProfile,
  getHeroStats,
  getFeaturedProjects,
  getAllPublishedProjects,
  getSkillsGrouped,
  getExperience,
  getEducation,
  getCertificates,
} from '@/lib/data/portfolio'
```

Update the `Promise.all`:
```tsx
const [profile, stats, featured, allProjects, skills, experience, education, certificates] =
  await Promise.all([
    getProfile(),
    getHeroStats(),
    getFeaturedProjects(4),
    getAllPublishedProjects(),
    getSkillsGrouped(16),
    getExperience(),
    getEducation(),
    getCertificates(),
  ])
```

Update the `SpecSheets` usage and wrap page with `ProjectModalProvider`:
```tsx
import { ProjectModalProvider } from '@/components/blueprint/ProjectModalProvider'
// ...
return (
  <div className="blueprint-page">
    <ProjectModalProvider>
      <script ... />
      <Nav resumeUrl={profile.resume} />
      <main>
        <HeroTitleBlock profile={profile} stats={stats} />
        <SpecSheets projects={featured} allProjects={allProjects} />
        <SkillsWithProof columns={skills} />
        <TimelineSection experience={experience} education={education} />
        <CertificatesGrid certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <BlueprintFooter />
    </ProjectModalProvider>
  </div>
)
```

- [ ] **Step 3: Add `.bp-all-projects-grid` and `.bp-compact-card` to `app/globals.css`**

Add before the responsive media queries at the end of globals.css:
```css
.bp-all-projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.bp-compact-card {
  padding: 16px 18px;
  transition: border-color 160ms ease;
}
.bp-compact-card:hover {
  border-color: rgba(146, 180, 215, 0.6);
}
@media (max-width: 860px) {
  .bp-all-projects-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .bp-all-projects-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add components/blueprint/SpecSheets.tsx app/page.tsx app/globals.css
git commit -m "feat: add all-projects tier to homepage, wire modal trigger"
```

---

## Task 7: ProjectModalProvider — Context + DOM Event Bridge

**Files:**
- Create: `components/blueprint/ProjectModalProvider.tsx`

- [ ] **Step 1: Create the provider**

Create `components/blueprint/ProjectModalProvider.tsx`:
```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { ProjectModal } from './ProjectModal'

interface ModalContextValue {
  open: (project: FeaturedProject) => void
  close: () => void
}

const ModalContext = createContext<ModalContextValue>({
  open: () => {},
  close: () => {},
})

export function useProjectModal() {
  return useContext(ModalContext)
}

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<FeaturedProject | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<FeaturedProject>
      setProject(custom.detail)
    }
    window.addEventListener('open-project-modal', handler)
    return () => window.removeEventListener('open-project-modal', handler)
  }, [])

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  const close = () => setProject(null)

  return (
    <ModalContext.Provider value={{ open: (p) => setProject(p), close }}>
      {children}
      {project && <ProjectModal project={project} onClose={close} />}
    </ModalContext.Provider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blueprint/ProjectModalProvider.tsx
git commit -m "feat: add ProjectModalProvider with DOM event bridge"
```

---

## Task 8: ProjectModal — Quick-Look Client Island

**Files:**
- Create: `components/blueprint/ProjectModal.tsx`

- [ ] **Step 1: Create the modal component**

Create `components/blueprint/ProjectModal.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { GalleryLightbox } from './GalleryLightbox'

interface ProjectModalProps {
  project: FeaturedProject
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, lightboxIndex])

  const galleryUrls = project.gallery.map((key) =>
    key.startsWith('certificates/') || key.startsWith('http')
      ? key.startsWith('http') ? key : `/api/upload/certificate/view?key=${encodeURIComponent(key)}`
      : key
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className="bp-modal-backdrop"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="bp-modal-panel" role="dialog" aria-modal aria-label={project.title}>
        {/* Header */}
        <div className="bp-modal-header">
          <div>
            <span className="bp-eyebrow" style={{ marginBottom: 4, display: 'block' }}>
              {project.role || 'Project'}
            </span>
            <h2
              style={{
                fontFamily: 'var(--bp-font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.3rem, 1rem + 1.2vw, 1.8rem)',
                color: 'var(--paper)',
                lineHeight: 1.1,
              }}
            >
              {project.title}
            </h2>
          </div>
          <button className="bp-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="bp-modal-body">
          {/* Cover image */}
          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.title}
              className="bp-modal-cover"
            />
          )}

          {/* Outcome */}
          {project.outcome && (
            <p
              className="bp-mono"
              style={{ color: 'var(--amber)', fontSize: 13, marginBottom: 12 }}
            >
              ✦ {project.outcome}
            </p>
          )}

          {/* Summary */}
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16, fontSize: 14 }}>
            {project.summary}
          </p>

          {/* Gallery thumbnails */}
          {galleryUrls.length > 0 && (
            <div className="bp-modal-gallery">
              {galleryUrls.slice(0, 4).map((url, i) => (
                <button
                  key={i}
                  className="bp-modal-thumb"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View gallery image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${project.title} screenshot ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Stack */}
          {project.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="bp-mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--muted)',
                    border: '1px solid var(--bp-line)',
                    padding: '2px 8px',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span
              className="bp-dot"
              style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
              aria-hidden
            />
            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
              {project.status}
            </span>
          </div>

          {/* Actions */}
          <div className="bp-modal-actions">
            <Link href={project.links.caseStudy} className="bp-btn bp-btn-primary" onClick={onClose}>
              VIEW FULL DETAILS →
            </Link>
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                LIVE ↗
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                SOURCE ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={galleryUrls}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Add modal styles to `app/globals.css`**

```css
/* ── Project Modal ──────────────────────────────────────── */
.bp-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 28, 48, 0.85);
  backdrop-filter: blur(4px);
  z-index: 900;
}
.bp-modal-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: min(520px, 100vw);
  height: 100dvh;
  background: var(--ink-2);
  border-left: 1px solid var(--bp-line);
  z-index: 901;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: slideInRight 200ms ease;
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@media (max-width: 640px) {
  .bp-modal-panel {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 90dvh;
    border-left: none;
    border-top: 1px solid var(--bp-line);
    animation: slideInUp 200ms ease;
  }
  @keyframes slideInUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}
.bp-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 0;
  position: sticky;
  top: 0;
  background: var(--ink-2);
  z-index: 1;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--bp-line);
}
.bp-modal-close {
  background: none;
  border: 1px solid var(--bp-line);
  color: var(--muted);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  transition: color 150ms ease, border-color 150ms ease;
}
.bp-modal-close:hover {
  color: var(--paper);
  border-color: var(--paper);
}
.bp-modal-body {
  padding: 20px 24px 32px;
  flex: 1;
}
.bp-modal-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  margin-bottom: 16px;
  display: block;
}
.bp-modal-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}
.bp-modal-thumb {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--ink);
  border: 1px solid var(--bp-line);
  cursor: pointer;
  padding: 0;
  transition: border-color 150ms ease;
}
.bp-modal-thumb:hover {
  border-color: var(--amber);
}
.bp-modal-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bp-modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add components/blueprint/ProjectModal.tsx app/globals.css
git commit -m "feat: add ProjectModal quick-look client island"
```

---

## Task 9: GalleryLightbox — Client Island

**Files:**
- Create: `components/blueprint/GalleryLightbox.tsx`

- [ ] **Step 1: Create the lightbox**

Create `components/blueprint/GalleryLightbox.tsx`:
```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'

interface GalleryLightboxProps {
  images: string[]
  startIndex: number
  onClose: () => void
}

export function GalleryLightbox({ images, startIndex, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  // Preload adjacent images
  useEffect(() => {
    const preload = (src: string) => { const img = new Image(); img.src = src }
    if (images[current - 1]) preload(images[current - 1])
    if (images[current + 1]) preload(images[current + 1])
  }, [current, images])

  // Touch swipe
  useEffect(() => {
    let startX = 0
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      if (dx > 50) prev()
      else if (dx < -50) next()
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [prev, next])

  return (
    <div className="bp-lightbox" role="dialog" aria-modal aria-label="Image viewer">
      {/* Backdrop */}
      <div className="bp-lightbox-backdrop" onClick={onClose} />

      {/* Top bar */}
      <div className="bp-lightbox-topbar">
        <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 12 }}>
          {current + 1} / {images.length}
        </span>
        <button className="bp-modal-close" onClick={onClose} aria-label="Close lightbox">✕</button>
      </div>

      {/* Main image */}
      <div className="bp-lightbox-main">
        {current > 0 && (
          <button className="bp-lightbox-arrow bp-lightbox-prev" onClick={prev} aria-label="Previous">←</button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="bp-lightbox-img"
        />
        {current < images.length - 1 && (
          <button className="bp-lightbox-arrow bp-lightbox-next" onClick={next} aria-label="Next">→</button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="bp-lightbox-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`bp-lightbox-thumb ${i === current ? 'active' : ''}`}
              aria-label={`Go to image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add lightbox styles to `app/globals.css`**

```css
/* ── Gallery Lightbox ───────────────────────────────────── */
.bp-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.bp-lightbox-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
}
.bp-lightbox-topbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}
.bp-lightbox-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  min-height: 0;
}
.bp-lightbox-img {
  max-height: 85vh;
  max-width: 100%;
  object-fit: contain;
  display: block;
}
.bp-lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 28, 48, 0.8);
  border: 1px solid var(--bp-line);
  color: var(--paper);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: background 150ms ease;
  z-index: 1;
}
.bp-lightbox-arrow:hover { background: var(--ink-2); }
.bp-lightbox-prev { left: 10px; }
.bp-lightbox-next { right: 10px; }
.bp-lightbox-thumbs {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 6px;
  justify-content: center;
  padding: 12px 20px 20px;
  overflow-x: auto;
}
.bp-lightbox-thumb {
  width: 56px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid var(--bp-line);
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: border-color 150ms ease;
}
.bp-lightbox-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bp-lightbox-thumb.active {
  border-color: var(--amber);
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add components/blueprint/GalleryLightbox.tsx app/globals.css
git commit -m "feat: add GalleryLightbox client island with keyboard and swipe navigation"
```

---

## Task 10: `/projects/[slug]` Detail Page

**Files:**
- Create: `app/projects/[slug]/page.tsx`
- Create: `app/projects/[slug]/ProjectDetailBlueprint.tsx`

- [ ] **Step 1: Create `ProjectDetailBlueprint.tsx`**

Create `app/projects/[slug]/ProjectDetailBlueprint.tsx`:
```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GalleryLightbox } from '@/components/blueprint/GalleryLightbox'

interface Feature {
  id: string
  title: string
  description?: string | null
  status: string
  storyPoints?: number
  priorityScore?: number
}

interface RoadmapPhase {
  id: string
  phaseName: string
  description?: string | null
  progress: number
  order: number
}

interface TechItem {
  name: string
  category: string
}

interface Module {
  id: string
  name: string
  description?: string | null
  status: string
  tasks: { id: string; title: string; status: string }[]
}

interface DeploymentInfo {
  platform?: string | null
  domain?: string | null
  environment?: string | null
  ciCd?: string | null
}

export interface ProjectDetailData {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  outcome: string | null
  role: string | null
  coverImage: string | null
  gallery: string[]
  lifecycleStatus: string
  projectType: string
  overallProgress: number
  isLive: boolean
  features: Feature[]
  roadmap: RoadmapPhase[]
  techStack: TechItem[]
  technologies: string[]
  modules: Module[]
  deployment: DeploymentInfo | null
  createdAt: string
  updatedAt: string
  demoUrl: string | null
  githubUrl: string | null
  clientLiveUrl: string | null
  demoUrlEnabled: boolean
  githubUrlEnabled: boolean
  clientLiveUrlEnabled: boolean
}

function priorityDot(score: number) {
  if (score >= 7) return '#63d6a3'
  if (score >= 4) return '#f2b33d'
  return '#e55'
}

function statusIcon(status: string) {
  if (status === 'completed') return '✓'
  if (status === 'in_progress') return '◐'
  return '○'
}

export function ProjectDetailBlueprint({ project }: { project: ProjectDetailData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (id: string) =>
    setExpandedModules((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const totalSP = project.features.reduce((sum, f) => sum + (f.storyPoints ?? 1), 0)
  const quickWins = project.features.filter(
    (f) => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) <= 3
  ).length

  const stack =
    project.techStack?.length
      ? project.techStack
      : project.technologies.map((t) => ({ name: t, category: 'other' }))

  const grouped = stack.reduce<Record<string, string[]>>((acc, t) => {
    const cat = t.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t.name)
    return acc
  }, {})

  const liveUrl =
    (project.demoUrlEnabled && project.demoUrl) ||
    (project.clientLiveUrlEnabled && project.clientLiveUrl) ||
    null

  return (
    <div className="blueprint-page">
      <div className="bp-container" style={{ paddingBlock: 48 }}>
        {/* Breadcrumb */}
        <div className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 32 }}>
          <Link href="/#work" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            WORK
          </Link>
          {' / '}
          <span style={{ color: 'var(--amber)' }}>PROJECT</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          {project.role && (
            <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>
              {project.role}
            </span>
          )}
          <h1
            style={{
              fontFamily: 'var(--bp-font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 1.2rem + 3vw, 3.5rem)',
              color: 'var(--paper)',
              lineHeight: 1.05,
              marginBottom: 12,
            }}
          >
            {project.title}
          </h1>
          {project.outcome && (
            <p
              className="bp-mono"
              style={{ color: 'var(--amber)', fontSize: 14, marginBottom: 16 }}
            >
              ✦ {project.outcome}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span
              className="bp-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: project.isLive ? 'var(--shipped)' : 'var(--muted)',
                fontSize: 12,
              }}
            >
              <span
                className={`bp-dot${project.isLive ? ' bp-dot-live' : ''}`}
                style={{ background: project.isLive ? 'var(--shipped)' : 'var(--muted)' }}
              />
              {project.lifecycleStatus.toUpperCase()}
            </span>
            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
              {project.projectType.toUpperCase()}
            </span>
            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
              {project.overallProgress}% COMPLETE
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-primary">
                LIVE DEMO ↗
              </a>
            )}
            {project.githubUrlEnabled && project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                SOURCE ↗
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="bp-detail-grid">
          {/* Main column */}
          <div className="bp-detail-main">
            {/* About */}
            {project.longDescription && (
              <section style={{ marginBottom: 40 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>About</span>
                {project.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>
                    {para}
                  </p>
                ))}
              </section>
            )}

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 12, display: 'block' }}>
                  Gallery · {project.gallery.length}
                </span>
                <div className="bp-detail-gallery">
                  {project.gallery.map((src, i) => (
                    <button
                      key={i}
                      className="bp-modal-thumb"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${project.title} screenshot ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Features */}
            {project.features.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
                  <span className="bp-eyebrow">Features</span>
                  <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10 }}>
                    {totalSP} SP · {quickWins} quick wins
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {project.features.map((f) => (
                    <div key={f.id} className="bp-cell" style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span
                        style={{
                          color: f.status === 'completed' ? 'var(--shipped)' : 'var(--muted)',
                          fontSize: 14,
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      >
                        {statusIcon(f.status)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ color: 'var(--paper)', fontSize: 13, fontWeight: 600 }}>{f.title}</span>
                        {f.description && (
                          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>
                            {f.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                          className="bp-mono"
                          style={{
                            fontSize: 10,
                            color: 'var(--muted)',
                            border: '1px solid var(--bp-line)',
                            padding: '1px 6px',
                          }}
                        >
                          SP {f.storyPoints ?? 1}
                        </span>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: priorityDot(f.priorityScore ?? 5),
                            flexShrink: 0,
                          }}
                          title={`Priority: ${f.priorityScore ?? 5}/10`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roadmap */}
            {project.roadmap.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 16, display: 'block' }}>Roadmap</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[...project.roadmap].sort((a, b) => a.order - b.order).map((phase) => (
                    <div key={phase.id} className="bp-cell" style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'var(--paper)', fontSize: 13, fontWeight: 600 }}>{phase.phaseName}</span>
                        <span className="bp-mono" style={{ color: 'var(--amber)', fontSize: 11 }}>{phase.progress}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--bp-line)', position: 'relative' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${phase.progress}%`,
                            background: 'var(--amber)',
                            transition: 'width 400ms ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Modules */}
            {project.modules.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 16, display: 'block' }}>Modules & Tasks</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {project.modules.map((mod) => (
                    <div key={mod.id} className="bp-cell">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--paper)',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{mod.name}</span>
                        <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
                          {mod.tasks.length} tasks {expandedModules.has(mod.id) ? '▲' : '▼'}
                        </span>
                      </button>
                      {expandedModules.has(mod.id) && (
                        <div style={{ borderTop: '1px solid var(--bp-line)', padding: '8px 16px 12px' }}>
                          {mod.tasks.map((task) => (
                            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                              <span style={{ color: task.status === 'completed' ? 'var(--shipped)' : 'var(--muted)', fontSize: 12 }}>
                                {statusIcon(task.status)}
                              </span>
                              <span style={{ color: 'var(--muted)', fontSize: 12 }}>{task.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="bp-detail-sidebar">
            {/* Tech Stack */}
            {Object.keys(grouped).length > 0 && (
              <div className="bp-cell" style={{ padding: '18px 20px', marginBottom: 16 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Tech Stack</span>
                {Object.entries(grouped).map(([cat, names]) => (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 10, marginBottom: 6 }}>
                      {cat.toUpperCase()}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {names.map((name) => (
                        <span
                          key={name}
                          className="bp-mono"
                          style={{
                            fontSize: 10,
                            color: 'var(--paper)',
                            border: '1px solid var(--bp-line)',
                            padding: '2px 8px',
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Deployment */}
            {project.deployment && (
              <div className="bp-cell" style={{ padding: '18px 20px', marginBottom: 16 }}>
                <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Deployment</span>
                {[
                  ['Platform', project.deployment.platform],
                  ['Environment', project.deployment.environment],
                  ['Domain', project.deployment.domain],
                  ['CI/CD', project.deployment.ciCd],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</span>
                    <span className="bp-mono" style={{ color: 'var(--paper)', fontSize: 11 }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Project Info */}
            <div className="bp-cell" style={{ padding: '18px 20px' }}>
              <span className="bp-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Project Info</span>
              {[
                ['Type', project.projectType],
                ['Created', new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })],
                ['Updated', new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{label}</span>
                  <span className="bp-mono" style={{ color: 'var(--paper)', fontSize: 11 }}>{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={project.gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/projects/[slug]/page.tsx`**

Create `app/projects/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import { Nav } from '@/components/blueprint/Nav'
import { BlueprintFooter } from '@/components/blueprint/BlueprintFooter'
import { getAllPublishedSlugs, getProjectBySlug, getProfile } from '@/lib/data/portfolio'
import { ProjectDetailBlueprint } from './ProjectDetailBlueprint'

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Murshed Al Main`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, profile] = await Promise.all([
    getProjectBySlug(params.slug),
    getProfile(),
  ])

  if (!project) notFound()

  const isLive = Boolean(
    (project.demoUrlEnabled && project.demoUrl) ||
    (project.clientLiveUrlEnabled && project.clientLiveUrl)
  )

  const data = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    longDescription: project.longDescription,
    outcome: (project as unknown as { outcome?: string }).outcome || null,
    role: (project as unknown as { role?: string }).role || null,
    coverImage: project.coverImage,
    gallery: project.gallery,
    lifecycleStatus: project.lifecycleStatus,
    projectType: project.projectType || 'webapp',
    overallProgress: project.overallProgress,
    isLive,
    features: project.features as unknown as any[],
    roadmap: project.roadmap as unknown as any[],
    techStack: project.techStack as unknown as any[],
    technologies: project.technologies,
    modules: project.modules as unknown as any[],
    deployment: project.deployment as unknown as any,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    clientLiveUrl: project.clientLiveUrl,
    demoUrlEnabled: project.demoUrlEnabled,
    githubUrlEnabled: project.githubUrlEnabled,
    clientLiveUrlEnabled: project.clientLiveUrlEnabled,
  }

  return (
    <div className="blueprint-page">
      <Nav resumeUrl={profile.resume} />
      <main>
        <ProjectDetailBlueprint project={data} />
      </main>
      <BlueprintFooter />
    </div>
  )
}
```

- [ ] **Step 3: Add detail page grid styles to `app/globals.css`**

```css
/* ── Project Detail Page ────────────────────────────────── */
.bp-detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: start;
}
.bp-detail-main {
  min-width: 0;
}
.bp-detail-sidebar {
  position: sticky;
  top: 24px;
}
.bp-detail-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
@media (max-width: 860px) {
  .bp-detail-grid { grid-template-columns: 1fr; }
  .bp-detail-sidebar { position: static; }
}
@media (max-width: 640px) {
  .bp-detail-gallery { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit --pretty false
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add app/projects/ app/globals.css
git commit -m "feat: add /projects/[slug] detail page in Blueprint style"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```
Expected: Build completes successfully with no type errors. Static pages for `/projects/[slug]` pre-rendered.

- [ ] **Step 2: Check homepage**
- Visit `http://localhost:3000`
- Featured projects show with `outcome` and `role` from DB (or fallback text)
- Non-featured published projects appear in 3-column grid below
- Clicking any card opens the quick-look modal
- Modal slides in from right, ESC closes it

- [ ] **Step 3: Check modal**
- Gallery thumbnails appear (if project has gallery images)
- Clicking thumbnail opens lightbox
- Lightbox: arrow keys navigate, ESC closes, thumbnail strip works
- "VIEW FULL DETAILS →" navigates to `/projects/[slug]`

- [ ] **Step 4: Check detail page**
- Visit `/projects/[your-slug]`
- Hero shows title, outcome, role, status, progress
- Gallery section renders thumbnails, lightbox opens on click
- Features list shows SP tags and priority dots
- Roadmap shows progress bars
- Sidebar shows tech stack grouped by category

- [ ] **Step 5: Check admin**
- Visit `/admin/projects/[id]`
- Overview tab has `outcome` and `role` inputs
- Overview tab has gallery upload zone
- Features tab has SP pill selector and priority stepper
- Summary bar shows total SP, avg priority, quick wins

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete project system overhaul — modal, lightbox, detail page, point system"
```
