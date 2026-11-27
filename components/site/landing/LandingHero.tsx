'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import type { HeroStats, ProfileView } from '@/lib/data/portfolio'
import { buildFigures, pickPortrait } from '@/lib/landing'
import { DotField } from './DotField'
import { KineticName } from './KineticName'
import { Magnetic } from './Magnetic'
import { CountUp } from './CountUp'
import { PortraitCard } from './PortraitCard'

const ROTATING = ['that scale.', 'people love.', 'that ship fast.', 'with AI inside.']
const ROTATE_MS = 2600
const EASE = [0.16, 1, 0.3, 1] as const
const FALLBACK_LEDE =
  'Full-stack developer building fast, secure, and scalable web applications with React, Next.js, Node.js, and MongoDB.'

interface LandingHeroProps {
  profile: ProfileView
  stats: HeroStats
}

function RotatingWord() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const tick = () => {
      // Background tabs don't run exit animations; skip so words don't pile up.
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % ROTATING.length)
    }
    const id = window.setInterval(tick, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <span className="ld-rotator" aria-hidden="true">
      {/* Longest phrase reserves the width so the line never jumps */}
      <span className="ld-rotator-sizer" aria-hidden="true">
        {ROTATING.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ROTATING[index]}
          className="ld-rotator-word"
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {ROTATING[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Opening screen: live dot field, rotating statement, tilting portrait, counters and a kinetic wordmark. */
export function LandingHero({ profile, stats }: LandingHeroProps) {
  const figures = buildFigures(stats)

  return (
    <section id="top" className="ld-hero" aria-labelledby="ld-hero-title">
      <DotField className="ld-hero-field" />

      <div className="ld-wrap ld-hero-inner">
        <div className="ld-hero-meta ld-in" style={{ '--d': 0 } as React.CSSProperties}>
          <span className="ld-status" data-on={profile.availability}>
            <span className="ld-status-dot" aria-hidden="true" />
            {profile.availability ? 'Available for new projects' : 'Currently booked'}
          </span>
          <span className="ld-hero-meta-right">
            {profile.title}
            {profile.location ? ` — ${profile.location}` : ''}
          </span>
        </div>

        <div className="ld-hero-grid">
          <div className="ld-hero-copy">
            <h1 id="ld-hero-title" className="ld-hero-title ld-in" style={{ '--d': 1 } as React.CSSProperties}>
              I build web products <span className="ld-sr">{ROTATING[0]}</span>
              <RotatingWord />
            </h1>

            <p className="ld-hero-lede ld-in" style={{ '--d': 2 } as React.CSSProperties}>
              {profile.subheadline || FALLBACK_LEDE}
            </p>

            <div className="ld-hero-actions ld-in" style={{ '--d': 3 } as React.CSSProperties}>
              <Magnetic>
                <Link href="/#projects" className="ld-btn ld-btn-solid">
                  See selected work <ArrowDown size={16} aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/#contact" className="ld-btn ld-btn-line">
                  Start a project <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="ld-in" style={{ '--d': 2 } as React.CSSProperties}>
            <PortraitCard
              src={pickPortrait(profile)}
              name={profile.name}
              title={profile.title}
              available={profile.availability}
            />
          </div>
        </div>

        {figures.length > 0 && (
          <dl className="ld-figures ld-in" style={{ '--d': 4 } as React.CSSProperties}>
            {figures.map((f) => (
              <div key={f.label} className="ld-figure">
                <dt>{f.label}</dt>
                <dd>
                  <CountUp value={f.value} />
                  <sup>+</sup>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="ld-wrap">
        <KineticName name={profile.name} />
      </div>
    </section>
  )
}
