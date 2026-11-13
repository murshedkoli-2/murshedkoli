import { rateLimit, clientIp, loginRateKey } from '@/lib/rate-limit'
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

const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_ATTEMPTS_PER_USER = 8
const LOGIN_ATTEMPTS_PER_IP = 30
const loginSchema = z.object({ username: z.string().min(1).max(200), password: z.string().min(1).max(1000) })

export async function POST(request: NextRequest) {
  let username = ''
  let password = ''
  try {
    const body = loginSchema.parse(await readJson(request, 4096))
    username = body.username
    password = body.password
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  try {
    const ip = clientIp(request.headers)
    const perUser = await rateLimit(loginRateKey(ip, username), LOGIN_ATTEMPTS_PER_USER, LOGIN_WINDOW_MS)
    // A per-IP cap only makes sense when the IP is real; "unknown" is shared by everyone.
    const perIp = ip === 'unknown' ? { ok: true } : await rateLimit('login-ip:' + ip, LOGIN_ATTEMPTS_PER_IP, LOGIN_WINDOW_MS)
    if (!perUser.ok || !perIp.ok) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  } catch (error) { return apiError(error) }

  // Values pasted into a hosting dashboard often carry a stray space or newline,
  // which would make the correct credentials fail forever.
  const expectedUser = process.env.ADMIN_USERNAME?.trim()
  const expectedPass = process.env.ADMIN_PASSWORD?.trim()
  if (!expectedUser || !expectedPass || !process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
    return NextResponse.json({ error: 'Admin credentials or session secret are not configured.' }, { status: 500 })
  }

  // Evaluate both comparisons regardless, to keep timing uniform.
  const okUser = safeEqual(username.trim(), expectedUser)
  const okPass = safeEqual(password, expectedPass)
  if (!okUser || !okPass) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
  }

  const token = await createSessionToken(expectedUser)
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
