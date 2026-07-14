'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Input, Textarea, Select, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/Progress'
import { FeatureItemType, FeatureStatusType } from '@/lib/validations/project'
import { generateId, getFeatureStatusColor, calculateFeaturesProgress } from '@/lib/utils/project-helpers'
import { Plus, Trash2, GripVertical, Target, Edit2, Check, X } from 'lucide-react'
import { AIGenerateButton } from '@/components/AIGenerateButton'

interface FeaturesTabProps {
  features: FeatureItemType[]
  onChange: (features: FeatureItemType[]) => void
  onSave: () => void
  isLoading?: boolean
}

const SP_VALUES = [1, 2, 3, 5, 8, 13] as const

function StoryPointsPills({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider">Story Points</p>
      <div className="flex gap-1 flex-wrap">
        {SP_VALUES.map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => onChange(sp)}
            className={`w-8 h-7 text-xs font-bold rounded transition-colors ${
              value === sp ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {sp}
          </button>
        ))}
      </div>
    </div>
  )
}

function priorityColor(score: number): string {
  if (score <= 3) return 'bg-red-500'
  if (score <= 6) return 'bg-amber-500'
  return 'bg-green-500'
}

function PriorityScoreStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-wider">Priority</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-bold">−</button>
        <span className="text-sm font-bold text-white w-4 text-center">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(10, value + 1))} className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-bold">+</button>
        <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${priorityColor(value)}`} style={{ width: `${(value / 10) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

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
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
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

  const progress = calculateFeaturesProgress(features)

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Target className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Features Progress</h3>
              <p className="text-sm text-gray-400">
                {features.filter(f => f.status === 'completed').length} of {features.length} completed
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
        <ProgressBar value={progress} showLabel={false} colorClass="from-purple-500 to-pink-500" />
        {features.length > 0 && (
          <div className="flex gap-6 mt-3 pt-3 border-t border-white/[0.06] text-xs text-zinc-400">
            <span><span className="text-white font-semibold">{features.reduce((sum, f) => sum + (f.storyPoints ?? 1), 0)}</span> total SP</span>
            <span><span className="text-white font-semibold">{features.length > 0 ? Math.round(features.reduce((sum, f) => sum + (f.priorityScore ?? 5), 0) / features.length * 10) / 10 : 0}</span> avg priority</span>
            <span><span className="text-green-400 font-semibold">{features.filter((f) => (f.priorityScore ?? 5) >= 7 && (f.storyPoints ?? 1) <= 3).length}</span> quick wins</span>
          </div>
        )}
      </Card>

      {/* Add New Feature */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Add New Feature</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label={
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Feature Title</span>
                  <AIGenerateButton
                    onGenerate={(text) => setNewFeature(prev => ({ ...prev, title: text }))}
                    promptContext={{ field: "Feature Title", contextData: { currentTitle: newFeature.title } }}
                    className="!p-1 scale-75 origin-right"
                  />
                </div>
              }
              placeholder="Feature title..."
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
            Add Feature
          </Button>
        </div>
        <div className="mt-3">
          <Textarea
            label={
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Feature Description (SEO/AI Optimized)</span>
                <AIGenerateButton
                  onGenerate={(text) => setNewFeature(prev => ({ ...prev, description: text }))}
                  promptContext={{ field: "Feature Description", contextData: { featureTitle: newFeature.title } }}
                  className="!p-1 scale-75 origin-right"
                />
              </div>
            }
            placeholder="Optional description..."
            value={newFeature.description}
            onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <StoryPointsPills value={newFeature.storyPoints} onChange={(v) => setNewFeature((prev) => ({ ...prev, storyPoints: v }))} />
          <PriorityScoreStepper value={newFeature.priorityScore} onChange={(v) => setNewFeature((prev) => ({ ...prev, priorityScore: v }))} />
        </div>
      </Card>

      {/* Features List */}
      <div className="space-y-2">
        {features.length === 0 ? (
          <EmptyState
            icon={<Target size={32} />}
            title="No features yet"
            description="Add features to track what your project will include"
          />
        ) : (
          <Reorder.Group axis="y" values={features} onReorder={handleReorder} className="space-y-2">
            <AnimatePresence>
              {features.map((feature) => (
                <Reorder.Item
                  key={feature.id}
                  value={feature}
                  className="group"
                >
                  <Card className="!p-4 cursor-grab active:cursor-grabbing hover:!border-white/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {editingId === feature.id ? (
                          <div className="space-y-3">
                            <Input
                              value={feature.title}
                              onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                              autoFocus
                            />
                            <Textarea
                              value={feature.description || ''}
                              onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                              rows={2}
                              placeholder="Description..."
                            />
                            <div className="flex items-center gap-2">
                              <Select
                                value={feature.status}
                                onChange={(e) => updateFeature(feature.id, { status: e.target.value as FeatureStatusType })}
                                options={statusOptions}
                                className="!w-auto"
                              />
                              <Button
                                size="sm"
                                onClick={() => setEditingId(null)}
                                leftIcon={<Check size={14} />}
                              >
                                Done
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <StoryPointsPills value={feature.storyPoints ?? 1} onChange={(v) => updateFeature(feature.id, { storyPoints: v })} />
                              <PriorityScoreStepper value={feature.priorityScore ?? 5} onChange={(v) => updateFeature(feature.id, { priorityScore: v })} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-white">{feature.title}</h4>
                              <StatusBadge status={feature.status} />
                              <span className="text-[10px] font-mono text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5">
                                SP {feature.storyPoints ?? 1}
                              </span>
                              <span
                                className={`w-2 h-2 rounded-full ${priorityColor(feature.priorityScore ?? 5)}`}
                                title={`Priority: ${feature.priorityScore ?? 5}/10`}
                              />
                            </div>
                            {feature.description && (
                              <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                            )}
                          </>
                        )}
                      </div>

                      {editingId !== feature.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingId(feature.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteFeature(feature.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Save Button */}
      {features.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Features
          </Button>
        </div>
      )}
    </div>
  )
}
