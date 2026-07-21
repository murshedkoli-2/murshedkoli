import type { TimelineEntry } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Reveal } from '@/components/site/Reveal'

interface TimelineSectionProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

function TimelineColumn({ label, heading, entries }: { label: string; heading: string; entries: TimelineEntry[] }) {
  if (entries.length === 0) return null
  return (
    <div>
      <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--comment)', marginBottom: '0.6rem' }}>
        <span style={{ color: 'var(--accent)' }}>#</span> {label}
      </div>
      <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: '1.75rem' }}>{heading}</h3>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          paddingLeft: '1.5rem',
          borderLeft: '1px solid var(--line)',
        }}
      >
        {entries.map((e) => (
          <Reveal key={e.id}>
            <div style={{ position: 'relative' }}>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 5px)',
                  top: 6,
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: e.current ? 'var(--accent)' : 'var(--canvas)',
                  border: '2px solid var(--accent)',
                  boxShadow: e.current ? '0 0 0 4px var(--accent-soft)' : 'none',
                }}
              />
              <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--accent)', letterSpacing: '0.02em' }}>
                {e.period}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginTop: 5 }}>
                {e.title}
              </div>
              <div style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', marginTop: 2 }}>{e.subtitle}</div>
              {e.detail && (
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginTop: 8, lineHeight: 1.6 }}>{e.detail}</p>
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
    <Section id="experience" surface eyebrow="journey" title="Experience & education">
      <div className="timeline-grid">
        <TimelineColumn label="work" heading="Experience" entries={experience} />
        <TimelineColumn label="study" heading="Education" entries={education} />
      </div>
    </Section>
  )
}
