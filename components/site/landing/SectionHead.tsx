import type { ReactNode } from 'react'

interface SectionHeadProps {
  index: string
  label: string
  title: ReactNode
  aside?: ReactNode
  id?: string
}

/** Editorial section opener: running index, mono label, display title, optional right-hand slot. */
export function SectionHead({ index, label, title, aside, id }: SectionHeadProps) {
  return (
    <header className="ld-head">
      <p className="ld-head-label">
        <span className="ld-head-index">{index}</span>
        <span className="ld-head-rule" aria-hidden="true" />
        {label}
      </p>
      <div className="ld-head-row">
        <h2 id={id} className="ld-head-title">
          {title}
        </h2>
        {aside ? <div className="ld-head-aside">{aside}</div> : null}
      </div>
    </header>
  )
}
