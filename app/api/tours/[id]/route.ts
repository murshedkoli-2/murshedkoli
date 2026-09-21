import { suppliedFields, objectId } from '@/lib/validations/content'
import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { tourUpdateSchema } from '@/lib/validations/tour'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const id = objectId.parse((await params).id)
    const body = await readJson(request)
    const parsed = tourUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const tour = await prisma.tourLocation.update({ where: { id }, data: suppliedFields(body as Record<string, unknown>, parsed.data) })
    return NextResponse.json(tour)
  } catch (error) { return apiError(error) }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.tourLocation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) { return apiError(error) }
}
