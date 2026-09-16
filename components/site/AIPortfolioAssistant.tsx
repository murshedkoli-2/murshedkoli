'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Bot, RefreshCw, ChevronDown, Cpu, Check, Settings2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  provider?: string
  model?: string
}

const STARTER_PROMPTS = [
  '🚀 What are your top featured projects?',
  '⚡ What is your core tech stack & backend experience?',
  '🌍 Are you available for remote full-time roles?',
  '💼 How can I hire you for a project or contract?',
]

const DEFAULT_POPULAR_MODELS = [
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'LLaMA 3.1 Nemotron 70B (Flagship)' },
  { id: 'mistralai/mistral-large-2-instruct', name: 'Mistral Large 2 (128k Context)' },
  { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron 4 340B (Ultra)' },
  { id: 'meta/llama-3.2-90b-vision-instruct', name: 'LLaMA 3.2 90B (Vision)' },
  { id: 'meta/llama-3.2-11b-vision-instruct', name: 'LLaMA 3.2 11B (Fast)' },
  { id: 'ibm/granite-3.0-8b-instruct', name: 'IBM Granite 3.0 8B' },
]

function formatModelShort(id: string): string {
  if (!id) return 'NVIDIA NIM'
  const name = id.split('/').pop() || id
  return name
    .replace(/-instruct$/i, '')
    .replace(/^llama-/i, 'LLaMA ')
    .replace(/^nemotron-/i, 'Nemotron ')
    .replace(/^mistral-/i, 'Mistral ')
    .replace(/^granite-/i, 'Granite ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AIPortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('nvidia/llama-3.1-nemotron-70b-instruct')
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string }>>(DEFAULT_POPULAR_MODELS)
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm Murshed's **AI Portfolio Copilot**, powered by **NVIDIA NIM**. Ask me anything about Murshed's full-stack architecture skills, featured projects, or remote availability!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'nvidia/llama-3.1-nemotron-70b-instruct',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const modelMenuRef = useRef<HTMLDivElement>(null)

  // Fetch initial active model & live available models on mount
  useEffect(() => {
    let isMounted = true

    async function loadCopilotConfig() {
      try {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('copilot_selected_model') : null

        // 1. Fetch server configured model
        const chatRes = await fetch('/api/ai/chat')
        if (chatRes.ok) {
          const chatData = await chatRes.json()
          if (chatData.activeModel && isMounted) {
            const initialModel = saved || chatData.activeModel
            setSelectedModel(initialModel)

            // Update initial greeting with active model name
            setMessages((prev) =>
              prev.map((m) =>
                m.id === 'welcome'
                  ? {
                      ...m,
                      content: `Hello! I'm Murshed's **AI Portfolio Copilot**, powered by **NVIDIA NIM (${formatModelShort(
                        initialModel
                      )})**. Ask me anything about Murshed's full-stack architecture skills, featured projects, or remote availability!`,
                      model: initialModel,
                    }
                  : m
              )
            )
          }
        }

        // 2. Fetch live models list for dropdown
        const modelsRes = await fetch('/api/ai/models')
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json()
          if (Array.isArray(modelsData.models) && modelsData.models.length > 0 && isMounted) {
            const chatModels = modelsData.models
              .filter((m: any) => m.isChat)
              .map((m: any) => ({
                id: m.id,
                name: formatModelShort(m.id),
              }))

            if (chatModels.length > 0) {
              setAvailableModels(chatModels)
            }
          }
        }
      } catch (err) {
        // Fallback to default popular models
      }
    }

    loadCopilotConfig()
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-scroll and focus
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, messages])

  // Close model menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false)
      }
    }
    if (isModelMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModelMenuOpen])

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId)
    setIsModelMenuOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('copilot_selected_model', modelId)
    }
    // Add brief info message
    const switchNotice: Message = {
      id: `switch-${Date.now()}`,
      role: 'assistant',
      content: `Switched active AI model to **${formatModelShort(modelId)}**. How can I assist you?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: modelId,
    }
    setMessages((prev) => [...prev, switchNotice])
  }

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
        .filter((m) => m.id !== 'welcome' && !m.id.startsWith('switch-'))
        .concat(userMessage)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userQuery: text,
          model: selectedModel,
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
        model: data.model || selectedModel,
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
          model: selectedModel,
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
            title={`Chat with AI Copilot (${formatModelShort(selectedModel)})`}
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
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '2px 8px',
                borderRadius: 999,
                letterSpacing: 0.3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />
              {formatModelShort(selectedModel)}
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
            width: 'min(430px, calc(100vw - 32px))',
            height: 'min(590px, calc(100vh - 48px))',
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
              padding: '14px 16px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Bot size={19} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                  Murshed&apos;s AI Copilot
                </div>
                {/* Clickable Model Selector Pill */}
                <button
                  type="button"
                  onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '2px 7px',
                    marginTop: 3,
                    borderRadius: 999,
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    fontSize: '0.70rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    maxWidth: 240,
                  }}
                  title="Click to switch active AI model"
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatModelShort(selectedModel)}
                  </span>
                  <ChevronDown
                    size={11}
                    style={{
                      transform: isModelMenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 150ms ease',
                      flexShrink: 0,
                    }}
                  />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  background: isModelMenuOpen ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isModelMenuOpen ? '#10b981' : 'var(--ink-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Select Model"
              >
                <Cpu size={14} />
              </button>
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

            {/* Model Selector Dropdown Popover */}
            {isModelMenuOpen && (
              <div
                ref={modelMenuRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 12,
                  right: 12,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 12,
                  boxShadow: '0 20px 30px -10px rgba(0,0,0,0.4), 0 0 0 1px var(--line)',
                  padding: 8,
                  zIndex: 100,
                  maxHeight: 260,
                  overflowY: 'auto',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div
                  style={{
                    padding: '4px 8px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: 'var(--ink-muted)',
                    borderBottom: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Select Active AI Model</span>
                  <span style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    NVIDIA NIM
                  </span>
                </div>
                <div style={{ paddingTop: 4 }}>
                  {availableModels.map((m) => {
                    const isSelected = m.id === selectedModel
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModel(m.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: 8,
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          border: isSelected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                          color: isSelected ? '#10b981' : 'var(--ink)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          marginBottom: 3,
                          transition: 'background 120ms ease',
                        }}
                      >
                        <div style={{ minWidth: 0, paddingRight: 6 }}>
                          <div style={{ fontWeight: isSelected ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.name || formatModelShort(m.id)}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                            {m.id}
                          </div>
                        </div>
                        {isSelected && <Check size={14} style={{ color: '#10b981', flexShrink: 0 }} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
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
                      maxWidth: '88%',
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
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--ink-muted)',
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{m.timestamp}</span>
                    {m.role === 'assistant' && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          background: 'var(--surface)',
                          padding: '1px 6px',
                          borderRadius: 999,
                          border: '1px solid var(--line)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          color: '#10b981',
                        }}
                      >
                        <Cpu size={9} />
                        {formatModelShort(m.model || selectedModel)}
                      </span>
                    )}
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
                    color: '#10b981',
                  }}
                >
                  <RefreshCw size={12} className="animate-spin" />
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                  Thinking with {formatModelShort(selectedModel)}…
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
              placeholder={`Ask ${formatModelShort(selectedModel)} anything…`}
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
