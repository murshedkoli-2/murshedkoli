import { careerSchema, careerSeedSchema } from '@/lib/validations/career'
import { readJson, apiError } from '@/lib/http'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { INITIAL_CAREER_ROADMAP, generateDefaultTasksForStep } from '@/lib/data/career-roadmap'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const steps = await prisma.careerStep.findMany({
      orderBy: [{ stageNumber: 'asc' }, { order: 'asc' }, { stepNumber: 'asc' }],
    })

    const totalSteps = steps.length
    const completedSteps = steps.filter((s) => s.status === 'completed').length
    const inProgressSteps = steps.filter((s) => s.status === 'in_progress').length
    const deliverablesLinked = steps.filter((s) => Boolean(s.deliverableUrl && s.deliverableUrl.trim())).length
    const readinessScore = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    return NextResponse.json({
      steps,
      stats: {
        totalSteps,
        completedSteps,
        inProgressSteps,
        todoSteps: totalSteps - completedSteps - inProgressSteps,
        deliverablesLinked,
        readinessScore,
      },
    })
  } catch (error) { return apiError(error) }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const raw = z.record(z.string(), z.unknown()).parse(await readJson(req))

    // Bulk Seed / Reset Action
    if (raw.action === 'seed') {
      const body = careerSeedSchema.parse(raw)
      const existingCount = await prisma.careerStep.count()
      if (existingCount > 0 && !body.force) {
        return NextResponse.json(
          { message: 'Roadmap already initialized', count: existingCount },
          { status: 200 }
        )
      }

      await prisma.careerStep.deleteMany({})

      const dataToInsert = INITIAL_CAREER_ROADMAP.map((item) => ({
        stage: item.stage,
        stageNumber: item.stageNumber,
        stepNumber: item.stepNumber,
        title: item.title,
        category: item.category,
        description: item.description,
        keyConcepts: item.keyConcepts,
        testQuestions: item.testQuestions,
        deliverable: item.deliverable,
        order: item.order,
        status: 'todo',
        tasks: generateDefaultTasksForStep(item),
      }))

      await (prisma as any).careerStep.createMany({
        data: dataToInsert,
      })

      return NextResponse.json({
        message: 'Successfully seeded industry career roadmap with granular sub-tasks',
        count: INITIAL_CAREER_ROADMAP.length,
      })
    }

    const body = careerSchema.parse(raw)

    // Single Custom Milestone Creation
    const {
      title,
      stage,
      stageNumber = 1,
      stepNumber,
      category = 'frontend',
      description,
      keyConcepts = [],
      testQuestions = [],
      deliverable,
      deliverableUrl,
      notes,
      tasks,
    } = body

    if (!title || !description || !deliverable) {
      return NextResponse.json(
        { error: 'Title, description, and deliverable are required.' },
        { status: 400 }
      )
    }

    const count = await prisma.careerStep.count({ where: { stageNumber: Number(stageNumber) } })
    const computedTasks = tasks || generateDefaultTasksForStep({
      stepNumber: Number(stepNumber) || count + 1,
      title,
      category,
      description,
      keyConcepts: Array.isArray(keyConcepts) ? keyConcepts : [],
      testQuestions: Array.isArray(testQuestions) ? testQuestions : [],
      deliverable,
    })

    const step = await (prisma as any).careerStep.create({
      data: {
        title,
        stage: stage || `Stage ${stageNumber}`,
        stageNumber: Number(stageNumber) || 1,
        stepNumber: Number(stepNumber) || count + 1,
        category,
        description,
        keyConcepts: Array.isArray(keyConcepts) ? keyConcepts : [],
        testQuestions: Array.isArray(testQuestions) ? testQuestions : [],
        deliverable,
        deliverableUrl: deliverableUrl || null,
        notes: notes || null,
        status: 'todo',
        order: count + 1,
        tasks: computedTasks,
      },
    })

    return NextResponse.json(step, { status: 201 })
  } catch (error) { return apiError(error) }
}
