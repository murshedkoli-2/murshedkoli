'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import type { TimelineEntry } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface TimelineSectionProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

function TimelineColumn({
  icon: Icon,
  label,
  entries,
  reduce,
}: {
  icon: typeof Briefcase
  label: string
  entries: TimelineEntry[]
  reduce: boolean | null
}) {
  if (entries.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
        <Icon size={16} style={{ color: '#f5b04c' }} />
        <span className="hp-meta" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {label.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map((e, idx) => (
          <motion.div
            key={e.id}
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: '#ececea' }}>
                {e.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: e.current ? '#34d399' : 'rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {e.current && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399' }} />}
                <span>{e.period}</span>
              </div>
            </div>

            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem' }}>{e.subtitle}</div>

            {e.detail && (
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  marginTop: 4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {e.detail}
              </div>
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
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Track" accent="record" meta="milestones" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '2.5rem',
            marginTop: '2rem',
          }}
        >
          <TimelineColumn icon={Briefcase} label="Professional Roles" entries={experience} reduce={reduce} />
          <TimelineColumn icon={GraduationCap} label="Academic Background" entries={education} reduce={reduce} />
        </div>
      </Container>
    </section>
  )
}
