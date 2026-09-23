'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { ProfileView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'

interface AboutPreviewProps {
  profile: ProfileView
}

const HIGHLIGHTS = [
  'Full-Stack Web Engineering',
  'Dashboard & Analytics Systems',
  'REST & Scalable API Design',
  'SaaS Architecture & Multi-Tenancy',
  'Secure Authentication & RBAC',
  'MongoDB Modeling & Query Optimization',
  'AI Capabilities & Workflow Automation',
]

export function AboutPreview({ profile }: AboutPreviewProps) {
  const reduce = useReducedMotion()

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid var(--line)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.4fr)',
            gap: 'clamp(2rem, 4vw, 5rem)',
            alignItems: 'start',
          }}
          className="about-preview-grid"
        >
          {/* Left Column: Numbered Eyebrow */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--accent)',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>01</span>
              <span>/</span>
              <span>ABOUT</span>
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-mono)',
                marginTop: '0.5rem',
              }}
            >
              FULL-STACK PROFILE
            </div>
          </motion.div>

          {/* Right Column: Statement, Bio & Capability Tags */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Bold Headline Statement */}
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 1.2rem + 2.5vw, 3rem)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--ink)',
                marginBottom: '1.75rem',
              }}
            >
              I turn ideas into reliable digital products — from database architecture and APIs to polished responsive interfaces.
            </h2>

            {/* Dynamic Bio Paragraphs */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                color: 'var(--ink-muted)',
                fontSize: 'clamp(1rem, 0.96rem + 0.2vw, 1.08rem)',
                lineHeight: 1.68,
                maxWidth: '46rem',
                marginBottom: '2rem',
              }}
            >
              <p>
                {profile.description ||
                  'As an engineer specializing in the MERN ecosystem, I focus on building robust, high-performance web applications that bridge clean systems architecture with delightful user experience.'}
              </p>
              <p>
                Whether crafting high-throughput operational dashboards, architecting multi-tenant SaaS platforms, or optimizing MongoDB indexing pipelines, I prioritize reliability, maintainability, and clean code that teams love to build upon.
              </p>
            </div>

            {/* Core Capability Badges */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                SPECIALIZED ENGINEERING DISCIPLINES
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HIGHLIGHTS.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--line)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2 size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  borderRadius: 999,
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--btn-secondary-border)',
                  color: 'var(--btn-secondary-ink)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 200ms ease',
                }}
                className="apple-secondary-btn"
              >
                <span>MORE ABOUT ME</span>
                <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
