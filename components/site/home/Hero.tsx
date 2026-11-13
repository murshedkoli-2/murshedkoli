import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import type { ProfileView, HeroStats } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HeroScene } from './HeroScene'

interface HeroProps {
  profile: ProfileView
  stats: HeroStats
}

const FALLBACK_SUBHEADLINE =
  'Full-stack MERN developer building fast, secure, and scalable web applications with React, Next.js, Node.js, and MongoDB.'

/** Opening screen: one statement, two actions, and an interactive 3D point cloud. */
export function Hero({ profile, stats }: HeroProps) {
  const figures = [
    { value: stats.projectsShipped, label: 'Projects shipped' },
    { value: stats.yearsExperience, label: 'Years building' },
    { value: stats.skills, label: 'Technologies' },
    { value: stats.certificates, label: 'Certificates' },
  ].filter((f) => f.value > 0)

  return (
    <section className="hm-hero" aria-labelledby="hm-hero-title">
      <Container>
        <div className="hm-hero-grid">
          <div className="hm-hero-copy">
            <p className="hm-eyebrow hm-rise" style={{ '--i': 0 } as React.CSSProperties}>
              <span className="hm-dot" data-on={profile.availability} aria-hidden="true" />
              {profile.availability ? 'Available for freelance & select roles' : 'Currently booked'}
              {profile.location ? ` · ${profile.location}` : ''}
            </p>

            <h1 id="hm-hero-title" className="hm-hero-title hm-rise" style={{ '--i': 1 } as React.CSSProperties}>
              I build powerful web products that <span className="serif-accent hm-accent">scale</span>.
            </h1>

            <p className="hm-hero-lede hm-rise" style={{ '--i': 2 } as React.CSSProperties}>
              {profile.subheadline || FALLBACK_SUBHEADLINE}
            </p>

            <div className="hm-hero-actions hm-rise" style={{ '--i': 3 } as React.CSSProperties}>
              <Link href="/#projects" className="hm-btn hm-btn-primary">
                View my work <ArrowDown size={16} aria-hidden="true" />
              </Link>
              <Link href="/#contact" className="hm-btn hm-btn-quiet">
                Let&apos;s talk <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hm-hero-scene hm-rise" style={{ '--i': 2 } as React.CSSProperties}>
            <HeroScene />
          </div>
        </div>

        {figures.length > 0 && (
          <dl className="hm-figures hm-rise" style={{ '--i': 4 } as React.CSSProperties}>
            {figures.map((f) => (
              <div key={f.label} className="hm-figure">
                <dt>{f.label}</dt>
                <dd>{String(f.value).padStart(2, '0')}</dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  )
}
