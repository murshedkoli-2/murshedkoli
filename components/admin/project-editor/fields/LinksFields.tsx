'use client'

import { Github, ExternalLink, Globe, Link as LinkIcon, Smartphone } from 'lucide-react'
import type { FieldGroupProps, LinksValue } from './types'

interface LinkField {
  key: keyof LinksValue
  enabledKey: keyof LinksValue
  label: string
  icon: typeof Github
  placeholder: string
}

export const LINK_FIELDS: LinkField[] = [
  { key: 'githubUrl', enabledKey: 'githubUrlEnabled', label: 'GitHub Repo', icon: Github, placeholder: 'https://github.com/user/repo' },
  { key: 'demoUrl', enabledKey: 'demoUrlEnabled', label: 'Live Demo', icon: ExternalLink, placeholder: 'https://demo.example.com' },
  { key: 'clientProjectUrl', enabledKey: 'clientProjectUrlEnabled', label: 'Client Project', icon: Globe, placeholder: 'https://client-project.com' },
  { key: 'adminProjectUrl', enabledKey: 'adminProjectUrlEnabled', label: 'Admin Project', icon: LinkIcon, placeholder: 'https://admin-project.com' },
  { key: 'clientLiveUrl', enabledKey: 'clientLiveUrlEnabled', label: 'Client Live', icon: ExternalLink, placeholder: 'https://client-live.com' },
  { key: 'adminLiveUrl', enabledKey: 'adminLiveUrlEnabled', label: 'Admin Live', icon: ExternalLink, placeholder: 'https://admin.live.com' },
  { key: 'androidDownloadUrl', enabledKey: 'androidDownloadUrlEnabled', label: 'Android Download', icon: Smartphone, placeholder: 'https://play.google.com/store/...' },
]

export function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`pe-switch ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    />
  )
}

/** Seven optional URLs, each gated by its own toggle. Disabled ones stay hidden on the public page. */
export function LinksFields({ value, onChange }: FieldGroupProps<LinksValue>) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
      {LINK_FIELDS.map((field, i) => {
        const enabled = value[field.enabledKey] as boolean
        const url = value[field.key] as string
        const Icon = field.icon
        return (
          <div
            key={field.key}
            className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5"
            style={{
              borderTop: i === 0 ? 'none' : '1px solid var(--line)',
              background: enabled ? 'var(--surface)' : 'var(--surface-2)',
              opacity: enabled ? 1 : 0.65,
              transition: 'opacity 160ms ease, background 160ms ease',
            }}
          >
            <ToggleSwitch
              checked={enabled}
              onChange={(v) => onChange({ [field.enabledKey]: v } as Partial<LinksValue>)}
              label={`Enable ${field.label}`}
            />
            <Icon size={14} className="shrink-0" style={{ color: enabled ? 'var(--accent)' : 'var(--ink-muted)' }} />
            <span
              className="w-24 shrink-0"
              style={{ fontSize: 12, fontWeight: 500, color: enabled ? 'var(--ink)' : 'var(--ink-muted)' }}
            >
              {field.label}
            </span>
            <input
              type="url"
              value={url}
              onChange={(e) => onChange({ [field.key]: e.target.value } as Partial<LinksValue>)}
              disabled={!enabled}
              placeholder={field.placeholder}
              aria-label={field.label}
              className="pe-input flex-1 min-w-0 w-full sm:w-auto"
              style={{ padding: '6px 10px', fontSize: 12 }}
            />
          </div>
        )
      })}
    </div>
  )
}
