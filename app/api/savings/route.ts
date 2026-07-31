import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { savingsCreateSchema } from '@/lib/validations/savings'

/** Personal finance data — admin-only, including reads. */
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const accounts = await prisma.savingsAccount.findMany({
      orderBy: [{ createdAt: 'asc' }],
    })
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching savings accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch savings accounts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = savingsCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const account = await prisma.savingsAccount.create({ data: parsed.data })
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating savings account:', error)
    return NextResponse.json({ error: 'Failed to create savings account' }, { status: 500 })
  }
}
