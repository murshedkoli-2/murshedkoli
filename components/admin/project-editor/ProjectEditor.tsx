'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft, Save, Download, ExternalLink, Sparkles } from 'lucide-react'

import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/FormElements'
import {
  updateProject,
  updateProjectFeatures,
  updateProjectTechStack,
} from '@/lib/actions/project-actions'
import type { FeatureItemType, TechStackItemType } from '@/lib/validations/project'

import { SectionMap } from './SectionMap'
import { SECTIONS, isSectionId, type SectionId } from './sections'
import { IdentityFields } from './fields/IdentityFields'
import { StoryFields } from './fields/StoryFields'
import { MediaFields } from './fields/MediaFields'
import { LinksFields } from './fields/LinksFields'
import { StatusFields } from './fields/StatusFields'
import { FeaturesTab } from './tabs/FeaturesTab'
import { TechStackTab } from './tabs/TechStackTab'

const EASE = [0.16, 1, 0.3, 1] as const

interface ProjectEditorProps {
  project: any
}

/**
 * Random-access project editing.
 *
 * The landing screen is a section map, not a form — you pick the one thing you
 * came to change. The open section lives in the URL (`?section=media`) so it is
 * linkable and the browser back button returns to the map.
 */
export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sectionParam = searchParams.get('section')
  const active: SectionId | null = isSectionId(sectionParam) ? sectionParam : null
  const justCreated = searchParams.get('created') === '1'

  const [form, setForm] = useState(() => ({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    outcome: project?.outcome || '',
    role: project?.role || '',
    coverImage: project?.coverImage || '',
    logoUrl: project?.logoUrl || '',
    gallery: (project?.gallery as string[]) || [],
    lifecycleStatus: project?.lifecycleStatus || 'idea',
    publishStatus: project?.publishStatus || 'draft',
    featured: project?.featured || false,
    order: project?.order || 0,
    githubUrl: project?.githubUrl || '',
    demoUrl: project?.demoUrl || '',
    clientProjectUrl: project?.clientProjectUrl || '',
    adminProjectUrl: project?.adminProjectUrl || '',
    clientLiveUrl: project?.clientLiveUrl || '',
    adminLiveUrl: project?.adminLiveUrl || '',
    androidDownloadUrl: project?.androidDownloadUrl || '',
    githubUrlEnabled: project?.githubUrlEnabled ?? true,
    demoUrlEnabled: project?.demoUrlEnabled ?? true,
    clientProjectUrlEnabled: project?.clientProjectUrlEnabled ?? false,
    adminProjectUrlEnabled: project?.adminProjectUrlEnabled ?? false,
    clientLiveUrlEnabled: project?.clientLiveUrlEnabled ?? false,
    adminLiveUrlEnabled: project?.adminLiveUrlEnabled ?? false,
    androidDownloadUrlEnabled: project?.androidDownloadUrlEnabled ?? false,
  }))

  const [features, setFeatures] = useState<FeatureItemType[]>(project?.features || [])
  const [techStack, setTechStack] = useState<TechStackItemType[]>(project?.techStack || [])
  const [isSaving, setIsSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [showCreated, setShowCreated] = useState(justCreated)

  useEffect(() => {
    if (!showCreated) return
    const t = setTimeout(() => setShowCreated(false), 8000)
    return () => clearTimeout(t)
  }, [showCreated])

  // Leaving a section with unsaved edits would silently discard them.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const patch = useCallback((p: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...p }))
    setDirty(true)
  }, [])

  const openSection = (id: SectionId) => {
    router.push(`${pathname}?section=${id}`, { scroll: true })
  }

  const backToMap = async () => {
    if (dirty) {
      const ok = await confirmDialog({
        title: 'Discard unsaved changes?',
        description: 'You have edits in this section that have not been saved. Leaving now will lose them.',
        confirmLabel: 'Discard changes',
        cancelLabel: 'Keep editing',
        tone: 'danger',
      })
      if (!ok) return
    }
    setDirty(false)
    router.push(pathname, { scroll: true })
  }

  /** Sends only the fields the open section owns, so sections never clobber each other. */
  const saveSection = async (id: SectionId) => {
    setIsSaving(true)
    try {
      if (id === 'features') {
        const res = await updateProjectFeatures({ projectId: project.id, features })
        if (!res.success) throw new Error(res.error || 'Failed to save features')
      } else if (id === 'techstack') {
        const res = await updateProjectTechStack({ projectId: project.id, techStack })
        if (!res.success) throw new Error(res.error || 'Failed to save tech stack')
      } else {
        const slices: Record<Exclude<SectionId, 'features' | 'techstack'>, (keyof typeof form)[]> = {
          identity: ['title', 'slug', 'description'],
          story: ['longDescription', 'outcome', 'role'],
          media: ['coverImage', 'logoUrl', 'gallery'],
          links: [
            'githubUrl', 'demoUrl', 'clientProjectUrl', 'adminProjectUrl',
            'clientLiveUrl', 'adminLiveUrl', 'androidDownloadUrl',
            'githubUrlEnabled', 'demoUrlEnabled', 'clientProjectUrlEnabled',
            'adminProjectUrlEnabled', 'clientLiveUrlEnabled', 'adminLiveUrlEnabled',
            'androidDownloadUrlEnabled',
          ],
          status: ['lifecycleStatus', 'publishStatus', 'featured', 'order'],
        }
        const payload = Object.fromEntries(slices[id].map(k => [k, form[k]]))
        const res = await updateProject({ id: project.id, ...payload })
        if (!res.success) throw new Error(res.error || 'Failed to save')
      }

      setDirty(false)
      toast.success('Saved')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadMarkdown = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/markdown`)
      if (!response.ok) throw new Error()
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.slug || 'project'}-ai-context.md`
      document.body.appendChild(a); a.click()
      window.URL.revokeObjectURL(url); document.body.removeChild(a)
      toast.success('AI context markdown downloaded')
    } catch {
      toast.error('Failed to download markdown')
    }
  }

  const meta = SECTIONS.find(s => s.id === active)

  const actions = active ? (
    <div className="flex items-center gap-3">
      {dirty && (
        <span
          className="adm-mono hidden sm:flex items-center gap-2"
          style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)' }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }} aria-hidden />
          Unsaved
        </span>
      )}
      <Button onClick={() => saveSection(active)} isLoading={isSaving} leftIcon={!isSaving && <Save size={15} />}>
        {isSaving ? 'Saving…' : 'Save'}
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Button variant="secondary" size="sm" onClick={handleDownloadMarkdown} leftIcon={<Download size={14} />} className="hidden sm:flex">
        AI Context
      </Button>
      {project?.slug && (
        <a
          href={`/projects/${project.slug}`}
          target="_blank"
          rel="noreferrer"
          className="pe-btn pe-btn-secondary pe-btn-sm"
        >
          View <ExternalLink size={13} />
        </a>
      )}
    </div>
  )

  return (
    <AdminShell
      active="projects"
      title={project?.title || 'Edit Project'}
      subtitle={project?.slug ? `/${project.slug}` : undefined}
      actions={actions}
    >
      <div className="max-w-5xl mx-auto w-full pb-24">
        <AnimatePresence>
          {showCreated && !active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-7 overflow-hidden"
            >
              <div
                className="flex items-start sm:items-center gap-4 p-4"
                style={{ background: 'var(--accent-soft)', borderLeft: '2px solid var(--accent)', borderRadius: '0 8px 8px 0' }}
              >
                <Sparkles size={17} style={{ color: 'var(--accent)', flex: 'none', marginTop: 2 }} />
                <div className="flex-1">
                  <h3 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>Project created</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
                    Everything is editable below — open any section to change it.
                  </p>
                </div>
                <button onClick={() => setShowCreated(false)} className="pe-btn pe-btn-ghost pe-btn-sm">
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={active ?? 'map'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {!active ? (
              <SectionMap project={{ ...project, ...form, features, techStack }} onOpen={openSection} />
            ) : (
              <div>
                <button onClick={backToMap} className="pe-btn pe-btn-ghost pe-btn-sm" style={{ marginBottom: 20 }}>
                  <ArrowLeft size={14} />
                  All sections
                </button>

                <h2
                  style={{
                    fontFamily: 'var(--adm-display)',
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    paddingBottom: 16,
                    marginBottom: 24,
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  {meta?.label}
                </h2>

                {active === 'identity' && (
                  <IdentityFields
                    value={{ title: form.title, slug: form.slug, description: form.description }}
                    onChange={patch}
                  />
                )}
                {active === 'story' && (
                  <StoryFields
                    value={{ longDescription: form.longDescription, outcome: form.outcome, role: form.role }}
                    onChange={patch}
                  />
                )}
                {active === 'media' && (
                  <MediaFields
                    value={{ coverImage: form.coverImage, logoUrl: form.logoUrl, gallery: form.gallery }}
                    onChange={patch}
                  />
                )}
                {active === 'links' && <LinksFields value={form} onChange={patch} />}
                {active === 'status' && (
                  <StatusFields
                    value={{
                      lifecycleStatus: form.lifecycleStatus,
                      publishStatus: form.publishStatus,
                      featured: form.featured,
                      order: form.order,
                    }}
                    onChange={patch}
                  />
                )}
                {active === 'features' && (
                  <FeaturesTab
                    features={features}
                    onChange={(f) => { setFeatures(f); setDirty(true) }}
                  />
                )}
                {active === 'techstack' && (
                  <TechStackTab
                    techStack={techStack}
                    onChange={(t) => { setTechStack(t); setDirty(true) }}
                  />
                )}

                <div
                  className="flex items-center justify-between gap-4"
                  style={{ marginTop: 40, paddingTop: 22, borderTop: '1px solid var(--line)' }}
                >
                  <button onClick={backToMap} className="pe-btn pe-btn-secondary pe-btn-md">
                    <ArrowLeft size={15} />
                    Back
                  </button>
                  <Button onClick={() => saveSection(active)} isLoading={isSaving} size="lg" leftIcon={!isSaving && <Save size={16} />}>
                    {isSaving ? 'Saving…' : `Save ${meta?.label}`}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminShell>
  )
}
