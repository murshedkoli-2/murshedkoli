import type { CSSProperties, ReactNode } from 'react'
import { Container } from './Container'
import { Eyebrow } from './Eyebrow'

interface SectionProps {
  id?: string
  eyebrow?: string
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  /** Alternate ground color for rhythm/depth. */
  surface?: boolean
  className?: string
  style?: CSSProperties
}

/** A vertical page section with consistent rhythm and an optional eyebrow/title header. */
export function Section({ id, eyebrow, title, intro, children, surface, className, style }: SectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        paddingBlock: 'var(--space-section)',
        background: surface ? 'var(--surface)' : 'transparent',
        scrollMarginTop: '5rem',
        ...style,
      }}
    >
      <Container>
        {(eyebrow || title || intro) && (
          <header style={{ maxWidth: '52rem', marginBottom: 'clamp(2rem, 1rem + 3vw, 3.5rem)' }}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 style={{ fontSize: 'var(--text-h2)', marginTop: eyebrow ? '0.75rem' : 0 }}>
                {title}
              </h2>
            )}
            {intro && (
              <p style={{ marginTop: '1rem', color: 'var(--ink-muted)', fontSize: '1.075rem' }}>
                {intro}
              </p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  )
}
