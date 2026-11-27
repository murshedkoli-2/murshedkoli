'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CircleAlert, LoaderCircle, UserRound } from 'lucide-react'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { LoginShowcase } from '@/components/admin/login/LoginShowcase'
import { PasswordField } from '@/components/admin/login/PasswordField'
import { loginErrorMessage } from '@/lib/admin-login'
import './login.css'

const DASHBOARD_PATH = '/admin/dashboard'
const SHAKE = { x: [0, -10, 9, -6, 5, -2, 0] }
const EASE = [0.16, 1, 0.3, 1] as const

type Status = 'idle' | 'loading' | 'success' | 'error'

/** A full page load, so the server reads the new session cookie on every admin route. */
function enterDashboard() {
  window.location.assign(new URL(DASHBOARD_PATH, window.location.origin).href)
}

const SUBMIT_LABEL: Record<Status, string> = {
  idle: 'Sign in',
  error: 'Try again',
  loading: 'Checking…',
  success: 'Opening dashboard…',
}

function SubmitIcon({ status }: { status: Status }) {
  if (status === 'loading') return <LoaderCircle size={18} className="lgx-spin" aria-hidden="true" />
  if (status === 'success') return <Check size={18} aria-hidden="true" />
  return <ArrowRight size={18} aria-hidden="true" />
}

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [scope, animate] = useAnimate<HTMLFormElement>()
  const passwordRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()
  const busy = status === 'loading' || status === 'success'

  // Already signed in? Skip the form.
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/session', { cache: 'no-store', signal: controller.signal })
      .then((res) => {
        if (res.ok) enterDashboard()
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const fail = (message: string) => {
    setError(message)
    setStatus('error')
    if (!reduce && scope.current) animate(scope.current, SHAKE, { duration: 0.45 })
    passwordRef.current?.select()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setStatus('loading')
    setError('')

    try {
      // The server checks the credentials and sets the httpOnly session cookie.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (res.ok) {
        setStatus('success')
        enterDashboard()
        return
      }

      const data: { error?: string } = await res.json().catch(() => ({}))
      fail(loginErrorMessage(res.status, data.error))
    } catch {
      fail('Could not reach the server. Check your connection and try again.')
    }
  }

  const invalid = status === 'error'

  return (
    <div className="lgx">
      <LoginShowcase />

      <main className="lgx-main">
        <div className="lgx-main-top">
          <Link href="/" className="lgx-back">
            <ArrowLeft size={15} aria-hidden="true" /> Portfolio
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          className="lgx-panel"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <form ref={scope} className="lgx-form" onSubmit={handleSubmit}>
            <header>
              <p className="lgx-eyebrow">Admin console</p>
              <h1 className="lgx-title">
                Welcome <em>back</em>.
              </h1>
              <p className="lgx-sub">Sign in to manage your portfolio.</p>
            </header>

            <div className="lgx-field">
              <label htmlFor="username" className="lgx-label">
                Username
              </label>
              <div className="lgx-control" data-invalid={invalid}>
                <UserRound size={17} className="lgx-control-icon" aria-hidden="true" />
                <input
                  id="username"
                  className="lgx-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  aria-invalid={invalid || undefined}
                  required
                />
              </div>
            </div>

            <PasswordField ref={passwordRef} value={password} onChange={setPassword} invalid={invalid} />

            <AnimatePresence initial={false}>
              {error && (
                <motion.div
                  className="lgx-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span>
                    <CircleAlert size={16} aria-hidden="true" />
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="lgx-submit" data-status={status} disabled={busy} aria-live="polite">
              <span>{SUBMIT_LABEL[status]}</span>
              <SubmitIcon status={status} />
            </button>

            <p className="lgx-hint">
              Press <kbd>Enter</kbd> to sign in
            </p>
          </form>
        </motion.div>

        <p className="lgx-legal">Restricted area · sign-in attempts are rate-limited</p>
      </main>
    </div>
  )
}
