'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  ChevronRight, ExternalLink, FilePlus2, LogOut, Menu, Moon, PanelLeftClose, PanelLeftOpen, Plus, Search, X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { useTheme } from '@/components/site/ThemeProvider'
import { CommandPalette, type PaletteCommand } from './shell/CommandPalette'
import { NAV_GROUPS, NAV_ITEMS, groupOf, type AdminNavKey, type BadgeKey, type NavItem } from './shell/nav'

export type { AdminNavKey } from './shell/nav'

export type AdminBadges = Partial<Record<BadgeKey, number>>

interface AdminShellProps {
  active: AdminNavKey
  title: string
  subtitle?: string
  actions?: ReactNode
  badges?: AdminBadges
  children: ReactNode
}

const COLLAPSE_KEY = 'adm-sidebar-collapsed'
const COLLAPSE_EVENT = 'adm-sidebar-change'
const EASE = [0.16, 1, 0.3, 1] as const

function subscribeCollapse(onChange: () => void) {
  window.addEventListener(COLLAPSE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(COLLAPSE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
const readCollapse = () => window.localStorage.getItem(COLLAPSE_KEY) === '1'
const serverCollapse = () => false

function setCollapsed(next: boolean) {
  window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
  window.dispatchEvent(new Event(COLLAPSE_EVENT))
}

async function signOut() {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    if (!response.ok) throw new Error('Logout failed')
    window.location.assign(new URL('/admin/login', window.location.origin).href)
  } catch {
    toast.error('Could not sign out. Please retry.')
  }
}

interface SidebarProps {
  active: AdminNavKey
  badges: AdminBadges
  collapsed: boolean
  onNavigate: () => void
  onToggleCollapse: () => void
  onClose: () => void
}

function Sidebar({ active, badges, collapsed, onNavigate, onToggleCollapse, onClose }: SidebarProps) {
  const renderItem = (item: NavItem) => {
    const badge = item.badgeKey ? badges[item.badgeKey] : undefined
    const isActive = item.key === active
    const Icon = item.icon
    return (
      <Link
        key={item.key}
        href={item.href}
        className="ash-link"
        data-active={isActive}
        aria-current={isActive ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
      >
        {isActive && <motion.span layoutId="ash-active" className="ash-link-pill" transition={{ duration: 0.45, ease: EASE }} />}
        <span className="ash-link-icon">
          <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="ash-link-label">{item.label}</span>
        {badge ? <span className="ash-badge" data-tone={item.badgeKey === 'messages' ? 'alert' : undefined}>{badge}</span> : null}
      </Link>
    )
  }

  return (
    <aside className="ash-side" aria-label="Admin navigation">
      <div className="ash-side-inner">
        <div className="ash-side-head">
          <Link href="/admin/dashboard" className="ash-brand" onClick={onNavigate}>
            <span className="ash-brand-mark" aria-hidden="true">m</span>
            <span className="ash-brand-word">
              murshed<span>.</span>admin
            </span>
          </Link>
          <button type="button" className="ash-icon-btn ash-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <LayoutGroup id="ash-nav">
          <nav className="ash-nav">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="ash-group">
                <p className="ash-group-label">{group.label}</p>
                {group.items.map(renderItem)}
              </div>
            ))}
          </nav>
        </LayoutGroup>

        <div className="ash-side-foot">
          <button type="button" className="ash-collapse" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            <span className="ash-link-label">Collapse</span>
          </button>
          <div className="ash-user">
            <span className="ash-avatar" aria-hidden="true">MA</span>
            <span className="ash-user-text">
              <b>Murshed Al Main</b>
              <small>Administrator</small>
            </span>
            <button type="button" className="ash-icon-btn" onClick={signOut} aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Frame for every admin page: animated sidebar, breadcrumb topbar and a ⌘K command palette. */
export function AdminShell({ active, title, subtitle, actions, badges = {}, children }: AdminShellProps) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const { toggle: toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const collapsed = useSyncExternalStore(subscribeCollapse, readCollapse, serverCollapse)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const toggleCollapse = useCallback(() => setCollapsed(!readCollapse()), [])

  const commands = useMemo<PaletteCommand[]>(
    () => [
      ...NAV_ITEMS.map((item) => ({
        id: `go-${item.key}`,
        label: item.label,
        group: 'Go to',
        keywords: item.keywords,
        icon: item.icon,
        hint: groupOf(item.key),
        run: () => router.push(item.href),
      })),
      { id: 'new-project', label: 'New project', group: 'Create', keywords: ['add', 'create'], icon: Plus, run: () => router.push('/admin/projects/new') },
      { id: 'new-cert', label: 'New certificate', group: 'Create', keywords: ['add', 'credential'], icon: FilePlus2, run: () => router.push('/admin/certificates/new') },
      { id: 'site', label: 'View public site', group: 'Actions', keywords: ['preview', 'open'], icon: ExternalLink, run: () => window.open('/', '_blank', 'noopener') },
      { id: 'theme', label: 'Toggle light / dark theme', group: 'Actions', keywords: ['dark', 'light', 'mode'], icon: Moon, run: toggleTheme },
      { id: 'collapse', label: 'Collapse / expand sidebar', group: 'Actions', keywords: ['sidebar', 'menu'], icon: PanelLeftClose, run: toggleCollapse },
      { id: 'signout', label: 'Sign out', group: 'Actions', keywords: ['logout', 'exit'], icon: LogOut, run: signOut },
    ],
    [router, toggleTheme, toggleCollapse],
  )

  return (
    <div className="adm-app ash" data-collapsed={collapsed} data-menu={menuOpen}>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="ash-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        active={active}
        badges={badges}
        collapsed={collapsed}
        onNavigate={() => setMenuOpen(false)}
        onToggleCollapse={toggleCollapse}
        onClose={() => setMenuOpen(false)}
      />

      <div className="ash-main">
        <header className="ash-top">
          <div className="ash-top-left">
            <button type="button" className="ash-icon-btn ash-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={18} />
            </button>
            <div className="ash-heading">
              <p className="ash-crumbs">
                <span>Admin</span>
                <ChevronRight size={12} aria-hidden="true" />
                <span>{groupOf(active)}</span>
              </p>
              <h1 className="ash-title">{title}</h1>
              {subtitle ? <p className="ash-sub">{subtitle}</p> : null}
            </div>
          </div>

          <div className="ash-top-right">
            {actions ? <div className="ash-actions">{actions}</div> : null}
            <button type="button" className="ash-search" onClick={() => setPaletteOpen(true)}>
              <Search size={16} aria-hidden="true" />
              <span>Search…</span>
              <kbd>Ctrl K</kbd>
            </button>
            <ThemeToggle />
          </div>
        </header>

        <motion.main
          key={active}
          className="ash-content adm-main"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {children}
        </motion.main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  )
}
