'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { TimelineEntry } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface TimelineSectionProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

function TimelineColumn({ label, entries, reduce }: { label: string; entries: TimelineEntry[]; reduce: boolean | null }) {
  if (entries.length === 0) return null
  return (
    <div>
      <div className="hp-meta" style={{ marginBottom: '1.75rem' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {entries.map((e, idx) => (
          <motion.div
            key={e.id}
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.25), ease: [0.16, 1, 0.3, 1] }}
            style={{
              paddingBlock: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.09)',
            }}
          >
            <div
              className="hp-meta"
              style={{
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: e.current ? '#f5b04c' : undefined,
              }}
            >
              {e.period}
              {e.current && (
                <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399' }} aria-hidden />
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: '#ececea' }}>
              {e.title}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem', marginTop: 4 }}>{e.subtitle}</div>
            {e.detail && (
              <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.92rem', marginTop: 10, lineHeight: 1.65, maxWidth: '30rem' }}>
                {e.detail}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TimelineSection({ experience, education }: TimelineSectionProps) {
  const reduce = useReducedMotion()
  if (experience.length === 0 && education.length === 0) return null

  return (
    <section
      id="experience"
      style={{
        background: '#0b0b0c',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Experience &" accent="education" meta="journey" />
        <div className="timeline-grid">
          <TimelineColumn label="work" entries={experience} reduce={reduce} />
          <TimelineColumn label="academic" entries={education} reduce={reduce} />
        </div>
      </Container>
    </section>
  )
}
