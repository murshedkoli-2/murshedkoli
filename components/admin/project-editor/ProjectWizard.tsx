'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/FormElements'
import { createProject } from '@/lib/actions/project-actions'
import type { CreateProjectInput } from '@/lib/validations/project'

import { WizardRail } from './wizard/WizardRail'
import { GithubImport } from './wizard/GithubImport'
import { TypeStep } from './wizard/TypeStep'
import { ReviewStep } from './wizard/ReviewStep'
import { STEPS, INITIAL_DATA, DRAFT_KEY, stepError, type StepId, type WizardData } from './wizard/steps'

import { IdentityFields } from './fields/IdentityFields'
import { StoryFields } from './fields/StoryFields'
import { MediaFields } from './fields/MediaFields'
import { LinksFields } from './fields/LinksFields'
import { FeaturesTab } from './tabs/FeaturesTab'
import { TechStackTab } from './tabs/TechStackTab'

const EASE = [0.16, 1, 0.3, 1] as const

/** Text fields the GitHub import may fill — but only while they are still empty. */
const OPTIONAL_IMPORT_FIELDS = [
  'title', 'slug', 'description', 'longDescription', 'coverImage',
] as const satisfies readonly (keyof WizardData)[]

/**
 * Guided project creation.
 *
 * Eight steps, one createProject() call at the end. Nothing hits the database
 * until Review, so the draft is mirrored to localStorage on every change and
 * restored on return — closing the tab mid-way costs nothing.
 */
export function ProjectWizard() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [furthest, setFurthest] = useState(0)
  const [data, setData] = useState<WizardData>(INITIAL_DATA)
  const [isCreating, setIsCreating] = useState(false)
  const [restored, setRestored] = useState(false)
  const [showError, setShowError] = useState(false)

  const step = STEPS[index]
  const error = stepError(step.id, data)
  const isLast = index === STEPS.length - 1

  // Restore after mount so server and client render the same initial markup.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as WizardData
      if (saved && typeof saved === 'object') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrate the persisted draft after SSR to avoid mismatched initial markup.
        setData({ ...INITIAL_DATA, ...saved })
        setRestored(true)
      }
    } catch {
      // A corrupt draft is not worth surfacing; start clean.
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (data === INITIAL_DATA) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    } catch {
      // Storage full or blocked — the wizard still works, just without recovery.
    }
  }, [data])

  const patch = useCallback((p: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...p }))
  }, [])

  const goTo = useCallback((next: number) => {
    setIndex(next)
    setFurthest(f => Math.max(f, next))
    setShowError(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleNext = () => {
    if (error) { setShowError(true); return }
    if (!isLast) goTo(index + 1)
  }

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setData(INITIAL_DATA)
    setRestored(false)
    setIndex(0)
    setFurthest(0)
  }

  const handleCreate = async () => {
    const identityError = stepError('identity', data)
    if (identityError) {
      toast.error(identityError)
      goTo(STEPS.findIndex(s => s.id === 'identity'))
      return
    }

    setIsCreating(true)
    try {
      const result = await createProject({
        ...data,
        title: data.title.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        technologies: [],
        modules: [],
        roadmap: [],
        apiStructure: [],
        databaseDesign: [],
      } as CreateProjectInput)

      if (result.success && result.data) {
        localStorage.removeItem(DRAFT_KEY)
        toast.success('Project created')
        const project = result.data as { id: string }
        router.push(`/admin/projects/${project.id}?created=1`)
      } else {
        toast.error(result.error || 'Failed to create project')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const jumpToStep = (id: StepId) => goTo(STEPS.findIndex(s => s.id === id))

  return (
    <div className="adm-app wiz-app">
      <header className="wiz-topbar">
        <button onClick={() => router.push('/admin/projects')} className="pe-btn pe-btn-ghost pe-btn-sm">
          <ArrowLeft size={15} />
          Projects
        </button>
        <span className="adm-mono wiz-counter">
          Step {index + 1} of {STEPS.length}
        </span>
      </header>

      {/* Mobile progress line — the rail is hidden at this width. */}
      <div className="wiz-progress" aria-hidden>
        <div style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="wiz-body">
        <WizardRail current={index} data={data} furthest={furthest} onJump={goTo} />

        <main className="wiz-main">
          {restored && index === 0 && (
            <div className="wiz-restored">
              <span>Picked up an unfinished draft.</span>
              <button type="button" onClick={discardDraft} className="pe-btn pe-btn-ghost pe-btn-sm">
                Start over
              </button>
            </div>
          )}

          <div className="wiz-head">
            <span className="adm-mono wiz-eyebrow">{step.label}</span>
            <h1 className="wiz-title">{step.hint}</h1>
            {step.optional && <p className="wiz-optional">Optional — you can fill this in later.</p>}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {step.id === 'type' && (
                <TypeStep value={data.projectType ?? 'webapp'} onChange={(v) => patch({ projectType: v as 'webapp' | 'android' | 'desktop' | 'api' })} />
              )}

              {step.id === 'identity' && (
                <>
                  <GithubImport
                    onImport={patch}
                    occupiedFields={OPTIONAL_IMPORT_FIELDS.filter(
                      (k) => String(data[k] ?? '').trim().length > 0
                    )}
                  />
                  <IdentityFields
                    value={{ title: data.title, slug: data.slug, description: data.description }}
                    onChange={patch}
                  />
                </>
              )}

              {step.id === 'story' && (
                <StoryFields
                  value={{
                    longDescription: data.longDescription ?? '',
                    outcome: data.outcome ?? '',
                    role: data.role ?? '',
                  }}
                  onChange={patch}
                />
              )}

              {step.id === 'media' && (
                <MediaFields
                  value={{
                    coverImage: data.coverImage ?? '',
                    logoUrl: data.logoUrl ?? '',
                    gallery: data.gallery ?? [],
                  }}
                  onChange={patch}
                />
              )}

              {step.id === 'links' && (
                <LinksFields
                  value={{
                    githubUrl: data.githubUrl ?? '',
                    demoUrl: data.demoUrl ?? '',
                    clientProjectUrl: data.clientProjectUrl ?? '',
                    adminProjectUrl: data.adminProjectUrl ?? '',
                    clientLiveUrl: data.clientLiveUrl ?? '',
                    adminLiveUrl: data.adminLiveUrl ?? '',
                    androidDownloadUrl: data.androidDownloadUrl ?? '',
                    githubUrlEnabled: data.githubUrlEnabled ?? true,
                    demoUrlEnabled: data.demoUrlEnabled ?? true,
                    clientProjectUrlEnabled: data.clientProjectUrlEnabled ?? false,
                    adminProjectUrlEnabled: data.adminProjectUrlEnabled ?? false,
                    clientLiveUrlEnabled: data.clientLiveUrlEnabled ?? false,
                    adminLiveUrlEnabled: data.adminLiveUrlEnabled ?? false,
                    androidDownloadUrlEnabled: data.androidDownloadUrlEnabled ?? false,
                  }}
                  onChange={patch}
                />
              )}

              {step.id === 'features' && (
                <FeaturesTab
                  features={data.features ?? []}
                  onChange={(features) => patch({ features })}
                />
              )}

              {step.id === 'techstack' && (
                <TechStackTab
                  techStack={data.techStack ?? []}
                  onChange={(techStack) => patch({ techStack })}
                />
              )}

              {step.id === 'review' && (
                <ReviewStep data={data} onChange={patch} onJump={jumpToStep} />
              )}
            </motion.div>
          </AnimatePresence>

          {showError && error && (
            <p className="pe-help err" style={{ marginTop: 18 }}>{error}</p>
          )}

          <footer className="wiz-foot">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="pe-btn pe-btn-secondary pe-btn-md"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            {isLast ? (
              <Button onClick={handleCreate} isLoading={isCreating} size="lg" leftIcon={<Check size={16} />}>
                {isCreating ? 'Creating…' : 'Create Project'}
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg" rightIcon={<ArrowRight size={16} />}>
                Continue
              </Button>
            )}
          </footer>
        </main>
      </div>
    </div>
  )
}
