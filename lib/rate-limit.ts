import { createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { HttpError } from '@/lib/http'

const COLLECTION = '_rate_limits'
const UNAVAILABLE = 'Rate limiter unavailable. Please try again.'
const MAX_LOCAL_BUCKETS = 10000

const globalState = globalThis as typeof globalThis & { rateLimitIndex?: Promise<unknown> }
const localBuckets = new Map<string, { count: number; reset: number }>()
export interface RateLimitResult { ok: boolean; remaining: number }

const result = (count: number, limit: number): RateLimitResult => ({ ok: count <= limit, remaining: Math.max(0, limit - count) })

/** Per-process fixed window. Only used outside production, where a shared store is optional. */
function localLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  for (const [id, bucket] of localBuckets) if (bucket.reset <= now) localBuckets.delete(id)
  if (localBuckets.size >= MAX_LOCAL_BUCKETS && !localBuckets.has(key)) throw new HttpError(503, 'Please try again later.')
  const bucket = localBuckets.get(key) ?? { count: 0, reset: now + windowMs }
  const next = { ...bucket, count: bucket.count + 1 }
  localBuckets.set(key, next)
  return result(next.count, limit)
}

/** Mongo returns small integers plainly, larger ones as extended JSON. */
function toCount(value: unknown): number {
  if (typeof value === 'number') return value
  const wrapped = value as { $numberLong?: string; $numberInt?: string } | null
  return Number(wrapped?.$numberLong ?? wrapped?.$numberInt ?? NaN)
}

/** Atomically increments the bucket, starting a new window when the old one has expired. */
async function bump(id: string, windowMs: number): Promise<number> {
  // A new bucket has no expiry yet, which counts as expired so its window starts now.
  const expired = { $lte: [{ $ifNull: ['$expiresAt', '$$NOW'] }, '$$NOW'] }
  const reply = await prisma.$runCommandRaw({
    findAndModify: COLLECTION,
    query: { _id: id },
    update: [{
      $set: {
        count: { $cond: [expired, 1, { $add: ['$count', 1] }] },
        expiresAt: { $cond: [expired, { $add: ['$$NOW', windowMs] }, '$expiresAt'] },
      },
    }],
    upsert: true,
    new: true,
  })
  const count = toCount((reply as { value?: { count?: unknown } | null }).value?.count)
  if (!Number.isFinite(count)) throw new Error('Missing rate bucket')
  return count
}

function ensureTtlIndex(): Promise<unknown> {
  return globalState.rateLimitIndex ??= prisma.$runCommandRaw({
    createIndexes: COLLECTION,
    indexes: [{ key: { expiresAt: 1 }, name: 'expiresAt_1', expireAfterSeconds: 0 }],
  })
}

/**
 * Atomic, shared fixed windows stored through the app's own Prisma connection,
 * so the limiter is reachable whenever the database is. Production fails closed
 * when the store is unavailable; development falls back to an in-memory window
 * so a database hiccup cannot block local sign-in.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === 'production'
  if (!process.env.DATABASE_URL) {
    if (isProduction) throw new HttpError(503, UNAVAILABLE)
    return localLimit(key, limit, windowMs)
  }
  const id = createHash('sha256').update(key).digest('hex')
  try {
    await ensureTtlIndex()
    try {
      return result(await bump(id, windowMs), limit)
    } catch {
      // Concurrent first requests can race to insert the same _id; the retry finds the bucket.
      return result(await bump(id, windowMs), limit)
    }
  } catch (error) {
    globalState.rateLimitIndex = undefined
    console.error('[rate-limit] store unavailable:', error instanceof Error ? error.name : 'Unknown error')
    if (isProduction) throw new HttpError(503, UNAVAILABLE)
    return localLimit(key, limit, windowMs)
  }
}

/**
 * Login bucket key scoped to client + attempted username.
 *
 * Without a trusted client IP every caller shares the "unknown" address, so an
 * IP-only bucket lets anyone lock the admin out. Scoping to the (normalised,
 * hashed) username means floods only hit the bucket of the username they try,
 * and brute force against the real username is still capped.
 */
export function loginRateKey(ip: string, username: string): string {
  const user = createHash('sha256').update(username.trim().toLowerCase()).digest('hex').slice(0, 32)
  return `login:${ip}:${user}`
}

let warnedUntrustedIp = false

/** Only accept forwarded client addresses from a configured trusted ingress. */
export function clientIp(headers: Headers): string {
  if (process.env.VERCEL === '1') return headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (process.env.TRUST_PROXY === 'true') return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (process.env.NODE_ENV === 'production' && !warnedUntrustedIp) {
    warnedUntrustedIp = true
    console.warn('[rate-limit] No trusted client IP source (VERCEL / TRUST_PROXY); all visitors share one rate-limit bucket.')
  }
  return 'unknown'
}
