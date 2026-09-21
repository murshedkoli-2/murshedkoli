import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin, requireAdmin } from '@/lib/auth/require-admin'
import { publicProjectSelect, toPublicProject } from '@/lib/projects/public'
import { updateProjectRecord, deleteProjectRecord } from '@/lib/projects/service'
import { readJson, apiError, HttpError } from '@/lib/http'
import { z } from 'zod'

type Context = { params: Promise<{ id: string }> }
const idSchema = z.string().regex(/^[a-f0-9]{24}$/i)

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const id = idSchema.parse((await params).id)
    if (await isAdmin()) {
      const project = await prisma.project.findUnique({ where: { id } })
      if (!project) throw new HttpError(404, 'Project not found')
      return NextResponse.json(project, { headers: { 'Cache-Control': 'private, no-store' } })
    }
    const project = await prisma.project.findFirst({ where: { id, publishStatus: 'published' }, select: publicProjectSelect })
    if (!project) throw new HttpError(404, 'Project not found')
    return NextResponse.json(toPublicProject(project), { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiError(error) }
}

export async function PUT(request: NextRequest, { params }: Context) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const body = z.record(z.string(), z.unknown()).parse(await readJson(request))
    return NextResponse.json(await updateProjectRecord({ ...body, id: idSchema.parse((await params).id) }))
  } catch (error) { return apiError(error) }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    await deleteProjectRecord(idSchema.parse((await params).id))
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
