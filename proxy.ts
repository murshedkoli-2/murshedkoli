import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'

// POST endpoints that are intentionally public (no admin session required).
const PUBLIC_POST = new Set(['/api/auth/login', '/api/contact'])

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/**
 * Edge middleware (Next 16 `proxy`).
 *
 * Centrally guards every mutating `/api/*` request: anything that isn't a safe
 * (read) method must carry a valid admin session cookie, except the small
 * allowlist of public POST endpoints. Admin *pages* keep their lightweight
 * client-side guard for redirects; sensitive data only ever flows through the
 * API + server actions, which are now protected here and in-handler.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (pathname.startsWith('/api/')) {
    const isMutation = !SAFE_METHODS.has(method)
    const isPublic = method === 'POST' && PUBLIC_POST.has(pathname)
    if (isMutation && !isPublic) {
      const token = request.cookies.get(SESSION_COOKIE)?.value
      const payload = await verifySessionToken(token)
      if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
