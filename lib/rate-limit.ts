import { createHash } from 'node:crypto'
import { MongoClient } from 'mongodb'
import { HttpError } from '@/lib/http'

type Bucket = { _id: string; count: number; expiresAt: Date }
const globalState = globalThis as typeof globalThis & {
  rateLimitClient?: MongoClient
  rateLimitIndex?: Promise<string>
}
const localBuckets = new Map<string, { count: number; reset: number }>()
export interface RateLimitResult { ok: boolean; remaining: number }

/** Atomic, shared fixed windows. Production fails closed when the store is unavailable. */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    if (process.env.NODE_ENV === 'production') throw new HttpError(503, 'Rate limiter unavailable. Please try again.')
    const now = Date.now()
    for (const [id, bucket] of localBuckets) if (bucket.reset <= now) localBuckets.delete(id)
    if (localBuckets.size >= 10000 && !localBuckets.has(key)) throw new HttpError(503, 'Please try again later.')
    const bucket = localBuckets.get(key) ?? { count: 0, reset: now + windowMs }
    bucket.count++
    localBuckets.set(key, bucket)
    return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) }
  }
  try {
    const client = globalState.rateLimitClient ??= new MongoClient(uri, { maxPoolSize: 3, serverSelectionTimeoutMS: 3000 })
    const collection = client.db().collection<Bucket>('_rate_limits')
    const index = globalState.rateLimitIndex ??= collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    await index
    const id = createHash('sha256').update(key).digest('hex')
    const expired = { $lte: [{ $ifNull: ['$expiresAt', new Date(0)] }, '$$NOW'] }
    const update = [{
      $set: {
        count: { $cond: [expired, 1, { $add: ['$count', 1] }] },
        expiresAt: { $cond: [expired, { $add: ['$$NOW', windowMs] }, '$expiresAt'] },
      },
    }]
    let bucket: Bucket | null
    try {
      bucket = await collection.findOneAndUpdate({ _id: id }, update, { upsert: true, returnDocument: 'after' })
    } catch (error) {
      // Concurrent first requests may race to insert the same unique _id.
      if ((error as { code?: number }).code !== 11000) throw error
      bucket = await collection.findOneAndUpdate({ _id: id }, update, { returnDocument: 'after' })
    }
    if (!bucket) throw new Error('Missing rate bucket')
    return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) }
  } catch {
    globalState.rateLimitIndex = undefined
    throw new HttpError(503, 'Rate limiter unavailable. Please try again.')
  }
}

/** Only accept forwarded client addresses from a configured trusted ingress. */
export function clientIp(headers: Headers): string {
  if (process.env.VERCEL === '1') return headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (process.env.TRUST_PROXY === 'true') return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return 'unknown'
}
