import Link from 'next/link'

interface NavProps {
  resumeUrl?: string | null
}

const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

const RESUME_FILENAME = 'Murshed-Al-Main-Resume.pdf'

export function Nav({ resumeUrl }: NavProps) {
  return (
    <header
      className="bp-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--bp-line)',
        background: 'rgba(11, 28, 48, 0.82)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <nav
        className="bp-container"
        aria-label="Main navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          gap: 16,
        }}
      >
        <Link
          href="/"
          className="bp-mono"
          style={{ color: 'var(--paper)', fontSize: 14, letterSpacing: '0.08em', fontWeight: 500 }}
        >
          MURSHED<span style={{ color: 'var(--amber)' }}>.</span>AL MAIN
        </Link>

        <ul
          className="bp-nav-links"
          style={{ display: 'flex', gap: 26, listStyle: 'none', margin: 0, padding: 0 }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="bp-mono"
                style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 11.5 }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={resumeUrl || '/resume'}
          download={resumeUrl ? RESUME_FILENAME : undefined}
          target={resumeUrl ? '_blank' : undefined}
          rel={resumeUrl ? 'noopener noreferrer' : undefined}
          className="bp-btn bp-btn-primary"
          style={{ padding: '9px 16px', fontSize: 11.5 }}
        >
          RESUME.PDF ↓
        </a>
      </nav>
    </header>
  )
}
