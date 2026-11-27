'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Briefcase, Building2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { Drawer } from '@/components/admin/kit/Drawer'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { matchesQuery } from '@/lib/admin/list'
import { period, toDateInput, type Experience } from '@/lib/admin/timeline'

export default function ExperienceManager() {
  const ready = useAdminGuard()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editing, setEditing] = useState<Experience | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
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

  const shown = useMemo(() => experiences.filter((e) => matchesQuery(query, e.position, e.company, e.location, e.description)), [experiences, query])

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
        <button type="button" className="adm-btn amber" onClick={() => setEditing(blank)}>
          <Plus size={16} aria-hidden="true" /> New role
        </button>
      }
    >
      <Drawer
        open={editing !== null}
        title={editing?.id ? 'Edit role' : 'New role'}
        subtitle="Roles appear on your About page timeline."
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="adm-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button type="button" className="adm-btn amber" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        {editing && (
          <div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="adm-label" style={{ margin: 0 }}>Description</label>
                  <AIGenerateButton
                    label="AI Polish Experience"
                    promptContext={{
                      field: 'experience-description',
                      contextData: {
                        position: editing.position,
                        company: editing.company,
                        currentDesc: editing.description,
                      },
                    }}
                    onGenerate={(text) => setEditing((prev) => prev ? { ...prev, description: text } : null)}
                  />
                </div>
                <textarea className="adm-textarea" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <StatStrip
        stats={[
          { label: 'Roles', value: experiences.length, icon: Briefcase, tone: 'accent' },
          { label: 'Current', value: experiences.filter((x) => x.current).length, icon: Sparkles, tone: 'good' },
          { label: 'Companies', value: new Set(experiences.map((x) => x.company.trim().toLowerCase())).size, icon: Building2 },
        ]}
      />

      <Toolbar id="experience" query={query} onQuery={setQuery} placeholder="Search experience…" />


      {shown.length === 0 ? (
        <div className="adm-panel">
          <EmptyState
            icon={Briefcase}
            title={experiences.length ? 'Nothing matches' : 'Nothing here yet'}
            body={experiences.length ? 'Try a different search.' : 'Add your first role to build the timeline.'}
          />
        </div>
      ) : (
        <div className="tl-grid">
          {shown.map((e) => (
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
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
