'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Input, Textarea, Select, Button, EmptyState } from '@/components/ui/FormElements'
import { FeatureItemType, FeatureStatusType } from '@/lib/validations/project'
import { generateId, calculateFeaturesProgress } from '@/lib/utils/project-helpers'
import { Plus, Trash2, GripVertical, Target, Edit2, Check } from 'lucide-react'
import { AIGenerateButton } from '@/components/AIGenerateButton'

interface FeaturesTabProps {
  features: FeatureItemType[]
  onChange: (features: FeatureItemType[]) => void
  onSave: () => void
  isLoading?: boolean
}

const SP_VALUES = [1, 2, 3, 5, 8, 13] as const

function priorityFillColor(score: number): string {
  if (score >= 7) return '#22c55e'
  if (score >= 4) return '#f59e0b'
  return '#ef4444'
}

function statusAccentColor(status: string): string {
  if (status === 'completed') return '#22c55e'
  if (status === 'in_progress') return '#f59e0b'
  return 'rgba(146,180,215,0.3)'
}

function statusLabel(status: string): string {
  if (status === 'completed') return 'Done'
  if (status === 'in_progress') return 'In Progress'
  return 'Planned'
}

// ── Story Points pill selector ────────────────────────────────────────────────
function StoryPointsPills({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-semibold">Story Points</p>
      <div className="flex gap-1">
        {SP_VALUES.map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => onChange(sp)}
            className={`
              flex-1 h-8 text-xs font-bold transition-all
              ${value === sp
                ? 'bg-amber-500 text-zinc-900 shadow-[0_0_0_1px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}
            `}
          >
            {sp}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Priority score stepper ────────────────────────────────────────────────────
function PriorityScoreStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const fill = priorityFillColor(value)
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-semibold">Priority Score</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 text-sm font-bold transition-colors"
        >
          −
        </button>
        <span className="text-base font-bold w-5 text-center" style={{ color: fill }}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 text-sm font-bold transition-colors"
        >
          +
        </button>
        {/* Signal bars */}
        <div className="flex gap-[3px] flex-1 items-end h-5">
          {[2, 4, 6, 8, 10].map((t, i) => (
            <div
              key={t}
              className="flex-1 transition-all"
              style={{
                height: `${40 + i * 12}%`,
                background: value >= t ? fill : 'rgba(255,255,255,0.07)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 2×2 Priority/Effort Quadrant ──────────────────────────────────────────────
function PriorityMatrix({ features }: { features: FeatureItemType[] }) {
  const quickWins  = features.filter(f => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) <= 3)
  const major      = features.filter(f => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) >  3)
  const fillers    = features.filter(f => (f.priorityScore ?? 5) <  7 && (f.storyPoints ?? 1) <= 3)
  const reconsider = features.filter(f => (f.priorityScore ?? 5) <  7 && (f.storyPoints ?? 1) >  3)

  const cells = [
    { label: 'Quick Wins', count: quickWins.length,  color: '#22c55e', sub: 'High P · Low SP' },
    { label: 'Major',      count: major.length,       color: '#f59e0b', sub: 'High P · High SP' },
    { label: 'Fill-ins',   count: fillers.length,     color: '#6b7280', sub: 'Low P · Low SP' },
    { label: 'Reconsider', count: reconsider.length,  color: '#ef4444', sub: 'Low P · High SP' },
  ]

  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-semibold">Priority Matrix</p>
      <div className="grid grid-cols-2 gap-[2px]">
        {cells.map((c) => (
          <div
            key={c.label}
            className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 flex flex-col gap-1"
          >
            <span className="text-[18px] font-bold leading-none" style={{ color: c.color }}>
              {c.count}
            </span>
            <span className="text-[10px] font-semibold text-zinc-300">{c.label}</span>
            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">{c.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SP "stamp" badge ──────────────────────────────────────────────────────────
function SpStamp({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-10 h-10 border-2 border-zinc-700 shrink-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <span className="text-[8px] font-mono text-zinc-600 leading-none uppercase">sp</span>
      <span className="text-sm font-bold text-amber-500 leading-none mt-0.5">{value}</span>
    </div>
  )
}

// ── Priority signal bars (read-only) ─────────────────────────────────────────
function PriorityBars({ value }: { value: number }) {
  const fill = priorityFillColor(value)
  return (
    <div className="flex gap-[2px] items-end h-3.5" title={`Priority: ${value}/10`}>
      {[2, 4, 6, 8, 10].map((t, i) => (
        <div
          key={t}
          className="w-1.5"
          style={{
            height: `${40 + i * 12}%`,
            background: value >= t ? fill : 'rgba(255,255,255,0.07)',
          }}
        />
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function FeaturesTab({ features, onChange, onSave, isLoading }: FeaturesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    status: 'planned' as FeatureStatusType,
    storyPoints: 1,
    priorityScore: 5,
  })

  const statusOptions = [
    { value: 'planned',     label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ]

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

  const updateFeature = (id: string, updates: Partial<FeatureItemType>) => {
    onChange(features.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const deleteFeature = (id: string) => {
    onChange(features.filter(f => f.id !== id))
  }

  const handleReorder = (newOrder: FeatureItemType[]) => {
    onChange(newOrder.map((f, i) => ({ ...f, order: i })))
  }

  const progress   = calculateFeaturesProgress(features)
  const totalSP    = features.reduce((s, f) => s + (f.storyPoints ?? 1), 0)
  const avgPriority = features.length
    ? Math.round(features.reduce((s, f) => s + (f.priorityScore ?? 5), 0) / features.length * 10) / 10
    : 0
  const completed  = features.filter(f => f.status === 'completed').length

  return (
    <div className="space-y-5">

      {/* ── Dashboard strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Progress block */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col gap-2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Progress</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white leading-none">{progress}%</span>
            <span className="text-xs text-zinc-500">{completed}/{features.length}</span>
          </div>
          <div className="h-1 bg-zinc-800 mt-1">
            <div
              className="h-full transition-all"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
            />
          </div>
        </div>

        {/* SP block */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col gap-2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Story Points</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-amber-500 leading-none">{totalSP}</span>
            <span className="text-xs text-zinc-500">avg·{avgPriority}P</span>
          </div>
          <div className="flex gap-[2px] mt-1">
            {SP_VALUES.map(sp => {
              const cnt = features.filter(f => (f.storyPoints ?? 1) === sp).length
              return (
                <div key={sp} className="flex-1 flex flex-col gap-[2px] items-center">
                  <div
                    className="w-full bg-amber-500/20 transition-all"
                    style={{ height: Math.max(2, cnt * 6) }}
                  />
                  <span className="text-[8px] text-zinc-700 font-mono">{sp}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Matrix block */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4">
          <PriorityMatrix features={features} />
        </div>
      </div>

      {/* ── Add new feature ──────────────────────────────────────────── */}
      <div className="bg-white/[0.02] border border-white/[0.07] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Add Feature</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input
              label={
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Title</span>
                  <AIGenerateButton
                    onGenerate={(text) => setNewFeature(prev => ({ ...prev, title: text }))}
                    promptContext={{ field: 'Feature Title', contextData: { currentTitle: newFeature.title } }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              placeholder="Feature title…"
              value={newFeature.title}
              onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addFeature()}
            />
          </div>
          <Select
            value={newFeature.status}
            onChange={(e) => setNewFeature(prev => ({ ...prev, status: e.target.value as FeatureStatusType }))}
            options={statusOptions}
          />
          <Button onClick={addFeature} leftIcon={<Plus size={16} />} disabled={!newFeature.title.trim()}>
            Add
          </Button>
        </div>

        <Textarea
          label={
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Description</span>
              <AIGenerateButton
                onGenerate={(text) => setNewFeature(prev => ({ ...prev, description: text }))}
                promptContext={{ field: 'Feature Description', contextData: { featureTitle: newFeature.title } }}
                className="!p-1 scale-75 origin-right"
              />
            </div>
          }
          placeholder="Optional description…"
          value={newFeature.description}
          onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <StoryPointsPills value={newFeature.storyPoints} onChange={(v) => setNewFeature(prev => ({ ...prev, storyPoints: v }))} />
          <PriorityScoreStepper value={newFeature.priorityScore} onChange={(v) => setNewFeature(prev => ({ ...prev, priorityScore: v }))} />
        </div>
      </div>

      {/* ── Feature list ─────────────────────────────────────────────── */}
      {features.length === 0 ? (
        <EmptyState
          icon={<Target size={32} />}
          title="No features yet"
          description="Add features to track what your project will include"
        />
      ) : (
        <Reorder.Group axis="y" values={features} onReorder={handleReorder} className="space-y-[2px]">
          <AnimatePresence>
            {features.map((feature, idx) => (
              <Reorder.Item key={feature.id} value={feature} className="group">
                <div
                  className="relative bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
                  style={{ borderLeft: `3px solid ${statusAccentColor(feature.status)}` }}
                >
                  {editingId === feature.id ? (
                    /* ── Edit mode ── */
                    <div className="p-4 space-y-3">
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                        autoFocus
                      />
                      <Textarea
                        value={feature.description || ''}
                        onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                        rows={2}
                        placeholder="Description…"
                      />
                      <div className="flex items-center gap-2">
                        <Select
                          value={feature.status}
                          onChange={(e) => updateFeature(feature.id, { status: e.target.value as FeatureStatusType })}
                          options={statusOptions}
                          className="!w-auto"
                        />
                        <Button size="sm" onClick={() => setEditingId(null)} leftIcon={<Check size={14} />}>
                          Done
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <StoryPointsPills value={feature.storyPoints ?? 1} onChange={(v) => updateFeature(feature.id, { storyPoints: v })} />
                        <PriorityScoreStepper value={feature.priorityScore ?? 5} onChange={(v) => updateFeature(feature.id, { priorityScore: v })} />
                      </div>
                    </div>
                  ) : (
                    /* ── Read mode ── */
                    <div className="flex items-center gap-0">
                      {/* Drag handle */}
                      <div className="px-2 py-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                      </div>

                      {/* SP stamp */}
                      <div className="px-3 py-4 flex items-center">
                        <SpStamp value={feature.storyPoints ?? 1} />
                      </div>

                      {/* Sequence number */}
                      <div className="px-2 py-4 hidden sm:block">
                        <span className="text-[11px] font-mono text-zinc-700">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-4 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-white truncate">{feature.title}</span>
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border"
                            style={{
                              color: statusAccentColor(feature.status),
                              borderColor: statusAccentColor(feature.status),
                              opacity: 0.8,
                            }}
                          >
                            {statusLabel(feature.status)}
                          </span>
                        </div>
                        {feature.description && (
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{feature.description}</p>
                        )}
                      </div>

                      {/* Priority bars */}
                      <div className="px-3 py-4 flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-zinc-600">{feature.priorityScore ?? 5}</span>
                        <PriorityBars value={feature.priorityScore ?? 5} />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 px-2 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingId(feature.id)}
                          className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteFeature(feature.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {features.length > 0 && (
        <div className="flex justify-end pt-1">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Features
          </Button>
        </div>
      )}
    </div>
  )
}
