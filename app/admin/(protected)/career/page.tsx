'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsDownUp, ChevronsUpDown, Plus, RotateCcw, Route, Zap } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { CareerHero } from '@/components/admin/career/CareerHero'
import { StageTrack } from '@/components/admin/career/StageTrack'
import { SkillMastery } from '@/components/admin/career/SkillMastery'
import { MilestoneCard } from '@/components/admin/career/MilestoneCard'
import { ExamWorkspace } from '@/components/admin/career/ExamWorkspace'
import { NewMilestoneDrawer } from '@/components/admin/career/NewMilestoneDrawer'
import { useCareerRoadmap } from '@/components/admin/career/useCareerRoadmap'
import {
  categorySummaries, filterSteps, nextMilestone, stageName, stageSummaries, type CareerStep, type StatusFilter,
} from '@/lib/admin/career'

export default function CareerRoadmapPage() {
  const ready = useAdminGuard()
  const roadmap = useCareerRoadmap(ready)
  const { steps, stats, totals, loading, seeding } = roadmap

  const [stage, setStage] = useState(0)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)

  const stages = useMemo(() => stageSummaries(steps), [steps])
  const categories = useMemo(() => categorySummaries(steps), [steps])
  const next = useMemo(() => nextMilestone(steps), [steps])
  const shown = useMemo(() => filterSteps(steps, { stage, status, category, query }), [steps, stage, status, category, query])
  const groups = useMemo(() => {
    const numbers = Array.from(new Set(shown.map((s) => s.stageNumber))).sort((a, b) => a - b)
    return numbers.map((n) => ({ stageNumber: n, steps: shown.filter((s) => s.stageNumber === n) }))
  }, [shown])

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const nextSet = new Set(prev)
      if (nextSet.has(id)) nextSet.delete(id)
      else nextSet.add(id)
      return nextSet
    })
  const allOpen = shown.length > 0 && shown.every((s) => openIds.has(s.id))

  const continueWith = (step: CareerStep) => {
    setStage(0)
    setStatus('all')
    setCategory('all')
    setQuery('')
    setOpenIds((prev) => new Set(prev).add(step.id))
    requestAnimationFrame(() =>
      document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  if (!ready) return null

  const isEmpty = !loading && steps.length === 0

  return (
    <AdminShell
      active="career"
      title="Career roadmap"
      subtitle="Skill mastery curriculum · tasks, exams and AI evaluation"
      badges={{ career: stats.inProgressSteps || undefined }}
      actions={
        <>
          <button type="button" className="adm-btn" onClick={() => roadmap.seed(true)} disabled={seeding || isEmpty}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
          <button type="button" className="adm-btn amber" onClick={() => setCreating(true)}>
            <Plus size={16} aria-hidden="true" /> New milestone
          </button>
        </>
      }
    >
      <div className="cr">
        {isEmpty ? (
          <div className="adm-panel">
            <EmptyState
              icon={Route}
              title="No roadmap yet"
              body="Generate the 32-milestone industry curriculum, complete with tasks, exams and AI evaluation."
              action={
                <button type="button" className="adm-btn amber" onClick={() => roadmap.seed(false)} disabled={seeding}>
                  <Zap size={16} aria-hidden="true" /> {seeding ? 'Building your roadmap…' : 'Build my roadmap'}
                </button>
              }
            />
          </div>
        ) : (
          <>
            <CareerHero stats={stats} tasks={totals.tasks} tasksDone={totals.tasksDone} next={next} loaded={!loading} onContinue={continueWith} />

            <div className="cr-overview">
              <StageTrack stages={stages} active={stage} onSelect={setStage} overallPercent={stats.readinessScore} />
              <SkillMastery categories={categories} active={category} onSelect={setCategory} />
            </div>

            <Toolbar
              id="career"
              query={query}
              onQuery={setQuery}
              placeholder="Search milestones, concepts, questions or exam prompts…"
              filters={[
                { value: 'all', label: 'All', count: steps.length },
                { value: 'in_progress', label: 'In progress', count: stats.inProgressSteps },
                { value: 'todo', label: 'To do', count: stats.todoSteps },
                { value: 'completed', label: 'Done', count: stats.completedSteps },
              ]}
              filter={status}
              onFilter={(v) => setStatus(v as StatusFilter)}
              end={
                shown.length > 0 && (
                  <button
                    type="button"
                    className="adm-btn ghost"
                    onClick={() => setOpenIds(allOpen ? new Set() : new Set(shown.map((s) => s.id)))}
                  >
                    {allOpen ? <ChevronsDownUp size={15} aria-hidden="true" /> : <ChevronsUpDown size={15} aria-hidden="true" />}
                    {allOpen ? 'Collapse all' : 'Expand all'}
                  </button>
                )
              }
            />

            {shown.length === 0 && !loading ? (
              <div className="adm-panel">
                <EmptyState icon={Route} title="No milestones match" body="Try another stage, skill area, status or search." />
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {groups.map((g) => (
                  <motion.section
                    key={g.stageNumber}
                    className="cr-group"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    aria-label={`Stage ${g.stageNumber}`}
                  >
                    <header className="cr-group-head">
                      <span className="cr-group-no">Stage {g.stageNumber}</span>
                      <h2>{stageName(g.stageNumber)}</h2>
                      <span className="cr-group-count">{g.steps.length} milestones</span>
                    </header>
                    <div className="cr-list">
                      {g.steps.map((step) => (
                        <MilestoneCard key={step.id} step={step} open={openIds.has(step.id)} onToggle={() => toggle(step.id)} roadmap={roadmap} />
                      ))}
                    </div>
                  </motion.section>
                ))}
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      <ExamWorkspace roadmap={roadmap} />
      <NewMilestoneDrawer open={creating} onClose={() => setCreating(false)} roadmap={roadmap} />
    </AdminShell>
  )
}
