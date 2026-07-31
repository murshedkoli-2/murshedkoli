'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { SkillColumn } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface SkillsSectionProps {
  columns: SkillColumn[]
}

export function SkillsSection({ columns }: SkillsSectionProps) {
  const reduce = useReducedMotion()
  if (columns.length === 0) return null

  return (
    <section
      style={{
        background: '#0b0b0c',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Stack &" accent="tools" meta="toolkit" />

        <div className="skills-grid">
          {columns.map((col, idx) => (
            <motion.div
              key={col.key}
              initial={reduce ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: Math.min(idx * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.09)', height: '100%' }}>
                <div className="hp-meta" style={{ marginBottom: '1.1rem' }}>
                  {col.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {col.skills.map((s) => (
                    <span
                      key={s.id}
                      className="mono"
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        padding: '5px 12px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 999,
                        transition: 'border-color 200ms var(--ease), color 200ms var(--ease)',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
