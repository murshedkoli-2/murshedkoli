'use client'

import { StatusFields } from '../fields/StatusFields'
import { STEPS, type StepId, type WizardData } from './steps'
import { PROJECT_TYPE_OPTIONS } from '../fields/types'

interface ReviewStepProps {
  data: WizardData
  onChange: (patch: Partial<WizardData>) => void
  onJump: (stepId: StepId) => void
}

/** One line per step: what you entered, or what you left empty. */
function summarise(id: StepId, d: WizardData): { text: string; empty: boolean } {
  switch (id) {
    case 'type': {
      const label = PROJECT_TYPE_OPTIONS.find(o => o.value === d.projectType)?.label ?? d.projectType
      return { text: label, empty: false }
    }
    case 'identity':
      return { text: d.title ? `${d.title} · /projects/${d.slug}` : 'Not set', empty: !d.title }
    case 'story': {
      const parts = [
        d.longDescription?.trim() && `${d.longDescription.trim().split(/\s+/).length} words`,
        d.role?.trim() && d.role.trim(),
      ].filter(Boolean)
      return { text: parts.length ? parts.join(' · ') : 'No write-up yet', empty: !parts.length }
    }
    case 'media': {
      const count = (d.gallery?.length ?? 0)
      const parts = [
        d.coverImage && 'cover',
        d.logoUrl && 'logo',
        count > 0 && `${count} gallery image${count === 1 ? '' : 's'}`,
      ].filter(Boolean)
      return { text: parts.length ? parts.join(' · ') : 'No images', empty: !parts.length }
    }
    case 'links': {
      const urls = [
        d.githubUrl, d.demoUrl, d.clientProjectUrl, d.adminProjectUrl,
        d.clientLiveUrl, d.adminLiveUrl, d.androidDownloadUrl,
      ].filter(u => u && u.trim())
      return { text: urls.length ? `${urls.length} link${urls.length === 1 ? '' : 's'}` : 'No links', empty: !urls.length }
    }
    case 'features': {
      const n = d.features?.length ?? 0
      return { text: n ? `${n} feature${n === 1 ? '' : 's'}` : 'None listed', empty: !n }
    }
    case 'techstack': {
      const n = d.techStack?.length ?? 0
      return { text: n ? (d.techStack ?? []).map(t => t.name).join(', ') : 'None listed', empty: !n }
    }
    case 'review':
      return { text: '', empty: true }
  }
}

export function ReviewStep({ data, onChange, onJump }: ReviewStepProps) {
  const rows = STEPS.filter(s => s.id !== 'review')

  return (
    <div className="flex flex-col gap-8">
      <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
        {rows.map((step, i) => {
          const { text, empty } = summarise(step.id, data)
          return (
            <div
              key={step.id}
              className="flex items-center gap-4 px-4 py-3"
              style={{
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                background: 'var(--surface)',
              }}
            >
              <span
                className="adm-mono shrink-0"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  width: 88,
                }}
              >
                {step.label}
              </span>
              <span
                className="flex-1 min-w-0 truncate"
                style={{ fontSize: 13, color: empty ? 'var(--ink-muted)' : 'var(--ink)' }}
              >
                {text}
              </span>
              <button
                type="button"
                onClick={() => onJump(step.id)}
                className="pe-btn pe-btn-ghost pe-btn-sm shrink-0"
              >
                Edit
              </button>
            </div>
          )
        })}
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'var(--adm-display)',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid var(--line)',
          }}
        >
          Publish settings
        </h3>
        <StatusFields
          value={{
            lifecycleStatus: data.lifecycleStatus ?? 'idea',
            publishStatus: data.publishStatus ?? 'draft',
            featured: data.featured ?? false,
            order: data.order ?? 0,
          }}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
