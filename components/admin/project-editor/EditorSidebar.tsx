'use client'

import { motion } from 'framer-motion'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
  hasChanges?: boolean
}

interface EditorSidebarProps {
  items: SidebarItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function EditorSidebar({ items, activeId, onChange, className = '' }: EditorSidebarProps) {
  return (
    <aside className={`w-52 shrink-0 pt-2 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-2">
        Sections
      </p>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`
                group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 text-left w-full
                ${isActive
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                }
              `}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}

              {/* Icon */}
              <span
                className={`relative z-10 shrink-0 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-600 group-hover:text-zinc-400'
                }`}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span className="relative z-10 flex-1 truncate">{item.label}</span>

              {/* Unsaved dot */}
              {item.hasChanges && (
                <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
              )}

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && !item.hasChanges && (
                <span
                  className={`relative z-10 min-w-[20px] text-center text-xs px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive
                      ? 'bg-white/[0.06] text-white border border-white/[0.08]'
                      : 'bg-zinc-900 text-zinc-500 border border-transparent'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
