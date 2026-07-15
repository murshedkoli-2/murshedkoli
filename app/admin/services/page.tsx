'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

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
    if (!window.confirm(`Delete service "${s.title}"?`)) return
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

  if (!ready) return null

  return (
    <AdminShell
      active="services"
      title="Services"
      subtitle={`${visibleCount} visible · ${services.length} total`}
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(emptyService(services.length))}>
          + New service
        </button>
      }
    >
      <div className="adm-panel">
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit service' : 'New service'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Web Applications"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Icon name</label>
                <input
                  className="adm-input"
                  value={editing.icon ?? ''}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  placeholder="e.g. web"
                />
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Description</label>
                <textarea
                  className="adm-textarea"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Short description of what you offer"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Order</label>
                <input
                  className="adm-input"
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <p className="adm-note">Icon options: {ICON_HINTS}</p>
            <label className="adm-toggle" style={{ marginBottom: 14, marginTop: 10 }}>
              <input
                type="checkbox"
                checked={editing.isEnabled !== false}
                onChange={(e) => setEditing({ ...editing, isEnabled: e.target.checked })}
              />
              <span className="track" />
              <span>Visible on the public site</span>
            </label>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save service'}
              </button>
              <button className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="adm-panel-head">
          <h2>All services ({services.length})</h2>
        </div>
        <div className="adm-rows">
          {services.length === 0 ? (
            <div className="adm-empty">No services yet. Add your first one.</div>
          ) : (
            services.map((s) => (
              <div className="adm-list-row" key={s.id}>
                {s.icon ? <span className="adm-cat">{s.icon}</span> : null}
                <div className="grow">
                  <b>{s.title}</b>
                  <div className="sub">{s.description}</div>
                </div>
                <label className="adm-toggle" title="Toggle visibility">
                  <input type="checkbox" checked={s.isEnabled !== false} onChange={() => toggleVisible(s)} />
                  <span className="track" />
                </label>
                <div className="adm-row-actions">
                  <button className="adm-icon-btn" onClick={() => setEditing(s)} title="Edit">
                    ✎
                  </button>
                  <button className="adm-icon-btn danger" onClick={() => remove(s)} title="Delete">
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  )
}
