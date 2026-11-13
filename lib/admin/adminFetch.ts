/**
 * Fetch wrapper for admin pages.
 *
 * API auth is an 8-hour signed cookie (see lib/auth/session.ts). When it
 * expires mid-session every API call starts returning 401; this sends the
 * user back to sign-in instead of leaving the page stuck on error toasts.
 */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init)
  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = new URL('/admin/login', window.location.origin).href
  }
  return res
}
