import Link from 'next/link'
import { Github, Linkedin, Twitter, Facebook, Youtube, Globe, Mail } from 'lucide-react'
import type { SocialLinks } from '@/lib/site-data'
import { Container } from '@/components/site/ui/Container'
import { DARK_THEME_SCOPE } from '@/lib/dark-theme'

interface FooterProps {
  name: string
  email?: string
  socialLinks?: SocialLinks
  /** Force the dark palette regardless of theme (used on the dark homepage). */
  dark?: boolean
}


const SOCIAL_ICONS: Record<keyof SocialLinks, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
}

const QUICK_LINKS = [
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
]

export function Footer({ name, email, socialLinks, dark }: FooterProps) {
  const socials = socialLinks
    ? (Object.entries(socialLinks).filter(([, url]) => Boolean(url)) as [keyof SocialLinks, string][])
    : []

  return (
    <footer
      style={{
        ...(dark ? DARK_THEME_SCOPE : undefined),
        borderTop: '1px solid var(--line)',
        background: dark ? 'var(--canvas)' : 'var(--surface)',
        paddingBlock: '3.5rem',
        color: dark ? 'var(--ink)' : undefined,
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              {name}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mono"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, fontSize: '0.82rem', color: 'var(--ink-muted)' }}
              >
                <Mail size={14} /> {email}
              </a>
            )}
          </div>

          <nav aria-label="Footer" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="site-nav-link mono"
                style={{ color: 'var(--ink-muted)', fontSize: '0.82rem' }}
              >
                <span style={{ color: 'var(--accent)' }}>{'//'}</span> {l.label.toLowerCase()}
              </Link>
            ))}
          </nav>

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
                    style={{
                      display: 'inline-flex',
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      color: 'var(--ink-muted)',
                    }}
                    className="site-card--interactive"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div
          className="mono"
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            fontSize: '0.76rem',
            color: 'var(--ink-muted)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
            justifyContent: 'space-between',
          }}
        >
          <span>© {new Date().getFullYear()} {name}. all rights reserved.</span>
          <span>built with <span style={{ color: 'var(--accent)' }}>Next.js</span> + TypeScript</span>
        </div>
      </Container>
    </footer>
  )
}
