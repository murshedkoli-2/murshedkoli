import type { ServiceView } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Card } from '@/components/site/ui/Card'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'
import { resolveServiceIcon } from './serviceIcons'

interface ServicesSectionProps {
  services: ServiceView[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null

  return (
    <Section id="services" eyebrow="What I do" title="Services">
      <RevealGroup stagger={0.08} className="services-grid">
        {services.map((s) => {
          const Icon = resolveServiceIcon(s.icon)
          return (
            <RevealItem key={s.id}>
              <Card style={{ padding: '1.75rem', height: '100%' }}>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    width: 48,
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 14,
                    background: 'color-mix(in oklch, var(--accent) 14%, transparent)',
                    color: 'var(--accent)',
                    marginBottom: '1.1rem',
                  }}
                >
                  <Icon size={24} />
                </span>
                <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.description}</p>
              </Card>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
