'use client'

import { useState } from 'react'
import { Drawer } from '@/components/admin/kit/Drawer'
import { STAGE_NAMES } from '@/lib/data/career-roadmap'
import { CATEGORY_META, shortStageName } from '@/lib/admin/career'
import { EMPTY_NEW_STEP, type CareerRoadmap, type NewStepForm } from './useCareerRoadmap'

interface NewMilestoneDrawerProps {
  open: boolean
  onClose: () => void
  roadmap: CareerRoadmap
}

/** Slide-over form for adding a custom milestone to the roadmap. */
export function NewMilestoneDrawer({ open, onClose, roadmap }: NewMilestoneDrawerProps) {
  const [form, setForm] = useState<NewStepForm>(EMPTY_NEW_STEP)
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof NewStepForm>(key: K, value: NewStepForm[K]) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async () => {
    setSaving(true)
    const ok = await roadmap.createStep(form)
    setSaving(false)
    if (ok) {
      setForm(EMPTY_NEW_STEP)
      onClose()
    }
  }

  return (
    <Drawer
      open={open}
      title="New milestone"
      subtitle="Add your own step to the curriculum."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="adm-btn amber" onClick={submit} disabled={saving}>
            {saving ? 'Adding…' : 'Add milestone'}
          </button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); submit() }}>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-title">Title</label>
          <input id="ms-title" className="adm-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Advanced React Server Components" />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-stage">Stage</label>
          <select id="ms-stage" className="adm-select" value={form.stageNumber} onChange={(e) => set('stageNumber', Number(e.target.value))}>
            {STAGE_NAMES.map((s) => (
              <option key={s.stageNumber} value={s.stageNumber}>
                {s.stageNumber}. {shortStageName(s.name)}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <span className="adm-label">Skill area</span>
          <div className="kit-chips" role="radiogroup" aria-label="Skill area">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <button key={key} type="button" role="radio" aria-checked={form.category === key} className={`pe-chip ${form.category === key ? 'on' : ''}`} onClick={() => set('category', key)}>
                {meta.label}
              </button>
            ))}
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-desc">Description</label>
          <textarea id="ms-desc" className="adm-textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-concepts">Key concepts (comma separated)</label>
          <input id="ms-concepts" className="adm-input" value={form.keyConcepts} onChange={(e) => set('keyConcepts', e.target.value)} placeholder="Streaming, Suspense, caching" />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-questions">Self-check questions (one per line)</label>
          <textarea id="ms-questions" className="adm-textarea" rows={3} value={form.testQuestions} onChange={(e) => set('testQuestions', e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ms-deliverable">Deliverable</label>
          <input id="ms-deliverable" className="adm-input" value={form.deliverable} onChange={(e) => set('deliverable', e.target.value)} placeholder="What you will build to prove it" />
        </div>
      </form>
    </Drawer>
  )
}
