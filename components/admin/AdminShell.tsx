'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Award, Briefcase, FolderKanban, GraduationCap, Hexagon, Layers, LayoutGrid, LogOut, Mail, Menu,
  PiggyBank, Plane, Route, Settings, UserRound, type LucideIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/site/ThemeToggle'

export type AdminNavKey =
  | 'overview'
  | 'career'
  | 'projects'
  | 'services'
  | 'skills'
  | 'certificates'
  | 'experience'
  | 'education'
  | 'about'
  | 'messages'
  | 'tour'
  | 'savings'
  | 'settings'

interface NavItem {
  key: AdminNavKey
  label: string
  icon: LucideIcon
  href: string
  badgeKey?: 'projects' | 'skills' | 'certificates' | 'messages' | 'career'
}

const HOME: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid, href: '/admin/dashboard' },
]

const CAREER: NavItem[] = [
  { key: 'career', label: 'Career Roadmap', icon: Route, href: '/admin/career', badgeKey: 'career' },
]

const CONTENT: NavItem[] = [
  { key: 'projects',      label: 'Projects',      icon: FolderKanban, href: '/admin/projects',     badgeKey: 'projects' },
  { key: 'services',      label: 'Services',       icon: Layers, href: '/admin/services' },
  { key: 'skills',        label: 'Skills',         icon: Hexagon, href: '/admin/skills',       badgeKey: 'skills' },
  { key: 'certificates',  label: 'Certificates',   icon: Award, href: '/admin/certificates', badgeKey: 'certificates' },
  { key: 'experience',    label: 'Experience',     icon: Briefcase, href: '/admin/experience' },
  { key: 'education',     label: 'Education',      icon: GraduationCap, href: '/admin/education' },
  { key: 'about',         label: 'About & Hero',   icon: UserRound, href: '/admin/about' },
]

const INBOX: NavItem[] = [
  { key: 'messages', label: 'Messages', icon: Mail, href: '/admin/messages', badgeKey: 'messages' },
]

const PERSONAL: NavItem[] = [
  { key: 'tour',    label: 'Tour',    icon: Plane, href: '/admin/tour' },
  { key: 'savings', label: 'Savings', icon: PiggyBank, href: '/admin/savings' },
]

const SYSTEM: NavItem[] = [
  { key: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
]

export interface AdminBadges {
  career?: number
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) throw new Error('Logout failed')
      window.location.assign(new URL('/admin/login', window.location.origin).href)
    } catch { toast.error('Could not sign out. Please retry.') }
  }

  const renderItem = (item: NavItem) => {
    const badge = item.badgeKey ? badges[item.badgeKey] : undefined
    const Icon = item.icon
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`adm-link ${item.key === active ? 'active' : ''}`}
        aria-current={item.key === active ? 'page' : undefined}
        onClick={() => setMenuOpen(false)}
      >
        <span className="adm-ic" aria-hidden="true"><Icon size={16} strokeWidth={1.75} /></span>
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
          murshed<span>.</span>admin
        </Link>

        {HOME.map(renderItem)}

        <div className="adm-nav-group">Career & Growth</div>
        {CAREER.map(renderItem)}

        <div className="adm-nav-group">Content</div>
        {CONTENT.map(renderItem)}

        <div className="adm-nav-group">Inbox</div>
        {INBOX.map(renderItem)}

        <div className="adm-nav-group">Personal</div>
        {PERSONAL.map(renderItem)}

        <div className="adm-nav-group">System</div>
        {SYSTEM.map(renderItem)}

        <div className="adm-side-foot">
          <div className="adm-avatar">MA</div>
          <div style={{ flex: 1 }}>
            Murshed Al Main
            <br />
            <span style={{ color: 'var(--ink-muted)', fontSize: 11 }}>Admin</span>
          </div>
          <button
            className="adm-link"
            style={{ width: 'auto', padding: '6px 8px', marginBottom: 0 }}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
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
              <Menu size={16} aria-hidden="true" />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 className="adm-h1">{title}</h1>
              {subtitle ? <div className="adm-sub">{subtitle}</div> : null}
            </div>
          </div>
          <div className="adm-top-actions" style={{ alignItems: 'center' }}>
            <ThemeToggle />
            {actions}
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
