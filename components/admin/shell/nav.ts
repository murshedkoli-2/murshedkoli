import {
  Award, Briefcase, FolderKanban, GraduationCap, Hexagon, Layers, LayoutGrid, Mail, PiggyBank, Plane,
  Route, Settings, UserRound, type LucideIcon,
} from 'lucide-react'

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

export type BadgeKey = 'projects' | 'skills' | 'certificates' | 'messages' | 'career'

export interface NavItem {
  key: AdminNavKey
  label: string
  icon: LucideIcon
  href: string
  badgeKey?: BadgeKey
  keywords: string[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Home',
    items: [{ key: 'overview', label: 'Overview', icon: LayoutGrid, href: '/admin/dashboard', keywords: ['dashboard', 'home', 'stats'] }],
  },
  {
    label: 'Career & growth',
    items: [{ key: 'career', label: 'Career roadmap', icon: Route, href: '/admin/career', badgeKey: 'career', keywords: ['goals', 'plan', 'learning'] }],
  },
  {
    label: 'Content',
    items: [
      { key: 'projects', label: 'Projects', icon: FolderKanban, href: '/admin/projects', badgeKey: 'projects', keywords: ['work', 'portfolio', 'case study'] },
      { key: 'services', label: 'Services', icon: Layers, href: '/admin/services', keywords: ['offer', 'capabilities'] },
      { key: 'skills', label: 'Skills', icon: Hexagon, href: '/admin/skills', badgeKey: 'skills', keywords: ['tech', 'stack', 'tools'] },
      { key: 'certificates', label: 'Certificates', icon: Award, href: '/admin/certificates', badgeKey: 'certificates', keywords: ['credentials', 'courses'] },
      { key: 'experience', label: 'Experience', icon: Briefcase, href: '/admin/experience', keywords: ['jobs', 'roles', 'work history'] },
      { key: 'education', label: 'Education', icon: GraduationCap, href: '/admin/education', keywords: ['degree', 'school', 'university'] },
      { key: 'about', label: 'About & hero', icon: UserRound, href: '/admin/about', keywords: ['profile', 'bio', 'resume', 'portrait'] },
    ],
  },
  {
    label: 'Inbox',
    items: [{ key: 'messages', label: 'Messages', icon: Mail, href: '/admin/messages', badgeKey: 'messages', keywords: ['contact', 'mail', 'inbox'] }],
  },
  {
    label: 'Personal',
    items: [
      { key: 'tour', label: 'Tour', icon: Plane, href: '/admin/tour', keywords: ['travel', 'map', 'trips'] },
      { key: 'savings', label: 'Savings', icon: PiggyBank, href: '/admin/savings', keywords: ['money', 'budget', 'finance'] },
    ],
  },
  {
    label: 'System',
    items: [{ key: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings', keywords: ['config', 'seo', 'site'] }],
  },
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

export function groupOf(key: AdminNavKey): string {
  return NAV_GROUPS.find((g) => g.items.some((i) => i.key === key))?.label ?? 'Admin'
}
