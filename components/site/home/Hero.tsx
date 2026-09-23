'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, FileText, Code2, Database } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import type { ProfileView, HeroStats } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'

const EASE = [0.16, 1, 0.3, 1] as const

interface HeroProps {
  profile: ProfileView
  stats: HeroStats
}

const CORE_PROOFS = [
  'MongoDB',
  'Express.js',
  'React 19',
  'Next.js 16',
  'Node.js',
  'TypeScript',
]

export function Hero({ profile, stats }: HeroProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40])

  const fadeVariants = {
    hidden: reduce ? {} : { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE, delay: 0.06 * i },
    }),
  }

  const githubUrl = profile.socialLinks?.github
  const linkedinUrl = profile.socialLinks?.linkedin

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        overflow: 'hidden',
        paddingTop: 'clamp(7.5rem, 6.5rem + 5vh, 10rem)',
        paddingBottom: 'clamp(4rem, 3.5rem + 4vh, 6rem)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      {/* Subtle ambient lighting */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1280px, 100vw)',
          height: '650px',
          background: 'radial-gradient(ellipse 70% 55% at 50% 25%, var(--ambient-bloom), transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle technical background grid */}
      <div className="dev-grid" aria-hidden />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            alignItems: 'center',
            gap: 'clamp(2.5rem, 4.5vw, 5.5rem)',
            width: '100%',
          }}
          className="hero-grid-layout"
        >
          {/* Left Column: Positioning & CTAs */}
          <motion.div style={{ y: copyY, opacity: copyOpacity, minWidth: 0 }}>
            {/* Live Availability Badge */}
            {profile.availability && (
              <motion.div
                custom={0}
                variants={fadeVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}
              >
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
                    fontSize: '0.78rem',
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
                  <span>AVAILABLE FOR FREELANCE & SELECT ROLES</span>
                </div>
              </motion.div>
            )}

            {/* Main Positioning Headline */}
            <motion.h1
              custom={1}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(2.75rem, 1.5rem + 5vw, 5.4rem)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: 'var(--ink)',
                marginBottom: '1.25rem',
              }}
            >
              I build powerful web products that{' '}
              <span className="serif-accent" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
                scale
              </span>
              .
            </motion.h1>

            {/* Clear Supporting Statement */}
            <motion.p
              custom={2}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(1.05rem, 0.98rem + 0.3vw, 1.22rem)',
                lineHeight: 1.6,
                color: 'var(--ink-muted)',
                maxWidth: '36rem',
                marginBottom: '2rem',
              }}
            >
              Full-stack MERN developer building fast, secure, and scalable web applications with React, Next.js, Node.js, and MongoDB.
            </motion.p>

            {/* Primary & Secondary CTAs + Quick Links */}
            <motion.div
              custom={3}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '2.5rem',
              }}
            >
              <Link
                href="/#projects"
                className="hero-primary-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-ink)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 200ms ease',
                }}
              >
                <span>View My Work</span>
                <ArrowDown size={15} />
              </Link>

              <Link
                href="/#contact"
                className="hero-secondary-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 26px',
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--btn-secondary-border)',
                  color: 'var(--btn-secondary-ink)',
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight size={16} />
              </Link>

              {/* Quick links: GitHub, LinkedIn, CV */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 4 }}>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink-muted)',
                      transition: 'all 200ms ease',
                    }}
                    className="site-card--interactive"
                  >
                    <Github size={17} />
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink-muted)',
                      transition: 'all 200ms ease',
                    }}
                    className="site-card--interactive"
                  >
                    <Linkedin size={17} />
                  </a>
                )}

                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-nav-resume hidden sm:inline-flex"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 18px',
                      borderRadius: 999,
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <FileText size={14} />
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Social Proof Strip: MERN Stack Foundation */}
            <motion.div
              custom={4}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--ink-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{'//'}</span>
                <span>BUILDING PRODUCTION WEB EXPERIENCES WITH</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CORE_PROOFS.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      padding: '4px 12px',
                      borderRadius: 6,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Portrait Composition */}
          <motion.div
            style={{ y: plateY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="hero-portrait-container"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                marginInline: 'auto',
              }}
            >
              {/* Floating Tech Badge Top-Left */}
              <div
                className="floating-code-chip hidden sm:inline-flex"
                style={{
                  position: 'absolute',
                  top: -14,
                  left: -14,
                  zIndex: 10,
                }}
              >
                <Code2 size={13} style={{ color: 'var(--accent)' }} />
                <span>React 19 · Next.js</span>
              </div>

              {/* Floating Tech Badge Bottom-Right */}
              <div
                className="floating-code-chip hidden sm:inline-flex"
                style={{
                  position: 'absolute',
                  bottom: 74,
                  right: -14,
                  zIndex: 10,
                }}
              >
                <Database size={13} style={{ color: '#10b981' }} />
                <span>MongoDB · Node.js</span>
              </div>

              {/* Main Portrait Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <Image
                  src={
                    profile.heroPortrait && !profile.heroPortrait.includes('murshed.jpg')
                      ? profile.heroPortrait
                      : '/images/hero-portrait.jpg'
                  }
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 90vw, 440px"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                  }}
                />

                {/* Subtle glass tag at bottom of portrait */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    padding: '12px 16px',
                    borderRadius: 16,
                    background: 'var(--nav-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--line)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>
                      {profile.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                      {profile.title}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'var(--accent-soft)',
                      border: '1px solid var(--accent)',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    FULL-STACK
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
