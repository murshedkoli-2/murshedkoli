'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { EditableField } from '@/components/admin/about/EditableField'
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
  heroPortrait?: string
  storyImage?: string
  resume?: string
  socialLinks?: SocialLinks
}

/** Every image the home page renders, and where it appears. */
const HOME_IMAGES: {
  key: 'heroPortrait' | 'storyImage'
  label: string
  help: string
  fallback: string
}[] = [
  {
    key: 'heroPortrait',
    label: 'Hero portrait',
    help: 'The tall plate beside your name at the top of the home page.',
    fallback: '/images/hero-1.png',
  },
  {
    key: 'storyImage',
    label: 'Craft image',
    help: 'The plate next to the “how I work” principles, further down.',
    fallback: '/images/hero-3.jpg',
  },
]

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
  const [uploading, setUploading] = useState<keyof Profile | null>(null)

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

  /**
   * Persists a single change.
   *
   * /api/profile PUT writes every column from the body, so a partial payload
   * would blank the rest — the whole profile always goes, with one field
   * replaced.
   */
  const saveField = useCallback(
    async (patch: Partial<Profile>): Promise<boolean> => {
      if (!profile) return false
      const next = { ...profile, ...patch }
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        })
        if (!res.ok) throw new Error('request failed')
        setProfile(next)
        toast.success('Saved.')
        return true
      } catch (error) {
        console.error('Profile save failed:', error)
        toast.error('Could not save.')
        return false
      }
    },
    [profile]
  )

  const saveAvailability = async (value: boolean) => {
    const previous = availability
    setAvailability(value)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'availability', value }),
      })
      if (!res.ok) throw new Error('request failed')
      toast.success(value ? 'Marked as available for work.' : 'Marked as unavailable.')
    } catch (error) {
      console.error('Availability save failed:', error)
      setAvailability(previous)
      toast.error('Could not update availability.')
    }
  }

  /** Uploads and persists in one step — no separate save to forget. */
  const upload = async (file: File, target: keyof Profile) => {
    setUploading(target)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok && data.success) {
        await saveField({ [target]: data.url } as Partial<Profile>)
      } else {
        toast.error(data.message || 'Upload failed.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed.')
    } finally {
      setUploading(null)
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="about"
      title="About & Hero"
      subtitle="Each field saves on its own — use ✎ to edit one"
      actions={
        <Link href="/" target="_blank" className="adm-btn">
          Preview site ↗
        </Link>
      }
    >
      {!profile ? (
        <div className="adm-panel"><div className="adm-empty">Loading profile…</div></div>
      ) : (
        <div style={{ maxWidth: 860 }}>
          {/* Identity */}
          <div className="adm-panel" style={{ marginBottom: 20 }}>
            <div className="adm-panel-head"><h2>Identity</h2></div>

            <EditableField
              label="Full name"
              value={profile.name}
              placeholder="Murshed Al Main"
              onSave={(v) => saveField({ name: v })}
            />
            <EditableField
              label="Headline / title"
              value={profile.title}
              placeholder="Full-stack developer"
              onSave={(v) => saveField({ title: v })}
            />
            <EditableField
              label="Email"
              type="email"
              value={profile.email}
              placeholder="you@example.com"
              onSave={(v) => saveField({ email: v })}
            />
            <EditableField
              label="Phone"
              type="tel"
              value={profile.phone || ''}
              onSave={(v) => saveField({ phone: v })}
            />
            <EditableField
              label="Location"
              value={profile.location || ''}
              placeholder="Dhaka, Bangladesh"
              onSave={(v) => saveField({ location: v })}
            />
            <EditableField
              label="Subheadline / bio"
              value={profile.description}
              multiline
              onSave={(v) => saveField({ description: v })}
            />

            {/* A switch is its own commit — there is no edit step to open. */}
            <div className="ef-row">
              <div className="ef-main">
                <span className="ef-label">Availability</span>
                <label className="adm-toggle" style={{ marginTop: 2 }}>
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => saveAvailability(e.target.checked)}
                  />
                  <span className="track" />
                  <span>Available for work (drives the hero status dot)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Hero media & résumé */}
          <div className="adm-panel" style={{ marginBottom: 20 }} id="resume">
            <div className="adm-panel-head"><h2>Hero media &amp; résumé</h2></div>

            <EditableField
              label="Hero image"
              value={profile.heroImage || ''}
              placeholder="/image.png or https://…"
              onSave={(v) => saveField({ heroImage: v })}
              renderValue={(v) => <span className="adm-mono" style={{ fontSize: 12 }}>{v}</span>}
              extra={
                <div className="ef-extra">
                  {profile.heroImage && (
                    // Arbitrary local/remote URLs; next/image would need host config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.heroImage} alt="" className="ef-thumb" />
                  )}
                  <label className="adm-btn">
                    {uploading === 'heroImage' ? 'Uploading…' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploading !== null}
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'heroImage')}
                    />
                  </label>
                </div>
              }
            />

            <EditableField
              label="Résumé file"
              value={profile.resume || ''}
              placeholder="/Murshed-Al-Main-Resume.pdf"
              onSave={(v) => saveField({ resume: v })}
              renderValue={(v) => <span className="adm-mono" style={{ fontSize: 12 }}>{v}</span>}
              extra={
                <div className="ef-extra">
                  <label className="adm-btn">
                    {uploading === 'resume' ? 'Uploading…' : 'Upload PDF'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      disabled={uploading !== null}
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'resume')}
                    />
                  </label>
                  {profile.resume && (
                    <a className="adm-btn" href={profile.resume} target="_blank" rel="noopener noreferrer">
                      View current ↗
                    </a>
                  )}
                </div>
              }
            />
          </div>

          {/* Socials */}
          <div className="adm-panel">
            <div className="adm-panel-head"><h2>Social links</h2></div>
            {SOCIALS.map((s) => (
              <EditableField
                key={s.key}
                label={s.label}
                type="url"
                value={profile.socialLinks?.[s.key] || ''}
                placeholder="https://…"
                onSave={(v) => saveField({ socialLinks: { ...profile.socialLinks, [s.key]: v } })}
                renderValue={(v) => (
                  <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                    {v}
                  </a>
                )}
              />
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  )
}
