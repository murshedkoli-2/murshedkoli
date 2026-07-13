'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export type AdminNavKey =
  | 'projects'
  | 'skills'
  | 'certificates'
  | 'experience'
  | 'about'
  | 'resume'
  | 'messages'
  | 'seo'
  | 'settings'

interface NavItem {
  key: AdminNavKey
  label: string
  icon: string
  href: string
  badgeKey?: 'projects' | 'skills' | 'certificates' | 'messages'
}

const CONTENT: NavItem[] = [
  { key: 'projects', label: 'Projects', icon: '▤', href: '/admin/dashboard', badgeKey: 'projects' },
  { key: 'skills', label: 'Skills', icon: '⬡', href: '/admin/manage?tab=skills', badgeKey: 'skills' },
  { key: 'certificates', label: 'Certificates', icon: '✦', href: '/admin/manage?tab=certifications', badgeKey: 'certificates' },
  { key: 'experience', label: 'Experience', icon: '≡', href: '/admin/manage?tab=experience' },
  { key: 'about', label: 'About & Hero', icon: '✎', href: '/admin/manage?tab=profile' },
  { key: 'resume', label: 'Resume File', icon: '⤓', href: '/admin/manage?tab=profile' },
]

const INBOX: NavItem[] = [
  { key: 'messages', label: 'Messages', icon: '✉', href: '/admin/manage?tab=messages', badgeKey: 'messages' },
]

const SYSTEM: NavItem[] = [
  { key: 'seo', label: 'SEO & Metadata', icon: '◎', href: '/admin/manage?tab=settings' },
  { key: 'settings', label: 'Settings', icon: '⚙', href: '/admin/manage?tab=settings' },
]

export interface AdminBadges {
  projects?: number
  skills?: number
  certificates?: number
  messages?: number
}

interface AdminShellProps {
  active: AdminNavKey
  title: string
  subtitle?: string
  actions?: ReactNode
  badges?: AdminBadges
  children: ReactNode
}

export function AdminShell({ active, title, subtitle, actions, badges = {}, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const renderItem = (item: NavItem) => {
    const badge = item.badgeKey ? badges[item.badgeKey] : undefined
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`adm-link ${item.key === active ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        <span className="adm-ic" aria-hidden>{item.icon}</span>
        <span>{item.label}</span>
        {badge ? <span className="adm-badge">{badge}</span> : null}
      </Link>
    )
  }

  return (
    <div className={`adm-app ${menuOpen ? 'adm-open' : ''}`}>
      {menuOpen ? <div className="adm-scrim" onClick={() => setMenuOpen(false)} /> : null}

      <aside className="adm-aside">
        <Link href="/admin/dashboard" className="adm-brand">
          MURSHED<span>.</span>ADMIN
        </Link>

        <div className="adm-nav-group">Content</div>
        {CONTENT.map(renderItem)}

        <div className="adm-nav-group">Inbox</div>
        {INBOX.map(renderItem)}

        <div className="adm-nav-group">System</div>
        {SYSTEM.map(renderItem)}

        <div className="adm-side-foot">
          <div className="adm-avatar">MA</div>
          <div style={{ flex: 1 }}>
            Murshed Al Main
            <br />
            <span style={{ color: '#5f7896', fontSize: 11 }}>Admin</span>
          </div>
          <button
            className="adm-link"
            style={{ width: 'auto', padding: '6px 8px', marginBottom: 0 }}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            ⏻
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button
              className="adm-btn adm-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{ padding: '8px 12px' }}
            >
              ☰
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 className="adm-h1">{title}</h1>
              {subtitle ? <div className="adm-sub">{subtitle}</div> : null}
            </div>
          </div>
          {actions ? <div className="adm-top-actions">{actions}</div> : null}
        </div>

        {children}
      </main>
    </div>
  )
}
