'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Flame, Link2, ListChecks, Trophy } from 'lucide-react'
import { DotField } from '@/components/site/landing/DotField'
import { categoryMeta, stageName, taskProgress, type CareerStats, type CareerStep } from '@/lib/admin/career'

const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const EASE = [0.16, 1, 0.3, 1] as const

interface CareerHeroProps {
  stats: CareerStats
  tasks: number
  tasksDone: number
  next: CareerStep | null
  loaded: boolean
  onContinue: (step: CareerStep) => void
}

function Ring({ percent }: { percent: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="cr-ring">
      <svg viewBox="0 0 160 160" role="img" aria-label={`${percent}% industry ready`}>
        <defs>
          <linearGradient id="cr-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="oklch(64% 0.19 350)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={RADIUS} className="cr-ring-track" />
        <motion.circle
          cx="80"
          cy="80"
          r={RADIUS}
          className="cr-ring-value"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100) }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
        />
      </svg>
      <p className="cr-ring-label">
        <b>{percent}</b>
        <small>%</small>
        <span>industry ready</span>
      </p>
    </div>
  )
}

/** Readiness ring, live counters and the milestone to pick up next. */
export function CareerHero({ stats, tasks, tasksDone, next, loaded, onContinue }: CareerHeroProps) {
  const percent = loaded ? stats.readinessScore : 0
  const counters = [
    { icon: Trophy, label: 'Milestones done', value: `${stats.completedSteps}/${stats.totalSteps}` },
    { icon: Flame, label: 'In progress', value: String(stats.inProgressSteps) },
    { icon: ListChecks, label: 'Tasks passed', value: `${tasksDone}/${tasks}` },
    { icon: Link2, label: 'Proof linked', value: String(stats.deliverablesLinked) },
  ]

  return (
    <section className="cr-hero" aria-label="Career readiness">
      <DotField className="cr-hero-field" />
      <Ring percent={percent} />

      <div className="cr-hero-main">
        <p className="cr-kicker">Career target · Global remote & $2k+ freelance</p>
        <h2 className="cr-hero-title">
          {percent >= 100 ? (
            <>Roadmap <em className="adm-accent">complete</em>.</>
          ) : percent > 0 ? (
            <>Keep going — <em className="adm-accent">{100 - percent}%</em> to go.</>
          ) : (
            <>Your path to <em className="adm-accent">senior</em> starts here.</>
          )}
        </h2>
        <dl className="cr-counters">
          {counters.map(({ icon: Icon, label, value }) => (
            <div key={label} className="cr-counter">
              <Icon size={16} aria-hidden="true" />
              <dt>{label}</dt>
              <dd>{loaded ? value : '–'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {next && (
        <motion.button
          type="button"
          className="cr-next"
          onClick={() => onContinue(next)}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <span className="cr-kicker">{next.status === 'in_progress' ? 'Continue' : 'Up next'}</span>
          <span className="cr-next-step">Step {String(next.stepNumber).padStart(2, '0')}</span>
          <span className="cr-next-title">{next.title}</span>
          <span className="cr-next-meta">
            <i style={{ background: categoryMeta(next.category).color }} aria-hidden="true" />
            {stageName(next.stageNumber)}
          </span>
          <span className="cr-bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${taskProgress(next).percent / 100})` }} />
          </span>
          <span className="cr-next-go">
            {taskProgress(next).done}/{taskProgress(next).total} tasks <ArrowRight size={16} aria-hidden="true" />
          </span>
        </motion.button>
      )}
    </section>
  )
}
