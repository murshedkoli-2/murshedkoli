'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Code2,
  Server,
  Database,
  LayoutDashboard,
  Boxes,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import type { ServiceView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'
import Link from 'next/link'

interface ExpertiseSectionProps {
  services?: ServiceView[]
}

const CAPABILITIES = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    tag: 'REACT 19 · NEXT.js · TS',
    description:
      'Responsive, accessible, and performance-focused web interfaces with fluid micro-interactions, clean component hierarchies, and strict TypeScript contracts.',
    icon: Code2,
  },
  {
    id: 'backend',
    title: 'Backend Systems & APIs',
    tag: 'NODE.js · EXPRESS · REST',
    description:
      'Scalable server architectures, RESTful API design, background jobs, webhook handlers, and robust JWT/OAuth authentication systems.',
    icon: Server,
  },
  {
    id: 'database',
    title: 'Database Architecture',
    tag: 'MONGODB · PRISMA · REDIS',
    description:
      'Schema modeling, complex aggregation pipelines, efficient compound indexing, transactional integrity, and low-latency cache layers.',
    icon: Database,
  },
  {
    id: 'dashboards',
    title: 'Admin & Operational Dashboards',
    tag: 'ANALYTICS · RBAC · AUDIT',
    description:
      'High-utility internal tools, multi-role access controls, data visualizations, export pipelines, and administrative workflow management.',
    icon: LayoutDashboard,
  },
  {
    id: 'saas',
    title: 'SaaS Architecture & Platforms',
    tag: 'MULTI-TENANT · BILLING',
    description:
      'Production-ready SaaS foundations with organization partitioning, customer lifecycle flows, subscription billing, and automated email services.',
    icon: Boxes,
  },
  {
    id: 'ai-integrations',
    title: 'AI & Pipeline Integration',
    tag: 'GEMINI · LLM WORKFLOWS',
    description:
      'Embedding intelligence into web apps: generative content pipelines, document analysis, automated summaries, and streaming API endpoints.',
    icon: Sparkles,
  },
]

export function ExpertiseSection({ services = [] }: ExpertiseSectionProps) {
  const reduce = useReducedMotion()

  // Use database services if populated and valid, otherwise fallback to our structured engineering pillars
  const items =
    services.length >= 3
      ? services.map((s, idx) => ({
          id: s.id,
          title: s.title,
          tag: `CAPABILITY · 0${idx + 1}`,
          description: s.description,
          icon: [Code2, Server, Database, LayoutDashboard, Boxes, Sparkles][idx % 6],
        }))
      : CAPABILITIES

  return (
    <section
      id="expertise"
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
          <HomeSectionHeader title="What I" accent="build" meta="ENGINEERING CAPABILITIES" />
          <p
            style={{
              color: 'var(--ink-muted)',
              fontSize: '1.05rem',
              maxWidth: '38rem',
              lineHeight: 1.55,
              marginTop: '-1.5rem',
            }}
          >
            Engineering complete, resilient web products from clean database architecture to high-fidelity frontend systems.
          </p>
        </div>

        {/* 6-Card Engineering Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(idx * 0.07, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  padding: '2rem',
                  borderRadius: 20,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 220,
                  transition: 'all 200ms ease',
                }}
                className="apple-studio-card"
              >
                <div>
                  {/* Top Bar: Icon + Monospaced Tech Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'var(--accent-soft)',
                        border: '1px solid var(--accent)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--accent)',
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--ink-muted)',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      color: 'var(--ink-muted)',
                      lineHeight: 1.58,
                      fontSize: '0.92rem',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <Link
                    href="/#contact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <span>DISCUSS THIS</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
