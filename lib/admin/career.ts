/** Types and pure helpers for the Career Roadmap admin page (unit-tested). */
import { STAGE_NAMES, type CareerTask } from '@/lib/data/career-roadmap'

export type StepStatus = 'todo' | 'in_progress' | 'completed'
export type StatusFilter = 'all' | StepStatus

export interface CareerStep {
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
  status: StepStatus
  notes?: string | null
  tasks?: CareerTask[]
  completedAt?: string | null
  order: number
}

export interface CareerStats {
  totalSteps: number
  completedSteps: number
  inProgressSteps: number
  todoSteps: number
  deliverablesLinked: number
  readinessScore: number
}

export const EMPTY_STATS: CareerStats = {
  totalSteps: 0,
  completedSteps: 0,
  inProgressSteps: 0,
  todoSteps: 0,
  deliverablesLinked: 0,
  readinessScore: 0,
}

/** Category label and the theme token that colours it. */
export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  frontend: { label: 'Frontend', color: 'var(--blue)' },
  backend: { label: 'Backend', color: 'var(--green)' },
  database: { label: 'Database', color: 'oklch(62% 0.17 300)' },
  devops: { label: 'DevOps', color: 'oklch(68% 0.17 50)' },
  'system-design': { label: 'System design', color: 'oklch(64% 0.19 350)' },
  monetization: { label: 'Monetization', color: 'var(--accent)' },
}

export function categoryMeta(key: string): { label: string; color: string } {
  return CATEGORY_META[key] ?? { label: key.replace(/-/g, ' '), color: 'var(--muted)' }
}

export const STATUS_LABEL: Record<StepStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  completed: 'Done',
}

export function shortStageName(name: string): string {
  return name.replace(/^Stage\s+\d+\s*:\s*/i, '').trim()
}

export function stageName(stageNumber: number): string {
  const found = STAGE_NAMES.find((s) => s.stageNumber === stageNumber)
  return found ? shortStageName(found.name) : `Stage ${stageNumber}`
}

export interface Progress {
  done: number
  total: number
  percent: number
}

export function taskProgress(step: Pick<CareerStep, 'tasks'>): Progress {
  const tasks = step.tasks ?? []
  const done = tasks.filter((t) => t.status === 'completed').length
  return { done, total: tasks.length, percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0 }
}

export interface StepFilters {
  stage: number
  status: StatusFilter
  category: string
  query: string
}

function matchesText(step: CareerStep, q: string): boolean {
  const fields = [
    step.title,
    step.description,
    step.deliverable,
    ...(step.keyConcepts ?? []),
    ...(step.testQuestions ?? []),
    ...(step.tasks ?? []).flatMap((t) => [t.title, t.description, t.exam?.prompt ?? '']),
  ]
  return fields.some((f) => f.toLowerCase().includes(q))
}

export function filterSteps(steps: readonly CareerStep[], f: StepFilters): CareerStep[] {
  const q = f.query.trim().toLowerCase()
  return steps.filter(
    (s) =>
      (f.stage === 0 || s.stageNumber === f.stage) &&
      (f.status === 'all' || s.status === f.status) &&
      (f.category === 'all' || s.category === f.category) &&
      (!q || matchesText(s, q)),
  )
}

export interface StageSummary {
  stageNumber: number
  name: string
  icon: string
  total: number
  completed: number
  inProgress: number
  percent: number
}

export function stageSummaries(steps: readonly CareerStep[]): StageSummary[] {
  const numbers = Array.from(new Set(steps.map((s) => s.stageNumber))).sort((a, b) => a - b)
  return numbers.map((n) => {
    const inStage = steps.filter((s) => s.stageNumber === n)
    const completed = inStage.filter((s) => s.status === 'completed').length
    const meta = STAGE_NAMES.find((s) => s.stageNumber === n)
    return {
      stageNumber: n,
      name: stageName(n),
      icon: meta?.icon ?? String(n),
      total: inStage.length,
      completed,
      inProgress: inStage.filter((s) => s.status === 'in_progress').length,
      percent: inStage.length ? Math.round((completed / inStage.length) * 100) : 0,
    }
  })
}

export interface CategorySummary {
  key: string
  label: string
  color: string
  total: number
  completed: number
  percent: number
}

export function categorySummaries(steps: readonly CareerStep[]): CategorySummary[] {
  const keys = Array.from(new Set(steps.map((s) => s.category)))
  return keys
    .map((key) => {
      const inCat = steps.filter((s) => s.category === key)
      const completed = inCat.filter((s) => s.status === 'completed').length
      return {
        key,
        ...categoryMeta(key),
        total: inCat.length,
        completed,
        percent: inCat.length ? Math.round((completed / inCat.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
}

const byOrder = (a: CareerStep, b: CareerStep) => a.order - b.order || a.stepNumber - b.stepNumber

/** The milestone to work on next: the earliest in progress, else the earliest to do. */
export function nextMilestone(steps: readonly CareerStep[]): CareerStep | null {
  const sorted = [...steps].sort(byOrder)
  return sorted.find((s) => s.status === 'in_progress') ?? sorted.find((s) => s.status === 'todo') ?? null
}
