import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { tourCreateSchema } from '@/lib/validations/tour'

/** Personal travel list — admin-only, including reads. */
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const tours = await prisma.tourLocation.findMany({
      orderBy: [{ region: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(tours)
  } catch (error) { return apiError(error) }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await readJson(request)
    const parsed = tourCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const tour = await prisma.tourLocation.create({ data: parsed.data })
    return NextResponse.json(tour, { status: 201 })
  } catch (error) { return apiError(error) }
}
