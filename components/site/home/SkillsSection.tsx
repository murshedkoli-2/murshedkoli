import type { SkillColumn } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Card } from '@/components/site/ui/Card'
import { TechTag } from '@/components/site/ui/TechTag'
import { RevealGroup, RevealItem } from '@/components/site/Reveal'

interface SkillsSectionProps {
  columns: SkillColumn[]
}

export function SkillsSection({ columns }: SkillsSectionProps) {
  if (columns.length === 0) return null

  return (
    <Section eyebrow="Toolkit" title="Skills & technologies">
      <RevealGroup
        stagger={0.08}
        className="skills-grid"
      >
        {columns.map((col) => (
          <RevealItem key={col.key}>
            <Card style={{ padding: '1.75rem', height: '100%' }}>
              <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: '1.1rem' }}>{col.label}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {col.skills.map((s) => (
                  <TechTag key={s.id} label={s.name} />
                ))}
              </div>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
