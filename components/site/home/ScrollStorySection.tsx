'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Layers, Zap, Sparkles } from 'lucide-react'
import { Container } from '@/components/site/ui/Container'
import type { ProfileView } from '@/lib/data/portfolio'

interface ScrollStorySectionProps {
  profile: ProfileView
}

const PRINCIPLES = [
  {
    icon: Layers,
    num: '01',
    title: 'Intentional Design',
    desc: 'High contrast, purposeful hierarchy, and spatial balance. Zero visual noise.',
  },
  {
    icon: Zap,
    num: '02',
    title: 'Scalable Systems',
    desc: 'Type-safe APIs, cached database queries, and sub-second edge response times.',
  },
  {
    icon: Sparkles,
    num: '03',
    title: 'Studio Polish',
    desc: 'Fluid spring physics, pristine responsiveness, and obsessive attention to detail.',
  },
]

export function ScrollStorySection({ profile }: ScrollStorySectionProps) {
  const reduce = useReducedMotion()

  return (
    <section
      id="philosophy"
      style={{
        position: 'relative',
        background: '#f5f5f7',
        color: '#1d1d1f',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        paddingBlock: 'clamp(5rem, 4.5rem + 5vh, 7.5rem)',
      }}
    >
      <Container>
        {/* Section Header */}
        <div style={{ maxWidth: '42rem', marginBottom: 'clamp(3rem, 2.5rem + 3vh, 4.5rem)' }}>
          <div
            className="hp-meta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#d97706',
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            <span>{'//'}</span>
            <span>STUDIO STANDARDS</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 1.2rem + 3vw, 3.6rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: '#1d1d1f',
            }}
          >
            Engineered with precision. <br />
            <span style={{ color: '#86868b' }}>Polished to the pixel.</span>
          </h2>
        </div>

        {/* 3-Card Apple Pro Studio Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.num}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '2rem',
                  borderRadius: 20,
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 18px -2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 220,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                }}
                className="apple-studio-card"
              >
                {/* Top Row: Icon + Number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(217, 119, 6, 0.08)',
                      border: '1px solid rgba(217, 119, 6, 0.18)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#d97706',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: '#86868b',
                      fontWeight: 600,
                    }}
                  >
                    {p.num}
                  </span>
                </div>

                {/* Bottom Row: Title + Micro-description */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.5rem',
                      color: '#1d1d1f',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      color: '#6e6e73',
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
