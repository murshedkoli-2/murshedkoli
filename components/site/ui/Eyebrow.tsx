import type { ReactNode } from 'react'

/** Monospace `// comment`-style accent label that sits above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="dev-eyebrow">{children}</span>
}
