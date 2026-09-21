import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ index: vi.fn(), update: vi.fn() }))
vi.mock('mongodb', () => ({
  MongoClient: class {
    db() { return { collection: () => ({ createIndex: mocks.index, findOneAndUpdate: mocks.update }) } }
  },
}))
import { rateLimit, clientIp } from '@/lib/rate-limit'
beforeEach(() => {
  const state = globalThis as typeof globalThis & { rateLimitClient?: unknown; rateLimitIndex?: unknown }
  delete state.rateLimitClient
  delete state.rateLimitIndex
  vi.stubEnv('DATABASE_URL', 'mongodb://example.test/portfolio')
  vi.stubEnv('NODE_ENV', 'production')
  mocks.index.mockResolvedValue('expiresAt_1')
})
afterEach(() => vi.unstubAllEnvs())

it('uses atomic shared counters with TTL expiry and hashed client identifiers', async () => {
  mocks.update.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 2 }).mockResolvedValueOnce({ count: 3 })
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: true, remaining: 1 })
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: true, remaining: 0 })
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: false, remaining: 0 })
  expect(mocks.index).toHaveBeenCalledWith({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  expect(mocks.index).toHaveBeenCalledOnce()
  const [filter, pipeline, options] = mocks.update.mock.calls[0]
  expect(filter._id).toMatch(/^[a-f0-9]{64}$/)
  expect(JSON.stringify(pipeline)).toContain('$$NOW')
  expect(options).toEqual({ upsert: true, returnDocument: 'after' })
})
it('retries a concurrent initial insert against the existing bucket', async () => {
  mocks.update.mockRejectedValueOnce({ code: 11000 }).mockResolvedValueOnce({ count: 3 })
  expect((await rateLimit('login:race', 2, 60000)).ok).toBe(false)
  expect(mocks.update.mock.calls[1][2]).toEqual({ returnDocument: 'after' })
})
it('fails closed when the production store is unavailable or unconfigured', async () => {
  mocks.index.mockRejectedValue(new Error('Offline'))
  await expect(rateLimit('test', 2, 60000)).rejects.toMatchObject({ status: 503 })
  vi.stubEnv('DATABASE_URL', '')
  await expect(rateLimit('test', 2, 60000)).rejects.toMatchObject({ status: 503 })
})
it('ignores caller-provided forwarding headers unless ingress is trusted', () => {
  vi.stubEnv('VERCEL', '')
  vi.stubEnv('TRUST_PROXY', 'false')
  const headers = new Headers({ 'x-forwarded-for': 'spoofed', 'x-vercel-forwarded-for': '192.0.2.2' })
  expect(clientIp(headers)).toBe('unknown')
  vi.stubEnv('VERCEL', '1')
  expect(clientIp(headers)).toBe('192.0.2.2')
})
