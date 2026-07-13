'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  facebook?: string
  youtube?: string
}

interface Profile {
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  avatar?: string
  heroImage?: string
  resume?: string
  socialLinks?: SocialLinks
}

const SOCIALS: { key: keyof SocialLinks; label: string }[] = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'website', label: 'Website' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
]

export default function AboutManager() {
  const ready = useAdminGuard()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [availability, setAvailability] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'hero' | 'resume' | null>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const [profRes, setRes] = await Promise.all([fetch('/api/profile'), fetch('/api/settings')])
      if (profRes.ok) setProfile(await profRes.json())
      if (setRes.ok) {
        const s = await setRes.json()
        const raw = s.availability ?? s.availableForWork
        setAvailability(raw === undefined ? true : Boolean(raw))
      }
    } catch (error) {
      console.error('Profile load failed:', error)
      toast.error('Could not load profile.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const upload = async (file: File, target: 'hero' | 'resume') => {
    setUploading(target)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok && data.success && profile) {
        setProfile({ ...profile, [target === 'hero' ? 'heroImage' : 'resume']: data.url })
        toast.success('Uploaded — remember to save.')
      } else {
        toast.error('Upload failed.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed.')
    } finally {
      setUploading(null)
    }
  }

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const [p, a] = await Promise.all([
        fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        }),
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'availability', value: availability }),
        }),
      ])
      if (p.ok && a.ok) toast.success('Profile saved.')
      else toast.error('Could not save everything.')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  const field = (label: string, value: string, onChange: (v: string) => void, opts: { col2?: boolean; textarea?: boolean; placeholder?: string } = {}) => (
    <div className={`adm-field ${opts.col2 ? 'adm-col-2' : ''}`}>
      <label className="adm-label">{label}</label>
      {opts.textarea ? (
        <textarea className="adm-textarea" value={value} onChange={(e) => onChange(e.target.value)} placeholder={opts.placeholder} />
      ) : (
        <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={opts.placeholder} />
      )}
    </div>
  )

  return (
    <AdminShell
      active="about"
      title="About & Hero"
      subtitle="Identity, availability, hero media, and social links"
      actions={
        <button className="adm-btn amber" onClick={save} disabled={saving || !profile}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      }
    >
      {!profile ? (
        <div className="adm-panel"><div className="adm-empty">Loading profile…</div></div>
      ) : (
        <>
          {/* Identity */}
          <div className="adm-panel" style={{ marginBottom: 20 }}>
            <div className="adm-panel-head"><h2>Identity</h2></div>
            <div className="adm-body">
              <div className="adm-form-grid">
                {field('Full name', profile.name, (v) => setProfile({ ...profile, name: v }), { placeholder: 'Murshed Al Main' })}
                {field('Headline / title', profile.title, (v) => setProfile({ ...profile, title: v }))}
                {field('Email', profile.email, (v) => setProfile({ ...profile, email: v }))}
                {field('Phone', profile.phone || '', (v) => setProfile({ ...profile, phone: v }))}
                {field('Location', profile.location || '', (v) => setProfile({ ...profile, location: v }))}
                <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
                  <label className="adm-toggle">
                    <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} />
                    <span className="track" />
                    <span>Available for work (drives the hero status dot)</span>
                  </label>
                </div>
                {field('Subheadline / bio', profile.description, (v) => setProfile({ ...profile, description: v }), { col2: true, textarea: true })}
              </div>
            </div>
          </div>

          {/* Hero image + Resume */}
          <div className="adm-panel" style={{ marginBottom: 20 }} ref={resumeRef} id="resume">
            <div className="adm-panel-head"><h2>Hero media & résumé</h2></div>
            <div className="adm-body">
              <div className="adm-form-grid">
                <div className="adm-field">
                  <label className="adm-label">Hero image URL</label>
                  <input className="adm-input" value={profile.heroImage || ''} onChange={(e) => setProfile({ ...profile, heroImage: e.target.value })} placeholder="/image.png or https://…" />
                  <label className="adm-btn" style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                    {uploading === 'hero' ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/*" hidden disabled={uploading !== null} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'hero')} />
                  </label>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Résumé file</label>
                  <input className="adm-input" value={profile.resume || ''} onChange={(e) => setProfile({ ...profile, resume: e.target.value })} placeholder="/Murshed-Al-Main-Resume.pdf" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <label className="adm-btn" style={{ alignSelf: 'flex-start' }}>
                      {uploading === 'resume' ? 'Uploading…' : 'Upload PDF'}
                      <input type="file" accept=".pdf,.doc,.docx" hidden disabled={uploading !== null} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'resume')} />
                    </label>
                    {profile.resume ? (
                      <a className="adm-btn" href={profile.resume} target="_blank" rel="noopener noreferrer">View current ↗</a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="adm-panel">
            <div className="adm-panel-head"><h2>Social links</h2></div>
            <div className="adm-body">
              <div className="adm-form-grid">
                {SOCIALS.map((s) =>
                  field(
                    s.label,
                    profile.socialLinks?.[s.key] || '',
                    (v) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [s.key]: v } }),
                    { placeholder: `https://…` }
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
}
