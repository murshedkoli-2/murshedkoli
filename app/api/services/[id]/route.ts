import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { suppliedFields, objectId } from '@/lib/validations/content'
import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { serviceUpdateSchema } from '@/lib/validations/service'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const id = objectId.parse((await params).id)
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(service)
  } catch (error) { return apiError(error) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await readJson(request)
    const parsed = serviceUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const service = await prisma.service.update({ where: { id }, data: suppliedFields(body as Record<string, unknown>, parsed.data) })
    invalidatePortfolio()
    return NextResponse.json(service)
  } catch (error) { return apiError(error) }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.service.delete({ where: { id } })
    invalidatePortfolio()
    return NextResponse.json({ success: true })
  } catch (error) { return apiError(error) }
}
