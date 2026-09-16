'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Terminal, Layout, Database, Wrench } from 'lucide-react'
import type { SkillColumn } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface SkillsSectionProps {
  columns: SkillColumn[]
}

const CATEGORY_ICONS: Record<string, typeof Terminal> = {
  frontend: Layout,
  backend: Terminal,
  database: Database,
  tools: Wrench,
}

const CORE_STACK = [
  { name: 'Next.js 16', highlight: true },
  { name: 'React 19', highlight: true },
  { name: 'TypeScript', highlight: true },
  { name: 'MongoDB Atlas', highlight: true },
  { name: 'Tailwind CSS', highlight: false },
  { name: 'Prisma ORM', highlight: false },
  { name: 'Node.js', highlight: false },
  { name: 'Framer Motion', highlight: false },
]

export function SkillsSection({ columns }: SkillsSectionProps) {
  const reduce = useReducedMotion()
  if (columns.length === 0) return null

  return (
    <section
      id="stack"
      style={{
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Engineering" accent="stack" meta="technologies" />

        {/* Core Highlighted Stack Showcase */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f5b04c', marginBottom: 4 }}>
              CORE ARSENAL
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ececea' }}>
              Daily production tools & modern runtimes
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CORE_STACK.map((tech) => (
              <span
                key={tech.name}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: tech.highlight ? 'rgba(245, 176, 76, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${tech.highlight ? 'rgba(245, 176, 76, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: tech.highlight ? '#f5b04c' : '#ececea',
                  fontWeight: tech.highlight ? 600 : 400,
                }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Categorized Tech Taxonomy Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {columns.map((col, idx) => {
            const Icon = CATEGORY_ICONS[col.key.toLowerCase()] || Terminal
            return (
              <motion.div
                key={col.key}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '1.5rem',
                  borderRadius: 18,
                  background: 'rgba(255, 255, 255, 0.018)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                  <Icon size={16} style={{ color: '#f5b04c' }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ececea', letterSpacing: '-0.01em' }}>
                    {col.label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {col.skills.slice(0, 10).map((s) => (
                    <span
                      key={s.id}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 6,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
