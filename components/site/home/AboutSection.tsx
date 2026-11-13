import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ProfileView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'
import { TiltCard } from './TiltCard'

const DEFAULT_PORTRAIT = '/images/hero-portrait.jpg'

interface AboutSectionProps {
  profile: ProfileView
}

/** Portrait, a short introduction and the few facts a visitor needs. */
export function AboutSection({ profile }: AboutSectionProps) {
  const portrait = profile.heroPortrait && !profile.heroPortrait.includes('murshed.jpg') ? profile.heroPortrait : DEFAULT_PORTRAIT
  const facts = [
    { label: 'Role', value: profile.title },
    { label: 'Based in', value: profile.location },
    { label: 'Status', value: profile.availability ? 'Open to new work' : 'Currently booked' },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  return (
    <section id="about" className="hm-section">
      <Container>
        <HomeSectionHeader title="About" accent="me" />

        <div className="hm-about-grid">
          <TiltCard className="hm-portrait">
            <Image src={portrait} alt={profile.name} fill sizes="(max-width: 860px) 80vw, 380px" className="hm-portrait-img" />
          </TiltCard>

          <div>
            <p className="hm-about-lead">{profile.description}</p>

            <dl className="hm-facts">
              {facts.map((f) => (
                <div key={f.label} className="hm-fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="hm-hero-actions">
              <Link href="/about" className="hm-btn hm-btn-quiet">
                More about me <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-quiet">
                  Résumé <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
