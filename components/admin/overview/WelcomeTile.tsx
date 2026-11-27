'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { ArrowUpRight, Inbox, Plus } from 'lucide-react'
import { DotField } from '@/components/site/landing/DotField'
import { greetingFor } from '@/lib/admin-login'

function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000)
  return () => window.clearInterval(id)
}
const nowMinute = () => Math.floor(Date.now() / 60_000)
const serverMinute = () => 0

interface WelcomeTileProps {
  firstName?: string
  loaded: boolean
  attention: number
  unread: number
}

/** Greeting, live date, one-line status and the three most common actions. */
export function WelcomeTile({ firstName, loaded, attention, unread }: WelcomeTileProps) {
  const minute = useSyncExternalStore(subscribeMinute, nowMinute, serverMinute)
  const now = minute ? new Date(minute * 60_000) : null

  return (
    <section className="ov-tile ov-welcome" aria-labelledby="ov-welcome-title">
      <DotField className="ov-welcome-field" />
      <div className="ov-welcome-top">
        <span className="ov-kicker">
          <span className="ov-live" aria-hidden="true" />
          {now ? now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today'}
        </span>
        {now && <span className="ov-kicker">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>

      <div>
        <h2 id="ov-welcome-title" className="ov-welcome-title">
          {now ? greetingFor(now.getHours()) : 'Hello'}
          {firstName ? `, ${firstName}` : ''}.
        </h2>
        <p className="ov-welcome-status">
          {!loaded ? (
            'Checking the site…'
          ) : attention === 0 ? (
            <>
              Everything is <em className="adm-accent">in order</em>.
            </>
          ) : (
            <>
              {attention} thing{attention === 1 ? '' : 's'} could use <em className="adm-accent">your attention</em>.
            </>
          )}
        </p>
      </div>

      <div className="ov-welcome-actions">
        <Link href="/admin/projects/new" className="adm-btn amber">
          <Plus size={16} aria-hidden="true" /> New project
        </Link>
        <Link href="/admin/messages" className="adm-btn">
          <Inbox size={16} aria-hidden="true" /> Inbox{unread ? ` · ${unread}` : ''}
        </Link>
        <Link href="/" target="_blank" className="adm-btn ghost">
          View site <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
