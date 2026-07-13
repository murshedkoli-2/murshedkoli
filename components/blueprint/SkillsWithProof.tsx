import { SectionHeading } from './primitives'
import type { SkillColumn } from '@/lib/data/portfolio'

interface SkillsWithProofProps {
  columns: SkillColumn[]
}

export function SkillsWithProof({ columns }: SkillsWithProofProps) {
  if (!columns.length) return null

  return (
    <section id="skills" aria-labelledby="skills-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading eyebrow="Capabilities" title="Skills, by discipline" id="skills-heading" />

      <div className="bp-skills-grid" style={{ marginTop: 40 }}>
        {columns.map((col) => (
          <div key={col.key} className="bp-cell" style={{ padding: '22px 24px' }}>
            <p className="bp-mono" style={{ color: 'var(--amber)', marginBottom: 16 }}>
              {col.label}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 11 }}>
              {col.skills.map((skill) => (
                <li
                  key={skill.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                    borderBottom: '1px solid rgba(146,180,215,0.14)',
                    paddingBottom: 10,
                  }}
                >
                  <span style={{ color: 'var(--paper)', fontSize: 14.5 }}>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
