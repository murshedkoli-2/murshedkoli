'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Code2, Layout, Database, Cpu, Sparkles, Globe } from 'lucide-react'
import type { ServiceView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface ServicesSectionProps {
  services: ServiceView[]
}

const DEFAULT_ICONS = [Code2, Layout, Database, Cpu, Sparkles, Globe]

export function ServicesSection({ services }: ServicesSectionProps) {
  const reduce = useReducedMotion()
  if (services.length === 0) return null

  return (
    <section
      id="services"
      style={{
        background: '#ffffff',
        color: '#1d1d1f',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container>
        <HomeSectionHeader title="Core" accent="capabilities" meta="services" />

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {services.map((s, i) => {
            const Icon = DEFAULT_ICONS[i % DEFAULT_ICONS.length]
            return (
              <motion.div
                key={s.id}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.25), ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '2rem',
                  borderRadius: 20,
                  background: '#f5f5f7',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 180,
                  transition: 'all 200ms ease',
                }}
                className="apple-bento-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
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
                      fontSize: '0.74rem',
                      color: '#86868b',
                      fontWeight: 600,
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: '#1d1d1f',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      color: '#6e6e73',
                      lineHeight: 1.5,
                      fontSize: '0.9rem',
                      margin: 0,
                    }}
                  >
                    {s.description}
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
