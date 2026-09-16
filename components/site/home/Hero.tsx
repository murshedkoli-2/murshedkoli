'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
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

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15])
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])

  const words = profile.name.split(' ')
  const lastWord = words[words.length - 1]
  const leadWords = words.slice(0, -1).join(' ')

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
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        overflow: 'hidden',
        paddingTop: 'clamp(7rem, 6rem + 5vh, 10rem)',
        paddingBottom: 'clamp(4rem, 3rem + 4vh, 6rem)',
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
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  color: '#34d399',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: '#34d399',
                    boxShadow: '0 0 10px #34d399',
                  }}
                  className="status-pulse"
                />
                <span>AVAILABLE FOR SELECT WORK</span>
              </div>
            </motion.div>

            {/* Oversized Studio Headline */}
            <motion.h1
              custom={1}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(2.8rem, 1.5rem + 5.5vw, 6.2rem)',
                fontWeight: 600,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                marginBottom: '1.5rem',
              }}
            >
              Building digital products with{' '}
              <span className="serif-accent" style={{ color: '#f5b04c', fontStyle: 'italic' }}>
                studio finish
              </span>
              .
            </motion.h1>

            {/* Ultra-Concise Subheadline (No Paragraphs) */}
            <motion.p
              custom={2}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(1.05rem, 0.98rem + 0.3vw, 1.25rem)',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.65)',
                maxWidth: '34rem',
                marginBottom: '2.25rem',
              }}
            >
              {profile.name} — Full-Stack Engineer & Product Builder specializing in high-performance web systems and bespoke UI.
            </motion.p>

            {/* Metric Chips (Campsite Style) */}
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
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f5b04c', fontFamily: 'var(--font-display)' }}>
                  {stats.projectsShipped}+
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.6)' }}>
                  SHIPPED APPS
                </span>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ececea', fontFamily: 'var(--font-display)' }}>
                  {stats.yearsExperience}+
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.6)' }}>
                  YEARS EXP
                </span>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-display)' }}>
                  &lt;1s
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.6)' }}>
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
                  background: '#ececea',
                  color: '#0b0b0c',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 9999,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.25)',
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ececea',
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
            initial={{ opacity: 0, scale: 0.95 }}
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
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
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
                  filter: 'grayscale(25%) contrast(105%)',
                }}
              />
              {/* Studio lighting gradient overlays */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(11, 11, 12, 0.05) 0%, rgba(11, 11, 12, 0.75) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  padding: '12px 16px',
                  borderRadius: 16,
                  background: 'rgba(15, 15, 18, 0.7)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ececea' }}>{profile.name}</div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {profile.title}
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(245, 176, 76, 0.12)',
                    border: '1px solid rgba(245, 176, 76, 0.3)',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#f5b04c',
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
