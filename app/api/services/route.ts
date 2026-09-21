import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { suppliedFields, objectId } from '@/lib/validations/content'
import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { serviceCreateSchema } from '@/lib/validations/service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDisabled = searchParams.get('includeDisabled') === 'true'
    if (includeDisabled) { const auth = await requireAdmin(); if (auth instanceof NextResponse) return auth }

    const services = await prisma.service.findMany({
      where: includeDisabled ? {} : { isEnabled: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json(services)
  } catch (error) { return apiError(error) }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await readJson(request)
    const parsed = serviceCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const service = await prisma.service.create({ data: parsed.data })
    invalidatePortfolio()
    return NextResponse.json(service, { status: 201 })
  } catch (error) { return apiError(error) }
}
