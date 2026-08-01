'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { Container } from '@/components/site/ui/Container'
import type { ProfileView } from '@/lib/data/portfolio'

interface ScrollStorySectionProps {
  profile: ProfileView
}

const STATEMENT =
  'I design and engineer web products end to end — from the database schema to the last pixel — with the speed of a startup and the finish of a studio.'

const PRINCIPLES = [
  {
    title: 'Design with intent',
    detail: 'High-contrast interfaces, typography that carries hierarchy, and motion that clarifies instead of decorating.',
  },
  {
    title: 'Engineer for scale',
    detail: 'Type-safe APIs, resilient data layers, and architectures that stay simple as the product grows.',
  },
  {
    title: 'Ship fast, polish hard',
    detail: 'Sub-second loads, honest Core Web Vitals, and the discipline to sweat the last five percent.',
  },
]

export function ScrollStorySection({ profile }: ScrollStorySectionProps) {
  const reduce = useReducedMotion()
  const statementRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 0.85', 'start 0.3'],
  })

  const statementWords = STATEMENT.split(' ')

  return (
    <section
      id="philosophy"
      style={{
        position: 'relative',
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
        paddingBlock: 'clamp(6rem, 4rem + 8vh, 11rem)',
      }}
    >
      <Container>
        {/* Statement: reveals word by word as it enters the viewport */}
        <div style={{ marginBottom: 'clamp(4.5rem, 3rem + 7vh, 8rem)' }}>
          <span className="hp-meta" style={{ display: 'block', marginBottom: '2rem' }}>
            the craft
          </span>
          <p
            ref={statementRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.7rem, 1rem + 3.2vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              maxWidth: '58rem',
            }}
          >
            {statementWords.map((word, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / statementWords.length, (i + 1) / statementWords.length]}
                reduce={reduce}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>

        {/* One contained image + principles, side by side */}
        <div className="craft-grid">
          <div className="hp-plate craft-plate">
            <Image
              src={profile.storyImage || '/images/hero-3.jpg'}
              alt={profile.name}
              fill
              sizes="(max-width: 900px) 92vw, 38vw"
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />
          </div>

          <div>
            {PRINCIPLES.map((p) => (
              <motion.div
                key={p.title}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  paddingBlock: '1.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.09)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.6rem',
                    color: '#ececea',
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.7, fontSize: '0.98rem', maxWidth: '30rem' }}>
                  {p.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
  reduce,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean | null
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span
      style={{
        opacity: reduce ? 1 : opacity,
        display: 'inline-block',
        marginRight: '0.28em',
      }}
    >
      {children}
    </motion.span>
  )
}
