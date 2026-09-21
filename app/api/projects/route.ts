import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { publicProjectSelect, toPublicProject } from '@/lib/projects/public'
import { createProjectRecord } from '@/lib/projects/service'
import { ProjectLifecycleStatus } from '@/lib/validations/project'
import { readJson, apiError } from '@/lib/http'

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get('all') === 'true'
    if (all) {
      const auth = await requireAdmin()
      if (auth instanceof NextResponse) return auth
    }
    const rawStatus = request.nextUrl.searchParams.get('lifecycleStatus')
    const lifecycleStatus = rawStatus ? ProjectLifecycleStatus.parse(rawStatus) : undefined
    const orderBy = [{ featured: 'desc' as const }, { order: 'asc' as const }, { createdAt: 'desc' as const }]
    if (all) return NextResponse.json(await prisma.project.findMany({ where: { lifecycleStatus }, orderBy }), { headers: { 'Cache-Control': 'private, no-store' } })
    const projects = await prisma.project.findMany({
      where: { publishStatus: 'published', lifecycleStatus }, select: publicProjectSelect, orderBy,
    })
    return NextResponse.json(projects.map(toPublicProject))
  } catch (error) { return apiError(error) }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const body = await readJson(request)
    return NextResponse.json(await createProjectRecord(body), { status: 201 })
  } catch (error) { return apiError(error) }
}
