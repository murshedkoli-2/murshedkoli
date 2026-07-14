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
  onSave: () => void
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

      {/* Stats */}
      {total > 0 && (
        <div className="flex items-center gap-4 px-1">
          <span className="text-sm text-zinc-400">
            <span className="text-white font-semibold">{done}</span>/{total} done
          </span>
          <div className="flex-1 h-1 bg-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            {total ? Math.round((done / total) * 100) : 0}%
          </span>
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a feature…"
          className="flex-1 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 px-3 py-2 outline-none focus:border-zinc-600 transition-colors"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-40 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Checklist */}
      {features.length === 0 ? (
        <p className="text-sm text-zinc-600 text-center py-8">
          No features yet — type above and press Enter.
        </p>
      ) : (
        <Reorder.Group axis="y" values={features} onReorder={reorder} className="space-y-[2px]">
          {features.map(f => (
            <Reorder.Item key={f.id} value={f} className="group">
              <div className={`flex items-center gap-3 px-3 py-2.5 border transition-colors ${
                f.done
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-zinc-900/40 border-zinc-800/60'
              }`}>
                {/* Drag */}
                <span className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0">
                  <GripVertical size={14} />
                </span>

                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggle(f.id)}
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                    f.done
                      ? 'bg-emerald-500 border-emerald-500 text-zinc-900'
                      : 'border-zinc-600 hover:border-zinc-400'
                  }`}
                  aria-label={f.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {f.done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {/* Title */}
                <span className={`flex-1 text-sm transition-colors ${
                  f.done ? 'text-zinc-500 line-through' : 'text-zinc-200'
                }`}>
                  {f.title}
                </span>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Save */}
      {features.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>Save Features</Button>
        </div>
      )}
    </div>
  )
}
