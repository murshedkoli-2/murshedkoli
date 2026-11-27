'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface RailSection {
  id: string
  label: string
}

/**
 * Reading-progress bar along the top plus a dot per section on the right edge
 * that tracks the section in view and jumps to it on click. `sections` must
 * list only sections that are actually rendered.
 */
export function ScrollRail({ sections }: { sections: RailSection[] }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [sections])

  return (
    <>
      <motion.div className="ld-progress" style={{ scaleX }} aria-hidden="true" />
      {sections.length > 1 && (
        <nav className="ld-rail-dots" aria-label="Page sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-active={active === s.id} aria-current={active === s.id ? 'true' : undefined}>
              <span className="ld-rail-label">{s.label}</span>
              <span className="ld-rail-dot" aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </>
  )
}
