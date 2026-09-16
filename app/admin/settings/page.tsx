'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface SettingsForm {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  heroSubheadline: string
  copyrightText: string
  nvidiaNimKey: string
  nvidiaNimModel: string
  googleAiKey: string
  openRouterKey: string
  maintenanceMode: boolean
}

const EMPTY: SettingsForm = {
  siteName: '',
  siteTitle: '',
  siteDescription: '',
  siteKeywords: '',
  heroSubheadline: '',
  copyrightText: '',
  nvidiaNimKey: '',
  nvidiaNimModel: 'meta/llama-3.3-70b-instruct',
  googleAiKey: '',
  openRouterKey: '',
  maintenanceMode: false,
}

const NVIDIA_MODELS = [
  { id: 'meta/llama-3.3-70b-instruct', name: 'meta/llama-3.3-70b-instruct (Recommended · Flagship)' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'nvidia/llama-3.1-nemotron-70b-instruct (NVIDIA Optimized)' },
  { id: 'deepseek-ai/deepseek-r1', name: 'deepseek-ai/deepseek-r1 (Reasoning & Algorithmic)' },
  { id: 'mistralai/mistral-large-2-instruct', name: 'mistralai/mistral-large-2-instruct (128k Context)' },
  { id: 'meta/llama-3.1-8b-instruct', name: 'meta/llama-3.1-8b-instruct (Ultra Low-Latency)' },
]

export default function SettingsManager() {
  const ready = useAdminGuard()
  const [form, setForm] = useState<SettingsForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [testingAI, setTestingAI] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    latencyMs?: number
  } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) return
      const s = await res.json()
      setForm({
        siteName: s.siteName || '',
        siteTitle: s.siteTitle || '',
        siteDescription: s.siteDescription || '',
        siteKeywords: Array.isArray(s.siteKeywords) ? s.siteKeywords.join(', ') : s.siteKeywords || '',
        heroSubheadline: s.heroSubheadline || '',
        copyrightText: s.copyrightText || '',
        nvidiaNimKey: s.nvidiaNimKey || '',
        nvidiaNimModel: s.nvidiaNimModel || 'meta/llama-3.3-70b-instruct',
        googleAiKey: s.googleAiKey || '',
        openRouterKey: s.openRouterKey || '',
        maintenanceMode: Boolean(s.maintenanceMode),
      })
    } catch (error) {
      console.error('Settings load failed:', error)
      toast.error('Could not load settings.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const save = async () => {
    setSaving(true)
    try {
      const entries: [string, unknown][] = [
        ['siteName', form.siteName],
        ['siteTitle', form.siteTitle],
        ['siteDescription', form.siteDescription],
        ['siteKeywords', form.siteKeywords.split(',').map((k) => k.trim()).filter(Boolean)],
        ['heroSubheadline', form.heroSubheadline],
        ['copyrightText', form.copyrightText],
        ['nvidiaNimKey', form.nvidiaNimKey],
        ['nvidiaNimModel', form.nvidiaNimModel],
        ['googleAiKey', form.googleAiKey],
        ['openRouterKey', form.openRouterKey],
        ['maintenanceMode', form.maintenanceMode],
      ]
      for (const [key, value] of entries) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      }
      toast.success('Settings and NVIDIA NIM configuration saved.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleTestAI = async () => {
    setTestingAI(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: form.nvidiaNimKey,
          model: form.nvidiaNimModel,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTestResult({
          success: true,
          message: `${data.sampleText} (${data.latencyMs}ms)`,
          latencyMs: data.latencyMs,
        })
        toast.success(`NVIDIA NIM connected successfully in ${data.latencyMs}ms!`)
      } else {
        setTestResult({
          success: false,
          message: data.sampleText || data.message || 'Connection failed',
        })
        toast.error('NVIDIA NIM connection failed. Check your API key.')
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error testing AI connection',
      })
      toast.error('Network error testing AI connection')
    } finally {
      setTestingAI(false)
    }
  }

  if (!ready) return null

  const text = (
    label: string,
    key: keyof SettingsForm,
    opts: { col2?: boolean; textarea?: boolean; placeholder?: string; type?: string } = {}
  ) => (
    <div className={`adm-field ${opts.col2 ? 'adm-col-2' : ''}`}>
      <label className="adm-label">{label}</label>
      {opts.textarea ? (
        <textarea
          className="adm-textarea"
          value={form[key] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={opts.placeholder}
        />
      ) : (
        <input
          className="adm-input"
          type={opts.type || 'text'}
          value={form[key] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={opts.placeholder}
        />
      )}
    </div>
  )

  return (
    <AdminShell
      active="settings"
      title="SEO, Settings & NVIDIA NIM AI"
      subtitle="Metadata, site identity, and enterprise AI configuration"
      actions={
        <button className="adm-btn amber" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      }
    >
      {/* ── NVIDIA NIM AI INTEGRATION (PRIMARY) ─────────────────────────── */}
      <div className="adm-panel" style={{ marginBottom: 20, border: '1px solid rgba(16, 185, 129, 0.35)' }}>
        <div
          className="adm-panel-head"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: '#10b981' }} />
            <h2 style={{ margin: 0 }}>NVIDIA NIM AI Architecture (Primary Engine)</h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                fontWeight: 700,
              }}
            >
              TIER 1
            </span>
          </div>

          <button
            type="button"
            className="adm-btn"
            onClick={handleTestAI}
            disabled={testingAI}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {testingAI ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>{testingAI ? 'Testing…' : 'Test NIM Connection'}</span>
          </button>
        </div>

        <div className="adm-body">
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            NVIDIA NIM (Inference Microservices) powers the portfolio&apos;s real-time AI generation, public AI Portfolio Copilot,
            and task exam grading. If an NVIDIA key is absent, the system automatically falls back to Google Gemini or OpenRouter.
          </p>

          <div className="adm-form-grid">
            {text('NVIDIA NIM API Key', 'nvidiaNimKey', {
              type: 'password',
              placeholder: 'nvapi-••••••••••••••••••••••••',
            })}

            <div className="adm-field">
              <label className="adm-label">NVIDIA NIM Inference Model</label>
              <select
                className="adm-input"
                value={form.nvidiaNimModel}
                onChange={(e) => setForm({ ...form, nvidiaNimModel: e.target.value })}
                style={{ fontSize: 13 }}
              >
                {NVIDIA_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {testResult && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 10,
                background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: testResult.success ? '#10b981' : '#ef4444',
              }}
            >
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              fontSize: 11.5,
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
            }}
          >
            Tip: Obtain free inference API credits directly from{' '}
            <a
              href="https://build.nvidia.com/"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#10b981', textDecoration: 'underline' }}
            >
              build.nvidia.com
            </a>
            .
          </div>
        </div>
      </div>

      {/* ── FALLBACK PROVIDERS ──────────────────────────────────────────── */}
      <div className="adm-panel" style={{ marginBottom: 20 }}>
        <div className="adm-panel-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2>Fallback AI Providers</h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 999,
                background: 'var(--surface-2)',
                color: 'var(--ink-muted)',
              }}
            >
              TIER 2 & 3
            </span>
          </div>
        </div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Google AI Key (Gemini 2.5 Flash)', 'googleAiKey', {
              type: 'password',
              placeholder: 'AIzaSy••••••••••••••••',
            })}
            {text('OpenRouter Key (Multi-Model Gateway)', 'openRouterKey', {
              type: 'password',
              placeholder: 'sk-or-••••••••••••••••',
            })}
          </div>
          <p className="adm-note">
            Keys are encrypted on the server and used automatically when earlier tiers reach rate limits.
          </p>
        </div>
      </div>

      {/* ── SEO & METADATA ──────────────────────────────────────────────── */}
      <div className="adm-panel" id="seo" style={{ marginBottom: 20 }}>
        <div className="adm-panel-head">
          <h2>SEO & Metadata</h2>
        </div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Site name', 'siteName', { placeholder: 'Murshed Al Main' })}
            {text('Meta title', 'siteTitle')}
            {text('Meta description', 'siteDescription', { col2: true, textarea: true })}
            {text('Keywords (comma-separated)', 'siteKeywords', {
              col2: true,
              placeholder: 'full-stack developer, Next.js, …',
            })}
            {text('Hero subheadline', 'heroSubheadline', {
              col2: true,
              textarea: true,
              placeholder: 'Shown under the homepage headline',
            })}
          </div>
        </div>
      </div>

      {/* ── SITE SETTINGS ───────────────────────────────────────────────── */}
      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2>Site Operations</h2>
        </div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Footer copyright text', 'copyrightText', {
              col2: true,
              placeholder: '© 2026 Murshed Al Main',
            })}
            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-toggle">
                <input
                  type="checkbox"
                  checked={form.maintenanceMode}
                  onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                />
                <span className="track" />
                <span>Maintenance mode</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
