import Link from 'next/link'
import { Github, Linkedin, Twitter, Facebook, Youtube, Globe, Mail } from 'lucide-react'
import type { SocialLinks } from '@/lib/site-data'
import { Container } from '@/components/site/ui/Container'

interface FooterProps {
  name: string
  email?: string
  socialLinks?: SocialLinks
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

export function Footer({ name, email, socialLinks }: FooterProps) {
  const socials = socialLinks
    ? (Object.entries(socialLinks).filter(([, url]) => Boolean(url)) as [keyof SocialLinks, string][])
    : []

  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--surface)', paddingBlock: '3.5rem' }}>
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
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>{name}</div>
            {email && (
              <a
                href={`mailto:${email}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 10, color: 'var(--ink-muted)' }}
              >
                <Mail size={15} /> {email}
              </a>
            )}
          </div>

          <nav aria-label="Footer" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: 'var(--ink-muted)' }} className="site-nav-link">
                {l.label}
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
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            fontSize: '0.85rem',
            color: 'var(--ink-muted)',
          }}
        >
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
