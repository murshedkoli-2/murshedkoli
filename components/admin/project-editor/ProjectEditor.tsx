'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
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
import { CheckCircle2 } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: string
  badge?: number
  hasChanges?: boolean
}

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

  const sidebarItems: TabItem[] = [
    { id: 'overview',  label: 'Overview',   icon: '▤', hasChanges: dirty.overview },
    { id: 'features',  label: 'Features',   icon: '✦', badge: features.length,  hasChanges: dirty.features },
    { id: 'techstack', label: 'Tech Stack', icon: '⬡', badge: techStack.length, hasChanges: dirty.techstack },
  ]

  const saveActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {hasAnyDirty && !isSaving && (
        <span style={{ fontSize: 12, color: '#e8a32b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8a32b', display: 'inline-block' }} />
          Unsaved
        </span>
      )}
      {isSaving && (
        <span style={{ fontSize: 12, color: '#66788f' }}>Saving…</span>
      )}
      <button
        className="adm-btn"
        onClick={handleDownloadMarkdown}
        title="Download AI context markdown"
      >
        AI Context
      </button>
      <button
        className="adm-btn amber"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </div>
  )

  return (
    <AdminShell
      active="projects"
      title={project?.title || 'Edit Project'}
      subtitle={project?.slug ? `/${project.slug}` : undefined}
      actions={saveActions}
    >
      {/* "Just created" success banner */}
      <AnimatePresence>
        {showCreatedBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ marginBottom: 16 }}
          >
            <div style={{ padding: '12px 16px', background: '#e7f7f0', border: '1px solid #a3dfc4', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={16} style={{ color: '#1b9c6e', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#14202e' }}>
                <strong>Project created!</strong>{' '}
                Fill in the details below and click Save.
              </p>
              <button
                onClick={() => setShowCreatedBanner(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#66788f', fontSize: 13 }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section tabs */}
      <div className="adm-editor-tabs">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`adm-editor-tab ${activeSection === item.id ? 'active' : ''}`}
          >
            <span style={{ opacity: 0.7 }}>{item.icon}</span>
            {item.label}
            {item.hasChanges && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8a32b', display: 'inline-block', marginLeft: 4 }} />
            )}
            {item.badge !== undefined && item.badge > 0 && !item.hasChanges && (
              <span className="adm-badge" style={{ background: '#eef1f5', color: '#66788f', borderRadius: 10 }}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 20 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
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
    </AdminShell>
  )
}
