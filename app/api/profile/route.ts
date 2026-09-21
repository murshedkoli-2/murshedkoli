import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { profileSchema, suppliedFields } from '@/lib/validations/content'
import { readJson, apiError } from '@/lib/http'
import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { getPublicProfile } from '@/lib/site-data'
import { z } from 'zod'

export async function GET() {
  return NextResponse.json(await getPublicProfile())
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const body = z.record(z.string(), z.unknown()).parse(await readJson(request))
    const existing = await prisma.profile.findFirst({ orderBy: { updatedAt: 'desc' } })
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data: suppliedFields(body, profileSchema.partial().parse(body)) })
      : await prisma.profile.create({ data: profileSchema.parse(body) })
    invalidatePortfolio()
    return NextResponse.json(profile)
  } catch (error) { return apiError(error) }
}
