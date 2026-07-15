import type { ReactNode } from 'react'

/** Small uppercase, letter-spaced accent label that sits above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 'var(--text-eyebrow)',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
      }}
    >
      {children}
    </span>
  )
}
