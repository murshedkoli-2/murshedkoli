import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'

const PUBLIC_POST = new Set(['/api/auth/login', '/api/auth/logout', '/api/contact'])
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const privateRead = /^\/api\/(settings$|career(?:\/|$)|ai(?:\/|$)|savings(?:\/|$)|tours(?:\/|$))/.test(pathname)
  const needsAuth = isAdminPage || privateRead ||
    (pathname.startsWith('/api/') && !SAFE_METHODS.has(request.method) &&
      !(request.method === 'POST' && PUBLIC_POST.has(pathname)))

  if (needsAuth) {
    const payload = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
    if (!payload) {
      if (isAdminPage) return NextResponse.redirect(new URL('/admin/login', request.url))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/:path*'] }
