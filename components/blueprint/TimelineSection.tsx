import { SectionHeading } from './primitives'
import type { TimelineEntry } from '@/lib/data/portfolio'

interface TimelineSectionProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

function TimelineColumn({ label, entries }: { label: string; entries: TimelineEntry[] }) {
  if (!entries.length) return null
  return (
    <div>
      <p className="bp-mono" style={{ color: 'var(--amber)', marginBottom: 18 }}>
        {label}
      </p>
      <div style={{ display: 'grid', gap: 0 }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bp-cell"
            style={{ padding: '18px 20px', marginTop: -1 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--bp-font-display)',
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'var(--paper)',
                }}
              >
                {entry.title}
              </span>
              <span className="bp-mono" style={{ color: entry.current ? 'var(--shipped)' : 'var(--muted)' }}>
                {entry.period}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>{entry.subtitle}</p>
            {entry.detail ? (
              <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10, lineHeight: 1.55 }}>
                {entry.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TimelineSection({ experience, education }: TimelineSectionProps) {
  if (!experience.length && !education.length) return null

  return (
    <section id="experience" aria-labelledby="experience-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading eyebrow="Track Record" title="Experience & education" id="experience-heading" />
      <div className="bp-timeline-grid" style={{ marginTop: 40 }}>
        <TimelineColumn label="Experience" entries={experience} />
        <TimelineColumn label="Education" entries={education} />
      </div>
    </section>
  )
}
