import type { CSSProperties, ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Centered content column capped at --container with responsive inline padding. */
export function Container({ children, className, style }: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: 'var(--container)',
        marginInline: 'auto',
        paddingInline: 'clamp(1.25rem, 0.5rem + 3vw, 2.5rem)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
