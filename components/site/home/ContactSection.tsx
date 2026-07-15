import { Mail, MapPin } from 'lucide-react'
import { Github, Linkedin, Twitter, Facebook, Youtube, Globe } from 'lucide-react'
import type { ProfileView } from '@/lib/data/portfolio'
import type { SocialLinks } from '@/lib/site-data'
import { Section } from '@/components/site/ui/Section'
import { Card } from '@/components/site/ui/Card'
import { ContactForm } from './ContactForm'

const SOCIAL_ICONS: Record<keyof SocialLinks, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
}

interface ContactSectionProps {
  profile: ProfileView
}

export function ContactSection({ profile }: ContactSectionProps) {
  const socials = profile.socialLinks
    ? (Object.entries(profile.socialLinks).filter(([, url]) => Boolean(url)) as [keyof SocialLinks, string][])
    : []

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together">
      <div className="contact-grid">
        <div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.075rem', maxWidth: '30rem', marginBottom: '1.75rem' }}>
            Have a project in mind or just want to say hello? Send a message and I&rsquo;ll get back to you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.75rem' }}>
            <a href={`mailto:${profile.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Mail size={18} style={{ color: 'var(--accent)' }} /> {profile.email}
            </a>
            {profile.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--ink-muted)' }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> {profile.location}
              </span>
            )}
          </div>
          {socials.length > 0 && (
            <div style={{ display: 'flex', gap: 12 }}>
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key] ?? Globe
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="site-card--interactive"
                    style={{
                      display: 'inline-flex',
                      width: 42,
                      height: 42,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <Card style={{ padding: 'clamp(1.4rem, 1rem + 2vw, 2.25rem)' }}>
          <ContactForm />
        </Card>
      </div>
    </Section>
  )
}
