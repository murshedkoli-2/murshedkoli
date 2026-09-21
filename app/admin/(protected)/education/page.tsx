'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { period, toDateInput, type Education } from '@/lib/admin/timeline'

export default function EducationManager() {
  const ready = useAdminGuard()
  const [educations, setEducations] = useState<Education[]>([])
  const [editing, setEditing] = useState<Education | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/education')
      if (res.ok) setEducations(await res.json())
      else toast.error('Could not load education.')
    } catch (error) {
      console.error('Education load failed:', error)
      toast.error('Could not load education.')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const save = async () => {
    if (!editing || !editing.degree.trim() || !editing.institution.trim()) {
      toast.error('Degree and institution are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/education', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Education saved.')
      } else toast.error('Could not save education.')
    } catch (error) {
      console.error('Education save failed:', error)
      toast.error('Could not save education.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (e: Education) => {
    const ok = await confirmDialog({
      title: 'Delete this qualification?',
      description: <><strong>{e.degree}</strong> will be removed from your timeline.</>,
      confirmLabel: 'Delete qualification',
      tone: 'danger',
    })
    if (!ok) return
    const res = await fetch(`/api/education?id=${e.id}`, { method: 'DELETE' })
    if (res.ok) {
      setEducations((prev) => prev.filter((x) => x.id !== e.id))
      toast.success('Education deleted.')
    } else toast.error('Could not delete.')
  }

  if (!ready) return null

  const blank: Education = {
    institution: '', degree: '', field: '', description: '', startDate: '',
    endDate: '', current: false, gpa: '', order: educations.length,
  }

  return (
    <AdminShell
      active="education"
      title="Education"
      subtitle={`${educations.length} qualification${educations.length === 1 ? '' : 's'}`}
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(blank)}>
          + New qualification
        </button>
      }
    >
      {editing && (
        <div className="adm-panel" style={{ marginBottom: 20 }}>
          <div className="adm-editor" style={{ borderBottom: 0 }}>
            <h3>{editing.id ? 'Edit education' : 'New education'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Degree</label>
                <input className="adm-input" value={editing.degree} onChange={(e) => setEditing({ ...editing, degree: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Institution</label>
                <input className="adm-input" value={editing.institution} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Field</label>
                <input className="adm-input" value={editing.field || ''} onChange={(e) => setEditing({ ...editing, field: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">GPA (optional)</label>
                <input className="adm-input" value={editing.gpa || ''} onChange={(e) => setEditing({ ...editing, gpa: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Start date</label>
                <input type="date" className="adm-input" value={toDateInput(editing.startDate)} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">End date</label>
                <input type="date" className="adm-input" value={toDateInput(editing.endDate)} disabled={editing.current} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
              </div>
              <div className="adm-field adm-col-2" style={{ justifyContent: 'flex-end' }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={editing.current} onChange={(e) => setEditing({ ...editing, current: e.target.checked })} />
                  <span className="track" />
                  <span>Currently studying</span>
                </label>
              </div>
              <div className="adm-field adm-col-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="adm-label" style={{ margin: 0 }}>Description (optional)</label>
                  <AIGenerateButton
                    label="AI Polish Education"
                    promptContext={{
                      field: 'education-description',
                      contextData: {
                        degree: editing.degree,
                        institution: editing.institution,
                        currentDesc: editing.description,
                      },
                    }}
                    onGenerate={(text) => setEditing((prev) => prev ? { ...prev, description: text } : null)}
                  />
                </div>
                <textarea className="adm-textarea" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {educations.length === 0 ? (
        <div className="pe-empty">No education entries yet. Add your first qualification.</div>
      ) : (
        <div className="tl-grid">
          {educations.map((e) => (
            <article key={e.id} className={`tl-card ${e.current ? 'current' : ''}`}>
              <div className="tl-top">
                <span className="tl-period">{period(e.startDate, e.endDate, e.current)}</span>
                {e.current && <span className="adm-pill feat">Studying</span>}
                {e.gpa && <span className="tl-gpa">GPA {e.gpa}</span>}
              </div>

              <h3 className="tl-title">
                <button type="button" className="tl-open" onClick={() => setEditing(e)}>
                  {e.degree}
                </button>
              </h3>

              <p className="tl-where">
                {e.institution}
                {e.field && <span className="at"> · {e.field}</span>}
              </p>

              {e.description && <p className="tl-desc">{e.description}</p>}

              <div className="tl-actions">
                <button
                  className="adm-icon-btn danger"
                  onClick={() => remove(e)}
                  title="Delete"
                  aria-label={`Delete ${e.degree} from ${e.institution}`}
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
