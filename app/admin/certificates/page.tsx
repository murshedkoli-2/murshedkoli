'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface Certificate {
  id?: string
  name: string
  issuer: string
  date: string
  url?: string
  description?: string
  order: number
}

function emptyCert(order: number): Certificate {
  return { name: '', issuer: '', date: new Date().toISOString().split('T')[0], url: '', description: '', order }
}

function toDateInput(value: string): string {
  if (!value) return ''
  return new Date(value).toISOString().split('T')[0]
}

export default function CertificatesManager() {
  const ready = useAdminGuard()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/certifications')
      if (res.ok) setCerts(await res.json())
    } catch (error) {
      console.error('Certificates load failed:', error)
      toast.error('Could not load certificates.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const save = async () => {
    if (!editing || !editing.name.trim() || !editing.issuer.trim()) {
      toast.error('Name and issuer are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/certifications', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Certificate saved.')
      } else {
        toast.error('Could not save certificate.')
      }
    } catch (error) {
      console.error('Cert save failed:', error)
      toast.error('Could not save certificate.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: Certificate) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return
    try {
      const res = await fetch(`/api/certifications?id=${c.id}`, { method: 'DELETE' })
      if (res.ok) {
        setCerts((prev) => prev.filter((x) => x.id !== c.id))
        toast.success('Certificate deleted.')
      } else {
        toast.error('Could not delete certificate.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete certificate.')
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="certificates"
      title="Certificates"
      subtitle={`${certs.length} total`}
      badges={{ certificates: certs.length }}
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(emptyCert(certs.length))}>
          + New certificate
        </button>
      }
    >
      <div className="adm-panel">
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit certificate' : 'New certificate'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Complete Web Development"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Issuer</label>
                <input
                  className="adm-input"
                  value={editing.issuer}
                  onChange={(e) => setEditing({ ...editing, issuer: e.target.value })}
                  placeholder="e.g. Programming Hero"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Issue date</label>
                <input
                  type="date"
                  className="adm-input"
                  value={toDateInput(editing.date)}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Verify URL</label>
                <input
                  className="adm-input"
                  value={editing.url || ''}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Description (optional)</label>
                <textarea
                  className="adm-textarea"
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save certificate'}
              </button>
              <button className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="adm-panel-head">
          <h2>All certificates ({certs.length})</h2>
        </div>
        <div className="adm-rows">
          {certs.length === 0 ? (
            <div className="adm-empty">No certificates yet.</div>
          ) : (
            certs.map((c) => (
              <div className="adm-list-row" key={c.id}>
                <span className="adm-cat">{toDateInput(c.date)}</span>
                <div className="grow">
                  <b>{c.name}</b>
                  <div className="sub">
                    {c.issuer}
                    {c.url ? ' · verify link set' : ' · no verify link'}
                  </div>
                </div>
                {c.url ? (
                  <a className="adm-icon-btn" href={c.url} target="_blank" rel="noopener noreferrer" title="Open verify link">
                    ↗
                  </a>
                ) : null}
                <div className="adm-row-actions">
                  <button className="adm-icon-btn" onClick={() => setEditing(c)} title="Edit">
                    ✎
                  </button>
                  <button className="adm-icon-btn danger" onClick={() => remove(c)} title="Delete">
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
