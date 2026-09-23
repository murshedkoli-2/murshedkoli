'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { Container } from '@/components/site/ui/Container'

interface FinalCTAProps {
  email?: string
  available?: boolean
}

export function FinalCTA({ email, available = true }: FinalCTAProps) {
  const reduce = useReducedMotion()

  return (
    <section
      aria-label="Call to action"
      style={{
        position: 'relative',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        paddingBlock: 'clamp(5rem, 4.5rem + 5vh, 7.5rem)',
        borderTop: '1px solid var(--line)',
        overflow: 'hidden',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      {/* Soft ambient bloom */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1000px, 100vw)',
          height: '500px',
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, var(--ambient-bloom), transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: '54rem',
            marginInline: 'auto',
            textAlign: 'center',
            padding: 'clamp(2.5rem, 2rem + 3vw, 4rem)',
            borderRadius: 28,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
          className="apple-studio-card"
        >
          {/* Availability Pill */}
          {available && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  letterSpacing: '0.04em',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              >
                <span
                  className="live-pulse-dot"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  }}
                />
                <span>CURRENTLY TAKING ON SELECT PROJECTS</span>
              </div>
            </div>
          )}

          {/* Headline */}
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 1.4rem + 3.2vw, 3.8rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'var(--ink)',
              marginBottom: '1.25rem',
            }}
          >
            Have an idea? <br />
            Let&apos;s turn it into a{' '}
            <span className="serif-accent" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
              real product
            </span>
            .
          </h2>

          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: 'clamp(1.02rem, 0.96rem + 0.2vw, 1.18rem)',
              lineHeight: 1.6,
              maxWidth: '36rem',
              marginInline: 'auto',
              marginBottom: '2.5rem',
            }}
          >
            Tell me what you&apos;re building and I&apos;ll help turn it into a fast, scalable, and polished application with the MERN stack.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Link
              href="/#contact"
              className="hero-primary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 30px',
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-ink)',
                fontSize: '0.88rem',
                fontWeight: 600,
                borderRadius: 9999,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 200ms ease',
              }}
            >
              <span>Start a Project</span>
              <ArrowRight size={15} />
            </Link>

            {email && (
              <a
                href={`mailto:${email}`}
                className="hero-secondary-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 26px',
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--btn-secondary-border)',
                  color: 'var(--btn-secondary-ink)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <Mail size={15} style={{ color: 'var(--accent)' }} />
                <span>Email Directly</span>
              </a>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
