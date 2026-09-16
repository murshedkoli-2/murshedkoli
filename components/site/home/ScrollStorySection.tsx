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
    desc: 'High contrast, purposeful hierarchy, and spatial balance. No superfluous clutter.',
  },
  {
    icon: Zap,
    num: '02',
    title: 'Scalable Systems',
    desc: 'Type-safe APIs, cached database queries, and sub-second edge responses.',
  },
  {
    icon: Sparkles,
    num: '03',
    title: 'Studio Polish',
    desc: 'Fluid spring physics, GPU-accelerated canvas, and extreme care for micro-details.',
  },
]

export function ScrollStorySection({ profile }: ScrollStorySectionProps) {
  const reduce = useReducedMotion()

  return (
    <section
      id="philosophy"
      style={{
        position: 'relative',
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBlock: 'clamp(5rem, 4rem + 6vh, 8rem)',
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
              color: '#f5b04c',
              marginBottom: '1rem',
            }}
          >
            <span>{'//'}</span>
            <span>STUDIO STANDARD</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 1.2rem + 3vw, 3.8rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Engineered with precision. <br />
            <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Polished to the pixel.</span>
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
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 240,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 200ms ease, background 200ms ease',
                }}
                className="studio-card"
              >
                {/* Top Row: Icon + Number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#f5b04c',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.3)',
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
                      color: '#ececea',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      color: 'rgba(255, 255, 255, 0.55)',
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
