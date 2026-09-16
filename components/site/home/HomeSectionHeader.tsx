import type { ReactNode } from 'react'

interface HomeSectionHeaderProps {
  /** Leading words of the title, set in the display face. */
  title: string
  /** Final word(s), set in the italic serif accent. */
  accent: string
  /** Small mono note on the right edge (count, category). */
  meta?: ReactNode
}

/** Shared homepage section header: clean Apple typography with warm accent and metadata pill. */
export function HomeSectionHeader({ title, accent, meta }: HomeSectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4rem)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-h2)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: 'var(--ink, #1d1d1f)',
        }}
      >
        {title}{' '}
        <span className="serif-accent" style={{ color: 'var(--accent, #d97706)', fontStyle: 'italic' }}>
          {accent}
        </span>
      </h2>
      {meta && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--ink-muted, #6e6e73)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 12px',
            borderRadius: 999,
            background: 'var(--surface-2, #f5f5f7)',
            border: '1px solid var(--line, rgba(0, 0, 0, 0.08))',
          }}
        >
          {meta}
        </span>
      )}
    </div>
  )
}
