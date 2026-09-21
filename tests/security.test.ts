import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  token: undefined as string | undefined,
  settings: { findMany: vi.fn(), upsert: vi.fn() },
  career: { findMany: vi.fn() },
  project: { findUnique: vi.fn() },
}))
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => mocks.token ? { value: mocks.token } : undefined }) }))
vi.mock('@/lib/prisma', () => ({ prisma: { settings: mocks.settings, careerStep: mocks.career, project: mocks.project } }))
vi.mock('@/lib/invalidate-portfolio', () => ({ invalidatePortfolio: vi.fn() }))
import { createSessionToken, verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'
import { GET as settingsGET, PUT as settingsPUT } from '@/app/api/settings/route'
import { GET as careerGET } from '@/app/api/career/route'
import { GET as markdownGET } from '@/app/api/projects/[id]/markdown/route'
import { POST as logout } from '@/app/api/auth/logout/route'
import { proxy } from '@/proxy'
import { serializeJsonLd } from '@/lib/json-ld'

beforeEach(() => {
  vi.stubEnv('NEXTAUTH_SECRET', 'test-secret-at-least-thirty-two-characters-long')
  mocks.token = undefined
})

describe('private reads', () => {
  it('rejects anonymous settings, career and Markdown reads before querying data', async () => {
    expect((await settingsGET()).status).toBe(401)
    expect((await careerGET()).status).toBe(401)
    expect((await markdownGET(new NextRequest('http://localhost/api/projects/abc/markdown'), { params: Promise.resolve({ id: 'abc' }) })).status).toBe(401)
    expect(mocks.settings.findMany).not.toHaveBeenCalled()
    expect(mocks.career.findMany).not.toHaveBeenCalled()
    expect(mocks.project.findUnique).not.toHaveBeenCalled()
  })
  it('masks stored credentials even for the administrator', async () => {
    mocks.token = await createSessionToken('admin')
    mocks.settings.findMany.mockResolvedValue([{ key: 'nvidiaNimKey', value: 'private-key' }, { key: 'siteName', value: 'Portfolio' }])
    const res = await settingsGET()
    expect(await res.json()).toEqual({ nvidiaNimKey: '********', siteName: 'Portfolio' })
    expect(res.headers.get('cache-control')).toContain('no-store')
  })
  it('does not replace a saved credential with its display mask', async () => {
    mocks.token = await createSessionToken('admin')
    const res = await settingsPUT(new NextRequest('http://localhost/api/settings', { method: 'PUT', body: JSON.stringify({ key: 'nvidiaNimKey', value: '********' }) }))
    expect(res.status).toBe(200)
    expect(mocks.settings.upsert).not.toHaveBeenCalled()
  })
})

describe('sessions and page protection', () => {
  it('rejects forged and expired sessions', async () => {
    const token = await createSessionToken('admin')
    expect(await verifySessionToken(token + 'x')).toBeNull()
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 8 * 60 * 60 * 1000)
    expect(await verifySessionToken(token)).toBeNull()
    vi.useRealTimers()
  })
  it('expires the exact HTTP-only session cookie on logout', async () => {
    const res = await logout()
    expect(res.cookies.get(SESSION_COOKIE)?.value).toBe('')
    expect(res.headers.get('set-cookie')).toContain('Max-Age=0')
    expect(res.headers.get('set-cookie')).toContain('Path=/')
    expect(res.headers.get('set-cookie')).toContain('HttpOnly')
    // A browser applying this cookie can no longer access the admin page.
    const request = new NextRequest('http://localhost/admin/dashboard', { headers: { cookie: SESSION_COOKIE + '=' } })
    expect((await proxy(request)).headers.get('location')).toBe('http://localhost/admin/login')
  })
  it('keeps login and idempotent logout accessible without a session', async () => {
    expect((await proxy(new NextRequest('http://localhost/admin/login'))).status).toBe(200)
    expect((await proxy(new NextRequest('http://localhost/api/auth/logout', { method: 'POST' }))).status).toBe(200)
  })
})

it('escapes script delimiters while preserving JSON data', () => {
  const value = { description: '</script><script>alert(1)</script>' }
  const serialized = serializeJsonLd(value)
  expect(serialized).not.toContain('<')
  expect(JSON.parse(serialized)).toEqual(value)
})
