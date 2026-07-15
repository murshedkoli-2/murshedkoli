import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'

/**
 * Route-handler guard. Returns the verified session payload when the request
 * carries a valid admin session, otherwise a 401 NextResponse.
 *
 * Usage:
 *   const auth = await requireAdmin()
 *   if (auth instanceof NextResponse) return auth
 */
export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = await verifySessionToken(token)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return payload
}
