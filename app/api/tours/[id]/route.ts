import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { tourUpdateSchema } from '@/lib/validations/tour'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = tourUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const tour = await prisma.tourLocation.update({ where: { id }, data: parsed.data })
    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error updating tour location:', error)
    return NextResponse.json({ error: 'Failed to update tour location' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.tourLocation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tour location:', error)
    return NextResponse.json({ error: 'Failed to delete tour location' }, { status: 500 })
  }
}
