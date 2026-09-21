'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function MessagesManager() {
  const ready = useAdminGuard()
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/contact')
      if (res.ok) setMessages(await res.json())
    } catch (error) {
      console.error('Messages load failed:', error)
      toast.error('Could not load messages.')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const unread = useMemo(() => messages.filter((m) => m.status === 'unread').length, [messages])
  const shown = useMemo(
    () => (filter === 'unread' ? messages.filter((m) => m.status === 'unread') : messages),
    [messages, filter]
  )

  const setStatus = async (m: Message, status: Message['status']) => {
    try {
      const res = await fetch(`/api/contact/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status } : x)))
      } else {
        toast.error('Could not update message.')
      }
    } catch (error) {
      console.error('Status update failed:', error)
      toast.error('Could not update message.')
    }
  }

  const remove = async (m: Message) => {
    const ok = await confirmDialog({
      title: 'Delete this message?',
      description: <>The message from <strong>{m.name}</strong> will be permanently deleted. You will not be able to recover it.</>,
      confirmLabel: 'Delete message',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/contact/${m.id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessages((prev) => prev.filter((x) => x.id !== m.id))
        toast.success('Message deleted.')
      } else {
        toast.error('Could not delete message.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete message.')
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="messages"
      title="Messages"
      subtitle={`${unread} unread · ${messages.length} total`}
      badges={{ messages: unread }}
      actions={
        <>
          <button
            className={`adm-btn ${filter === 'all' ? 'primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`adm-btn ${filter === 'unread' ? 'primary' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
        </>
      }
    >
      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2>Inbox ({shown.length})</h2>
        </div>
        <div className="adm-rows">
          {shown.length === 0 ? (
            <div className="adm-empty">
              {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
            </div>
          ) : (
            shown.map((m) => (
              <div key={m.id} className={`adm-msg ${m.status === 'unread' ? 'unread' : 'read'}`}>
                <span className="dot" aria-hidden />
                <div className="body">
                  <div className="meta">
                    <span className="name">
                      {m.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {m.email}</span>
                    </span>
                    <span className="time">{formatDate(m.createdAt)}</span>
                  </div>
                  {m.subject ? <div className="subject">{m.subject}</div> : null}
                  <div className="text">{m.message}</div>
                  <div className="msg-actions">
                    <a
                      className="adm-linkbtn"
                      href={`mailto:${m.email}?subject=${encodeURIComponent(
                        `Re: ${m.subject || 'Your message'}`
                      )}`}
                      onClick={() => setStatus(m, 'replied')}
                    >
                      Reply via email
                    </a>
                    {m.status === 'unread' ? (
                      <button className="adm-linkbtn" onClick={() => setStatus(m, 'read')}>
                        Mark read
                      </button>
                    ) : (
                      <button className="adm-linkbtn" onClick={() => setStatus(m, 'unread')}>
                        Mark unread
                      </button>
                    )}
                    <button className="adm-linkbtn danger" onClick={() => remove(m)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  )
}
