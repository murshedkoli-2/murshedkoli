/**
 * Fetch wrapper for admin pages.
 *
 * The admin UI's logged-in state is a localStorage flag, but API auth is an
 * 8-hour signed cookie (see lib/auth/session.ts). When the cookie has expired
 * the flag goes stale: pages render as logged-in while every API call 401s.
 * This wrapper detects that case, clears the stale flag, and redirects to the
 * login page instead of leaving the page stuck on error toasts.
 */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init)
  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin/login'
  }
  return res
}
