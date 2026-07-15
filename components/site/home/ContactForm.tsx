'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--line)',
  background: 'var(--canvas)',
  color: 'var(--ink)',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  marginBottom: 6,
  color: 'var(--ink-muted)',
}

export function ContactForm() {
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      subject: String(data.get('subject') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      toast.error('Please fill in your name, email, and message.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      toast.success("Thanks! Your message has been sent — I'll be in touch soon.")
      form.reset()
    } catch {
      toast.error('Something went wrong. Please try again or email me directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="contact-form-row">
        <div>
          <label style={labelStyle} htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" required style={inputStyle} autoComplete="name" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required style={inputStyle} autoComplete="email" />
        </div>
      </div>
      <div>
        <label style={labelStyle} htmlFor="cf-subject">Subject</label>
        <input id="cf-subject" name="subject" type="text" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle} htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <button
        type="submit"
        disabled={sending}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '13px 22px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          fontWeight: 600,
          border: 'none',
          cursor: sending ? 'default' : 'pointer',
          opacity: sending ? 0.7 : 1,
          alignSelf: 'flex-start',
        }}
      >
        <Send size={16} /> {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
