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
        background: '#f5f5f7',
        color: '#1d1d1f',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Engineering" accent="stack" meta="technologies" />

        {/* Core Highlighted Stack Showcase */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: 20,
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 18px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#d97706', marginBottom: 4, fontWeight: 600 }}>
              CORE ARSENAL
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1d1d1f' }}>
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
                  background: tech.highlight ? 'rgba(217, 119, 6, 0.08)' : '#f5f5f7',
                  border: `1px solid ${tech.highlight ? 'rgba(217, 119, 6, 0.25)' : 'rgba(0, 0, 0, 0.06)'}`,
                  color: tech.highlight ? '#b45309' : '#1d1d1f',
                  fontWeight: tech.highlight ? 600 : 500,
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
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                  <Icon size={16} style={{ color: '#d97706' }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
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
                        color: '#424245',
                        padding: '4px 10px',
                        background: '#f5f5f7',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: 6,
                        fontWeight: 500,
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
