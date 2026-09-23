'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Search, Compass, Terminal, ShieldAlert, Rocket } from 'lucide-react'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

const STEPS = [
  {
    step: '01',
    title: 'Discover & Scope',
    icon: Search,
    subtitle: 'Clarifying Core Problems',
    description:
      'Unpacking business logic, user personas, performance requirements, and technical constraints before writing code.',
  },
  {
    step: '02',
    title: 'Architect & Design',
    icon: Compass,
    subtitle: 'Schemas & API Contracts',
    description:
      'Designing MongoDB collections, relational boundaries, RESTful endpoints, auth flows, and responsive UI structures.',
  },
  {
    step: '03',
    title: 'Build & Integrate',
    icon: Terminal,
    subtitle: 'Production TypeScript',
    description:
      'Implementing maintainable Next.js and Node.js code with clean abstractions, modular components, and type safety.',
  },
  {
    step: '04',
    title: 'Verify & Harden',
    icon: ShieldAlert,
    subtitle: 'Edge Cases & Security',
    description:
      'Rigorous testing for accessibility, input validation, role-based protection, API rate limits, and lighthouse performance.',
  },
  {
    step: '05',
    title: 'Ship & Iterate',
    icon: Rocket,
    subtitle: 'Deployment & Telemetry',
    description:
      'Zero-downtime deployment, CDN edge caching, live monitoring, database indexing audits, and seamless feature evolution.',
  },
]

export function WorkProcess() {
  const reduce = useReducedMotion()

  return (
    <section
      id="process"
      style={{
        background: 'var(--surface-2)',
        color: 'var(--ink)',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid var(--line)',
        transition: 'background 300ms ease, color 300ms ease',
      }}
    >
      <Container>
        <div style={{ marginBottom: '2.5rem' }}>
          <HomeSectionHeader title="How I" accent="work" meta="ENGINEERING PROCESS" />
          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: '1.05rem',
              maxWidth: '38rem',
              lineHeight: 1.55,
              marginTop: '-1.5rem',
            }}
          >
            A disciplined, end-to-end software development lifecycle designed to deliver stable production systems on time.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '1.25rem',
            position: 'relative',
          }}
        >
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(idx * 0.08, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  padding: '1.75rem 1.5rem',
                  borderRadius: 20,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 250,
                  position: 'relative',
                  transition: 'all 200ms ease',
                }}
                className="apple-studio-card"
              >
                <div>
                  {/* Top Bar: Step number + Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                      }}
                    >
                      {s.step}
                    </span>

                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {s.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent)',
                      fontWeight: 500,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {s.subtitle}
                  </div>

                  <p
                    style={{
                      color: 'var(--ink-muted)',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {s.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--ink-muted)',
                    marginTop: '1.25rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--accent)' }} />
                  <span>PHASE {s.step}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
