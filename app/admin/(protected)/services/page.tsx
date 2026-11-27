'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { Eye, EyeOff, Layers, Pencil, Plus, Trash2 } from 'lucide-react'
import { Drawer } from '@/components/admin/kit/Drawer'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { matchesQuery } from '@/lib/admin/list'

interface Service {
  id?: string
  title: string
  description: string
  icon?: string | null
  order: number
  isEnabled?: boolean
}

const ICON_HINTS = 'web · backend · mobile · design · database · ai · seo · ecommerce · analytics · cloud · performance · fullstack'

function emptyService(order: number): Service {
  return { title: '', description: '', icon: '', order, isEnabled: true }
}

export default function ServicesManager() {
  const ready = useAdminGuard()
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/services?includeDisabled=true')
      if (res.ok) setServices(await res.json())
    } catch (error) {
      console.error('Services load failed:', error)
      toast.error('Could not load services.')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const visibleCount = useMemo(() => services.filter((s) => s.isEnabled !== false).length, [services])

  const save = async () => {
    if (!editing || !editing.title.trim() || !editing.description.trim()) {
      toast.error('Title and description are required.')
      return
    }
    setSaving(true)
    try {
      const url = editing.id ? `/api/services/${editing.id}` : '/api/services'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Service saved.')
      } else {
        toast.error('Could not save service.')
      }
    } catch (error) {
      console.error('Service save failed:', error)
      toast.error('Could not save service.')
    } finally {
      setSaving(false)
    }
  }

  const toggleVisible = async (s: Service) => {
    try {
      const next = { ...s, isEnabled: s.isEnabled === false }
      const res = await fetch(`/api/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: next.isEnabled }),
      })
      if (res.ok) setServices((prev) => prev.map((x) => (x.id === s.id ? next : x)))
      else toast.error('Could not update visibility.')
    } catch (error) {
      console.error('Toggle failed:', error)
      toast.error('Could not update visibility.')
    }
  }

  const remove = async (s: Service) => {
    const ok = await confirmDialog({
      title: 'Delete this service?',
      description: <><strong>{s.title}</strong> will no longer appear on your site.</>,
      confirmLabel: 'Delete service',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/services/${s.id}`, { method: 'DELETE' })
      if (res.ok) {
        setServices((prev) => prev.filter((x) => x.id !== s.id))
        toast.success('Service deleted.')
      } else {
        toast.error('Could not delete service.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete service.')
    }
  }

  const shown = services.filter((s) => matchesQuery(query, s.title, s.description, s.icon))

  if (!ready) return null

  return (
    <AdminShell
      active="services"
      title="Services"
      subtitle={`${visibleCount} visible · ${services.length} total`}
      actions={
        <button type="button" className="adm-btn amber" onClick={() => setEditing(emptyService(services.length))}>
          <Plus size={16} aria-hidden="true" /> New service
        </button>
      }
    >
      <StatStrip
        stats={[
          { label: 'Services', value: services.length, icon: Layers, tone: 'accent' },
          { label: 'Visible', value: visibleCount, icon: Eye, tone: 'good', note: services.length < 3 ? 'The site shows defaults below 3' : 'Shown on the home page' },
          { label: 'Hidden', value: services.length - visibleCount, icon: EyeOff },
        ]}
      />

      <Toolbar id="services" query={query} onQuery={setQuery} placeholder="Search services…" />

      {shown.length === 0 ? (
        <div className="adm-panel">
          <EmptyState
            icon={Layers}
            title={services.length ? 'No services match' : 'No services yet'}
            body={services.length ? 'Try a different search.' : 'Describe what clients can hire you for.'}
            action={!services.length && <button type="button" className="adm-btn amber" onClick={() => setEditing(emptyService(0))}>Add a service</button>}
          />
        </div>
      ) : (
        <div className="kit-grid">
          {shown.map((s, i) => (
            <article key={s.id} className="kit-card" data-muted={s.isEnabled === false}>
              <div className="kit-card-top">
                <span className="kit-card-icon" aria-hidden="true">
                  <Layers size={19} />
                </span>
                <span className="kit-card-meta">
                  #{String(s.order ?? i).padStart(2, '0')}
                  {s.icon ? ` · ${s.icon}` : ''}
                </span>
              </div>
              <h3 className="kit-card-title">{s.title}</h3>
              <p className="kit-card-body">{s.description}</p>
              <div className="kit-card-foot">
                <label className="adm-toggle" title="Toggle visibility">
                  <input type="checkbox" checked={s.isEnabled !== false} onChange={() => toggleVisible(s)} />
                  <span className="track" />
                  <span>{s.isEnabled === false ? 'Hidden' : 'Visible'}</span>
                </label>
                <div className="kit-handle">
                  <button type="button" className="adm-icon-btn" onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`}>
                    <Pencil size={15} />
                  </button>
                  <button type="button" className="adm-icon-btn danger" onClick={() => remove(s)} aria-label={`Delete ${s.title}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Drawer
        open={editing !== null}
        title={editing?.id ? 'Edit service' : 'New service'}
        subtitle="Shown in the Capabilities section of the home page."
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="adm-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button type="button" className="adm-btn amber" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save service'}
            </button>
          </>
        }
      >
        {editing && (
          <div>
            <div className="adm-field">
              <label className="adm-label" htmlFor="svc-title">Title</label>
              <input id="svc-title" className="adm-input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Web Applications" />
            </div>
            <div className="adm-field">
              <div className="kit-field-head">
                <label className="adm-label" htmlFor="svc-desc">Description</label>
                <AIGenerateButton
                  label="AI Write Service"
                  promptContext={{ field: 'service-description', contextData: { title: editing.title || 'Custom Full-Stack Development' } }}
                  onGenerate={(text) => setEditing((prev) => (prev ? { ...prev, description: text } : null))}
                />
              </div>
              <textarea id="svc-desc" className="adm-textarea" rows={5} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Compelling client-focused description of what you deliver" />
            </div>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label" htmlFor="svc-icon">Icon name</label>
                <input id="svc-icon" className="adm-input" value={editing.icon ?? ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="e.g. web" />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="svc-order">Order</label>
                <input id="svc-order" className="adm-input" type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <p className="adm-note">Icon options: {ICON_HINTS}</p>
            <label className="adm-toggle" style={{ marginTop: 16 }}>
              <input type="checkbox" checked={editing.isEnabled !== false} onChange={(e) => setEditing({ ...editing, isEnabled: e.target.checked })} />
              <span className="track" />
              <span>Visible on the public site</span>
            </label>
          </div>
        )}
      </Drawer>
    </AdminShell>
  )
}
