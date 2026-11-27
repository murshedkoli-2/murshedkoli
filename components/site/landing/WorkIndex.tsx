'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, type PointerEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { filterProjects, projectFilters, typeLabel } from '@/lib/landing'
import { SectionHead } from './SectionHead'

const STACK_SHOWN = 3
const EASE = [0.16, 1, 0.3, 1] as const
const FOLLOW = { stiffness: 320, damping: 32, mass: 0.6 }

function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return fine
}

function Cover({ project, sizes }: { project: FeaturedProject; sizes: string }) {
  return project.coverImage ? (
    <Image src={project.coverImage} alt="" fill sizes={sizes} className="ld-cover-img" />
  ) : (
    <span className="ld-cover-empty" aria-hidden="true">
      {project.number}
    </span>
  )
}

/** Project index: filterable rows with a cover preview that trails the cursor. */
export function WorkIndex({ projects }: { projects: FeaturedProject[] }) {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState<FeaturedProject | null>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const fx = useSpring(x, FOLLOW)
  const fy = useSpring(y, FOLLOW)

  if (projects.length === 0) return null

  const filters = projectFilters(projects)
  const shown = filterProjects(projects, filter)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <section id="projects" className="ld-section" aria-labelledby="ld-work-title">
      <div className="ld-wrap">
        <SectionHead
          id="ld-work-title"
          index="01"
          label="Selected work"
          title={
            <>
              Things I&apos;ve <em>built</em>
            </>
          }
          aside={
            filters.length > 0 ? (
              <LayoutGroup id="work-filter">
                <div className="ld-chips" role="tablist" aria-label="Filter projects by type">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      role="tab"
                      aria-selected={filter === f.key}
                      className="ld-chip"
                      onClick={() => setFilter(f.key)}
                    >
                      {filter === f.key && <motion.span layoutId="chip-bg" className="ld-chip-bg" />}
                      <span className="ld-chip-text">
                        {f.label} <sup>{f.count}</sup>
                      </span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            ) : null
          }
        />

        <ol className="ld-rows" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((project, i) => (
              <motion.li
                key={project.id}
                layout={!reduce}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.04, ease: EASE }}
              >
                <Link
                  href={project.links.caseStudy}
                  className="ld-row"
                  data-active={active?.id === project.id}
                  onPointerEnter={() => setActive(project)}
                  onFocus={() => setActive(project)}
                  onBlur={() => setActive(null)}
                >
                  <span className="ld-row-num">{project.number}</span>
                  <span className="ld-row-thumb" aria-hidden="true">
                    <Cover project={project} sizes="(max-width: 900px) 92vw, 240px" />
                  </span>
                  <span className="ld-row-main">
                    <span className="ld-row-title">{project.title}</span>
                    <span className="ld-row-summary">{project.summary}</span>
                  </span>
                  <span className="ld-row-type">
                    {project.isLive && <span className="ld-live" aria-label="Live" />}
                    {typeLabel(project.projectType)}
                  </span>
                  <span className="ld-row-stack">{project.stack.slice(0, STACK_SHOWN).join(' / ')}</span>
                  <span className="ld-row-arrow" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>

        <div className="ld-section-foot">
          <Link href="/projects" className="ld-btn ld-btn-line">
            Browse the full archive <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {fine && (
        <motion.div className="ld-preview" style={{ x: fx, y: fy }} aria-hidden="true">
          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                className="ld-preview-card"
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <Cover project={active} sizes="380px" />
                <span className="ld-preview-tag">View case study</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
