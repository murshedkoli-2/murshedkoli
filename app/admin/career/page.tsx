'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { adminFetch } from '@/lib/admin/adminFetch'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { STAGE_NAMES } from '@/lib/data/career-roadmap'

interface CareerStep {
  id: string
  stage: string
  stageNumber: number
  stepNumber: number
  title: string
  category: string
  description: string
  keyConcepts: string[]
  testQuestions: string[]
  deliverable: string
  deliverableUrl?: string | null
  status: 'todo' | 'in_progress' | 'completed'
  notes?: string | null
  completedAt?: string | null
  order: number
}

interface CareerStats {
  totalSteps: number
  completedSteps: number
  inProgressSteps: number
  todoSteps: number
  deliverablesLinked: number
  readinessScore: number
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  frontend: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
  backend: { bg: 'rgba(16, 185, 129, 0.08)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  database: { bg: 'rgba(168, 85, 247, 0.08)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
  devops: { bg: 'rgba(249, 115, 22, 0.08)', text: '#f97316', border: 'rgba(249, 115, 22, 0.2)' },
  'system-design': { bg: 'rgba(236, 72, 153, 0.08)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.2)' },
  monetization: { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04', border: 'rgba(234, 179, 8, 0.25)' },
}

export default function CareerRoadmapPage() {
  const ready = useAdminGuard()
  const [steps, setSteps] = useState<CareerStep[]>([])
  const [stats, setStats] = useState<CareerStats>({
    totalSteps: 0,
    completedSteps: 0,
    inProgressSteps: 0,
    todoSteps: 0,
    deliverablesLinked: 0,
    readinessScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  // Filters
  const [activeStage, setActiveStage] = useState<number>(0) // 0 = all
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Expanded UI state
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({})
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [editingUrls, setEditingUrls] = useState<Record<string, string>>({})
  const [savingStepId, setSavingStepId] = useState<string | null>(null)

  // New Milestone Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [newStepForm, setNewStepForm] = useState({
    title: '',
    stageNumber: 1,
    category: 'frontend',
    description: '',
    keyConcepts: '',
    testQuestions: '',
    deliverable: '',
    deliverableUrl: '',
    notes: '',
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await adminFetch('/api/career')
      if (res.ok) {
        const data = await res.json()
        setSteps(data.steps || [])
        if (data.stats) setStats(data.stats)

        // Initialize editable states
        const notesMap: Record<string, string> = {}
        const urlsMap: Record<string, string> = {}
        data.steps?.forEach((s: CareerStep) => {
          notesMap[s.id] = s.notes || ''
          urlsMap[s.id] = s.deliverableUrl || ''
        })
        setEditingNotes(notesMap)
        setEditingUrls(urlsMap)
      } else {
        toast.error('Failed to load career roadmap')
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not connect to career roadmap API')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (ready) loadData()
  }, [ready, loadData])

  // Seed / Reset Handler
  const handleSeed = async (force = false) => {
    if (force) {
      const ok = await confirmDialog({
        title: 'Reset Career Roadmap?',
        description: 'This will reset all 32 steps to default and clear any custom deliverables or notes. Proceed?',
        confirmLabel: 'Reset Roadmap',
        tone: 'danger',
      })
      if (!ok) return
    }

    setSeeding(true)
    try {
      const res = await adminFetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed', force }),
      })
      if (res.ok) {
        toast.success(force ? 'Roadmap reset to 32 industry milestones.' : 'Roadmap initialized with 32 milestones!')
        await loadData()
      } else {
        toast.error('Failed to initialize roadmap.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error seeding roadmap.')
    } finally {
      setSeeding(false)
    }
  }

  // Update Status
  const handleStatusChange = async (stepId: string, nextStatus: 'todo' | 'in_progress' | 'completed') => {
    setSavingStepId(stepId)
    try {
      const res = await adminFetch(`/api/career/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSteps((prev) => prev.map((s) => (s.id === stepId ? updated : s)))
        // Recalculate quick stats
        setSteps((current) => {
          const total = current.length
          const comp = current.filter((s) => s.status === 'completed').length
          const inProg = current.filter((s) => s.status === 'in_progress').length
          const linked = current.filter((s) => Boolean(s.deliverableUrl?.trim())).length
          setStats({
            totalSteps: total,
            completedSteps: comp,
            inProgressSteps: inProg,
            todoSteps: total - comp - inProg,
            deliverablesLinked: linked,
            readinessScore: total > 0 ? Math.round((comp / total) * 100) : 0,
          })
          return current
        })
        toast.success(`Milestone updated to ${nextStatus.replace('_', ' ')}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not update status')
    } finally {
      setSavingStepId(null)
    }
  }

  // Save Deliverable URL or Notes
  const handleSaveField = async (stepId: string, field: 'deliverableUrl' | 'notes') => {
    setSavingStepId(stepId)
    const payload = field === 'deliverableUrl'
      ? { deliverableUrl: editingUrls[stepId] }
      : { notes: editingNotes[stepId] }

    try {
      const res = await adminFetch(`/api/career/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated = await res.json()
        setSteps((prev) => prev.map((s) => (s.id === stepId ? updated : s)))
        toast.success(field === 'deliverableUrl' ? 'Proof of work URL saved!' : 'Notes saved!')
      } else {
        toast.error('Failed to save changes')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error saving field')
    } finally {
      setSavingStepId(null)
    }
  }

  // Delete Milestone
  const handleDeleteStep = async (stepId: string, title: string) => {
    const ok = await confirmDialog({
      title: 'Delete Milestone?',
      description: `Are you sure you want to delete "${title}"?`,
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (!ok) return

    try {
      const res = await adminFetch(`/api/career/${stepId}`, { method: 'DELETE' })
      if (res.ok) {
        setSteps((prev) => prev.filter((s) => s.id !== stepId))
        toast.success('Milestone deleted')
        loadData()
      } else {
        toast.error('Failed to delete milestone')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting milestone')
    }
  }

  // Create Custom Step
  const handleCreateCustomStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStepForm.title.trim() || !newStepForm.deliverable.trim()) {
      toast.error('Please enter a title and capstone deliverable.')
      return
    }

    try {
      const concepts = newStepForm.keyConcepts
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean)
      const questions = newStepForm.testQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean)

      const stageObj = STAGE_NAMES.find((s) => s.stageNumber === Number(newStepForm.stageNumber))

      const res = await adminFetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newStepForm.title,
          stageNumber: Number(newStepForm.stageNumber),
          stage: stageObj?.name || `Stage ${newStepForm.stageNumber}`,
          category: newStepForm.category,
          description: newStepForm.description,
          deliverable: newStepForm.deliverable,
          deliverableUrl: newStepForm.deliverableUrl,
          keyConcepts: concepts,
          testQuestions: questions,
          notes: newStepForm.notes,
        }),
      })

      if (res.ok) {
        toast.success('Custom milestone added to roadmap!')
        setIsNewModalOpen(false)
        setNewStepForm({
          title: '',
          stageNumber: 1,
          category: 'frontend',
          description: '',
          keyConcepts: '',
          testQuestions: '',
          deliverable: '',
          deliverableUrl: '',
          notes: '',
        })
        loadData()
      } else {
        toast.error('Failed to create milestone')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error adding milestone')
    }
  }

  // Filtered Steps
  const filteredSteps = useMemo(() => {
    return steps.filter((step) => {
      if (activeStage !== 0 && step.stageNumber !== activeStage) return false
      if (statusFilter !== 'all' && step.status !== statusFilter) return false
      if (categoryFilter !== 'all' && step.category !== categoryFilter) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = step.title.toLowerCase().includes(query)
        const matchDesc = step.description.toLowerCase().includes(query)
        const matchConcepts = step.keyConcepts.some((c) => c.toLowerCase().includes(query))
        const matchDeliverable = step.deliverable.toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchConcepts && !matchDeliverable) return false
      }
      return true
    })
  }, [steps, activeStage, statusFilter, categoryFilter, searchQuery])

  if (!ready) return null

  return (
    <AdminShell
      active="career"
      title="Full-Stack Career HQ"
      subtitle="Industry readiness curriculum, skill assessment challenges, and earning roadmap"
      badges={{ career: stats.inProgressSteps }}
      actions={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {steps.length === 0 ? (
            <button
              className="adm-btn amber"
              onClick={() => handleSeed(false)}
              disabled={seeding}
              style={{ fontWeight: 600 }}
            >
              {seeding ? 'Initializing…' : '⚡ Initialize 32 Industry Steps'}
            </button>
          ) : (
            <>
              <button
                className="adm-btn"
                onClick={() => setIsNewModalOpen(true)}
                style={{ fontSize: 13 }}
              >
                + Add Custom Milestone
              </button>
              <button
                className="adm-btn"
                onClick={() => handleSeed(true)}
                disabled={seeding}
                title="Reset roadmap to default"
                style={{ fontSize: 12, color: 'var(--ink-muted)' }}
              >
                ↺ Reset
              </button>
            </>
          )}
        </div>
      }
    >
      {/* ── TOP READINESS & SCORE CARDS ─────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Industry Readiness Progress Card */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: 8 }}>
            // INDUSTRY READINESS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {stats.readinessScore}%
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
              ({stats.completedSteps} of {stats.totalSteps} complete)
            </span>
          </div>
          {/* Progress Track */}
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 999,
              background: 'var(--surface-2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${stats.readinessScore}%`,
                height: '100%',
                background: stats.readinessScore >= 80 ? '#10b981' : 'var(--accent)',
                borderRadius: 999,
                transition: 'width 400ms ease',
              }}
            />
          </div>
        </div>

        {/* Active Sprints / In Progress Card */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: 8 }}>
            // ACTIVE SPRINTS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#3b82f6' }}>
              {stats.inProgressSteps}
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>milestones in progress</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
            Focus on 1–2 milestones at a time for maximum retention.
          </div>
        </div>

        {/* Proof-of-Work Linked Card */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: 8 }}>
            // PROOF OF WORK LINKED
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#10b981' }}>
              {stats.deliverablesLinked}
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>deliverables with code URLs</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
            Every linked deliverable is solid proof for clients & recruiters.
          </div>
        </div>

        {/* Next Earning Target */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', marginBottom: 8 }}>
            // CAREER TARGET
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
            Global Remote & $2k+ Freelance
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            Complete Stage 6 to deploy Capstone SaaS and launch Upwork & direct client outreach.
          </div>
        </div>
      </div>

      {/* ── STAGE NAVIGATION TABS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 20,
        }}
      >
        <button
          className={`adm-btn ${activeStage === 0 ? 'amber' : ''}`}
          onClick={() => setActiveStage(0)}
          style={{ whiteSpace: 'nowrap', borderRadius: 10 }}
        >
          All Stages ({steps.length})
        </button>

        {STAGE_NAMES.map((st) => {
          const countInStage = steps.filter((s) => s.stageNumber === st.stageNumber).length
          const compInStage = steps.filter((s) => s.stageNumber === st.stageNumber && s.status === 'completed').length
          const isCurrent = activeStage === st.stageNumber
          return (
            <button
              key={st.stageNumber}
              className={`adm-btn ${isCurrent ? 'amber' : ''}`}
              onClick={() => setActiveStage(st.stageNumber)}
              style={{
                whiteSpace: 'nowrap',
                borderRadius: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{st.icon}</span>
              <span>{st.name.split(':')[0]}</span>
              <span style={{ opacity: 0.7, fontSize: 11 }}>
                ({compInStage}/{countInStage})
              </span>
            </button>
          )
        })}
      </div>

      {/* ── SEARCH & STATUS FILTERS ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          background: 'var(--card-bg)',
          padding: '12px 16px',
          borderRadius: 14,
          border: '1px solid var(--card-border)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Buttons */}
          <button
            className={`adm-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            All ({steps.length})
          </button>
          <button
            className={`adm-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
            style={{ padding: '6px 12px', fontSize: 12, color: '#3b82f6' }}
          >
            ● In Progress ({stats.inProgressSteps})
          </button>
          <button
            className={`adm-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
            style={{ padding: '6px 12px', fontSize: 12, color: '#10b981' }}
          >
            ✓ Completed ({stats.completedSteps})
          </button>
          <button
            className={`adm-btn ${statusFilter === 'todo' ? 'active' : ''}`}
            onClick={() => setStatusFilter('todo')}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            ○ To Do ({stats.todoSteps})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ minWidth: 240, flex: 1, maxWidth: 360 }}>
          <input
            type="text"
            className="adm-input"
            placeholder="Search concepts, questions, deliverables…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 13 }}
          />
        </div>
      </div>

      {/* ── EMPTY STATE OR LIST OF STEPS ─────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-muted)' }}>
          Loading roadmap milestones…
        </div>
      ) : steps.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--card-bg)',
            borderRadius: 16,
            border: '1px dashed var(--line-strong)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>
            Start Your Industry Readiness Journey
          </h3>
          <p style={{ color: 'var(--ink-muted)', maxWidth: 520, marginInline: 'auto', marginBottom: 20 }}>
            Initialize your roadmap with 32 curated, high-impact milestones designed to take you to a senior full-stack engineer and land international work.
          </p>
          <button
            className="adm-btn amber"
            onClick={() => handleSeed(false)}
            disabled={seeding}
            style={{ padding: '12px 24px', fontSize: 14, fontWeight: 600 }}
          >
            {seeding ? 'Building your roadmap…' : '⚡ Initialize 32 Milestone Curriculum'}
          </button>
        </div>
      ) : filteredSteps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--ink-muted)' }}>
          No milestones match the active filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredSteps.map((step) => {
            const catStyle = CATEGORY_COLORS[step.category] || CATEGORY_COLORS.frontend
            const isSaving = savingStepId === step.id
            const isQuestionsOpen = Boolean(expandedQuestions[step.id])

            return (
              <div
                key={step.id}
                style={{
                  background: 'var(--card-bg)',
                  border: `1px solid ${
                    step.status === 'completed'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : step.status === 'in_progress'
                      ? 'rgba(59, 130, 246, 0.35)'
                      : 'var(--card-border)'
                  }`,
                  borderRadius: 16,
                  padding: '24px',
                  boxShadow: 'var(--card-shadow)',
                  position: 'relative',
                  transition: 'all 200ms ease',
                }}
              >
                {/* Milestone Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    flexWrap: 'wrap',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                        background: 'var(--surface-2)',
                        padding: '4px 10px',
                        borderRadius: 8,
                      }}
                    >
                      STEP {String(step.stepNumber).padStart(2, '0')}
                    </span>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: catStyle.bg,
                        color: catStyle.text,
                        border: `1px solid ${catStyle.border}`,
                        fontWeight: 600,
                      }}
                    >
                      {step.category}
                    </span>

                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                      {step.stage.split(':')[0]}
                    </span>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      disabled={isSaving}
                      onClick={() => handleStatusChange(step.id, 'todo')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        background: step.status === 'todo' ? 'var(--surface-2)' : 'transparent',
                        color: step.status === 'todo' ? 'var(--ink)' : 'var(--ink-muted)',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: step.status === 'todo' ? 600 : 400,
                      }}
                    >
                      To Do
                    </button>

                    <button
                      disabled={isSaving}
                      onClick={() => handleStatusChange(step.id, 'in_progress')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        border: step.status === 'in_progress' ? '1px solid #3b82f6' : '1px solid var(--line)',
                        background: step.status === 'in_progress' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: step.status === 'in_progress' ? '#3b82f6' : 'var(--ink-muted)',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: step.status === 'in_progress' ? 600 : 400,
                      }}
                    >
                      ● In Progress
                    </button>

                    <button
                      disabled={isSaving}
                      onClick={() => handleStatusChange(step.id, 'completed')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        border: step.status === 'completed' ? '1px solid #10b981' : '1px solid var(--line)',
                        background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                        color: step.status === 'completed' ? '#10b981' : 'var(--ink-muted)',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: step.status === 'completed' ? 600 : 400,
                      }}
                    >
                      ✓ Completed
                    </button>

                    <button
                      onClick={() => handleDeleteStep(step.id, step.title)}
                      title="Delete milestone"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ink-muted)',
                        fontSize: 14,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        marginLeft: 6,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
                  {step.description}
                </p>

                {/* Key Concepts Pills */}
                {step.keyConcepts && step.keyConcepts.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--ink-muted)',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                      }}
                    >
                      Key Competencies to Master
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {step.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: 'var(--surface-2)',
                            color: 'var(--ink)',
                            border: '1px solid var(--line)',
                          }}
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proof-of-Work Deliverable Box */}
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--accent)',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    <span>🎯</span>
                    <span>PROOF-OF-WORK CAPSTONE DELIVERABLE</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginBottom: 10 }}>
                    {step.deliverable}
                  </div>

                  {/* GitHub / Demo URL Input */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="url"
                      className="adm-input"
                      placeholder="Paste your GitHub repository or live URL (e.g. https://github.com/...)"
                      value={editingUrls[step.id] ?? ''}
                      onChange={(e) => setEditingUrls((prev) => ({ ...prev, [step.id]: e.target.value }))}
                      style={{ fontSize: 12.5, padding: '6px 10px', flex: 1 }}
                    />
                    <button
                      className="adm-btn"
                      disabled={isSaving}
                      onClick={() => handleSaveField(step.id, 'deliverableUrl')}
                      style={{ fontSize: 12, padding: '6px 12px', whiteSpace: 'nowrap' }}
                    >
                      Save URL
                    </button>
                    {step.deliverableUrl && (
                      <a
                        href={step.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="adm-btn"
                        style={{ fontSize: 12, padding: '6px 10px', textDecoration: 'none' }}
                      >
                        ↗ Open
                      </a>
                    )}
                  </div>
                </div>

                {/* Self-Assessment Questions (Expandable) */}
                {step.testQuestions && step.testQuestions.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <button
                      onClick={() =>
                        setExpandedQuestions((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--accent)',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <span>{isQuestionsOpen ? '▼' : '▶'}</span>
                      <span>
                        {isQuestionsOpen
                          ? 'Hide Technical Challenge Questions'
                          : `Self-Test: Answer These 3 Interview Questions (${step.testQuestions.length})`}
                      </span>
                    </button>

                    {isQuestionsOpen && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: '12px 16px',
                          borderRadius: 10,
                          background: 'rgba(217, 119, 6, 0.05)',
                          border: '1px solid rgba(217, 119, 6, 0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        {step.testQuestions.map((q, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>
                              Q{idx + 1}.
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
                              {q}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Personal Study Notes */}
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                      // PERSONAL STUDY NOTES & INSIGHTS
                    </span>
                    <button
                      disabled={isSaving}
                      onClick={() => handleSaveField(step.id, 'notes')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Save Notes
                    </button>
                  </div>
                  <textarea
                    className="adm-textarea"
                    rows={2}
                    placeholder="Record key lessons learned, challenges faced, or links to references…"
                    value={editingNotes[step.id] ?? ''}
                    onChange={(e) => setEditingNotes((prev) => ({ ...prev, [step.id]: e.target.value }))}
                    style={{ fontSize: 12.5, minHeight: 46 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── CREATE CUSTOM MILESTONE MODAL ─────────────────────────────────── */}
      {isNewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink)' }}>
                Add Custom Career Milestone
              </h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomStep} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="adm-label">Milestone Title</label>
                <input
                  type="text"
                  className="adm-input"
                  required
                  placeholder="e.g. Master GraphQL Federation & Apollo Router"
                  value={newStepForm.title}
                  onChange={(e) => setNewStepForm({ ...newStepForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="adm-label">Stage</label>
                  <select
                    className="adm-input"
                    value={newStepForm.stageNumber}
                    onChange={(e) => setNewStepForm({ ...newStepForm, stageNumber: Number(e.target.value) })}
                  >
                    {STAGE_NAMES.map((s) => (
                      <option key={s.stageNumber} value={s.stageNumber}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="adm-label">Category</label>
                  <select
                    className="adm-input"
                    value={newStepForm.category}
                    onChange={(e) => setNewStepForm({ ...newStepForm, category: e.target.value })}
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="devops">DevOps</option>
                    <option value="system-design">System Design</option>
                    <option value="monetization">Monetization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="adm-label">Description & Goal</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  required
                  placeholder="What will you learn and achieve in this milestone?"
                  value={newStepForm.description}
                  onChange={(e) => setNewStepForm({ ...newStepForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="adm-label">Proof-of-Work Capstone Deliverable</label>
                <input
                  type="text"
                  className="adm-input"
                  required
                  placeholder="e.g. Build a federated GraphQL gateway combining 2 microservices"
                  value={newStepForm.deliverable}
                  onChange={(e) => setNewStepForm({ ...newStepForm, deliverable: e.target.value })}
                />
              </div>

              <div>
                <label className="adm-label">Key Concepts (one per line)</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  placeholder="Subgraphs&#10;Query Planning&#10;Schema Directives"
                  value={newStepForm.keyConcepts}
                  onChange={(e) => setNewStepForm({ ...newStepForm, keyConcepts: e.target.value })}
                />
              </div>

              <div>
                <label className="adm-label">Challenge Questions (one per line)</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  placeholder="How does query planning resolve entity references across subgraphs?"
                  value={newStepForm.testQuestions}
                  onChange={(e) => setNewStepForm({ ...newStepForm, testQuestions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="adm-btn"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn amber">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
