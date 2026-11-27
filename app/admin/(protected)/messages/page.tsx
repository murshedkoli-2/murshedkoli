'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { ArrowLeft, Inbox, Mail, MailOpen, Reply, Trash2 } from 'lucide-react'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { matchesQuery } from '@/lib/admin/list'
import { initials } from '@/lib/admin/overview'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

type Filter = 'all' | Message['status']

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
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
        setSelectedId((id) => (id === m.id ? null : id))
        toast.success('Message deleted.')
      } else {
        toast.error('Could not delete message.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete message.')
    }
  }

  const counts = useMemo(
    () => ({
      unread: messages.filter((m) => m.status === 'unread').length,
      replied: messages.filter((m) => m.status === 'replied').length,
    }),
    [messages],
  )
  const shown = useMemo(
    () =>
      messages.filter(
        (m) => (filter === 'all' || m.status === filter) && matchesQuery(query, m.name, m.email, m.subject, m.message),
      ),
    [messages, filter, query],
  )
  const selected = messages.find((m) => m.id === selectedId) ?? null

  const open = (m: Message) => {
    setSelectedId(m.id)
    // Opening a message reads it, as in any mail client.
    if (m.status === 'unread') setStatus(m, 'read')
  }

  if (!ready) return null

  return (
    <AdminShell
      active="messages"
      title="Messages"
      subtitle={`${counts.unread} unread · ${messages.length} total`}
      badges={{ messages: counts.unread }}
    >
      <StatStrip
        stats={[
          { label: 'Messages', value: messages.length, icon: Inbox, tone: 'accent' },
          { label: 'Unread', value: counts.unread, icon: Mail, tone: counts.unread ? 'warn' : undefined, note: counts.unread ? 'Awaiting a reply' : 'All caught up' },
          { label: 'Replied', value: counts.replied, icon: Reply, tone: 'good' },
        ]}
      />

      <Toolbar
        id="messages"
        query={query}
        onQuery={setQuery}
        placeholder="Search name, email or text…"
        filters={[
          { value: 'all', label: 'All', count: messages.length },
          { value: 'unread', label: 'Unread', count: counts.unread },
          { value: 'read', label: 'Read' },
          { value: 'replied', label: 'Replied', count: counts.replied },
        ]}
        filter={filter}
        onFilter={(v) => setFilter(v as Filter)}
      />

      <div className="adm-panel kit-inbox" data-reading={selected !== null}>
        <div className="kit-inbox-list" role="listbox" aria-label="Messages">
          {shown.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={messages.length ? 'Nothing here' : 'Inbox zero'}
              body={messages.length ? 'No messages match this view.' : 'Contact-form messages will land here.'}
            />
          ) : (
            shown.map((m) => (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={m.id === selectedId}
                className="kit-inbox-item"
                data-unread={m.status === 'unread'}
                onClick={() => open(m)}
              >
                <span className="kit-inbox-avatar" aria-hidden="true">{initials(m.name)}</span>
                <span className="kit-inbox-name">{m.name}</span>
                <span className="kit-inbox-time">{formatDate(m.createdAt)}</span>
                <span className="kit-inbox-subject">{m.subject || m.message}</span>
              </button>
            ))
          )}
        </div>

        <div className="kit-reader">
          {selected ? (
            <>
              <button type="button" className="adm-btn ghost kit-reader-back" onClick={() => setSelectedId(null)}>
                <ArrowLeft size={15} aria-hidden="true" /> Back to inbox
              </button>
              <header className="kit-reader-head">
                <span className="kit-inbox-avatar" aria-hidden="true">{initials(selected.name)}</span>
                <div>
                  <h2 className="kit-reader-title">{selected.subject || 'No subject'}</h2>
                  <p className="kit-reader-from">
                    {selected.name} · {selected.email} · {formatDate(selected.createdAt)}
                  </p>
                </div>
                <span className={`adm-pill ${selected.status === 'replied' ? 'live' : ''}`}>{selected.status}</span>
              </header>
              <div className="kit-reader-body">{selected.message}</div>
              <div className="kit-reader-actions">
                <a
                  className="adm-btn amber"
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your message'}`)}`}
                  onClick={() => setStatus(selected, 'replied')}
                >
                  <Reply size={16} aria-hidden="true" /> Reply by email
                </a>
                {selected.status === 'unread' ? (
                  <button type="button" className="adm-btn" onClick={() => setStatus(selected, 'read')}>
                    <MailOpen size={16} aria-hidden="true" /> Mark read
                  </button>
                ) : (
                  <button type="button" className="adm-btn" onClick={() => setStatus(selected, 'unread')}>
                    <Mail size={16} aria-hidden="true" /> Mark unread
                  </button>
                )}
                <button type="button" className="adm-btn danger" onClick={() => remove(selected)}>
                  <Trash2 size={16} aria-hidden="true" /> Delete
                </button>
              </div>
            </>
          ) : (
            <EmptyState icon={MailOpen} title="Select a message" body="Pick a conversation on the left to read it here." />
          )}
        </div>
      </div>
    </AdminShell>
  )
}
