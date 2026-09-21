import { rateLimit, clientIp } from '@/lib/rate-limit'
import { readJson, apiError } from '@/lib/http'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session'

/** Constant-time compare so timing can't reveal how much of the value matched. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit('login:' + clientIp(request.headers), 8, 10 * 60 * 1000)
    if (!limit.ok) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  } catch (error) { return apiError(error) }

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD
  if (!expectedUser || !expectedPass || !process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
    return NextResponse.json({ error: 'Admin credentials or session secret are not configured.' }, { status: 500 })
  }

  let username = ''
  let password = ''
  try {
    const body = z.object({ username: z.string().min(1).max(200), password: z.string().min(1).max(1000) }).parse(await readJson(request, 4096))
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
