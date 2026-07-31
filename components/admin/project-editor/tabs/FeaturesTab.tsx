'use client'

import { useRef, useState } from 'react'
import { Reorder } from 'framer-motion'
import { FeatureItemType } from '@/lib/validations/project'
import { generateId } from '@/lib/utils/project-helpers'
import { GripVertical, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/FormElements'

interface FeaturesTabProps {
  features: FeatureItemType[]
  onChange: (features: FeatureItemType[]) => void
  /** Omitted by the create wizard, which defers all saving to the final step. */
  onSave?: () => void
  isLoading?: boolean
}

export function FeaturesTab({ features, onChange, onSave, isLoading }: FeaturesTabProps) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const add = () => {
    const title = draft.trim()
    if (!title) return
    onChange([
      ...features,
      { id: generateId(), title, done: false, order: features.length },
    ])
    setDraft('')
    inputRef.current?.focus()
  }

  const toggle = (id: string) =>
    onChange(features.map(f => f.id === id ? { ...f, done: !f.done } : f))

  const remove = (id: string) =>
    onChange(features.filter(f => f.id !== id))

  const reorder = (next: FeatureItemType[]) =>
    onChange(next.map((f, i) => ({ ...f, order: i })))

  const done  = features.filter(f => f.done).length
  const total = features.length

  return (
    <div className="space-y-6">

      {/* Stats — a single hairline meter, amber fill */}
      {total > 0 && (
        <div className="flex items-center gap-4 px-1">
          <span className="adm-mono" style={{ fontSize: 11.5, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{done}</span>/{total} done
          </span>
          <div
            className="flex-1 overflow-hidden"
            style={{ height: 3, background: 'var(--line)', borderRadius: 999 }}
          >
            <div
              style={{
                height: '100%',
                width: `${total ? (done / total) * 100 : 0}%`,
                background: 'var(--accent)',
                transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
          <span className="adm-mono" style={{ fontSize: 11.5, color: 'var(--accent)' }}>
            {total ? Math.round((done / total) * 100) : 0}%
          </span>
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a new feature…"
          aria-label="New feature"
          className="pe-input flex-1"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          aria-label="Add feature"
          className="pe-btn pe-btn-primary pe-btn-md"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Checklist */}
      {features.length === 0 ? (
        <p className="text-center py-10" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          No features yet — type above and press Enter.
        </p>
      ) : (
        <Reorder.Group
          axis="y"
          values={features}
          onReorder={reorder}
          style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}
        >
          {features.map((f, i) => (
            <Reorder.Item key={f.id} value={f} className="group outline-none">
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  background: f.done ? 'var(--accent-soft)' : 'var(--surface)',
                  transition: 'background 200ms ease',
                }}
              >
                {/* Drag */}
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <GripVertical size={15} />
                </span>

                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggle(f.id)}
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 4,
                    border: `1px solid ${f.done ? 'var(--accent)' : 'var(--line-strong)'}`,
                    background: f.done ? 'var(--accent)' : 'transparent',
                    color: 'var(--accent-ink)',
                    transition: 'background 200ms ease, border-color 200ms ease',
                  }}
                  aria-label={f.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {f.done && (
                    <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Title */}
                <span
                  className="flex-1"
                  style={{
                    fontSize: 13.5,
                    color: f.done ? 'var(--ink-muted)' : 'var(--ink)',
                    textDecoration: f.done ? 'line-through' : 'none',
                  }}
                >
                  {f.title}
                </span>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  aria-label={`Delete ${f.title}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Save */}
      {onSave && features.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>Save Features</Button>
        </div>
      )}
    </div>
  )
}
