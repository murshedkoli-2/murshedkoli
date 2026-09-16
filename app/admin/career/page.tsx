'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { adminFetch } from '@/lib/admin/adminFetch'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import {
  STAGE_NAMES,
  CareerTask,
  CareerTaskEvaluation,
  generateDefaultTasksForStep,
} from '@/lib/data/career-roadmap'

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
  tasks?: CareerTask[]
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
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [editingUrls, setEditingUrls] = useState<Record<string, string>>({})
  const [savingStepId, setSavingStepId] = useState<string | null>(null)

  // Exam & AI Evaluation Modal State
  const [activeExamTask, setActiveExamTask] = useState<{ step: CareerStep; task: CareerTask } | null>(null)
  const [examModalTab, setExamModalTab] = useState<'challenge' | 'reference' | 'report'>('challenge')
  const [submissionDraft, setSubmissionDraft] = useState({
    answerText: '',
    codeSnippet: '',
    repoUrl: '',
  })
  const [evaluatingTaskId, setEvaluatingTaskId] = useState<string | null>(null)

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

  // Open Exam Modal for a specific sub-task
  const openExamModal = (step: CareerStep, task: CareerTask) => {
    setActiveExamTask({ step, task })
    setSubmissionDraft({
      answerText: task.submission?.answerText || '',
      codeSnippet: task.submission?.codeSnippet || '',
      repoUrl: task.submission?.repoUrl || '',
    })
    setExamModalTab(task.evaluation ? 'report' : 'challenge')
  }

  // Handle AI Evaluation trigger
  const handleEvaluateTask = async () => {
    if (!activeExamTask) return
    const { step, task } = activeExamTask

    if (
      !submissionDraft.answerText.trim() &&
      !submissionDraft.codeSnippet.trim() &&
      !submissionDraft.repoUrl.trim()
    ) {
      toast.error('Please write an answer, code snippet, or provide a repository link to evaluate.')
      return
    }

    try {
      setEvaluatingTaskId(task.id)
      const res = await adminFetch('/api/career/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: step.id,
          taskId: task.id,
          taskTitle: task.title,
          taskDescription: task.description,
          examPrompt: task.exam.prompt,
          rubric: task.exam.rubric,
          referenceSolution: task.exam.referenceSolution,
          userSubmission: submissionDraft,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Evaluation request failed')
      }

      const data = await res.json()
      toast.success(
        data.evaluation.passed
          ? '🎉 Task Passed with AI Evaluation!'
          : 'Task evaluated. Review recommendations to improve score.'
      )

      // Switch to report tab
      setExamModalTab('report')

      // Reload roadmap data to update state & progress
      await loadData()

      // Update active modal task with latest evaluation
      if (data.evaluation) {
        setActiveExamTask((prev) =>
          prev
            ? {
                ...prev,
                task: {
                  ...prev.task,
                  status: data.evaluation.passed ? 'completed' : 'in_progress',
                  submission: submissionDraft,
                  evaluation: data.evaluation,
                },
              }
            : null
        )
      }
    } catch (err: any) {
      console.error('Task evaluation error:', err)
      toast.error(err.message || 'Could not complete AI evaluation.')
    } finally {
      setEvaluatingTaskId(null)
    }
  }

  // Toggle single task status manually
  const handleToggleTaskStatus = async (
    step: CareerStep,
    taskId: string,
    newStatus: 'todo' | 'completed'
  ) => {
    const currentTasks =
      step.tasks && step.tasks.length > 0 ? step.tasks : generateDefaultTasksForStep(step)
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
        }
      }
      return t
    })

    // Optimistic UI update
    setSteps((prev) =>
      prev.map((s) => (s.id === step.id ? { ...s, tasks: updatedTasks } : s))
    )

    const allCompleted = updatedTasks.every((t) => t.status === 'completed')
    const body: Record<string, any> = { tasks: updatedTasks }
    if (allCompleted && step.status !== 'completed') {
      body.status = 'completed'
    }

    try {
      const res = await adminFetch(`/api/career/${step.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        toast.success(newStatus === 'completed' ? 'Task marked as completed!' : 'Task reset to To Do')
        loadData()
      }
    } catch (err) {
      console.error('Task update failed:', err)
      toast.error('Could not update task')
    }
  }

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
      const data = await res.json().catch(() => null)
      if (res.ok) {
        toast.success(
          data?.message ||
            (force
              ? 'Roadmap reset to 32 industry milestones with granular sub-tasks.'
              : 'Roadmap initialized with 32 milestones and exam systems!')
        )
        await loadData()
      } else {
        toast.error(data?.error || data?.message || 'Failed to initialize roadmap.')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Error seeding roadmap.')
    } finally {
      setSeeding(false)
    }
  }

  // Milestone Status Change Handler
  const handleStatusChange = async (id: string, status: 'todo' | 'in_progress' | 'completed') => {
    setSavingStepId(id)
    try {
      const res = await adminFetch(`/api/career/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))
        toast.success(`Milestone updated to ${status.replace('_', ' ')}`)
        loadData()
      } else {
        toast.error('Could not update status')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error updating status')
    } finally {
      setSavingStepId(null)
    }
  }

  // Save editable field
  const handleSaveField = async (id: string, field: 'notes' | 'deliverableUrl') => {
    const value = field === 'notes' ? editingNotes[id] : editingUrls[id]
    setSavingStepId(id)
    try {
      const res = await adminFetch(`/api/career/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      if (res.ok) {
        toast.success(`${field === 'notes' ? 'Notes' : 'Deliverable URL'} saved.`)
        loadData()
      } else {
        toast.error('Failed to save')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error saving')
    } finally {
      setSavingStepId(null)
    }
  }

  // Delete milestone
  const handleDeleteStep = async (id: string, title: string) => {
    const ok = await confirmDialog({
      title: `Delete "${title}"?`,
      description: 'This milestone and its evaluation history will be permanently deleted.',
      confirmLabel: 'Delete Milestone',
      tone: 'danger',
    })
    if (!ok) return

    try {
      const res = await adminFetch(`/api/career/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSteps((prev) => prev.filter((s) => s.id !== id))
        toast.success('Milestone deleted.')
        loadData()
      } else {
        toast.error('Could not delete milestone')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting milestone')
    }
  }

  // Create custom milestone
  const handleCreateStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStepForm.title || !newStepForm.description || !newStepForm.deliverable) {
      toast.error('Please fill in Title, Description, and Deliverable.')
      return
    }

    try {
      const res = await adminFetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStepForm,
          keyConcepts: newStepForm.keyConcepts.split(',').map((s) => s.trim()).filter(Boolean),
          testQuestions: newStepForm.testQuestions.split('\n').map((s) => s.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success('Custom milestone added!')
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
        toast.error('Could not create milestone')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error creating milestone')
    }
  }

  // Filtered steps
  const filteredSteps = useMemo(() => {
    return steps.filter((step) => {
      if (activeStage > 0 && step.stageNumber !== activeStage) return false
      if (statusFilter !== 'all' && step.status !== statusFilter) return false
      if (categoryFilter !== 'all' && step.category !== categoryFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = step.title.toLowerCase().includes(q)
        const matchesDesc = step.description.toLowerCase().includes(q)
        const matchesConcepts = step.keyConcepts?.some((c) => c.toLowerCase().includes(q))
        const matchesDeliv = step.deliverable.toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc && !matchesConcepts && !matchesDeliv) return false
      }
      return true
    })
  }, [steps, activeStage, statusFilter, categoryFilter, searchQuery])

  if (!ready) return null

  return (
    <AdminShell
      active="career"
      title="Career Roadmap & Skill Mastery"
      subtitle="Industry Readiness Curriculum · Granular Tasks · Exam Systems · AI Evaluation"
      actions={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="adm-btn"
            onClick={() => handleSeed(true)}
            disabled={seeding}
            title="Reset to default 32 curriculum milestones"
            style={{ fontSize: 12 }}
          >
            ↻ Reset Defaults
          </button>
          <button
            className="adm-btn amber"
            onClick={() => setIsNewModalOpen(true)}
            style={{ fontSize: 12 }}
          >
            + New Milestone
          </button>
        </div>
      }
    >
      {/* ── TOP READINESS & TARGET BANNER ───────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Industry Readiness Gauge */}
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
            // INDUSTRY READINESS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: stats.readinessScore >= 80 ? '#10b981' : 'var(--accent)',
              }}
            >
              {stats.readinessScore}%
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
              ({stats.completedSteps}/{stats.totalSteps} milestones)
            </span>
          </div>

          {/* Progress Bar */}
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
            Complete granular sub-tasks and pass AI exams to reach 100%.
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
            Every linked deliverable serves as verifiable proof for high-paying roles.
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

      {/* ── LIST OF MILESTONES ──────────────────────────────────────────── */}
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
            Initialize your roadmap with 32 curated, high-impact milestones equipped with granular sub-tasks, exam systems, and AI evaluation.
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

            // Retrieve or generate granular sub-tasks
            const stepTasks =
              step.tasks && step.tasks.length > 0
                ? step.tasks
                : generateDefaultTasksForStep(step)

            const completedTasksCount = stepTasks.filter((t) => t.status === 'completed').length
            const isTasksOpen = expandedTasks[step.id] ?? true // default open

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

                {/* ── GRANULAR TASKS & EXAMS (NEW) ─────────────────────────── */}
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>📋</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: 'var(--ink)',
                          textTransform: 'uppercase',
                        }}
                      >
                        SUB-TASKS & EXAM SYSTEM ({completedTasksCount}/{stepTasks.length} Completed)
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedTasks((prev) => ({ ...prev, [step.id]: !isTasksOpen }))}
                      className="adm-btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      {isTasksOpen ? '▲ Collapse Tasks' : '▼ Expand Tasks'}
                    </button>
                  </div>

                  {/* Micro Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--surface)',
                      overflow: 'hidden',
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round((completedTasksCount / (stepTasks.length || 1)) * 100)}%`,
                        height: '100%',
                        background: '#10b981',
                        borderRadius: 999,
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>

                  {/* Task Items List */}
                  {isTasksOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {stepTasks.map((t, idx) => {
                        const isTaskDone = t.status === 'completed'
                        const evalScore = t.evaluation?.score

                        return (
                          <div
                            key={t.id || idx}
                            style={{
                              background: 'var(--card-bg)',
                              border: `1px solid ${
                                isTaskDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--line)'
                              }`,
                              borderRadius: 10,
                              padding: '12px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 12,
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 260 }}>
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isTaskDone}
                                onChange={(e) =>
                                  handleToggleTaskStatus(step, t.id, e.target.checked ? 'completed' : 'todo')
                                }
                                style={{ marginTop: 3, cursor: 'pointer', accentColor: '#10b981' }}
                                title="Toggle Task Completion"
                              />

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  <span
                                    style={{
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: isTaskDone ? 'var(--ink-muted)' : 'var(--ink)',
                                      textDecoration: isTaskDone ? 'line-through' : 'none',
                                    }}
                                  >
                                    {t.title}
                                  </span>

                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      padding: '1px 6px',
                                      borderRadius: 4,
                                      background: 'var(--surface-2)',
                                      color: 'var(--ink-muted)',
                                    }}
                                  >
                                    ⏱ {t.estimatedMinutes}m
                                  </span>

                                  {evalScore !== undefined && (
                                    <span
                                      style={{
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        padding: '1px 6px',
                                        borderRadius: 4,
                                        background: t.evaluation?.passed
                                          ? 'rgba(16, 185, 129, 0.12)'
                                          : 'rgba(245, 158, 11, 0.12)',
                                        color: t.evaluation?.passed ? '#10b981' : '#f59e0b',
                                      }}
                                    >
                                      {t.evaluation?.passed ? '✓' : '●'} {evalScore}% AI Score
                                    </span>
                                  )}
                                </div>

                                <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                                  {t.description}
                                </div>
                              </div>
                            </div>

                            {/* Task Action Button */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <button
                                className="adm-btn amber"
                                onClick={() => openExamModal(step, t)}
                                style={{
                                  fontSize: 11.5,
                                  padding: '5px 11px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontWeight: 600,
                                }}
                              >
                                <span>📝</span>
                                <span>{t.evaluation ? 'Exam & AI Report' : 'Take Exam & AI Eval'}</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

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
                          : `Self-Test: Answer These Interview Questions (${step.testQuestions.length})`}
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
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--ink-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Personal Learning Notes & Code Log
                    </span>
                    <button
                      className="adm-btn"
                      disabled={isSaving}
                      onClick={() => handleSaveField(step.id, 'notes')}
                      style={{ fontSize: 11, padding: '3px 8px' }}
                    >
                      Save Notes
                    </button>
                  </div>
                  <textarea
                    className="adm-textarea"
                    rows={2}
                    placeholder="Log your key discoveries, architectural notes, or interview take-aways…"
                    value={editingNotes[step.id] ?? ''}
                    onChange={(e) => setEditingNotes((prev) => ({ ...prev, [step.id]: e.target.value }))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── TASK EXAM, REFERENCE SYSTEM & AI EVALUATION MODAL ───────────── */}
      {activeExamTask && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setActiveExamTask(null)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              maxWidth: 780,
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'var(--surface-2)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    {activeExamTask.step.stage.split(':')[0]} · STEP {activeExamTask.step.stepNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: activeExamTask.task.status === 'completed'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'var(--surface-2)',
                      color: activeExamTask.task.status === 'completed' ? '#10b981' : 'var(--ink)',
                      fontWeight: 600,
                    }}
                  >
                    {activeExamTask.task.status === 'completed' ? '✓ Completed' : '● In Progress'}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                  {activeExamTask.task.title}
                </h3>
              </div>

              <button
                className="adm-icon-btn"
                onClick={() => setActiveExamTask(null)}
                title="Close"
                style={{ fontSize: 16, padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <button
                className={`adm-btn ${examModalTab === 'challenge' ? 'amber' : ''}`}
                onClick={() => setExamModalTab('challenge')}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                🎯 Challenge & Workspace
              </button>
              <button
                className={`adm-btn ${examModalTab === 'reference' ? 'amber' : ''}`}
                onClick={() => setExamModalTab('reference')}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                📖 Reference Solution & Rubric
              </button>
              <button
                className={`adm-btn ${examModalTab === 'report' ? 'amber' : ''}`}
                onClick={() => setExamModalTab('report')}
                style={{
                  fontSize: 12,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>📊 AI Evaluation Report</span>
                {activeExamTask.task.evaluation && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: activeExamTask.task.evaluation.passed ? '#10b981' : '#f59e0b',
                    }}
                  />
                )}
              </button>
            </div>

            {/* TAB 1: CHALLENGE & SUBMISSION WORKSPACE */}
            {examModalTab === 'challenge' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Problem Statement Box */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: '#3b82f6',
                      fontWeight: 700,
                      marginBottom: 6,
                      textTransform: 'uppercase',
                    }}
                  >
                    Exam Prompt & Technical Challenge
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                    {activeExamTask.task.exam.prompt}
                  </div>
                </div>

                {/* Code Solution Workspace */}
                <div className="adm-field">
                  <label className="adm-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Your Code Solution (TypeScript / JS / React / SQL / Shell)</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Monospace Code Editor</span>
                  </label>
                  <textarea
                    className="adm-textarea"
                    rows={8}
                    placeholder="// Paste or write your code solution here...
export function solution() {
  // Your implementation
}"
                    value={submissionDraft.codeSnippet}
                    onChange={(e) => setSubmissionDraft((prev) => ({ ...prev, codeSnippet: e.target.value }))}
                    style={{ fontFamily: 'monospace', fontSize: 12.5 }}
                  />
                </div>

                {/* Explanation / Walkthrough Textarea */}
                <div className="adm-field">
                  <label className="adm-label">
                    Conceptual Walkthrough & Trade-off Explanation
                  </label>
                  <textarea
                    className="adm-textarea"
                    rows={3}
                    placeholder="Explain how your solution works, execution order, edge cases handled, and why this design is resilient..."
                    value={submissionDraft.answerText}
                    onChange={(e) => setSubmissionDraft((prev) => ({ ...prev, answerText: e.target.value }))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>

                {/* Repository / Commit Link */}
                <div className="adm-field">
                  <label className="adm-label">GitHub Repository or Commit URL (Optional)</label>
                  <input
                    type="url"
                    className="adm-input"
                    placeholder="https://github.com/..."
                    value={submissionDraft.repoUrl}
                    onChange={(e) => setSubmissionDraft((prev) => ({ ...prev, repoUrl: e.target.value }))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>

                {/* Challenge Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                    borderTop: '1px solid var(--border)',
                    paddingTop: 14,
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      className="adm-btn amber"
                      onClick={handleEvaluateTask}
                      disabled={evaluatingTaskId === activeExamTask.task.id}
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>🤖</span>
                      <span>
                        {evaluatingTaskId === activeExamTask.task.id
                          ? 'Evaluating with Gemini AI…'
                          : 'Evaluate with AI (Gemini)'}
                      </span>
                    </button>

                    <button
                      className="adm-btn"
                      onClick={() =>
                        handleToggleTaskStatus(
                          activeExamTask.step,
                          activeExamTask.task.id,
                          activeExamTask.task.status === 'completed' ? 'todo' : 'completed'
                        )
                      }
                      style={{ fontSize: 12 }}
                    >
                      {activeExamTask.task.status === 'completed'
                        ? '↺ Mark as To Do'
                        : '✓ Mark Passed / Completed'}
                    </button>
                  </div>

                  <button className="adm-btn" onClick={() => setActiveExamTask(null)}>
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REFERENCE SOLUTION & RUBRIC */}
            {examModalTab === 'reference' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Rubric Checklist Box */}
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent)',
                      fontWeight: 700,
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    Senior Evaluation Rubric (What Interviewers & AI Check)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activeExamTask.task.exam.rubric.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benchmark Code Solution */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <label className="adm-label" style={{ margin: 0 }}>
                      Golden Standard Benchmark Solution
                    </label>
                    <button
                      className="adm-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(activeExamTask.task.exam.referenceSolution)
                        toast.success('Benchmark code copied!')
                      }}
                      style={{ fontSize: 11, padding: '2px 8px' }}
                    >
                      📋 Copy Code
                    </button>
                  </div>

                  <pre
                    style={{
                      background: '#0a192f',
                      color: '#e2e8f0',
                      padding: 16,
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      lineHeight: 1.55,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: 320,
                    }}
                  >
                    {activeExamTask.task.exam.referenceSolution}
                  </pre>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 12,
                  }}
                >
                  <button className="adm-btn" onClick={() => setExamModalTab('challenge')}>
                    Back to Challenge Workspace
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: AI EVALUATION REPORT */}
            {examModalTab === 'report' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeExamTask.task.evaluation ? (
                  <>
                    {/* Score & Verdict Card */}
                    <div
                      style={{
                        background: activeExamTask.task.evaluation.passed
                          ? 'rgba(16, 185, 129, 0.08)'
                          : 'rgba(245, 158, 11, 0.08)',
                        border: `1px solid ${
                          activeExamTask.task.evaluation.passed
                            ? 'rgba(16, 185, 129, 0.35)'
                            : 'rgba(245, 158, 11, 0.35)'
                        }`,
                        borderRadius: 12,
                        padding: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>
                            {activeExamTask.task.evaluation.passed ? '🟢' : '🟡'}
                          </span>
                          <b
                            style={{
                              fontSize: 16,
                              color: activeExamTask.task.evaluation.passed ? '#10b981' : '#f59e0b',
                            }}
                          >
                            {activeExamTask.task.evaluation.passed
                              ? 'EXAM PASSED · SENIOR LEVEL'
                              : 'NEEDS REVISION · REASSESSMENT SUGGESTED'}
                          </b>
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-muted)' }}>
                          {activeExamTask.task.evaluation.summary}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                          Evaluator Score
                        </div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: activeExamTask.task.evaluation.passed ? '#10b981' : '#f59e0b',
                          }}
                        >
                          {activeExamTask.task.evaluation.score}/100
                        </div>
                      </div>
                    </div>

                    {/* Strengths Section */}
                    {activeExamTask.task.evaluation.strengths?.length > 0 && (
                      <div
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            color: '#10b981',
                            fontWeight: 700,
                            marginBottom: 8,
                            textTransform: 'uppercase',
                          }}
                        >
                          Key Strengths Demonstrated
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {activeExamTask.task.evaluation.strengths.map((str, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                              <span style={{ color: '#10b981' }}>✓</span>
                              <span>{str}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Architectural Improvements */}
                    {activeExamTask.task.evaluation.improvements?.length > 0 && (
                      <div
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            color: '#f59e0b',
                            fontWeight: 700,
                            marginBottom: 8,
                            textTransform: 'uppercase',
                          }}
                        >
                          Recommended Architectural Fixes
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {activeExamTask.task.evaluation.improvements.map((imp, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                              <span style={{ color: '#f59e0b' }}>➔</span>
                              <span>{imp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Senior Engineer Tips Callout */}
                    {activeExamTask.task.evaluation.seniorTips && (
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.06)',
                          border: '1px solid rgba(59, 130, 246, 0.25)',
                          borderRadius: 10,
                          padding: 14,
                          fontSize: 13,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            color: '#3b82f6',
                            fontWeight: 700,
                            marginBottom: 6,
                            textTransform: 'uppercase',
                          }}
                        >
                          💡 Principal Engineer Production & Interview Tip
                        </div>
                        <div style={{ color: 'var(--ink)', lineHeight: 1.55 }}>
                          {activeExamTask.task.evaluation.seniorTips}
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border)',
                        paddingTop: 12,
                      }}
                    >
                      <button className="adm-btn amber" onClick={() => setExamModalTab('challenge')}>
                        Re-attempt & Re-evaluate Solution
                      </button>
                      <button className="adm-btn" onClick={() => setActiveExamTask(null)}>
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                    <h4 style={{ margin: '0 0 6px', color: 'var(--ink)', fontSize: 15 }}>
                      No AI Evaluation Yet
                    </h4>
                    <p style={{ margin: '0 0 16px', fontSize: 13 }}>
                      Write your solution in the Challenge tab and click &quot;Evaluate with AI (Gemini)&quot; to receive your senior review.
                    </p>
                    <button className="adm-btn amber" onClick={() => setExamModalTab('challenge')}>
                      Go to Challenge Workspace
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE NEW CUSTOM MILESTONE MODAL ───────────────────────────── */}
      {isNewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              maxWidth: 620,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>+ Add Custom Milestone</h3>
              <button className="adm-icon-btn" onClick={() => setIsNewModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStep} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="adm-field">
                <label className="adm-label">Milestone Title *</label>
                <input
                  className="adm-input"
                  required
                  placeholder="e.g. Distributed Tracing & OpenTelemetry Setup"
                  value={newStepForm.title}
                  onChange={(e) => setNewStepForm({ ...newStepForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="adm-field">
                  <label className="adm-label">Target Stage *</label>
                  <select
                    className="adm-input"
                    value={newStepForm.stageNumber}
                    onChange={(e) => setNewStepForm({ ...newStepForm, stageNumber: Number(e.target.value) })}
                  >
                    {STAGE_NAMES.map((st) => (
                      <option key={st.stageNumber} value={st.stageNumber}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-field">
                  <label className="adm-label">Category *</label>
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

              <div className="adm-field">
                <label className="adm-label">Description *</label>
                <textarea
                  className="adm-textarea"
                  required
                  rows={2}
                  placeholder="What will you learn and why is this critical for high-paying roles?"
                  value={newStepForm.description}
                  onChange={(e) => setNewStepForm({ ...newStepForm, description: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Key Competencies (comma separated)</label>
                <input
                  className="adm-input"
                  placeholder="e.g. Tracing, Jaeger, Spans, Context Propagation"
                  value={newStepForm.keyConcepts}
                  onChange={(e) => setNewStepForm({ ...newStepForm, keyConcepts: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Interview / Challenge Questions (1 per line)</label>
                <textarea
                  className="adm-textarea"
                  rows={2}
                  placeholder="How does context propagation work across asynchronous microservice boundaries?"
                  value={newStepForm.testQuestions}
                  onChange={(e) => setNewStepForm({ ...newStepForm, testQuestions: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Proof-of-Work Deliverable *</label>
                <input
                  className="adm-input"
                  required
                  placeholder="e.g. Implement distributed tracing pipeline in Docker Compose with Jaeger UI"
                  value={newStepForm.deliverable}
                  onChange={(e) => setNewStepForm({ ...newStepForm, deliverable: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="adm-btn" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn amber">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
