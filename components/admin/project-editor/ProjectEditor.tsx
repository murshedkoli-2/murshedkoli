'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/FormElements'
import { SaveBar } from './SaveBar'
import { EditorSidebar, SidebarItem } from './EditorSidebar'
import { OverviewTab, OverviewTabHandle } from './tabs/OverviewTab'
import { FeaturesTab } from './tabs/FeaturesTab'
import { TechStackTab } from './tabs/TechStackTab'
import {
  updateProject,
  updateProjectFeatures,
  updateProjectTechStack,
} from '@/lib/actions/project-actions'
import {
  FeatureItemType,
  TechStackItemType,
} from '@/lib/validations/project'
import {
  LayoutDashboard,
  CheckSquare,
  Cpu,
  FileDown,
  CheckCircle2,
} from 'lucide-react'

interface ProjectEditorProps {
  project: any
  isNew?: boolean
}

/** Track dirty (unsaved) state per section */
type DirtyMap = Record<string, boolean>

export function ProjectEditor({ project }: ProjectEditorProps) {
  const searchParams = useSearchParams()
  const justCreated = searchParams.get('created') === '1'

  const [activeSection, setActiveSection] = useState('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [dirty, setDirty] = useState<DirtyMap>({})
  const [showCreatedBanner, setShowCreatedBanner] = useState(justCreated)

  const overviewRef = useRef<OverviewTabHandle>(null)

  // Section data state
  const [features, setFeatures] = useState<FeatureItemType[]>(project?.features || [])
  const [techStack, setTechStack] = useState<TechStackItemType[]>(project?.techStack || [])

  // Helpers
  const markDirty = (section: string) =>
    setDirty(prev => ({ ...prev, [section]: true }))
  const markClean = (section: string) =>
    setDirty(prev => ({ ...prev, [section]: false }))
  const hasAnyDirty = Object.values(dirty).some(Boolean)

  // Auto-dismiss created banner
  useEffect(() => {
    if (showCreatedBanner) {
      const t = setTimeout(() => setShowCreatedBanner(false), 6000)
      return () => clearTimeout(t)
    }
  }, [showCreatedBanner])

  // ── Save handlers ──────────────────────────────────────────────────────────

  const saveOverview = async () => {
    overviewRef.current?.submit()
  }

  const handleOverviewSave = async (data: any) => {
    setIsSaving(true)
    try {
      const result = await updateProject({ id: project.id, ...data })
      if (result.success) {
        setLastSaved(new Date())
        markClean('overview')
        toast.success('Overview saved')
      } else {
        toast.error(result.error || 'Failed to save overview')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const saveFeatures = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectFeatures({ projectId: project.id, features })
      if (result.success) { setLastSaved(new Date()); markClean('features'); toast.success('Features saved') }
      else toast.error(result.error || 'Failed to save features')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  const saveTechStack = async () => {
    setIsSaving(true)
    try {
      const result = await updateProjectTechStack({ projectId: project.id, techStack })
      if (result.success) { setLastSaved(new Date()); markClean('techstack'); toast.success('Tech stack saved') }
      else toast.error(result.error || 'Failed to save tech stack')
    } catch { toast.error('An error occurred') }
    finally { setIsSaving(false) }
  }

  // Dispatch save for the current active section
  const handleSave = () => {
    switch (activeSection) {
      case 'overview':  return saveOverview()
      case 'features':  return saveFeatures()
      case 'techstack': return saveTechStack()
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
      toast.success('AI context markdown downloaded!')
    } catch { toast.error('Failed to download markdown') }
  }

  // ── Sidebar items ──────────────────────────────────────────────────────────

  const sidebarItems: SidebarItem[] = [
    { id: 'overview',  label: 'Overview',   icon: <LayoutDashboard size={16} />, hasChanges: dirty.overview },
    { id: 'features',  label: 'Features',   icon: <CheckSquare size={16} />,     badge: features.length,  hasChanges: dirty.features },
    { id: 'techstack', label: 'Tech Stack', icon: <Cpu size={16} />,             badge: techStack.length, hasChanges: dirty.techstack },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Sticky SaveBar */}
      <SaveBar
        title={project?.title || 'Project'}
        slug={project?.slug}
        isSaving={isSaving}
        hasUnsavedChanges={hasAnyDirty}
        lastSaved={lastSaved}
        onSave={handleSave}
        extraActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadMarkdown}
            leftIcon={<FileDown size={14} />}
            className="text-zinc-500 hover:text-zinc-200 hidden sm:flex"
            title="Download AI context markdown"
          >
            AI Context
          </Button>
        }
      />

      {/* "Just created" success banner */}
      <AnimatePresence>
        {showCreatedBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <p className="text-sm text-emerald-300">
                <strong>Project created!</strong>{' '}
                Now fill in the details below — every section has its own save button in the top bar.
              </p>
              <button
                onClick={() => setShowCreatedBanner(false)}
                className="ml-auto text-emerald-500 hover:text-emerald-300 text-xs"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: sidebar + content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar – desktop only */}
        <div className="hidden lg:block border-r border-zinc-800/60 px-3 shrink-0">
          <EditorSidebar
            items={sidebarItems}
            activeId={activeSection}
            onChange={setActiveSection}
          />
        </div>

        {/* Mobile tab strip – stacks above content on small screens */}
        <div className="lg:hidden w-full bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60 overflow-x-auto shrink-0">
          <div className="flex gap-1 p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeSection === item.id
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {item.icon}
                {item.label}
                {item.hasChanges && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeSection === 'overview' && (
                  <OverviewTab
                    ref={overviewRef}
                    project={project}
                    onUpdate={handleOverviewSave}
                    onAnyChange={() => markDirty('overview')}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'features' && (
                  <FeaturesTab
                    features={features}
                    onChange={(f) => { setFeatures(f); markDirty('features') }}
                    onSave={saveFeatures}
                    isLoading={isSaving}
                  />
                )}

                {activeSection === 'techstack' && (
                  <TechStackTab
                    techStack={techStack}
                    onChange={(t) => { setTechStack(t); markDirty('techstack') }}
                    onSave={saveTechStack}
                    isLoading={isSaving}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
