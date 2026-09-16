'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Bot, User, CornerDownLeft, RefreshCw, ChevronDown } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  provider?: string
}

const STARTER_PROMPTS = [
  '🚀 What are your top featured projects?',
  '⚡ What is your core tech stack & backend experience?',
  '🌍 Are you available for remote full-time roles?',
  '💼 How can I hire you for a project or contract?',
]

export function AIPortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm Murshed's **AI Portfolio Copilot**, powered by **NVIDIA NIM (LLaMA 3.3 70B)**. Ask me anything about Murshed's full-stack architecture skills, featured projects, or remote availability!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, messages])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .concat(userMessage)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userQuery: text,
        }),
      })

      if (!res.ok) throw new Error('AI Assistant network error')

      const data = await res.json()
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm available to answer any questions regarding Murshed's projects and skills!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm currently operating in low-latency standby mode. Please feel free to browse Murshed's projects or drop a direct message through the Contact section!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── FLOATING TOGGLE BADGE ────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.45), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
            }}
            title="Chat with Murshed's AI Assistant"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <span>AI Copilot</span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '2px 6px',
                borderRadius: 999,
                letterSpacing: 0.4,
              }}
            >
              NVIDIA NIM
            </span>
          </button>
        )}
      </div>

      {/* ── EXPANDED CHAT DRAWER / MODAL ─────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(580px, calc(100vh - 48px))',
            borderRadius: 20,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px var(--line)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 99999,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 18px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Murshed&apos;s AI Copilot
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#10b981',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Powered by NVIDIA NIM (LLaMA 3.3)
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'transparent',
                color: 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Close Assistant"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      maxWidth: '86%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser ? 'var(--accent)' : 'var(--surface-2)',
                      color: isUser ? '#ffffff' : 'var(--ink)',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      border: isUser ? 'none' : '1px solid var(--line)',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.content}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-muted)', padding: '0 4px' }}>
                    {m.timestamp} {m.provider ? `· ${m.provider}` : ''}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                  }}
                >
                  <RefreshCw size={12} className="animate-spin" />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                  Thinking with NVIDIA NIM…
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: '8px 14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                borderTop: '1px solid var(--line)',
                background: 'var(--surface)',
              }}
            >
              {STARTER_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 9px',
                    borderRadius: 8,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--line)',
              background: 'var(--surface-2)',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about projects, stack, hiring…"
              style={{
                flex: 1,
                resize: 'none',
                background: 'var(--card-bg)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: '0.85rem',
                color: 'var(--ink)',
                outline: 'none',
                fontFamily: 'inherit',
                maxHeight: 90,
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface)',
                color: input.trim() && !loading ? '#ffffff' : 'var(--ink-muted)',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 150ms ease',
              }}
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
