import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ command: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ prisma: { $runCommandRaw: mocks.command } }))
import { rateLimit, clientIp, loginRateKey } from '@/lib/rate-limit'

type Command = { findAndModify?: string; createIndexes?: string; query?: { _id: string }; update?: unknown; upsert?: boolean; new?: boolean; indexes?: unknown }
const bucket = (count: unknown) => ({ value: { count }, ok: 1 })

/** Answers index creation, then hands out the queued bucket replies in order. */
function queueBuckets(...replies: unknown[]) {
  const queue = [...replies]
  mocks.command.mockImplementation(async (command: Command) => {
    if (command.createIndexes) return { ok: 1 }
    const next = queue.shift()
    if (next instanceof Error) throw next
    return next
  })
}
const calls = (kind: 'findAndModify' | 'createIndexes') => mocks.command.mock.calls.map(([c]) => c as Command).filter((c) => c[kind])

beforeEach(() => {
  delete (globalThis as typeof globalThis & { rateLimitIndex?: unknown }).rateLimitIndex
  mocks.command.mockReset()
  vi.stubEnv('DATABASE_URL', 'mongodb://example.test/portfolio')
  vi.stubEnv('NODE_ENV', 'production')
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks() })

it('uses atomic shared counters with TTL expiry and hashed client identifiers', async () => {
  queueBuckets(bucket(1), bucket(2), bucket({ $numberLong: '3' }))
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: true, remaining: 1 })
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: true, remaining: 0 })
  expect(await rateLimit('login:192.0.2.1', 2, 60000)).toEqual({ ok: false, remaining: 0 })
  expect(calls('createIndexes')).toHaveLength(1)
  expect(calls('createIndexes')[0].indexes).toEqual([{ key: { expiresAt: 1 }, name: 'expiresAt_1', expireAfterSeconds: 0 }])
  const [first] = calls('findAndModify')
  expect(first.findAndModify).toBe('_rate_limits')
  expect(first.query?._id).toMatch(/^[a-f0-9]{64}$/)
  expect(JSON.stringify(first.update)).toContain('$$NOW')
  expect(first).toMatchObject({ upsert: true, new: true })
})
it('retries a concurrent initial insert against the existing bucket', async () => {
  queueBuckets(new Error('E11000 duplicate key'), bucket(3))
  expect((await rateLimit('login:race', 2, 60000)).ok).toBe(false)
  expect(calls('findAndModify')).toHaveLength(2)
})
it('fails closed when the production store is unavailable or unconfigured', async () => {
  mocks.command.mockRejectedValue(new Error('Offline'))
  await expect(rateLimit('test', 2, 60000)).rejects.toMatchObject({ status: 503 })
  vi.stubEnv('DATABASE_URL', '')
  await expect(rateLimit('test', 2, 60000)).rejects.toMatchObject({ status: 503 })
})
it('keeps limiting in memory during development when the store is unreachable, so sign-in still works', async () => {
  vi.stubEnv('NODE_ENV', 'development')
  mocks.command.mockRejectedValue(new Error('Offline'))
  expect(await rateLimit('dev-offline', 2, 60000)).toEqual({ ok: true, remaining: 1 })
  expect(await rateLimit('dev-offline', 2, 60000)).toEqual({ ok: true, remaining: 0 })
  expect((await rateLimit('dev-offline', 2, 60000)).ok).toBe(false)
})
it('ignores caller-provided forwarding headers unless ingress is trusted', () => {
  vi.stubEnv('VERCEL', '')
  vi.stubEnv('TRUST_PROXY', 'false')
  const headers = new Headers({ 'x-forwarded-for': 'spoofed', 'x-vercel-forwarded-for': '192.0.2.2' })
  expect(clientIp(headers)).toBe('unknown')
  vi.stubEnv('VERCEL', '1')
  expect(clientIp(headers)).toBe('192.0.2.2')
})
it('scopes login buckets to the attempted username so wrong-username floods cannot lock out the admin', () => {
  const admin = loginRateKey('unknown', 'admin')
  expect(loginRateKey('unknown', 'Admin ')).toBe(admin)
  expect(loginRateKey('unknown', 'attacker')).not.toBe(admin)
  expect(loginRateKey('192.0.2.1', 'admin')).not.toBe(admin)
  expect(admin).not.toContain('admin')
})
