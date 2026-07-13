import { Button } from './primitives'
import type { HeroStats, ProfileView } from '@/lib/data/portfolio'

interface HeroTitleBlockProps {
  profile: ProfileView
  stats: HeroStats
}

interface StatCell {
  value: string
  label: string
}

export function HeroTitleBlock({ profile, stats }: HeroTitleBlockProps) {
  const available = profile.availability
  const statCells: StatCell[] = [
    { value: String(stats.projectsShipped).padStart(2, '0'), label: 'Projects shipped' },
    { value: String(stats.skills), label: 'Core skills' },
    {
      value: stats.yearsExperience ? `${stats.yearsExperience}+` : '—',
      label: 'Years building',
    },
    { value: String(stats.certificates), label: 'Certificates' },
  ]

  return (
    <section aria-labelledby="hero-heading" className="bp-container" style={{ paddingBlock: '48px 72px' }}>
      <div className="bp-title-block" style={{ border: '1px solid var(--bp-line)' }}>
        {/* Top row: sheet label + live status */}
        <div className="bp-title-toprow">
          <div className="bp-cell bp-title-cell">
            <span className="bp-mono" style={{ color: 'var(--muted)' }}>Sheet</span>
            <span className="bp-mono" style={{ color: 'var(--paper)' }}>
              PORTFOLIO / REV&nbsp;3.0
            </span>
          </div>
          <div className="bp-cell bp-title-cell">
            <span className="bp-mono" style={{ color: 'var(--muted)' }}>Status</span>
            <span
              className="bp-mono"
              style={{ color: available ? 'var(--shipped)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span
                className={`bp-dot ${available ? 'bp-dot-live' : ''}`}
                style={{ background: available ? 'var(--shipped)' : 'var(--muted)' }}
                aria-hidden
              />
              {available ? 'AVAILABLE FOR WORK' : 'HEADS-DOWN'}
            </span>
          </div>
        </div>

        {/* Main cell: headline + subheadline + CTAs */}
        <div className="bp-cell bp-title-main">
          <h1
            id="hero-heading"
            style={{
              fontFamily: 'var(--bp-font-display)',
              fontWeight: 800,
              fontSize: 'var(--bp-fs-hero)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: 'var(--paper)',
              margin: 0,
            }}
          >
            Full-stack developer who{' '}
            <span style={{ color: 'var(--amber)' }}>plans, specs, and ships</span>{' '}
            AI-integrated products.
          </h1>

          {profile.subheadline ? (
            <p
              style={{
                marginTop: 22,
                maxWidth: 620,
                color: 'var(--muted)',
                fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.15rem)',
                lineHeight: 1.6,
              }}
            >
              {profile.subheadline}
            </p>
          ) : null}

          <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button href="#work" variant="primary">
              View the work →
            </Button>
            <Button href="#contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </div>

        {/* Footer row: 4 stat cells */}
        <div className="bp-title-stats">
          {statCells.map((cell) => (
            <div key={cell.label} className="bp-cell bp-stat-cell">
              <span
                style={{
                  fontFamily: 'var(--bp-font-display)',
                  fontWeight: 800,
                  fontSize: 'var(--bp-fs-num)',
                  color: 'var(--amber)',
                  lineHeight: 1,
                }}
              >
                {cell.value}
              </span>
              <span className="bp-mono" style={{ color: 'var(--muted)', marginTop: 8 }}>
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
