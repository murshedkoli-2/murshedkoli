'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, FileText } from 'lucide-react'
import { ThemeToggle } from '@/components/site/ThemeToggle'

interface NavLink {
  label: string
  href: string
}

const LINKS: NavLink[] = [
  { label: 'Work', href: '/#projects' },
  { label: 'Craft', href: '/#philosophy' },
  { label: 'Capabilities', href: '/#services' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Contact', href: '/#contact' },
]

interface NavProps {
  name: string
  resumeUrl?: string | null
  dark?: boolean
}

export function Nav({ name, resumeUrl }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const [first] = name.split(' ')

  return (
    <header
      style={{
        position: 'fixed',
        top: 'clamp(0.75rem, 1.5vh, 1.25rem)',
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        paddingInline: '1rem',
        pointerEvents: 'none',
      }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 1.5vw, 1.5rem)',
          padding: '7px 12px 7px 18px',
          borderRadius: 9999,
          background: scrolled
            ? 'rgba(255, 255, 255, 0.88)'
            : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled
            ? '0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
            : '0 8px 24px -4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)',
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand logo / monogram */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1d1d1f',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
            }}
          />
          <span>{first}</span>
          <span style={{ color: '#d97706' }}>.</span>
        </Link>

        {/* Desktop links */}
        <div
          className="site-nav-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            paddingLeft: 12,
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#6e6e73',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 999,
                transition: 'all 180ms ease',
                textDecoration: 'none',
              }}
              className="site-nav-pill-link"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 6 }}>
          <ThemeToggle />

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-resume"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                color: '#1d1d1f',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              <FileText size={13} />
              <span>CV</span>
            </a>
          )}

          <button
            type="button"
            className="site-nav-burger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            style={{
              padding: 6,
              background: 'transparent',
              border: 'none',
              color: '#1d1d1f',
              cursor: 'pointer',
              display: 'none',
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '4.5rem',
              left: '1rem',
              right: '1rem',
              maxWidth: 420,
              marginInline: 'auto',
              borderRadius: 24,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '1.5rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
              pointerEvents: 'auto',
              zIndex: 60,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    padding: '10px 14px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{l.label}</span>
                  <span style={{ fontSize: '0.8rem', color: '#d97706', fontFamily: 'var(--font-mono)' }}>→</span>
                </Link>
              ))}

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 12,
                    background: '#1d1d1f',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <FileText size={16} /> View Résumé
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
