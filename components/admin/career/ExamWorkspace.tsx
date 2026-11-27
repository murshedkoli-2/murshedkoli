'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import {
  BookOpen, Check, CheckCircle2, ClipboardCopy, FileCode2, LoaderCircle, RotateCcw, Sparkles, Target, TrendingUp, X,
} from 'lucide-react'
import type { CareerTask } from '@/lib/data/career-roadmap'
import type { CareerStep } from '@/lib/admin/career'
import type { CareerRoadmap, SubmissionDraft } from './useCareerRoadmap'

type Tab = 'challenge' | 'reference' | 'report'
const EASE = [0.16, 1, 0.3, 1] as const
const SCORE_R = 54
const SCORE_C = 2 * Math.PI * SCORE_R
const noopSubscribe = () => () => {}
const TASK_STATUS: Record<CareerTask['status'], string> = { todo: 'To do', in_progress: 'In progress', completed: 'Completed' }

const draftFrom = (task: CareerTask): SubmissionDraft => ({
  answerText: task.submission?.answerText || '',
  codeSnippet: task.submission?.codeSnippet || '',
  repoUrl: task.submission?.repoUrl || '',
})

function Report({ task }: { task: CareerTask }) {
  const reduce = useReducedMotion()
  const ev = task.evaluation
  if (!ev) {
    return (
      <div className="cr-x-empty">
        <Sparkles size={28} aria-hidden="true" />
        <p>No AI report yet. Submit your answer on the Challenge tab to get scored.</p>
      </div>
    )
  }
  return (
    <div className="cr-report">
      <div className="cr-verdict" data-pass={ev.passed}>
        <div className="cr-score-ring">
          <svg viewBox="0 0 128 128" aria-hidden="true">
            <circle cx="64" cy="64" r={SCORE_R} className="cr-score-track" />
            <motion.circle
              cx="64"
              cy="64"
              r={SCORE_R}
              className="cr-score-value"
              strokeDasharray={SCORE_C}
              initial={{ strokeDashoffset: SCORE_C }}
              animate={{ strokeDashoffset: SCORE_C * (1 - ev.score / 100) }}
              transition={{ duration: reduce ? 0 : 1.3, ease: EASE }}
            />
          </svg>
          <p>
            <b>{ev.score}</b>
            <small>/100</small>
          </p>
        </div>
        <div>
          <p className="cr-kicker">{ev.evaluator === 'ai' ? 'AI evaluation' : 'Self assessment'} · {new Date(ev.evaluatedAt).toLocaleDateString()}</p>
          <h3>{ev.passed ? 'Passed' : 'Not passed yet'}</h3>
          <p className="cr-summary">{ev.summary}</p>
        </div>
      </div>

      <div className="cr-report-grid">
        <section>
          <h4><CheckCircle2 size={16} aria-hidden="true" /> Strengths</h4>
          <ul>{ev.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
        <section>
          <h4><TrendingUp size={16} aria-hidden="true" /> Improvements</h4>
          <ul>{ev.improvements.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      </div>
      {ev.seniorTips && (
        <aside className="cr-tip">
          <Target size={16} aria-hidden="true" />
          <div>
            <p className="cr-kicker">Senior engineer tip</p>
            <p>{ev.seniorTips}</p>
          </div>
        </aside>
      )}
    </div>
  )
}

function Panel({ step, task, roadmap }: { step: CareerStep; task: CareerTask; roadmap: CareerRoadmap }) {
  const [tab, setTab] = useState<Tab>(task.evaluation ? 'report' : 'challenge')
  const [draft, setDraft] = useState<SubmissionDraft>(() => draftFrom(task))
  const evaluating = roadmap.evaluatingTaskId === task.id
  const done = task.status === 'completed'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && roadmap.closeExam()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [roadmap])

  const submit = async () => {
    if (await roadmap.evaluate(draft)) setTab('report')
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(task.exam.referenceSolution)
      toast.success('Reference solution copied.')
    } catch {
      toast.error('Could not copy to the clipboard.')
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof Target }[] = [
    { key: 'challenge', label: 'Challenge', icon: Target },
    { key: 'reference', label: 'Reference & rubric', icon: BookOpen },
    { key: 'report', label: 'AI report', icon: Sparkles },
  ]

  return (
    <div className="adm-app cr-x-root">
      <motion.div className="cr-x-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={roadmap.closeExam} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        className="cr-x"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <header className="cr-x-head">
          <div>
            <p className="cr-kicker">Step {String(step.stepNumber).padStart(2, '0')} · {step.title}</p>
            <h2>{task.title}</h2>
          </div>
          <span className="adm-pill" data-done={done}>{TASK_STATUS[task.status]}</span>
          <button type="button" className="adm-icon-btn" onClick={roadmap.closeExam} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <LayoutGroup id="cr-x-tabs">
          <div className="cr-tabs cr-x-tabs" role="tablist">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} className="cr-tab" onClick={() => setTab(key)}>
                {tab === key && <motion.span layoutId="cr-x-tab-bg" className="cr-tab-bg" transition={{ duration: 0.35, ease: EASE }} />}
                <span className="cr-tab-text"><Icon size={14} aria-hidden="true" /> {label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="cr-x-body">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {tab === 'challenge' && (
                <div className="cr-challenge">
                  <div className="cr-prompt">
                    <p className="cr-kicker">Problem statement</p>
                    <p>{task.exam.prompt}</p>
                  </div>
                  <div className="adm-field">
                    <label className="adm-label" htmlFor="cr-code">Your code</label>
                    <textarea id="cr-code" className="adm-textarea cr-code" rows={10} spellCheck={false} value={draft.codeSnippet} placeholder="// Paste or write your solution" onChange={(e) => setDraft({ ...draft, codeSnippet: e.target.value })} />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label" htmlFor="cr-answer">Explanation</label>
                    <textarea id="cr-answer" className="adm-textarea" rows={4} value={draft.answerText} placeholder="Walk through your approach, trade-offs and edge cases" onChange={(e) => setDraft({ ...draft, answerText: e.target.value })} />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label" htmlFor="cr-repo">Repository or commit link (optional, not inspected)</label>
                    <input id="cr-repo" className="adm-input" value={draft.repoUrl} placeholder="https://github.com/…" onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })} />
                  </div>
                </div>
              )}

              {tab === 'reference' && (
                <div className="cr-reference">
                  <section>
                    <h4>Rubric</h4>
                    <ul className="cr-rubric">
                      {task.exam.rubric.map((r) => (
                        <li key={r}><Check size={14} aria-hidden="true" /> {r}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <div className="cr-ref-head">
                      <h4>Reference solution</h4>
                      <button type="button" className="adm-btn" onClick={copy}>
                        <ClipboardCopy size={15} aria-hidden="true" /> Copy
                      </button>
                    </div>
                    <pre className="cr-pre"><code>{task.exam.referenceSolution}</code></pre>
                  </section>
                </div>
              )}

              {tab === 'report' && <Report task={task} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="cr-x-foot">
          <button type="button" className="adm-btn" onClick={() => roadmap.toggleTask(step, task.id, done ? 'todo' : 'completed')}>
            {done ? <><RotateCcw size={15} aria-hidden="true" /> Mark to do</> : <><Check size={15} aria-hidden="true" /> Mark passed</>}
          </button>
          <button type="button" className="adm-btn amber" onClick={submit} disabled={evaluating}>
            {evaluating ? <LoaderCircle size={16} className="cr-spin" aria-hidden="true" /> : <FileCode2 size={16} aria-hidden="true" />}
            {evaluating ? 'Evaluating…' : 'Evaluate with AI'}
          </button>
        </footer>
      </motion.div>
    </div>
  )
}

/** Exam workspace for one task: write a solution, compare with the reference, read the AI report. */
export function ExamWorkspace({ roadmap }: { roadmap: CareerRoadmap }) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  if (!mounted) return null
  const exam = roadmap.activeExam
  return createPortal(
    <AnimatePresence>
      {exam && <Panel key={exam.task.id} step={exam.step} task={exam.task} roadmap={roadmap} />}
    </AnimatePresence>,
    document.body,
  )
}
