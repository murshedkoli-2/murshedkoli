'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Mail, ArrowUpRight } from 'lucide-react'
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
        background: '#ffffff',
        color: '#1d1d1f',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(2.5rem, 4vw, 5rem)',
            alignItems: 'start',
          }}
        >
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#d97706',
                display: 'block',
                marginBottom: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              // INITIATE CONTACT
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.2rem, 1.4rem + 3.4vw, 3.8rem)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: '#1d1d1f',
                marginBottom: '1.5rem',
              }}
            >
              Let&apos;s build something{' '}
              <span className="serif-accent" style={{ color: '#d97706', fontStyle: 'italic' }}>
                remarkable
              </span>
              .
            </h2>

            <p style={{ color: '#6e6e73', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '28rem', marginBottom: '2.5rem' }}>
              Have a project in mind, an engineering role, or a challenging problem to solve? Send a message directly.
            </p>

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 22px',
                  borderRadius: 999,
                  background: '#f5f5f7',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  color: '#1d1d1f',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '2rem',
                }}
                className="apple-secondary-btn"
              >
                <Mail size={16} style={{ color: '#d97706' }} />
                <span>{profile.email}</span>
              </a>
            )}

            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: '1rem' }}>
                {socials.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: '#6e6e73',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 500,
                    }}
                  >
                    <span>{SOCIAL_LABELS[key] || key}</span>
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '2.25rem',
              borderRadius: 24,
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.06)',
            }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
