'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, ArrowLeft } from 'lucide-react'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Authenticate server-side — validates against env credentials and sets
      // the httpOnly admin_session cookie. No credentials live in the client.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (res.ok) {
        // localStorage flag drives the lightweight client-side route guard.
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminUser', credentials.username)
        router.push('/admin/dashboard')
        return
      }

      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Invalid username or password')
    } catch {
      setError('Could not sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--line)',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    fontSize: '0.95rem',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: 7,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        background: 'var(--canvas)',
        color: 'var(--ink)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)',
          padding: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              display: 'inline-flex',
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: 'color-mix(in oklch, var(--accent) 14%, transparent)',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            <LogIn size={22} />
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              style={inputStyle}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              style={inputStyle}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'color-mix(in oklch, #d16a5a 12%, transparent)',
                border: '1px solid color-mix(in oklch, #d16a5a 30%, var(--line))',
                color: '#c0503f',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontWeight: 600,
              border: 'none',
              cursor: isLoading ? 'default' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={15} /> Back to portfolio
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
