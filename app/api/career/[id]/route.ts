import { careerSchema } from '@/lib/validations/career'
import { objectId } from '@/lib/validations/content'
import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const id = objectId.parse((await params).id)
    const body = careerSchema.partial().parse(await readJson(req))

    const existing = await prisma.careerStep.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Career step not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}

    if (body.status !== undefined) {
      data.status = body.status
      if (body.status === 'completed' && existing.status !== 'completed') {
        data.completedAt = new Date()
      } else if (body.status !== 'completed') {
        data.completedAt = null
      }
    }

    if (body.notes !== undefined) data.notes = body.notes
    if (body.tasks !== undefined) data.tasks = body.tasks
    if (body.deliverableUrl !== undefined) data.deliverableUrl = body.deliverableUrl
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.deliverable !== undefined) data.deliverable = body.deliverable
    if (body.keyConcepts !== undefined) data.keyConcepts = body.keyConcepts
    if (body.testQuestions !== undefined) data.testQuestions = body.testQuestions
    if (body.category !== undefined) data.category = body.category
    if (body.order !== undefined) data.order = Number(body.order)

    const updated = await (prisma as any).careerStep.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) { return apiError(error) }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const id = objectId.parse((await params).id)
    await prisma.careerStep.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
