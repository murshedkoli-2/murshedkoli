import type { CSSProperties } from 'react'
import type { SkillColumn } from '@/lib/data/portfolio'

const MIN_ITEMS = 8

/** Two counter-scrolling bands of technologies; pauses on hover. */
export function SkillMarquee({ skills }: { skills: SkillColumn[] }) {
  const names = skills.flatMap((c) => c.skills.map((s) => s.name))
  if (names.length === 0) return null

  // Repeat short lists so each band is wide enough to loop seamlessly.
  const repeats = Math.max(1, Math.ceil(MIN_ITEMS / names.length))
  const base = Array.from({ length: repeats }, () => names).flat()
  const half = Math.ceil(base.length / 2)
  const rows = [base, [...base.slice(half), ...base.slice(0, half)]]

  return (
    <section className="ld-marquee" aria-label="Technologies I work with">
      {rows.map((row, r) => (
        <div
          key={r}
          className="ld-marquee-row"
          data-dir={r === 0 ? 'left' : 'right'}
          style={{ '--dur': `${Math.max(28, row.length * 3.2)}s` } as CSSProperties}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="ld-marquee-track" aria-hidden={copy === 1}>
              {row.map((name, i) => (
                <li key={`${name}-${i}`}>
                  <span>{name}</span>
                  <span className="ld-marquee-star" aria-hidden="true">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </section>
  )
}
