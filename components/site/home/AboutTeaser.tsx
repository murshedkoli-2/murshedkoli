import { ArrowRight } from 'lucide-react'
import type { ProfileView } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Button } from '@/components/site/ui/Button'
import { Reveal } from '@/components/site/Reveal'

interface AboutTeaserProps {
  profile: ProfileView
}

export function AboutTeaser({ profile }: AboutTeaserProps) {
  return (
    <Section id="about" surface eyebrow="About">
      <Reveal>
        <div style={{ maxWidth: '48rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.4rem)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              marginBottom: '1.75rem',
            }}
          >
            {profile.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', color: 'var(--ink-muted)' }}>
            {profile.location && <span>Based in {profile.location}</span>}
            <Button href="/about" variant="ghost">
              More about me <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
