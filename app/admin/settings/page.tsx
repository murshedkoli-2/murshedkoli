'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface SettingsForm {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  heroSubheadline: string
  copyrightText: string
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
  googleAiKey: '',
  openRouterKey: '',
  maintenanceMode: false,
}

export default function SettingsManager() {
  const ready = useAdminGuard()
  const [form, setForm] = useState<SettingsForm>(EMPTY)
  const [saving, setSaving] = useState(false)

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
      toast.success('Settings saved.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  const text = (label: string, key: keyof SettingsForm, opts: { col2?: boolean; textarea?: boolean; placeholder?: string; type?: string } = {}) => (
    <div className={`adm-field ${opts.col2 ? 'adm-col-2' : ''}`}>
      <label className="adm-label">{label}</label>
      {opts.textarea ? (
        <textarea className="adm-textarea" value={form[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={opts.placeholder} />
      ) : (
        <input className="adm-input" type={opts.type || 'text'} value={form[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={opts.placeholder} />
      )}
    </div>
  )

  return (
    <AdminShell
      active="settings"
      title="SEO & Settings"
      subtitle="Metadata, site identity, and integrations"
      actions={
        <button className="adm-btn amber" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      }
    >
      <div className="adm-panel" id="seo" style={{ marginBottom: 20 }}>
        <div className="adm-panel-head"><h2>SEO & Metadata</h2></div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Site name', 'siteName', { placeholder: 'Murshed Al Main' })}
            {text('Meta title', 'siteTitle')}
            {text('Meta description', 'siteDescription', { col2: true, textarea: true })}
            {text('Keywords (comma-separated)', 'siteKeywords', { col2: true, placeholder: 'full-stack developer, Next.js, …' })}
            {text('Hero subheadline', 'heroSubheadline', { col2: true, textarea: true, placeholder: 'Shown under the homepage headline' })}
          </div>
        </div>
      </div>

      <div className="adm-panel" style={{ marginBottom: 20 }}>
        <div className="adm-panel-head"><h2>Site</h2></div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Footer copyright text', 'copyrightText', { col2: true, placeholder: '© 2026 Murshed Al Main' })}
            <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
              <label className="adm-toggle">
                <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
                <span className="track" />
                <span>Maintenance mode</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-head"><h2>AI integrations</h2></div>
        <div className="adm-body">
          <div className="adm-form-grid">
            {text('Google AI key', 'googleAiKey', { type: 'password', placeholder: '••••••••' })}
            {text('OpenRouter key', 'openRouterKey', { type: 'password', placeholder: '••••••••' })}
          </div>
          <p className="adm-note">Keys are stored server-side and used by the AI generate endpoints.</p>
        </div>
      </div>
    </AdminShell>
  )
}
