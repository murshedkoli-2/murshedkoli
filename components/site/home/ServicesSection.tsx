import type { ServiceView } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'
import { resolveServiceIcon } from './serviceIcons'

interface ServicesSectionProps {
  services: ServiceView[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null

  return (
    <Section id="services" eyebrow="what I do" title="Expertise">
      <RevealGroup stagger={0.08} className="services-grid">
        {services.map((s, i) => {
          const Icon = resolveServiceIcon(s.icon)
          return (
            <RevealItem key={s.id}>
              <div
                className="site-card site-card--interactive"
                style={{
                  height: '100%',
                  padding: '1.75rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex',
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Icon size={22} />
                  </span>
                  <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--comment)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>{s.description}</p>
              </div>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
