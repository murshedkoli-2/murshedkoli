'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  BookOpenCheck, Check, ChevronDown, Clock, ExternalLink, FileCode2, Lightbulb, ListChecks, NotebookPen, Sparkles, Trash2,
} from 'lucide-react'
import type { CareerTask } from '@/lib/data/career-roadmap'
import { categoryMeta, taskProgress, STATUS_LABEL, type CareerStep, type StepStatus } from '@/lib/admin/career'
import type { CareerRoadmap } from './useCareerRoadmap'

const EASE = [0.16, 1, 0.3, 1] as const
const STATUSES: StepStatus[] = ['todo', 'in_progress', 'completed']
const MINI_R = 15
const MINI_C = 2 * Math.PI * MINI_R

type Tab = 'tasks' | 'concepts' | 'proof' | 'check'
const TABS: { key: Tab; label: string; icon: typeof ListChecks }[] = [
  { key: 'tasks', label: 'Tasks & exams', icon: ListChecks },
  { key: 'concepts', label: 'Concepts', icon: Lightbulb },
  { key: 'proof', label: 'Proof & notes', icon: NotebookPen },
  { key: 'check', label: 'Self-check', icon: BookOpenCheck },
]

interface MilestoneCardProps {
  step: CareerStep
  open: boolean
  onToggle: () => void
  roadmap: CareerRoadmap
}

function MiniRing({ percent }: { percent: number }) {
  return (
    <svg viewBox="0 0 36 36" className="cr-mini" aria-hidden="true">
      <circle cx="18" cy="18" r={MINI_R} className="cr-mini-track" />
      <circle cx="18" cy="18" r={MINI_R} className="cr-mini-value" strokeDasharray={MINI_C} strokeDashoffset={MINI_C * (1 - percent / 100)} />
    </svg>
  )
}

function TaskRow({ step, task, roadmap }: { step: CareerStep; task: CareerTask; roadmap: CareerRoadmap }) {
  const done = task.status === 'completed'
  const score = task.evaluation?.score
  return (
    <li className="cr-task" data-done={done}>
      <button
        type="button"
        className="cr-check"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark "${task.title}" ${done ? 'to do' : 'done'}`}
        onClick={() => roadmap.toggleTask(step, task.id, done ? 'todo' : 'completed')}
      >
        <Check size={14} strokeWidth={3} />
      </button>
      <div className="cr-task-main">
        <p className="cr-task-title">{task.title}</p>
        <p className="cr-task-desc">{task.description}</p>
        <p className="cr-task-meta">
          <span>
            <Clock size={12} aria-hidden="true" /> {task.estimatedMinutes} min
          </span>
          {score !== undefined && (
            <span className="cr-score" data-pass={task.evaluation?.passed}>
              <Sparkles size={12} aria-hidden="true" /> AI score {score}%
            </span>
          )}
        </p>
      </div>
      <button type="button" className="adm-btn cr-task-open" onClick={() => roadmap.openExam(step, task)}>
        <FileCode2 size={15} aria-hidden="true" /> {task.evaluation ? 'Report' : 'Exam'}
      </button>
    </li>
  )
}

function Body({ step, roadmap }: { step: CareerStep; roadmap: CareerRoadmap }) {
  const [tab, setTab] = useState<Tab>('tasks')
  const saving = roadmap.savingStepId === step.id
  const url = roadmap.editingUrls[step.id] ?? ''

  return (
    <div className="cr-body">
      <p className="cr-desc">{step.description}</p>

      <LayoutGroup id={`cr-tabs-${step.id}`}>
        <div className="cr-tabs" role="tablist" aria-label="Milestone sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} className="cr-tab" onClick={() => setTab(key)}>
              {tab === key && <motion.span layoutId="cr-tab-bg" className="cr-tab-bg" transition={{ duration: 0.35, ease: EASE }} />}
              <span className="cr-tab-text">
                <Icon size={14} aria-hidden="true" /> {label}
              </span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'tasks' && (
            <ul className="cr-tasks">
              {(step.tasks ?? []).map((t) => (
                <TaskRow key={t.id} step={step} task={t} roadmap={roadmap} />
              ))}
            </ul>
          )}

          {tab === 'concepts' && (
            <ul className="cr-concepts">
              {step.keyConcepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}

          {tab === 'proof' && (
            <div className="cr-proof">
              <div className="cr-deliverable">
                <p className="adm-label">Deliverable</p>
                <p>{step.deliverable}</p>
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor={`url-${step.id}`}>GitHub or demo link</label>
                <div className="cr-inline">
                  <input
                    id={`url-${step.id}`}
                    className="adm-input"
                    value={url}
                    placeholder="https://github.com/…"
                    onChange={(e) => roadmap.setUrl(step.id, e.target.value)}
                  />
                  <button type="button" className="adm-btn" disabled={saving} onClick={() => roadmap.saveField(step.id, 'deliverableUrl')}>
                    Save
                  </button>
                  {step.deliverableUrl && (
                    <a className="adm-icon-btn" href={step.deliverableUrl} target="_blank" rel="noopener noreferrer" aria-label="Open linked proof">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor={`notes-${step.id}`}>Study notes</label>
                <textarea
                  id={`notes-${step.id}`}
                  className="adm-textarea"
                  rows={4}
                  value={roadmap.editingNotes[step.id] ?? ''}
                  placeholder="What clicked, what to revisit…"
                  onChange={(e) => roadmap.setNote(step.id, e.target.value)}
                />
                <div>
                  <button type="button" className="adm-btn" disabled={saving} onClick={() => roadmap.saveField(step.id, 'notes')}>
                    {saving ? 'Saving…' : 'Save notes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'check' && (
            <ol className="cr-questions">
              {step.testQuestions.map((q, i) => (
                <li key={q}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {q}
                </li>
              ))}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** One milestone: compact summary that expands into tasks, concepts, proof and self-check. */
export function MilestoneCard({ step, open, onToggle, roadmap }: MilestoneCardProps) {
  const progress = taskProgress(step)
  const cat = categoryMeta(step.category)

  return (
    <motion.article
      layout="position"
      id={`step-${step.id}`}
      className="cr-card"
      data-status={step.status}
      data-open={open}
      style={{ '--tone': cat.color } as React.CSSProperties}
    >
      <div className="cr-card-head">
        <button type="button" className="cr-card-toggle" aria-expanded={open} onClick={onToggle}>
          <span className="cr-step-no">{String(step.stepNumber).padStart(2, '0')}</span>
          <span className="cr-card-heading">
            <span className="cr-card-meta">
              <span className="cr-cat">{cat.label}</span>
              <span>
                {progress.total} tasks · {step.keyConcepts.length} concepts
              </span>
            </span>
            <span className="cr-card-title">{step.title}</span>
          </span>
          <span className="cr-card-progress" title={`${progress.done} of ${progress.total} tasks`}>
            <MiniRing percent={progress.percent} />
            <span>
              {progress.done}/{progress.total}
            </span>
          </span>
          <ChevronDown size={18} className="cr-chevron" aria-hidden="true" />
        </button>

        <div className="cr-card-actions">
          <LayoutGroup id={`cr-status-${step.id}`}>
            <div className="cr-status" role="radiogroup" aria-label="Milestone status">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={step.status === s}
                  data-value={s}
                  disabled={roadmap.savingStepId === step.id}
                  onClick={() => step.status !== s && roadmap.changeStatus(step.id, s)}
                >
                  {step.status === s && <motion.span layoutId="cr-status-bg" className="cr-status-bg" transition={{ duration: 0.35, ease: EASE }} />}
                  <span>{STATUS_LABEL[s]}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <button type="button" className="adm-icon-btn danger" onClick={() => roadmap.deleteStep(step.id, step.title)} aria-label={`Delete ${step.title}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            className="cr-collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Body step={step} roadmap={roadmap} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
