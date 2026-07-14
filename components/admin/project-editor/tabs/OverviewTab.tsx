'use client'

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import { Input, Textarea, Select, Card } from '@/components/ui/FormElements'
import { CircularProgress } from '@/components/ui/Progress'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { getLifecycleStatusInfo, getFeatureStats, getTaskStats, formatDate } from '@/lib/utils/project-helpers'
import { ProjectLifecycleStatusType } from '@/lib/validations/project'
import {
  Github, ExternalLink, Globe, Link as LinkIcon,
  Smartphone, Calendar, Clock, Target, ListTodo,
  TrendingUp, ChevronDown,
} from 'lucide-react'
import { AIGenerateButton } from '@/components/AIGenerateButton'

export interface OverviewTabHandle {
  submit: () => void
}

interface OverviewTabProps {
  project: any
  onUpdate: (data: any) => void
  onAnyChange?: () => void
  isLoading?: boolean
}

// ────────────────────────────────────────────────────────────────────────────
// Link table config
// ────────────────────────────────────────────────────────────────────────────
const LINK_FIELDS = [
  {
    key: 'githubUrl', enabledKey: 'githubUrlEnabled',
    label: 'GitHub Repo', icon: Github,
    placeholder: 'https://github.com/user/repo',
    group: 'primary',
  },
  {
    key: 'demoUrl', enabledKey: 'demoUrlEnabled',
    label: 'Live Demo', icon: ExternalLink,
    placeholder: 'https://demo.example.com',
    group: 'primary',
  },
  {
    key: 'clientProjectUrl', enabledKey: 'clientProjectUrlEnabled',
    label: 'Client Project', icon: Globe,
    placeholder: 'https://client-project.com',
    group: 'project',
  },
  {
    key: 'adminProjectUrl', enabledKey: 'adminProjectUrlEnabled',
    label: 'Admin Project', icon: LinkIcon,
    placeholder: 'https://admin-project.com',
    group: 'project',
  },
  {
    key: 'clientLiveUrl', enabledKey: 'clientLiveUrlEnabled',
    label: 'Client Live', icon: ExternalLink,
    placeholder: 'https://client-live.com',
    group: 'live',
  },
  {
    key: 'adminLiveUrl', enabledKey: 'adminLiveUrlEnabled',
    label: 'Admin Live', icon: ExternalLink,
    placeholder: 'https://admin.live.com',
    group: 'live',
  },
  {
    key: 'androidDownloadUrl', enabledKey: 'androidDownloadUrlEnabled',
    label: 'Android Download', icon: Smartphone,
    placeholder: 'https://play.google.com/store/...',
    group: 'mobile',
  },
] as const

// ────────────────────────────────────────────────────────────────────────────
// Toggle Switch micro-component
// ────────────────────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative w-8 h-4.5 rounded-full transition-colors duration-200 shrink-0
        ${checked ? 'bg-blue-600' : 'bg-zinc-700'}
      `}
      style={{ height: '18px' }}
    >
      <span
        className={`
          absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow
          transition-transform duration-200
          ${checked ? 'translate-x-[14px]' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Section Accordion wrapper
// ────────────────────────────────────────────────────────────────────────────
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-semibold text-zinc-200">{title}</span>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 space-y-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// GalleryUploadButton
// ────────────────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────────────
// OverviewTab
// ────────────────────────────────────────────────────────────────────────────
export const OverviewTab = forwardRef<OverviewTabHandle, OverviewTabProps>(
  ({ project, onUpdate, onAnyChange, isLoading }, ref) => {
    const formRef = useRef<HTMLFormElement>(null)

    const [formData, setFormData] = useState({
      title: project?.title || '',
      slug: project?.slug || '',
      description: project?.description || '',
      longDescription: project?.longDescription || '',
      projectType: project?.projectType || 'webapp',
      lifecycleStatus: project?.lifecycleStatus || 'idea',
      publishStatus: project?.publishStatus || 'draft',
      coverImage: project?.coverImage || '',
      logoUrl: project?.logoUrl || '',
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
      featured: project?.featured || false,
      order: project?.order || 0,
      outcome: project?.outcome || '',
      role: project?.role || '',
      gallery: (project?.gallery as string[]) || [] as string[],
    })

    // Expose submit method to parent via ref
    useImperativeHandle(ref, () => ({
      submit: () => formRef.current?.requestSubmit(),
    }))

    const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      onAnyChange?.()
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onUpdate(formData)
    }

    const statusInfo = getLifecycleStatusInfo(formData.lifecycleStatus as ProjectLifecycleStatusType)
    const featureStats = project?.features ? getFeatureStats(project.features) : { total: 0, completed: 0 }
    const taskStats = project?.modules ? getTaskStats(project.modules) : { total: 0, completed: 0 }

    const lifecycleOptions = [
      { value: 'idea', label: '💡 Idea' },
      { value: 'planning', label: '📋 Planning' },
      { value: 'design', label: '🎨 Design' },
      { value: 'development', label: '💻 Development' },
      { value: 'testing', label: '🧪 Testing' },
      { value: 'deployment', label: '🚀 Deployment' },
      { value: 'live', label: '✅ Live' },
    ]
    const publishOptions = [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ]
    const projectTypeOptions = [
      { value: 'webapp', label: 'Web Application' },
      { value: 'android', label: 'Android App' },
      { value: 'desktop', label: 'Desktop App' },
      { value: 'api', label: 'API / Backend' },
    ]

    return (
      <div className="space-y-4">
        {/* Stats strip (existing projects only) */}
        {project?.id && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {[
              {
                label: 'Progress',
                value: `${project.overallProgress || 0}%`,
                el: <CircularProgress value={project.overallProgress || 0} size={40} />,
              },
              {
                label: 'Features',
                value: `${featureStats.completed}/${featureStats.total}`,
                icon: Target,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
              },
              {
                label: 'Tasks',
                value: `${taskStats.completed}/${taskStats.total}`,
                icon: ListTodo,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
              },
              {
                label: 'Stage',
                value: statusInfo.label,
                icon: TrendingUp,
                color: statusInfo.color,
                bg: statusInfo.bgColor,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3"
              >
                {stat.el
                  ? stat.el
                  : stat.icon && (
                      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                        <stat.icon className={stat.color} size={18} />
                      </div>
                    )}
                <div>
                  <p className="text-[11px] text-zinc-500">{stat.label}</p>
                  <p className={`text-sm font-semibold ${stat.color || 'text-white'}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* ── Identity ── */}
          <Section title="Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={
                  <div className="flex items-center justify-between w-full">
                    <span>
                      Project Title <span className="text-red-500">*</span>
                    </span>
                    <AIGenerateButton
                      onGenerate={(text) => handleChange('title', text)}
                      promptContext={{ field: 'Project Title', contextData: { title: formData.title, description: formData.description } }}
                      className="!p-1 scale-75 origin-right"
                    />
                  </div>
                }
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="My Awesome Project"
                required
              />
              <Input
                label="URL Slug *"
                value={formData.slug}
                onChange={(e) =>
                  handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                }
                placeholder="my-awesome-project"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-end">
              <Select
                label="Project Type"
                value={formData.projectType}
                onChange={(e) => handleChange('projectType', e.target.value)}
                options={projectTypeOptions}
              />
              <Input
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
              />
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                      Featured
                    </p>
                    <p className="text-xs text-zinc-600">Show on homepage</p>
                  </div>
                </label>
              </div>
            </div>
          </Section>

          {/* ── Content ── */}
          <Section title="Content & Descriptions">
            <Textarea
              label={
                <div className="flex items-center justify-between w-full">
                  <span>Short Description (SEO) <span className="text-red-500">*</span></span>
                  <AIGenerateButton
                    onGenerate={(text) => handleChange('description', text)}
                    promptContext={{ field: 'Short Description', contextData: { title: formData.title, description: formData.description } }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="A concise description of what this project does…"
              rows={2}
              required
            />

            <Textarea
              label={
                <div className="flex items-center justify-between w-full">
                  <span>Long Description (Markdown / AI Crawler)</span>
                  <AIGenerateButton
                    onGenerate={(text) => handleChange('longDescription', text)}
                    promptContext={{ field: 'Long Description', contextData: { title: formData.title, description: formData.description } }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              value={formData.longDescription}
              onChange={(e) => handleChange('longDescription', e.target.value)}
              placeholder="Detailed description with features, goals, tech highlights…"
              rows={6}
            />

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
          </Section>

          {/* ── Status ── */}
          <Section title="Status & Visibility">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Lifecycle Stage"
                value={formData.lifecycleStatus}
                onChange={(e) => handleChange('lifecycleStatus', e.target.value)}
                options={lifecycleOptions}
              />
              <Select
                label="Publish Status"
                value={formData.publishStatus}
                onChange={(e) => handleChange('publishStatus', e.target.value)}
                options={publishOptions}
              />
            </div>
          </Section>

          {/* ── Media ── */}
          <Section title="Media">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUpload
                label="Cover Image"
                value={formData.coverImage}
                onChange={(url) => handleChange('coverImage', url)}
                previewSize="large"
              />
              <ImageUpload
                label="Logo"
                value={formData.logoUrl}
                onChange={(url) => handleChange('logoUrl', url)}
                previewSize="medium"
              />
            </div>

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
          </Section>

          {/* ── Links ── */}
          <Section title="Project Links" defaultOpen={false}>
            <p className="text-xs text-zinc-600 -mt-1 mb-2">
              Toggle a link on to enable it. Disabled links won't appear on the public page.
            </p>

            <div className="divide-y divide-zinc-800/60 rounded-lg border border-zinc-800/60 overflow-hidden">
              {LINK_FIELDS.map((field) => {
                const enabled = formData[field.enabledKey as keyof typeof formData] as boolean
                const value = formData[field.key as keyof typeof formData] as string
                const Icon = field.icon
                return (
                  <div
                    key={field.key}
                    className={`flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 transition-colors ${
                      enabled ? 'bg-zinc-900/30' : 'bg-zinc-950/50 opacity-60'
                    }`}
                  >
                    <ToggleSwitch
                      checked={enabled}
                      onChange={(v) => handleChange(field.enabledKey, v)}
                    />
                    <Icon
                      size={14}
                      className={enabled ? 'text-zinc-400 shrink-0' : 'text-zinc-700 shrink-0'}
                    />
                    <span
                      className={`text-xs font-medium w-24 shrink-0 ${
                        enabled ? 'text-zinc-300' : 'text-zinc-600'
                      }`}
                    >
                      {field.label}
                    </span>
                    <input
                      type="url"
                      value={value}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      disabled={!enabled}
                      placeholder={field.placeholder}
                      className={`
                        flex-1 min-w-0 w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg border transition-all bg-transparent
                        placeholder-zinc-700 outline-none
                        ${enabled
                          ? 'text-zinc-200 border-zinc-700 focus:border-blue-500/60 focus:bg-zinc-900/50'
                          : 'text-zinc-700 border-zinc-800 cursor-not-allowed'
                        }
                      `}
                    />
                  </div>
                )
              })}
            </div>
          </Section>

          {/* Timestamps */}
          {project?.id && (
            <div className="flex items-center gap-6 text-xs text-zinc-700 px-1">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                Created {formatDate(project.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                Updated {formatDate(project.updatedAt)}
              </span>
            </div>
          )}

          {/* Hidden submit trigger */}
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </div>
    )
  }
)

OverviewTab.displayName = 'OverviewTab'
