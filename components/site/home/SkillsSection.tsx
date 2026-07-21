import type { SkillColumn } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'

interface SkillsSectionProps {
  columns: SkillColumn[]
}

export function SkillsSection({ columns }: SkillsSectionProps) {
  if (columns.length === 0) return null

  return (
    <Section eyebrow="toolkit" title="Stack & technologies">
      <RevealGroup stagger={0.06} className="skills-grid">
          {columns.map((col) => (
            <RevealItem key={col.key}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  padding: '1.5rem',
                  height: '100%',
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--comment)',
                    marginBottom: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5ch',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>#</span>
                  {col.label.toLowerCase()}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
                  {col.skills.map((s) => (
                    <span
                      key={s.id}
                      className="mono"
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--ink)',
                        padding: '3px 8px',
                        border: '1px solid var(--line)',
                        borderRadius: 5,
                        background: 'var(--surface-2)',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
      </RevealGroup>
    </Section>
  )
}
