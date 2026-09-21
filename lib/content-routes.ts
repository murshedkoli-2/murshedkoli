import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { apiError, readJson } from '@/lib/http'
import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { objectId, suppliedFields } from '@/lib/validations/content'

type Context = { params: Promise<{ id: string }> }
type Operations<T> = {
  list: (includeDisabled: boolean) => Promise<unknown>
  create: (data: T) => Promise<unknown>
  update: (id: string, data: Partial<T>) => Promise<unknown>
  remove: (id: string) => Promise<unknown>
}

/** Shared boundary for CMS CRUD: auth, bounded parsing, validation and invalidation. */
export function contentRoutes<S extends z.ZodRawShape>(schema: z.ZodObject<S>, ops: Operations<z.output<z.ZodObject<S>>>) {
  const GET = async (request: NextRequest) => {
    try {
      const disabled = request.nextUrl.searchParams.get('includeDisabled') === 'true'
      if (disabled) { const auth = await requireAdmin(); if (auth instanceof NextResponse) return auth }
      return NextResponse.json(await ops.list(disabled))
    } catch (error) { return apiError(error) }
  }
  const POST = async (request: NextRequest) => {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    try {
      const result = await ops.create(schema.parse(await readJson(request)))
      invalidatePortfolio()
      return NextResponse.json(result, { status: 201 })
    } catch (error) { return apiError(error) }
  }
  const PUT = async (request: NextRequest, context?: Context) => {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    try {
      const body = z.record(z.string(), z.unknown()).parse(await readJson(request))
      const id = objectId.parse(context ? (await context.params).id : body.id)
      const parsed = schema.partial().parse(body)
      const result = await ops.update(id, suppliedFields(body, parsed) as Partial<z.output<z.ZodObject<S>>>)
      invalidatePortfolio()
      return NextResponse.json(result)
    } catch (error) { return apiError(error) }
  }
  const DELETE = async (request: NextRequest, context?: Context) => {
    const auth = await requireAdmin()
    if (auth instanceof NextResponse) return auth
    try {
      const id = objectId.parse(context ? (await context.params).id : request.nextUrl.searchParams.get('id'))
      await ops.remove(id)
      invalidatePortfolio()
      return NextResponse.json({ ok: true })
    } catch (error) { return apiError(error) }
  }
  return { GET, POST, PUT, DELETE }
}
