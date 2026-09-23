'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Terminal, Layout, Database, Wrench, Sparkles, Server, Cpu } from 'lucide-react'
import type { SkillColumn } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface SkillsSectionProps {
  columns: SkillColumn[]
}

const CATEGORY_ICONS: Record<string, typeof Terminal> = {
  frontend: Layout,
  backend: Server,
  database: Database,
  devops: Cpu,
  tools: Wrench,
  ai: Sparkles,
}

const CORE_STACK = [
  { name: 'MongoDB', highlight: true },
  { name: 'Express.js', highlight: true },
  { name: 'React 19', highlight: true },
  { name: 'Next.js 16', highlight: true },
  { name: 'Node.js', highlight: true },
  { name: 'TypeScript', highlight: true },
  { name: 'Prisma ORM', highlight: false },
  { name: 'Tailwind CSS', highlight: false },
]

export function SkillsSection({ columns }: SkillsSectionProps) {
  const reduce = useReducedMotion()
  if (columns.length === 0) return null

  return (
    <section
      id="stack"
      style={{
        background: 'var(--canvas)',
        color: 'var(--ink)',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid var(--line)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <div style={{ marginBottom: '2.5rem' }}>
          <HomeSectionHeader title="Engineering" accent="stack" meta="TECHNOLOGIES" />
          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: '1.05rem',
              maxWidth: '38rem',
              lineHeight: 1.55,
              marginTop: '-1.5rem',
            }}
          >
            A categorized look at the production languages, frameworks, databases, and tooling I use day to day.
          </p>
        </div>

        {/* Core MERN Arsenal Highlight Banner */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: 20,
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent)',
                marginBottom: 4,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {'// CORE PRODUCTION RUNTIMES'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>
              Primary Full-Stack &amp; MERN Ecosystem
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
                  background: tech.highlight ? 'var(--accent-soft)' : 'var(--card-bg)',
                  border: `1px solid ${tech.highlight ? 'var(--accent)' : 'var(--line)'}`,
                  color: tech.highlight ? 'var(--accent)' : 'var(--ink)',
                  fontWeight: tech.highlight ? 600 : 500,
                  boxShadow: 'var(--shadow-sm)',
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
                  padding: '1.75rem',
                  borderRadius: 20,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
                className="apple-studio-card"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--accent-soft)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--accent)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {col.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {col.skills.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--ink)',
                          padding: '5px 11px',
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
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--ink-muted)',
                    borderTop: '1px solid var(--line)',
                    paddingTop: 10,
                  }}
                >
                  {col.skills.length} VERIFIED {col.skills.length === 1 ? 'SKILL' : 'SKILLS'}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
