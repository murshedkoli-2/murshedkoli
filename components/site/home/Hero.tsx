'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import type { ProfileView, HeroStats } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { Button } from '@/components/site/ui/Button'

const EASE = [0.16, 1, 0.3, 1] as const

interface HeroProps {
  profile: ProfileView
  stats: HeroStats
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Hero({ profile, stats }: HeroProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60])

  const words = profile.name.split(' ')
  const heroImg = profile.heroImage || profile.avatar
  const subhead = profile.subheadline || profile.description
  const firstName = (words[0] || 'me').toLowerCase()

  const statItems = [
    { value: `${stats.projectsShipped}+`, label: 'projects shipped' },
    { value: `${stats.yearsExperience}+`, label: 'years experience' },
    { value: `${stats.skills}+`, label: 'technologies' },
  ].filter((s) => !s.value.startsWith('0'))

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  }
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="dev-grid" aria-hidden />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ paddingBlock: 'clamp(3rem, 2rem + 8vh, 7rem)' }}>
          <motion.div variants={container} initial="hidden" animate="show" className="hero-copy">
            {profile.availability && (
              <motion.div
                variants={item}
                className="mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.78rem',
                  color: 'var(--ink-muted)',
                  padding: '5px 12px',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  background: 'var(--surface)',
                  marginBottom: '1.4rem',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: 'var(--accent)',
                    boxShadow: '0 0 0 3px var(--accent-soft)',
                  }}
                />
                available for work
              </motion.div>
            )}

            <motion.div
              variants={item}
              className="dev-eyebrow"
              style={{ fontSize: '0.92rem' }}
            >
              {profile.title}
              <span className="cursor-blink" aria-hidden />
            </motion.div>

            <h1
              aria-label={profile.name}
              style={{ fontSize: 'var(--text-hero)', marginTop: '1rem', marginBottom: '1.5rem', fontWeight: 700 }}
            >
              {words.map((w, i) => (
                <motion.span key={i} variants={item} style={{ display: 'inline-block', marginRight: '0.28em' }}>
                  {i === words.length - 1 ? <span style={{ color: 'var(--accent)' }}>{w}</span> : w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={item}
              style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', maxWidth: '34rem', marginBottom: '2rem', lineHeight: 1.7 }}
            >
              {subhead}
            </motion.p>

            <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button href="/#projects" size="lg">
                view work <ArrowRight size={16} />
              </Button>
              <Button href="/#contact" variant="ghost" size="lg">
                <Mail size={16} /> get in touch
              </Button>
            </motion.div>

            {statItems.length > 0 && (
              <motion.div
                variants={item}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(1.5rem, 4vw, 3rem)',
                  marginTop: '3rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--line)',
                }}
              >
                {statItems.map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.9rem',
                        fontWeight: 600,
                        lineHeight: 1,
                        color: 'var(--ink)',
                      }}
                    >
                      {s.value}
                    </div>
                    <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', marginTop: 8 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          >
            <motion.div
              style={{
                y: imageY,
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                border: '1px solid var(--line-strong)',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--surface)',
              }}
            >
              {/* Terminal chrome bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                }}
              >
                <span className="term-dots" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                  ~/{firstName}.jpg
                </span>
              </div>

              <div style={{ position: 'relative', aspectRatio: '4 / 5', background: 'var(--surface-2)' }}>
                {heroImg ? (
                  <Image
                    src={heroImg}
                    alt={profile.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 90vw, 42vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '4.5rem',
                      color: 'var(--accent)',
                    }}
                  >
                    {initials(profile.name)}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
