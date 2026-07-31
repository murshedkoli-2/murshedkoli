'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, FileText } from 'lucide-react'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { Container } from '@/components/site/ui/Container'
import { DARK_THEME_SCOPE } from '@/lib/dark-theme'

interface NavLink {
  label: string
  href: string
}

const LINKS: NavLink[] = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
]

interface NavProps {
  name: string
  resumeUrl?: string | null
  /** Force the dark palette regardless of theme (used on the dark homepage). */
  dark?: boolean
}

export function Nav({ name, resumeUrl, dark }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const [first, ...rest] = name.split(' ')

  return (
    <header
      style={{
        ...(dark ? DARK_THEME_SCOPE : undefined),
        color: 'var(--ink)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled
          ? 'color-mix(in oklch, var(--canvas) 82%, transparent)'
          : dark
            ? 'var(--canvas)'
            : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        transition: 'background 300ms var(--ease), border-color 300ms var(--ease)',
      }}
    >
      <Container>
        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.03em' }}
          >
            {first}
            {rest.length > 0 && <span style={{ color: 'var(--accent)' }}>{rest.join('')}</span>}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </Link>

          {/* Desktop links */}
          <div className="site-nav-desktop" style={{ alignItems: 'center', gap: 26 }}>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--ink-muted)',
                  fontWeight: 500,
                }}
                className="site-nav-link"
              >
                <span style={{ color: 'var(--accent)' }}>{'//'}</span> {l.label.toLowerCase()}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="site-nav-resume"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface)',
                  border: '1px solid var(--line-strong)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
              >
                <FileText size={15} /> resume ↗
              </a>
            )}
            <button
              type="button"
              className="site-nav-burger"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              style={{
                display: 'inline-flex',
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 60 }}
          >
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'color-mix(in oklch, var(--ink) 45%, transparent)' }}
            />
            <motion.aside
              initial={reduce ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: 'min(320px, 82vw)',
                background: 'var(--surface)',
                borderLeft: '1px solid var(--line)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 999,
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '13px 8px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-mono)',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>{'//'}</span> {l.label.toLowerCase()}
                </Link>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{
                    marginTop: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '13px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent)',
                    color: 'var(--accent-ink)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  <FileText size={16} /> resume ↗
                </a>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
