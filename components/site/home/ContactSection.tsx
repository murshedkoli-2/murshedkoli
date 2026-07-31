'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ProfileView } from '@/lib/data/portfolio'
import type { SocialLinks } from '@/lib/site-data'
import { Container } from '@/components/site/ui/Container'
import { ContactForm } from './ContactForm'

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  website: 'Website',
}

interface ContactSectionProps {
  profile: ProfileView
}

export function ContactSection({ profile }: ContactSectionProps) {
  const reduce = useReducedMotion()
  const socials = profile.socialLinks
    ? (Object.entries(profile.socialLinks).filter(([, url]) => Boolean(url)) as [keyof SocialLinks, string][])
    : []

  return (
    <section
      id="contact"
      style={{
        background: '#0b0b0c',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <Container>
        <div className="contact-grid">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hp-meta" style={{ display: 'block', marginBottom: '1.5rem' }}>
              get in touch
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 1.4rem + 3.6vw, 4.2rem)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              Let&apos;s build something{' '}
              <span className="serif-accent" style={{ color: '#f5b04c' }}>
                exceptional
              </span>
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '1.05rem',
                maxWidth: '28rem',
                marginBottom: '2.5rem',
                lineHeight: 1.7,
              }}
            >
              Have a project in mind, or looking for a lead developer? Send a message — I reply within a day.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="mono contact-email"
              style={{
                display: 'inline-block',
                fontSize: 'clamp(1rem, 0.9rem + 1vw, 1.4rem)',
                color: '#ececea',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: 6,
                marginBottom: '2.5rem',
                transition: 'color 250ms var(--ease), border-color 250ms var(--ease)',
              }}
            >
              {profile.email}
            </a>

            {socials.length > 0 && (
              <div className="hp-meta" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
                {socials.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255, 255, 255, 0.55)', transition: 'color 200ms var(--ease)' }}
                    className="contact-social"
                  >
                    {SOCIAL_LABELS[key] ?? key} ↗
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                padding: 'clamp(1.75rem, 1rem + 2vw, 2.5rem)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
