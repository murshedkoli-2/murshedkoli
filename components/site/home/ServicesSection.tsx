'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ServiceView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

interface ServicesSectionProps {
  services: ServiceView[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const reduce = useReducedMotion()
  if (services.length === 0) return null

  return (
    <section
      id="services"
      style={{
        background: 'var(--section-ground, #0b0b0c)',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        scrollMarginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <Container>
        <HomeSectionHeader title="What I" accent="do" meta="capabilities" />

        <div>
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              className="svc-row"
              initial={reduce ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: Math.min(i * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
            >
              <h3
                style={{
                  fontSize: 'clamp(1.3rem, 1.1rem + 1vw, 1.8rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: '#ececea',
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
