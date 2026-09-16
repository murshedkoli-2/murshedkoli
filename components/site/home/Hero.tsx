'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import type { ProfileView, HeroStats } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'

const EASE = [0.16, 1, 0.3, 1] as const

interface HeroProps {
  profile: ProfileView
  stats: HeroStats
}

export function Hero({ profile, stats }: HeroProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -35])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 50])

  const fadeVariants = {
    hidden: reduce ? {} : { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE, delay: 0.07 * i },
    }),
  }

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
        paddingTop: 'clamp(7.5rem, 6.5rem + 5vh, 10.5rem)',
        paddingBottom: 'clamp(4rem, 3.5rem + 4vh, 6.5rem)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            alignItems: 'center',
            gap: 'clamp(3rem, 5vw, 6rem)',
            width: '100%',
          }}
          className="hero-grid-layout"
        >
          {/* Main Visual Typography & Action */}
          <motion.div style={{ y: copyY, opacity: copyOpacity, minWidth: 0 }}>
            {/* Live Status Pill */}
            <motion.div
              custom={0}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  }}
                  className="status-pulse"
                />
                <span>AVAILABLE FOR SELECT WORK</span>
              </div>
            </motion.div>

            {/* Oversized Clean Headline */}
            <motion.h1
              custom={1}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(2.8rem, 1.5rem + 5.2vw, 5.8rem)',
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
                color: 'var(--ink)',
                marginBottom: '1.5rem',
              }}
            >
              Building digital products with{' '}
              <span className="serif-accent" style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
                studio finish
              </span>
              .
            </motion.h1>

            {/* Ultra-Concise Subheadline */}
            <motion.p
              custom={2}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(1.05rem, 0.98rem + 0.3vw, 1.25rem)',
                lineHeight: 1.55,
                color: 'var(--ink-muted)',
                maxWidth: '34rem',
                marginBottom: '2.25rem',
              }}
            >
              {profile.name} — Full-Stack Engineer & Product Builder crafting fast, accessible web applications and high-fidelity interfaces.
            </motion.p>

            {/* Metric Chips */}
            <motion.div
              custom={3}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '2.5rem',
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {stats.projectsShipped}+
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', fontWeight: 500 }}>
                  SHIPPED APPS
                </span>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                  {stats.yearsExperience}+
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', fontWeight: 500 }}>
                  YEARS EXP
                </span>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-display)' }}>
                  &lt;1s
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', fontWeight: 500 }}>
                  SPEED BENCHMARK
                </span>
              </div>
            </motion.div>

            {/* Tactile CTAs */}
            <motion.div
              custom={4}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}
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
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 200ms ease',
                }}
              >
                <span>View Selected Work</span>
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
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Showcase Portrait */}
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
                aspectRatio: '4 / 5',
                borderRadius: 24,
                overflow: 'hidden',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--card-shadow)',
                marginInline: 'auto',
              }}
            >
              <Image
                src={profile.heroPortrait || profile.avatar || '/developer.jpg'}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 900px) 90vw, 440px"
                style={{
                  objectFit: 'cover',
                }}
              />
              {/* Subtle glass tag at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
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
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>{profile.name}</div>
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
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  ENGINEER
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
