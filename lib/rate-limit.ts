/**
 * Minimal in-memory fixed-window rate limiter. Per-instance only — enough to
 * blunt abuse of public endpoints on a single node. Swap for a shared store
 * (Redis/KV) if the app scales horizontally.
 */
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }

  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false, remaining: 0 }
  }
  return { ok: true, remaining: limit - bucket.count }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
