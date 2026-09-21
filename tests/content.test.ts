import { beforeEach, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
const mocks = vi.hoisted(() => ({ admin: true, invalidate: vi.fn() }))
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: async () => mocks.admin ? { sub: 'admin' } : NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }))
vi.mock('@/lib/invalidate-portfolio', () => ({ invalidatePortfolio: mocks.invalidate }))
import { contentRoutes } from '@/lib/content-routes'
import { skillSchema, certificationSchema } from '@/lib/validations/content'
const ops = { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() }
const handlers = contentRoutes(skillSchema, ops)
const id = '0123456789abcdef01234567'
beforeEach(() => { mocks.admin = true; ops.create.mockResolvedValue({ id }); ops.update.mockResolvedValue({ id }) })

it('guards mutations independently of Proxy', async () => {
  mocks.admin = false
  const res = await handlers.POST(new NextRequest('http://localhost/api/skills', { method: 'POST', body: '{}' }))
  expect(res.status).toBe(401)
  expect(ops.create).not.toHaveBeenCalled()
})
it('invalidates cache after each successful CMS mutation', async () => {
  expect((await handlers.POST(new NextRequest('http://localhost/api/skills', { method: 'POST', body: JSON.stringify({ name: 'TypeScript', category: 'frontend' }) }))).status).toBe(201)
  expect((await handlers.PUT(new NextRequest('http://localhost/api/skills', { method: 'PUT', body: JSON.stringify({ id, isEnabled: false }) }))).status).toBe(200)
  expect(ops.update).toHaveBeenCalledWith(id, { isEnabled: false })
  expect((await handlers.DELETE(new NextRequest('http://localhost/api/skills?id=' + id, { method: 'DELETE' }))).status).toBe(200)
  expect(mocks.invalidate).toHaveBeenCalledTimes(3)
})
it('rejects malformed inputs before persistence or invalidation', async () => {
  expect((await handlers.POST(new NextRequest('http://localhost/api/skills', { method: 'POST', body: JSON.stringify({ name: 'TypeScript', category: 'frontend', proficiency: 101 }) }))).status).toBe(400)
  expect(ops.create).not.toHaveBeenCalled()
  expect(mocks.invalidate).not.toHaveBeenCalled()
})
it('supports existing R2 certificate keys and prevents unsafe URL schemes', () => {
  const data = { name: 'Certificate', issuer: 'Issuer', date: '2026-01-01', fileType: 'pdf', fileUrl: 'certificates/uuid-file.pdf' }
  expect(certificationSchema.safeParse(data).success).toBe(true)
  expect(certificationSchema.safeParse({ ...data, fileUrl: 'javascript:alert(1)' }).success).toBe(false)
})
