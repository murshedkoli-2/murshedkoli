'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const DASHBOARD_PATH = '/admin/dashboard'

/** A full page load, so the server reads the new session cookie on every admin route. */
function enterDashboard() {
  window.location.assign(new URL(DASHBOARD_PATH, window.location.origin).href)
}

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Already signed in? Skip the form.
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/session', { cache: 'no-store', signal: controller.signal })
      .then((res) => { if (res.ok) enterDashboard() })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // The server checks the credentials and sets the httpOnly session cookie.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (res.ok) {
        enterDashboard()
        return
      }

      const data: { error?: string } = await res.json().catch(() => ({}))
      setError(data.error || 'Invalid username or password.')
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="lgn">
      <aside className="lgn-aside" aria-hidden="true">
        <div className="lgn-aside-brand">murshed<span>.</span>admin</div>
        <p className="lgn-aside-note">Everything on the site, in <em>one place</em>.</p>
      </aside>

      <main className="lgn-main">
        <form className="lgn-form" onSubmit={handleSubmit}>
          <div>
            <h1 className="lgn-title">Sign in</h1>
            <p className="lgn-sub">Use your admin username and password.</p>
          </div>

          <div className="lgn-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="lgn-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </div>

          <div className="lgn-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="lgn-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="lgn-error" role="alert">{error}</div>}

          <button type="submit" className="lgn-submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>

          <Link href="/" className="lgn-back">
            <ArrowLeft size={15} aria-hidden="true" /> Back to portfolio
          </Link>
        </form>
      </main>
    </div>
  )
}
