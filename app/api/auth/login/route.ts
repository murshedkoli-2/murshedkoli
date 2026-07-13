import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session'

// Basic in-memory rate limit (per-instance). Enough to blunt password
// guessing; a distributed limiter can replace it later.
const attempts = new Map<string, { count: number; first: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now })
    return false
  }
  rec.count += 1
  return rec.count > MAX_ATTEMPTS
}

/** Constant-time compare so timing can't reveal how much of the value matched. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD
  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 500 })
  }

  let username = ''
  let password = ''
  try {
    const body = await request.json()
    username = String(body.username ?? '')
    password = String(body.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Evaluate both comparisons regardless, to keep timing uniform.
  const okUser = safeEqual(username, expectedUser)
  const okPass = safeEqual(password, expectedPass)
  if (!okUser || !okPass) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
  }

  const token = await createSessionToken(username)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return res
}
