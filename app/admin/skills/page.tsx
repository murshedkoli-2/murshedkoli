'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface Skill {
  id?: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
  isEnabled?: boolean
}

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'ai', label: 'AI' },
  { value: 'tools', label: 'Tools' },
  { value: 'languages', label: 'Languages' },
]

const MAX_VISIBLE = 16

function emptySkill(order: number): Skill {
  return { name: '', category: 'frontend', proficiency: 70, icon: '', order, isEnabled: true }
}

export default function SkillsManager() {
  const ready = useAdminGuard()
  const [skills, setSkills] = useState<Skill[]>([])
  const [editing, setEditing] = useState<Skill | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/skills')
      if (res.ok) setSkills(await res.json())
    } catch (error) {
      console.error('Skills load failed:', error)
      toast.error('Could not load skills.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const visibleCount = useMemo(() => skills.filter((s) => s.isEnabled !== false).length, [skills])

  const save = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error('Skill name is required.')
      return
    }
    setSaving(true)
    try {
      const url = editing.id ? `/api/skills/${editing.id}` : '/api/skills'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        await load()
        toast.success('Skill saved.')
      } else {
        toast.error('Could not save skill.')
      }
    } catch (error) {
      console.error('Skill save failed:', error)
      toast.error('Could not save skill.')
    } finally {
      setSaving(false)
    }
  }

  const toggleVisible = async (s: Skill) => {
    try {
      const next = { ...s, isEnabled: s.isEnabled === false }
      const res = await fetch(`/api/skills/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (res.ok) setSkills((prev) => prev.map((x) => (x.id === s.id ? next : x)))
      else toast.error('Could not update visibility.')
    } catch (error) {
      console.error('Toggle failed:', error)
      toast.error('Could not update visibility.')
    }
  }

  const remove = async (s: Skill) => {
    if (!window.confirm(`Delete skill "${s.name}"?`)) return
    try {
      const res = await fetch(`/api/skills/${s.id}`, { method: 'DELETE' })
      if (res.ok) {
        setSkills((prev) => prev.filter((x) => x.id !== s.id))
        toast.success('Skill deleted.')
      } else {
        toast.error('Could not delete skill.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete skill.')
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="skills"
      title="Skills"
      subtitle={`${visibleCount} visible · ${skills.length} total`}
      badges={{ skills: skills.length }}
      actions={
        <button className="adm-btn amber" onClick={() => setEditing(emptySkill(skills.length))}>
          + New skill
        </button>
      }
    >
      {visibleCount > MAX_VISIBLE && (
        <div className="adm-banner">
          <span aria-hidden>⚠</span>
          <div className="fill">
            <b>{visibleCount} skills are visible.</b> Recruiters skim — hide some so the strongest{' '}
            {MAX_VISIBLE} lead. Toggle visibility below.
          </div>
        </div>
      )}

      <div className="adm-panel">
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit skill' : 'New skill'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Name</label>
                <input
                  className="adm-input"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Next.js"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Category</label>
                <select
                  className="adm-select"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="adm-toggle" style={{ marginBottom: 14 }}>
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
                {saving ? 'Saving…' : 'Save skill'}
              </button>
              <button className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="adm-panel-head">
          <h2>All skills ({skills.length})</h2>
        </div>
        <div className="adm-rows">
          {skills.length === 0 ? (
            <div className="adm-empty">No skills yet. Add your first one.</div>
          ) : (
            skills.map((s) => (
              <div className="adm-list-row" key={s.id}>
                <span className="adm-cat">{s.category}</span>
                <div className="grow">
                  <b>{s.name}</b>
                </div>
                <label className="adm-toggle" title="Toggle visibility">
                  <input
                    type="checkbox"
                    checked={s.isEnabled !== false}
                    onChange={() => toggleVisible(s)}
                  />
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
