'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { adminFetch } from '@/lib/admin/adminFetch'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { generateDefaultTasksForStep, type CareerTask } from '@/lib/data/career-roadmap'
import { EMPTY_STATS, type CareerStats, type CareerStep, type StepStatus } from '@/lib/admin/career'

export interface SubmissionDraft {
  answerText: string
  codeSnippet: string
  repoUrl: string
}

export interface NewStepForm {
  title: string
  stageNumber: number
  category: string
  description: string
  keyConcepts: string
  testQuestions: string
  deliverable: string
  deliverableUrl: string
  notes: string
}

export const EMPTY_NEW_STEP: NewStepForm = {
  title: '',
  stageNumber: 1,
  category: 'frontend',
  description: '',
  keyConcepts: '',
  testQuestions: '',
  deliverable: '',
  deliverableUrl: '',
  notes: '',
}

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error && err.message ? err.message : fallback)

/** Steps without stored tasks get the same generated defaults the API would create. */
const withTasks = (steps: CareerStep[]): CareerStep[] =>
  steps.map((s) => (s.tasks && s.tasks.length > 0 ? s : { ...s, tasks: generateDefaultTasksForStep(s) }))

/** All Career Roadmap data and mutations. UI components stay presentational. */
export function useCareerRoadmap(ready: boolean) {
  const [steps, setSteps] = useState<CareerStep[]>([])
  const [stats, setStats] = useState<CareerStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [savingStepId, setSavingStepId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [editingUrls, setEditingUrls] = useState<Record<string, string>>({})
  const [activeExam, setActiveExam] = useState<{ step: CareerStep; task: CareerTask } | null>(null)
  const [evaluatingTaskId, setEvaluatingTaskId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await adminFetch('/api/career')
      if (!res.ok) {
        toast.error('Failed to load career roadmap')
        return
      }
      const data: { steps?: CareerStep[]; stats?: CareerStats } = await res.json()
      const loaded = withTasks(data.steps ?? [])
      setSteps(loaded)
      if (data.stats) setStats(data.stats)
      setEditingNotes(Object.fromEntries(loaded.map((s) => [s.id, s.notes || ''])))
      setEditingUrls(Object.fromEntries(loaded.map((s) => [s.id, s.deliverableUrl || ''])))
    } catch {
      toast.error('Could not connect to career roadmap API')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) loadData()
  }, [ready, loadData])

  const putStep = (id: string, body: Record<string, unknown>) =>
    adminFetch(`/api/career/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  const changeStatus = async (id: string, status: StepStatus) => {
    setSavingStepId(id)
    try {
      const res = await putStep(id, { status })
      if (!res.ok) throw new Error('Could not update status')
      const updated: Partial<CareerStep> = await res.json()
      setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated, tasks: s.tasks } : s)))
      toast.success(`Milestone updated to ${status.replace('_', ' ')}`)
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Network error updating status'))
    } finally {
      setSavingStepId(null)
    }
  }

  const toggleTask = async (step: CareerStep, taskId: string, newStatus: 'todo' | 'completed') => {
    const current = step.tasks && step.tasks.length > 0 ? step.tasks : generateDefaultTasksForStep(step)
    const updatedTasks = current.map((t) =>
      t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null } : t,
    )
    setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, tasks: updatedTasks } : s)))
    setActiveExam((prev) =>
      prev && prev.task.id === taskId ? { ...prev, task: { ...prev.task, status: newStatus } } : prev,
    )

    const body: Record<string, unknown> = { tasks: updatedTasks }
    if (updatedTasks.every((t) => t.status === 'completed') && step.status !== 'completed') body.status = 'completed'

    try {
      const res = await putStep(step.id, body)
      if (!res.ok) throw new Error('Could not update task')
      toast.success(newStatus === 'completed' ? 'Task marked as completed!' : 'Task reset to To Do')
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update task'))
      loadData()
    }
  }

  const saveField = async (id: string, field: 'notes' | 'deliverableUrl') => {
    const value = field === 'notes' ? editingNotes[id] : editingUrls[id]
    setSavingStepId(id)
    try {
      const res = await putStep(id, { [field]: value })
      if (!res.ok) throw new Error('Failed to save')
      toast.success(`${field === 'notes' ? 'Notes' : 'Deliverable URL'} saved.`)
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Network error saving'))
    } finally {
      setSavingStepId(null)
    }
  }

  const deleteStep = async (id: string, title: string) => {
    const ok = await confirmDialog({
      title: `Delete "${title}"?`,
      description: 'This milestone and its evaluation history will be permanently deleted.',
      confirmLabel: 'Delete Milestone',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await adminFetch(`/api/career/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Could not delete milestone')
      setSteps((prev) => prev.filter((s) => s.id !== id))
      toast.success('Milestone deleted.')
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Error deleting milestone'))
    }
  }

  const seed = async (force = false) => {
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
      const data: { message?: string; error?: string } | null = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to initialize roadmap.')
      toast.success(
        data?.message ||
          (force
            ? 'Roadmap reset to 32 industry milestones with granular sub-tasks.'
            : 'Roadmap initialized with 32 milestones and exam systems!'),
      )
      await loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Error seeding roadmap.'))
    } finally {
      setSeeding(false)
    }
  }

  const createStep = async (form: NewStepForm): Promise<boolean> => {
    if (!form.title || !form.description || !form.deliverable) {
      toast.error('Please fill in Title, Description, and Deliverable.')
      return false
    }
    try {
      const res = await adminFetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          keyConcepts: form.keyConcepts.split(',').map((s) => s.trim()).filter(Boolean),
          testQuestions: form.testQuestions.split('\n').map((s) => s.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error('Could not create milestone')
      toast.success('Custom milestone added!')
      loadData()
      return true
    } catch (err) {
      toast.error(errorMessage(err, 'Network error creating milestone'))
      return false
    }
  }

  const evaluate = async (draft: SubmissionDraft): Promise<boolean> => {
    if (!activeExam) return false
    const { step, task } = activeExam
    if (!draft.answerText.trim() && !draft.codeSnippet.trim()) {
      toast.error('Paste an answer or code snippet to evaluate. Repository links are not inspected.')
      return false
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
          userSubmission: draft,
        }),
      })
      if (!res.ok) {
        const err: { error?: string } = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Evaluation request failed')
      }
      const data: { evaluation?: CareerTask['evaluation'] } = await res.json()
      const evaluation = data.evaluation
      toast.success(evaluation?.passed ? 'Task passed the AI evaluation!' : 'Task evaluated. Review the recommendations to improve your score.')
      await loadData()
      if (evaluation) {
        setActiveExam((prev) =>
          prev
            ? {
                ...prev,
                task: { ...prev.task, status: evaluation.passed ? 'completed' : 'in_progress', submission: draft, evaluation },
              }
            : null,
        )
      }
      return true
    } catch (err) {
      toast.error(errorMessage(err, 'Could not complete AI evaluation.'))
      return false
    } finally {
      setEvaluatingTaskId(null)
    }
  }

  const totals = useMemo(() => {
    const tasks = steps.flatMap((s) => s.tasks ?? [])
    return { tasks: tasks.length, tasksDone: tasks.filter((t) => t.status === 'completed').length }
  }, [steps])

  return {
    steps,
    stats,
    totals,
    loading,
    seeding,
    savingStepId,
    editingNotes,
    editingUrls,
    setNote: (id: string, value: string) => setEditingNotes((prev) => ({ ...prev, [id]: value })),
    setUrl: (id: string, value: string) => setEditingUrls((prev) => ({ ...prev, [id]: value })),
    activeExam,
    openExam: (step: CareerStep, task: CareerTask) => setActiveExam({ step, task }),
    closeExam: () => setActiveExam(null),
    evaluatingTaskId,
    changeStatus,
    toggleTask,
    saveField,
    deleteStep,
    seed,
    createStep,
    evaluate,
  }
}

export type CareerRoadmap = ReturnType<typeof useCareerRoadmap>
