/**
 * Lightweight signed-cookie admin session.
 *
 * A session token is `base64url(payloadJson).base64url(HMAC-SHA256)`.
 * Signing/verification use Web Crypto (`crypto.subtle`) so the exact same
 * code runs in the Edge middleware and in Node route handlers.
 *
 * The signing secret comes from NEXTAUTH_SECRET. Tokens carry an expiry and
 * are verified in constant time.
 */

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

interface SessionPayload {
  sub: string // admin username
  exp: number // epoch seconds
}

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not configured — cannot sign admin sessions')
  }
  return secret
}

// ── base64url helpers (edge + node safe) ────────────────────────────
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function encodeJson(payload: SessionPayload): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return bytesToBase64Url(new Uint8Array(sig))
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }
  const encoded = encodeJson(payload)
  const signature = await hmac(encoded)
  return `${encoded}.${signature}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot < 1) return null

  const encoded = token.slice(0, dot)
  const signature = token.slice(dot + 1)

  const expected = await hmac(encoded)
  if (!safeEqual(signature, expected)) return null

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encoded))) as SessionPayload
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
