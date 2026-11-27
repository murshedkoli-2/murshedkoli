import { describe, expect, test } from 'vitest'
import {
  categorySummaries,
  filterSteps,
  nextMilestone,
  shortStageName,
  stageSummaries,
  taskProgress,
  type CareerStep,
} from '@/lib/admin/career'

const task = (id: string, status: 'todo' | 'completed' = 'todo') => ({
  id,
  title: `Task ${id}`,
  description: 'desc',
  estimatedMinutes: 30,
  status,
  exam: { prompt: 'Explain closures', rubric: [], referenceSolution: '' },
})

function step(over: Partial<CareerStep> & { id: string }): CareerStep {
  return {
    stage: 'Stage 1: Core',
    stageNumber: 1,
    stepNumber: 1,
    title: 'Event loop',
    category: 'frontend',
    description: 'How JS runs',
    keyConcepts: ['microtasks'],
    testQuestions: ['What is a microtask?'],
    deliverable: 'Demo app',
    status: 'todo',
    order: 0,
    tasks: [],
    ...over,
  }
}

const STEPS = [
  step({ id: 'a', order: 0, status: 'completed', tasks: [task('1', 'completed'), task('2', 'completed')] }),
  step({ id: 'b', order: 1, status: 'in_progress', title: 'Generics', keyConcepts: ['infer'], tasks: [task('3', 'completed'), task('4')] }),
  step({ id: 'c', order: 2, stageNumber: 2, category: 'backend', title: 'REST APIs', tasks: [task('5')] }),
]

describe('shortStageName', () => {
  test('drops the "Stage N:" prefix', () => {
    expect(shortStageName('Stage 3: Scalable Backend, APIs & Database Systems')).toBe('Scalable Backend, APIs & Database Systems')
    expect(shortStageName('Custom')).toBe('Custom')
  })
})

describe('taskProgress', () => {
  test('counts completed tasks and a whole-number percent', () => {
    expect(taskProgress(STEPS[1])).toEqual({ done: 1, total: 2, percent: 50 })
  })

  test('treats a step without tasks as 0 of 0', () => {
    expect(taskProgress(step({ id: 'x', tasks: [] }))).toEqual({ done: 0, total: 0, percent: 0 })
  })
})

describe('filterSteps', () => {
  const all = { stage: 0, status: 'all' as const, category: 'all', query: '' }

  test('returns everything with no filters', () => {
    expect(filterSteps(STEPS, all)).toHaveLength(3)
  })

  test('filters by stage, status and category together', () => {
    expect(filterSteps(STEPS, { ...all, stage: 1, status: 'in_progress' }).map((s) => s.id)).toEqual(['b'])
    expect(filterSteps(STEPS, { ...all, category: 'backend' }).map((s) => s.id)).toEqual(['c'])
  })

  test('searches titles, concepts and task exam prompts', () => {
    expect(filterSteps(STEPS, { ...all, query: 'infer' }).map((s) => s.id)).toEqual(['b'])
    expect(filterSteps(STEPS, { ...all, query: 'closures' })).toHaveLength(3)
    expect(filterSteps(STEPS, { ...all, query: 'nothing-matches' })).toEqual([])
  })
})

describe('stageSummaries', () => {
  test('summarises each stage that has steps', () => {
    const [one, two] = stageSummaries(STEPS)

    expect(one).toMatchObject({ stageNumber: 1, total: 2, completed: 1, inProgress: 1, percent: 50 })
    expect(two).toMatchObject({ stageNumber: 2, total: 1, completed: 0, percent: 0 })
  })
})

describe('categorySummaries', () => {
  test('orders categories by size and reports completion', () => {
    expect(categorySummaries(STEPS).map((c) => [c.key, c.total, c.completed])).toEqual([
      ['frontend', 2, 1],
      ['backend', 1, 0],
    ])
  })
})

describe('nextMilestone', () => {
  test('prefers the earliest in-progress step', () => {
    expect(nextMilestone(STEPS)?.id).toBe('b')
  })

  test('falls back to the earliest to-do step, then null', () => {
    expect(nextMilestone([STEPS[0], STEPS[2]])?.id).toBe('c')
    expect(nextMilestone([STEPS[0]])).toBeNull()
  })
})
