import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { readJson, apiError } from '@/lib/http'
import { visitedDistrictsSchema } from '@/lib/validations/tour'

/** Districts ticked on the admin travel map — admin-only, including reads. */
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const rows = await prisma.visitedDistrict.findMany({ select: { districtId: true } })
    return NextResponse.json({ districtIds: rows.map((r) => r.districtId) }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiError(error) }
}

/** Replaces the whole set, so the client can send its current selection. */
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { districtIds } = visitedDistrictsSchema.parse(await readJson(request, 8 * 1024))
    await prisma.$transaction([
      prisma.visitedDistrict.deleteMany({ where: { districtId: { notIn: districtIds } } }),
      ...districtIds.map((districtId) => prisma.visitedDistrict.upsert({
        where: { districtId }, create: { districtId }, update: {},
      })),
    ])
    return NextResponse.json({ districtIds })
  } catch (error) { return apiError(error) }
}
