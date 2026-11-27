'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Hexagon, Layers3, Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { Drawer } from '@/components/admin/kit/Drawer'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { matchesQuery } from '@/lib/admin/list'

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
const labelFor = (value: string) => CATEGORIES.find((c) => c.value === value)?.label ?? value

const MAX_VISIBLE = 16

function emptySkill(order: number): Skill {
  return { name: '', category: 'frontend', proficiency: 70, icon: '', order, isEnabled: true }
}

export default function SkillsManager() {
  const ready = useAdminGuard()
  const [skills, setSkills] = useState<Skill[]>([])
  const [editing, setEditing] = useState<Skill | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/skills')
      if (res.ok) setSkills(await res.json())
      else toast.error('Could not load skills.')
    } catch {
      toast.error('Could not load skills.')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const visibleCount = useMemo(() => skills.filter((s) => s.isEnabled !== false).length, [skills])

  const filters = useMemo(
    () => [
      { value: 'all', label: 'All', count: skills.length },
      ...CATEGORIES.map((c) => ({ ...c, count: skills.filter((s) => s.category === c.value).length })).filter((c) => c.count > 0),
    ],
    [skills],
  )

  const columns = useMemo(() => {
    const shown = skills.filter((s) => (filter === 'all' || s.category === filter) && matchesQuery(query, s.name, s.category))
    const keys = Array.from(new Set(shown.map((s) => s.category)))
    return keys.map((key) => ({ key, label: labelFor(key), skills: shown.filter((s) => s.category === key) }))
  }, [skills, filter, query])

  const save = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error('Skill name is required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(editing.id ? `/api/skills/${editing.id}` : '/api/skills', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, name: editing.name.trim() }),
      })
      if (!res.ok) throw new Error('save failed')
      setEditing(null)
      await load()
      toast.success('Skill saved.')
    } catch {
      toast.error('Could not save skill.')
    } finally {
      setSaving(false)
    }
  }

  const toggleVisible = async (s: Skill) => {
    const next = { ...s, isEnabled: s.isEnabled === false }
    setSkills((prev) => prev.map((x) => (x.id === s.id ? next : x)))
    try {
      const res = await fetch(`/api/skills/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error('toggle failed')
    } catch {
      setSkills((prev) => prev.map((x) => (x.id === s.id ? s : x)))
      toast.error('Could not update visibility.')
    }
  }

  const remove = async (s: Skill) => {
    const ok = await confirmDialog({
      title: 'Delete this skill?',
      description: <><strong>{s.name}</strong> will be removed from your skills list.</>,
      confirmLabel: 'Delete skill',
      tone: 'danger',
    })
    if (!ok) return
    try {
      const res = await fetch(`/api/skills/${s.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      setSkills((prev) => prev.filter((x) => x.id !== s.id))
      toast.success('Skill deleted.')
    } catch {
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
        <button type="button" className="adm-btn amber" onClick={() => setEditing(emptySkill(skills.length))}>
          <Plus size={16} aria-hidden="true" /> New skill
        </button>
      }
    >
      <StatStrip
        stats={[
          { label: 'Total skills', value: skills.length, icon: Hexagon, tone: 'accent' },
          { label: 'Visible', value: visibleCount, icon: Eye, tone: visibleCount > MAX_VISIBLE ? 'warn' : 'good', note: visibleCount > MAX_VISIBLE ? `Trim to ${MAX_VISIBLE} or fewer` : `Within the ${MAX_VISIBLE} limit` },
          { label: 'Hidden', value: skills.length - visibleCount, icon: EyeOff },
          { label: 'Categories', value: filters.length - 1, icon: Layers3 },
        ]}
      />

      <Toolbar id="skills" query={query} onQuery={setQuery} placeholder="Search skills…" filters={filters} filter={filter} onFilter={setFilter} />

      {columns.length === 0 ? (
        <div className="adm-panel">
          <EmptyState
            icon={Hexagon}
            title={skills.length ? 'No skills match' : 'No skills yet'}
            body={skills.length ? 'Try a different search or category.' : 'Add the technologies you want recruiters to see.'}
            action={!skills.length && <button type="button" className="adm-btn amber" onClick={() => setEditing(emptySkill(0))}>Add a skill</button>}
          />
        </div>
      ) : (
        <div className="kit-board">
          {columns.map((col) => (
            <section key={col.key} className="kit-column" aria-label={col.label}>
              <header className="kit-column-head">
                <h3>{col.label}</h3>
                <span className="adm-cat">{col.skills.length}</span>
              </header>
              <ul className="kit-chips">
                {col.skills.map((s) => (
                  <li key={s.id} className="kit-chip" data-hidden={s.isEnabled === false}>
                    <span>{s.name}</span>
                    <button type="button" onClick={() => toggleVisible(s)} aria-label={s.isEnabled === false ? `Show ${s.name}` : `Hide ${s.name}`} title={s.isEnabled === false ? 'Hidden — click to show' : 'Visible — click to hide'}>
                      {s.isEnabled === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button type="button" onClick={() => setEditing(s)} aria-label={`Edit ${s.name}`}>
                      <Pencil size={13} />
                    </button>
                    <button type="button" className="danger" onClick={() => remove(s)} aria-label={`Delete ${s.name}`}>
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Drawer
        open={editing !== null}
        title={editing?.id ? 'Edit skill' : 'New skill'}
        subtitle="Shown in the tech strip and capabilities section."
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="adm-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button type="button" className="adm-btn amber" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save skill'}
            </button>
          </>
        }
      >
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save() }}>
            <div className="adm-field">
              <label className="adm-label" htmlFor="skill-name">Name</label>
              <input id="skill-name" className="adm-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Next.js" />
            </div>
            <div className="adm-field">
              <span className="adm-label">Category</span>
              <div className="kit-chips" role="radiogroup" aria-label="Category">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={editing.category === c.value}
                    className={`pe-chip ${editing.category === c.value ? 'on' : ''}`}
                    onClick={() => setEditing({ ...editing, category: c.value })}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="adm-toggle">
              <input type="checkbox" checked={editing.isEnabled !== false} onChange={(e) => setEditing({ ...editing, isEnabled: e.target.checked })} />
              <span className="track" />
              <span>Visible on the public site</span>
            </label>
          </form>
        )}
      </Drawer>
    </AdminShell>
  )
}
