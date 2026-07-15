import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  /** Adds a hover-lift affordance (use for clickable cards). */
  interactive?: boolean
  className?: string
  style?: CSSProperties
}

/** Soft surface panel with a hairline border and layered shadow. */
export function Card({ children, interactive, className, style }: CardProps) {
  return (
    <div
      className={`site-card${interactive ? ' site-card--interactive' : ''}${className ? ` ${className}` : ''}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
