'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import type { ProfileView, HeroStats } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { Eyebrow } from '@/components/site/ui/Eyebrow'
import { Button } from '@/components/site/ui/Button'
import { HeroBackdrop } from './HeroBackdrop'

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
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80])

  const words = profile.name.split(' ')
  const heroImg = profile.heroImage || profile.avatar
  const subhead = profile.subheadline || profile.description

  const statItems = [
    { value: `${stats.projectsShipped}+`, label: 'Projects shipped' },
    { value: `${stats.yearsExperience}+`, label: 'Years experience' },
    { value: `${stats.skills}+`, label: 'Technologies' },
  ].filter((s) => !s.value.startsWith('0'))

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      <HeroBackdrop />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ paddingBlock: 'clamp(3rem, 2rem + 8vh, 7rem)' }}>
          <motion.div variants={container} initial="hidden" animate="show" className="hero-copy">
            <motion.div variants={item}>
              <Eyebrow>{profile.availability ? 'Available for work · ' : ''}{profile.title}</Eyebrow>
            </motion.div>

            <h1 aria-label={profile.name} style={{ fontSize: 'var(--text-hero)', marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              {words.map((w, i) => (
                <motion.span key={i} variants={item} style={{ display: 'inline-block', marginRight: '0.28em' }}>
                  {i === words.length - 1 ? <span style={{ color: 'var(--accent)' }}>{w}</span> : w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={item}
              style={{ fontSize: '1.15rem', color: 'var(--ink-muted)', maxWidth: '34rem', marginBottom: '2rem' }}
            >
              {subhead}
            </motion.p>

            <motion.div variants={item} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button href="/#projects" size="lg">
                View my work <ArrowUpRight size={18} />
              </Button>
              <Button href="/#contact" variant="ghost" size="lg">
                <Mail size={17} /> Get in touch
              </Button>
            </motion.div>

            {statItems.length > 0 && (
              <motion.div
                variants={item}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.5rem, 4vw, 3rem)', marginTop: '3rem' }}
              >
                {statItems.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <motion.div
              style={{
                y: imageY,
                position: 'relative',
                aspectRatio: '4 / 5',
                width: '100%',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--surface-2)',
              }}
            >
              {heroImg ? (
                <Image
                  src={heroImg}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 90vw, 44vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '5rem',
                    color: 'var(--accent)',
                  }}
                >
                  {initials(profile.name)}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
