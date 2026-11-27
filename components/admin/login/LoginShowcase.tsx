'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DotField } from '@/components/site/landing/DotField'
import { greetingFor, sessionLengthLabel } from '@/lib/admin-login'
import { SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session'

/** The areas the dashboard actually manages (mirrors the admin sidebar). */
const MODULES = ['Projects', 'Services', 'Skills', 'Certificates', 'Experience', 'Messages', 'Tour planner', 'Savings']
const TICK_MS = 2200
const EASE = [0.16, 1, 0.3, 1] as const

/** Ticks once a second; 0 on the server so SSR markup never holds a wrong time. */
function subscribeSecond(onChange: () => void) {
  const id = window.setInterval(onChange, 1000)
  return () => window.clearInterval(id)
}
const nowSecond = () => Math.floor(Date.now() / 1000)
const serverSecond = () => 0

function Clock() {
  const second = useSyncExternalStore(subscribeSecond, nowSecond, serverSecond)
  if (second === 0) return <div className="lgx-clock" aria-hidden="true" />

  const now = new Date(second * 1000)
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="lgx-clock">
      <p className="lgx-greeting">{greetingFor(now.getHours())}.</p>
      <p className="lgx-time">
        <time dateTime={now.toISOString()}>{time}</time>
      </p>
      <p className="lgx-date">{date}</p>
    </div>
  )
}

function ModuleTicker() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % MODULES.length)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <span className="lgx-ticker">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={MODULES[index]}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {MODULES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Decorative left panel: live dot field, clock with greeting, and what the console manages. */
export function LoginShowcase() {
  return (
    <aside className="lgx-show" aria-hidden="true">
      <DotField className="lgx-dots" />

      <div className="lgx-show-top">
        <span className="lgx-brand">
          murshed<span>.</span>admin
        </span>
        <span className="lgx-chip">
          <span className="lgx-chip-dot" /> Console
        </span>
      </div>

      <Clock />

      <div className="lgx-show-bottom">
        <p className="lgx-statement">
          Everything on the site, in <em>one place</em>.
        </p>
        <p className="lgx-manage">
          <span className="lgx-manage-label">Manage</span>
          <ModuleTicker />
        </p>
        <p className="lgx-foot">
          Signed, httpOnly session · expires after {sessionLengthLabel(SESSION_MAX_AGE_SECONDS)}
        </p>
      </div>
    </aside>
  )
}
