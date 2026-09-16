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
        background: 'var(--surface-2)',
        color: 'var(--ink)',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid var(--line)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <HomeSectionHeader title="Engineering" accent="stack" meta="technologies" />

        {/* Core Highlighted Stack Showcase */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: 20,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>
              CORE ARSENAL
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>
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
                  background: tech.highlight ? 'var(--accent-soft)' : 'var(--surface-2)',
                  border: `1px solid ${tech.highlight ? 'var(--accent)' : 'var(--line)'}`,
                  color: tech.highlight ? 'var(--accent)' : 'var(--ink)',
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
                  background: 'var(--card-bg)',
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                  <Icon size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
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
                        color: 'var(--ink)',
                        padding: '4px 10px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
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
