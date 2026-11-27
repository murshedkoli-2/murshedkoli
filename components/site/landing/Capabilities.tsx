'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Code2, Cpu, Database, Globe, Layout, Sparkles, type LucideIcon } from 'lucide-react'
import type { ServiceView, SkillColumn } from '@/lib/data/portfolio'
import { servicesOrDefault } from '@/lib/landing'
import { SectionHead } from './SectionHead'

const ICONS: LucideIcon[] = [Code2, Layout, Database, Cpu, Sparkles, Globe]
const EASE = [0.16, 1, 0.3, 1] as const

interface CapabilitiesProps {
  services: ServiceView[]
  skills: SkillColumn[]
}

function ServiceExplorer({ services }: { services: ServiceView[] }) {
  const [active, setActive] = useState(0)
  const current = services[active]
  const Icon = ICONS[active % ICONS.length]
  const total = String(services.length).padStart(2, '0')

  return (
    <div className="ld-services">
      <ul className="ld-service-list">
        {services.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="ld-service"
              aria-expanded={i === active}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            >
              <span className="ld-service-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="ld-service-title">{s.title}</span>
            </button>
            <AnimatePresence initial={false}>
              {i === active && (
                <motion.p
                  className="ld-service-desc"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span>{s.description}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>

      <div className="ld-service-stage" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="ld-service-card"
            initial={{ opacity: 0, y: 24, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -16, rotate: 2 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="ld-service-count">
              {String(active + 1).padStart(2, '0')} / {total}
            </span>
            <Icon className="ld-service-icon" size={72} strokeWidth={1.25} />
            <p className="ld-service-card-title">{current.title}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SkillTabs({ skills }: { skills: SkillColumn[] }) {
  const [tab, setTab] = useState(skills[0].key)
  const reduce = useReducedMotion()
  const column = skills.find((c) => c.key === tab) ?? skills[0]

  return (
    <div className="ld-skills">
      <LayoutGroup id="skill-tabs">
        <div className="ld-tabs" role="tablist" aria-label="Skill groups">
          {skills.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              id={`skill-tab-${c.key}`}
              aria-selected={tab === c.key}
              aria-controls="skill-panel"
              className="ld-tab"
              onClick={() => setTab(c.key)}
            >
              {tab === c.key && <motion.span layoutId="tab-bg" className="ld-tab-bg" />}
              <span className="ld-tab-text">
                {c.label} <sup>{c.skills.length}</sup>
              </span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <motion.ul
        key={column.key}
        id="skill-panel"
        role="tabpanel"
        aria-labelledby={`skill-tab-${column.key}`}
        className="ld-skill-cloud"
      >
        {column.skills.map((s, i) => (
          <motion.li
            key={s.id}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
          >
            {s.name}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

/** What I do (service explorer) and what I use (tabbed skill cloud). */
export function Capabilities({ services: published, skills }: CapabilitiesProps) {
  const services = servicesOrDefault(published)

  return (
    <section id="expertise" className="ld-section ld-section-alt" aria-labelledby="ld-cap-title">
      <div className="ld-wrap">
        <SectionHead
          id="ld-cap-title"
          index="03"
          label="Capabilities"
          title={
            <>
              What I can <em>do</em> for you
            </>
          }
        />
        <ServiceExplorer services={services} />
        {skills.length > 0 && <SkillTabs skills={skills} />}
      </div>
    </section>
  )
}
