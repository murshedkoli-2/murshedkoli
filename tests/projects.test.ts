import { beforeEach, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
const mocks = vi.hoisted(() => ({
  admin: false,
  project: { findMany: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  invalidate: vi.fn(),
}))
vi.mock('@/lib/auth/require-admin', () => ({
  isAdmin: async () => mocks.admin,
  requireAdmin: async () => mocks.admin ? { sub: 'admin' } : NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
}))
vi.mock('@/lib/prisma', () => ({ prisma: { project: mocks.project } }))
vi.mock('@/lib/invalidate-portfolio', () => ({ invalidatePortfolio: mocks.invalidate }))
import { GET } from '@/app/api/projects/route'
import { GET as byId } from '@/app/api/projects/[id]/route'
import { updateProjectRecord } from '@/lib/projects/service'
import { toPublicProject, type PublicProject } from '@/lib/projects/public'

const id = '0123456789abcdef01234567'
beforeEach(() => { mocks.admin = false })

it('does not let anonymous callers enable all-projects mode', async () => {
  const res = await GET(new NextRequest('http://localhost/api/projects?all=true'))
  expect(res.status).toBe(401)
  expect(mocks.project.findMany).not.toHaveBeenCalled()
})

it('filters single-project reads by published status for anonymous visitors', async () => {
  mocks.project.findFirst.mockResolvedValue(null)
  const res = await byId(new NextRequest('http://localhost/api/projects/' + id), { params: Promise.resolve({ id }) })
  expect(res.status).toBe(404)
  expect(mocks.project.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id, publishStatus: 'published' } }))
})

it('strips internal fields and disabled links even from a full record', () => {
  const result = toPublicProject({
    id, title: 'Demo', modules: [{ secret: true }], deployment: { secret: true },
    githubUrl: 'https://private.example', githubUrlEnabled: false,
    demoUrl: 'https://demo.example', demoUrlEnabled: true,
    adminLiveUrl: 'https://admin.example',
  } as unknown as PublicProject)
  expect(result.githubUrl).toBeNull()
  expect(result.demoUrl).toBe('https://demo.example')
  expect(result).not.toHaveProperty('modules')
  expect(result).not.toHaveProperty('deployment')
  expect(result).not.toHaveProperty('adminLiveUrl')
})

it('preserves omitted fields on a title-only save and invalidates public caches', async () => {
  mocks.admin = true
  mocks.project.update.mockResolvedValue({ id, title: 'Renamed' })
  await updateProjectRecord({ id, title: 'Renamed' })
  expect(mocks.project.update).toHaveBeenCalledWith({ where: { id }, data: { title: 'Renamed' } })
  expect(mocks.invalidate).toHaveBeenCalledOnce()
})

it('merges existing progress inputs instead of resetting unsupplied sections', async () => {
  mocks.admin = true
  mocks.project.findUnique.mockResolvedValue({ modules: [{ status: 'completed', tasks: [] }], features: [], roadmap: [{ progress: 100 }] })
  mocks.project.update.mockResolvedValue({ id })
  await updateProjectRecord({ id, features: [{ id: 'feature', title: 'Done', done: true, order: 0 }] })
  expect(mocks.project.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ overallProgress: 100 }) }))
})

it('accepts explicit link clearing but rejects unsupported project types', async () => {
  mocks.admin = true
  await updateProjectRecord({ id, githubUrl: null })
  expect(mocks.project.update).toHaveBeenCalledWith({ where: { id }, data: { githubUrl: null } })
  await expect(updateProjectRecord({ id, projectType: 'invalid' })).rejects.toThrow()
})
