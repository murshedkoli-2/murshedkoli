import type { ReactNode } from 'react'

interface HomeSectionHeaderProps {
  /** Leading words of the title, set in the display face. */
  title: string
  /** Final word(s), set in the italic serif accent. */
  accent: string
  /** Small mono note on the right edge (count, category). */
  meta?: ReactNode
}

/** Shared homepage section header: display title + serif accent word, mono meta right. */
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
      <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 600, letterSpacing: '-0.03em', color: '#ececea' }}>
        {title}{' '}
        <span className="serif-accent" style={{ color: '#f5b04c' }}>
          {accent}
        </span>
      </h2>
      {meta && <span className="hp-meta">{meta}</span>}
    </div>
  )
}
