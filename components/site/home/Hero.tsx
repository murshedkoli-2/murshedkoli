'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
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

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80])

  const words = profile.name.split(' ')
  const lastWord = words[words.length - 1]
  const leadWords = words.slice(0, -1).join(' ')
  const subhead = profile.subheadline || profile.description

  const meta = [
    profile.location ? `based in ${profile.location}` : 'based in bangladesh',
    `${stats.projectsShipped}+ projects shipped`,
    `${stats.yearsExperience}+ years`,
  ]

  const lineVariants = {
    hidden: reduce ? {} : { y: '110%' },
    show: (i: number) => ({
      y: '0%',
      transition: { duration: 0.9, ease: EASE, delay: 0.08 * i },
    }),
  }

  const fadeVariants = {
    hidden: reduce ? {} : { opacity: 0, y: 14 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: 0.08 * i },
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
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        overflow: 'hidden',
      }}
    >
      <Container
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          paddingTop: 'clamp(6rem, 5rem + 4vh, 9rem)',
          paddingBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(2.5rem, 4vw, 5rem)',
            width: '100%',
          }}
        >
          {/* Copy */}
          <motion.div style={{ y: copyY, opacity: copyOpacity, minWidth: 0 }}>
            <motion.div
              custom={0}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem', flexWrap: 'wrap' }}
            >
              <span className="hp-meta" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                {profile.title || 'Full-stack developer'}
              </span>
              {profile.availability && (
                <span className="hp-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#f5b04c' }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#34d399',
                    }}
                  />
                  open to work
                </span>
              )}
            </motion.div>

            <h1
              aria-label={profile.name}
              style={{
                fontSize: 'clamp(3.2rem, 1.6rem + 8.5vw, 8.25rem)',
                fontWeight: 600,
                lineHeight: 0.98,
                letterSpacing: '-0.04em',
                marginBottom: '2rem',
              }}
            >
              <span style={{ display: 'block', overflow: 'hidden', paddingBlock: '0.06em' }}>
                <motion.span
                  custom={1}
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'block', color: '#ececea' }}
                >
                  {leadWords || profile.name}
                </motion.span>
              </span>
              {leadWords && (
                <span style={{ display: 'block', overflow: 'hidden', paddingBlock: '0.06em' }}>
                  <motion.span
                    custom={2}
                    variants={lineVariants}
                    initial="hidden"
                    animate="show"
                    className="serif-accent"
                    style={{ display: 'block', color: '#f5b04c', fontSize: '1.04em' }}
                  >
                    {lastWord}
                  </motion.span>
                </span>
              )}
            </h1>

            <motion.p
              custom={3}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{
                fontSize: 'clamp(1.02rem, 0.96rem + 0.3vw, 1.18rem)',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '34rem',
                marginBottom: '2.5rem',
              }}
            >
              {subhead}
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Link
                href="/#projects"
                className="mono hero-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 26px',
                  background: '#ececea',
                  color: '#0b0b0c',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  transition: 'background 250ms var(--ease)',
                }}
              >
                VIEW WORK <ArrowDown size={15} />
              </Link>
              <Link
                href="/#contact"
                className="mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 26px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ececea',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  transition: 'border-color 250ms var(--ease)',
                }}
              >
                GET IN TOUCH <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Portrait plate: contained, duotone at rest */}
          <motion.div
            className="hero-plate-wrap"
            style={{ y: plateY, flexShrink: 0 }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          >
            <div
              className="hp-plate"
              style={{
                width: 'clamp(240px, 24vw, 330px)',
                aspectRatio: '3 / 4',
              }}
            >
              <Image
                src={profile.heroPortrait || '/images/hero-1.png'}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 900px) 0px, 24vw"
                style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
            <div
              className="hp-meta"
              style={{
                marginTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              <span>portrait</span>
              <span>dhaka, bd</span>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Meta rail */}
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.09)' }}
      >
        <Container>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              paddingBlock: '1.1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)', flexWrap: 'wrap' }}>
              {meta.map((m) => (
                <span key={m} className="hp-meta">
                  {m}
                </span>
              ))}
            </div>
            <span className="hp-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              scroll <ArrowDown size={12} />
            </span>
          </div>
        </Container>
      </motion.div>
    </section>
  )
}
