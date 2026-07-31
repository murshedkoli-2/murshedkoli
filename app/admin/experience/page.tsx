'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { period, toDateInput, type Experience } from '@/lib/admin/timeline'

export default function ExperienceManager() {
  const ready = useAdminGuard()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editing, setEditing] = useState<Experience | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/experience')
      if (res.ok) setExperiences(await res.json())
      else toast.error('Could not load experience.')
    } catch (error) {
      console.error('Experience load failed:', error)
      toast.error('Could not load experience.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const save = async () => {
    if (!editing || !editing.position.trim() || !editing.company.trim()) {
      toast.error('Role and company are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/experience', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Experience saved.')
      } else toast.error('Could not save experience.')
    } catch (error) {
      console.error('Experience save failed:', error)
      toast.error('Could not save experience.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (e: Experience) => {
    const ok = await confirmDialog({
      title: 'Delete this role?',
      description: <><strong>{e.position}</strong> at {e.company} will be removed from your timeline.</>,
      confirmLabel: 'Delete role',
      tone: 'danger',
    })
    if (!ok) return
    const res = await fetch(`/api/experience?id=${e.id}`, { method: 'DELETE' })
    if (res.ok) {
      setExperiences((prev) => prev.filter((x) => x.id !== e.id))
      toast.success('Experience deleted.')
    } else toast.error('Could not delete.')
  }

  if (!ready) return null

  const blank: Experience = {
    company: '', position: '', description: '', startDate: '', endDate: '',
    current: false, location: '', order: experiences.length,
  }

  return (
    <AdminShell
      active="experience"
      title="Experience"
      subtitle={`${experiences.length} role${experiences.length === 1 ? '' : 's'}`}
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(blank)}>
          + New role
        </button>
      }
    >
      {editing && (
        <div className="adm-panel" style={{ marginBottom: 20 }}>
          <div className="adm-editor" style={{ borderBottom: 0 }}>
            <h3>{editing.id ? 'Edit experience' : 'New experience'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Role</label>
                <input className="adm-input" value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Company</label>
                <input className="adm-input" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Start date</label>
                <input type="date" className="adm-input" value={toDateInput(editing.startDate)} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">End date</label>
                <input type="date" className="adm-input" value={toDateInput(editing.endDate)} disabled={editing.current} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Location</label>
                <input className="adm-input" value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </div>
              <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={editing.current} onChange={(e) => setEditing({ ...editing, current: e.target.checked })} />
                  <span className="track" />
                  <span>Current role</span>
                </label>
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Description</label>
                <textarea className="adm-textarea" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="pe-empty">No experience entries yet. Add your first role.</div>
      ) : (
        <div className="tl-grid">
          {experiences.map((e) => (
            <article key={e.id} className={`tl-card ${e.current ? 'current' : ''}`}>
              <div className="tl-top">
                <span className="tl-period">{period(e.startDate, e.endDate, e.current)}</span>
                {e.current && <span className="adm-pill feat">Current</span>}
              </div>

              <h3 className="tl-title">
                <button type="button" className="tl-open" onClick={() => setEditing(e)}>
                  {e.position}
                </button>
              </h3>

              <p className="tl-where">
                {e.company}
                {e.location && <span className="at"> · {e.location}</span>}
              </p>

              {e.description && <p className="tl-desc">{e.description}</p>}

              <div className="tl-actions">
                <button
                  className="adm-icon-btn danger"
                  onClick={() => remove(e)}
                  title="Delete"
                  aria-label={`Delete ${e.position} at ${e.company}`}
                >
                  🗑
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
