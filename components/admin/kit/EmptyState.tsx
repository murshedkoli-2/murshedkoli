import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  body?: string
  action?: ReactNode
}

/** Friendly placeholder for an empty list or a search with no results. */
export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="kit-empty">
      <span className="kit-empty-icon" aria-hidden="true">
        <Icon size={26} strokeWidth={1.5} />
      </span>
      <p className="kit-empty-title">{title}</p>
      {body && <p className="kit-empty-body">{body}</p>}
      {action}
    </div>
  )
}
