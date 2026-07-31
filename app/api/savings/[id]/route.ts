import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { savingsUpdateSchema } from '@/lib/validations/savings'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = savingsUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const account = await prisma.savingsAccount.update({ where: { id }, data: parsed.data })
    return NextResponse.json(account)
  } catch (error) {
    console.error('Error updating savings account:', error)
    return NextResponse.json({ error: 'Failed to update savings account' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.savingsAccount.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting savings account:', error)
    return NextResponse.json({ error: 'Failed to delete savings account' }, { status: 500 })
  }
}
