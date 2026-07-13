'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface Experience {
  id?: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  order: number
}

interface Education {
  id?: string
  institution: string
  degree: string
  field?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  order: number
}

function toDateInput(value?: string): string {
  if (!value) return ''
  return new Date(value).toISOString().split('T')[0]
}

function period(start?: string, end?: string, current?: boolean): string {
  const s = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'
  const e = current ? 'Present' : end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'
  return `${s} — ${e}`
}

export default function ExperienceManager() {
  const ready = useAdminGuard()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [editExp, setEditExp] = useState<Experience | null>(null)
  const [editEdu, setEditEdu] = useState<Education | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [expRes, eduRes] = await Promise.all([fetch('/api/experience'), fetch('/api/education')])
      if (expRes.ok) setExperiences(await expRes.json())
      if (eduRes.ok) setEducations(await eduRes.json())
    } catch (error) {
      console.error('Timeline load failed:', error)
      toast.error('Could not load experience/education.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const saveExp = async () => {
    if (!editExp || !editExp.position.trim() || !editExp.company.trim()) {
      toast.error('Role and company are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/experience', {
        method: editExp.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editExp),
      })
      if (res.ok) {
        setEditExp(null)
        await load()
        toast.success('Experience saved.')
      } else toast.error('Could not save experience.')
    } catch (error) {
      console.error(error)
      toast.error('Could not save experience.')
    } finally {
      setSaving(false)
    }
  }

  const saveEdu = async () => {
    if (!editEdu || !editEdu.degree.trim() || !editEdu.institution.trim()) {
      toast.error('Degree and institution are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/education', {
        method: editEdu.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEdu),
      })
      if (res.ok) {
        setEditEdu(null)
        await load()
        toast.success('Education saved.')
      } else toast.error('Could not save education.')
    } catch (error) {
      console.error(error)
      toast.error('Could not save education.')
    } finally {
      setSaving(false)
    }
  }

  const removeExp = async (e: Experience) => {
    if (!window.confirm(`Delete "${e.position} · ${e.company}"?`)) return
    const res = await fetch(`/api/experience?id=${e.id}`, { method: 'DELETE' })
    if (res.ok) {
      setExperiences((prev) => prev.filter((x) => x.id !== e.id))
      toast.success('Experience deleted.')
    } else toast.error('Could not delete.')
  }

  const removeEdu = async (e: Education) => {
    if (!window.confirm(`Delete "${e.degree}"?`)) return
    const res = await fetch(`/api/education?id=${e.id}`, { method: 'DELETE' })
    if (res.ok) {
      setEducations((prev) => prev.filter((x) => x.id !== e.id))
      toast.success('Education deleted.')
    } else toast.error('Could not delete.')
  }

  if (!ready) return null

  const newExp: Experience = {
    company: '', position: '', description: '', startDate: '', endDate: '', current: false, location: '', order: experiences.length,
  }
  const newEdu: Education = {
    institution: '', degree: '', field: '', description: '', startDate: '', endDate: '', current: false, gpa: '', order: educations.length,
  }

  return (
    <AdminShell active="experience" title="Experience & Education" subtitle="Your professional track record">
      {/* Experience */}
      <div className="adm-panel" style={{ marginBottom: 24 }}>
        {editExp && (
          <div className="adm-editor">
            <h3>{editExp.id ? 'Edit experience' : 'New experience'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Role</label>
                <input className="adm-input" value={editExp.position} onChange={(e) => setEditExp({ ...editExp, position: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Company</label>
                <input className="adm-input" value={editExp.company} onChange={(e) => setEditExp({ ...editExp, company: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Start date</label>
                <input type="date" className="adm-input" value={toDateInput(editExp.startDate)} onChange={(e) => setEditExp({ ...editExp, startDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">End date</label>
                <input type="date" className="adm-input" value={toDateInput(editExp.endDate)} disabled={editExp.current} onChange={(e) => setEditExp({ ...editExp, endDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Location</label>
                <input className="adm-input" value={editExp.location || ''} onChange={(e) => setEditExp({ ...editExp, location: e.target.value })} />
              </div>
              <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={editExp.current} onChange={(e) => setEditExp({ ...editExp, current: e.target.checked })} />
                  <span className="track" />
                  <span>Current role</span>
                </label>
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Description</label>
                <textarea className="adm-textarea" value={editExp.description} onChange={(e) => setEditExp({ ...editExp, description: e.target.value })} />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={saveExp} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="adm-btn" onClick={() => setEditExp(null)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="adm-panel-head">
          <h2>Experience ({experiences.length})</h2>
          <button className="adm-btn amber" onClick={() => setEditExp(newExp)}>+ Add</button>
        </div>
        <div className="adm-rows">
          {experiences.length === 0 ? (
            <div className="adm-empty">No experience entries yet.</div>
          ) : (
            experiences.map((e) => (
              <div className="adm-list-row" key={e.id}>
                <div className="grow">
                  <b>{e.position}</b>
                  <div className="sub">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                </div>
                <span className="adm-cat">{period(e.startDate, e.endDate, e.current)}</span>
                <div className="adm-row-actions">
                  <button className="adm-icon-btn" onClick={() => setEditExp(e)} title="Edit">✎</button>
                  <button className="adm-icon-btn danger" onClick={() => removeExp(e)} title="Delete">🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Education */}
      <div className="adm-panel">
        {editEdu && (
          <div className="adm-editor">
            <h3>{editEdu.id ? 'Edit education' : 'New education'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Degree</label>
                <input className="adm-input" value={editEdu.degree} onChange={(e) => setEditEdu({ ...editEdu, degree: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Institution</label>
                <input className="adm-input" value={editEdu.institution} onChange={(e) => setEditEdu({ ...editEdu, institution: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Field</label>
                <input className="adm-input" value={editEdu.field || ''} onChange={(e) => setEditEdu({ ...editEdu, field: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">GPA (optional)</label>
                <input className="adm-input" value={editEdu.gpa || ''} onChange={(e) => setEditEdu({ ...editEdu, gpa: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Start date</label>
                <input type="date" className="adm-input" value={toDateInput(editEdu.startDate)} onChange={(e) => setEditEdu({ ...editEdu, startDate: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-label">End date</label>
                <input type="date" className="adm-input" value={toDateInput(editEdu.endDate)} disabled={editEdu.current} onChange={(e) => setEditEdu({ ...editEdu, endDate: e.target.value })} />
              </div>
              <div className="adm-field adm-col-2" style={{ justifyContent: 'flex-end' }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={editEdu.current} onChange={(e) => setEditEdu({ ...editEdu, current: e.target.checked })} />
                  <span className="track" />
                  <span>Currently studying</span>
                </label>
              </div>
              <div className="adm-field adm-col-2">
                <label className="adm-label">Description (optional)</label>
                <textarea className="adm-textarea" value={editEdu.description || ''} onChange={(e) => setEditEdu({ ...editEdu, description: e.target.value })} />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={saveEdu} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="adm-btn" onClick={() => setEditEdu(null)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="adm-panel-head">
          <h2>Education ({educations.length})</h2>
          <button className="adm-btn amber" onClick={() => setEditEdu(newEdu)}>+ Add</button>
        </div>
        <div className="adm-rows">
          {educations.length === 0 ? (
            <div className="adm-empty">No education entries yet.</div>
          ) : (
            educations.map((e) => (
              <div className="adm-list-row" key={e.id}>
                <div className="grow">
                  <b>{e.degree}</b>
                  <div className="sub">{e.institution}{e.field ? ` · ${e.field}` : ''}</div>
                </div>
                <span className="adm-cat">{period(e.startDate, e.endDate, e.current)}</span>
                <div className="adm-row-actions">
                  <button className="adm-icon-btn" onClick={() => setEditEdu(e)} title="Edit">✎</button>
                  <button className="adm-icon-btn danger" onClick={() => removeEdu(e)} title="Delete">🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  )
}
