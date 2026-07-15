import type { TimelineEntry } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Reveal } from '@/components/site/Reveal'

interface TimelineSectionProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

function TimelineColumn({ heading, entries }: { heading: string; entries: TimelineEntry[] }) {
  if (entries.length === 0) return null
  return (
    <div>
      <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: '1.5rem' }}>{heading}</h3>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {entries.map((e) => (
          <Reveal key={e.id}>
            <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: e.current ? 'var(--accent)' : 'var(--surface)',
                  border: '2px solid var(--accent)',
                }}
              />
              <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {e.period}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginTop: 4 }}>{e.title}</div>
              <div style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', marginTop: 2 }}>{e.subtitle}</div>
              {e.detail && (
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', marginTop: 8, lineHeight: 1.6 }}>{e.detail}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function TimelineSection({ experience, education }: TimelineSectionProps) {
  if (experience.length === 0 && education.length === 0) return null

  return (
    <Section id="experience" surface eyebrow="Journey" title="Experience & education">
      <div className="timeline-grid">
        <TimelineColumn heading="Experience" entries={experience} />
        <TimelineColumn heading="Education" entries={education} />
      </div>
    </Section>
  )
}
