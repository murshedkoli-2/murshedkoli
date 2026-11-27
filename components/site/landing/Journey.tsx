'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { TimelineEntry } from '@/lib/data/portfolio'
import { SectionHead } from './SectionHead'

const EASE = [0.16, 1, 0.3, 1] as const

interface JourneyProps {
  experience: TimelineEntry[]
  education: TimelineEntry[]
}

interface Track {
  key: string
  label: string
  entries: TimelineEntry[]
}

function Entry({ entry, open, onToggle }: { entry: TimelineEntry; open: boolean; onToggle: () => void }) {
  const body = (
    <>
      <span className="ld-entry-period">
        {entry.current && <span className="ld-live" aria-hidden="true" />}
        {entry.period}
      </span>
      <span className="ld-entry-title">{entry.title}</span>
      <span className="ld-entry-sub">{entry.subtitle}</span>
    </>
  )

  return (
    <li className="ld-entry" data-current={entry.current}>
      <span className="ld-entry-node" aria-hidden="true" />
      {entry.detail ? (
        <button type="button" className="ld-entry-head" aria-expanded={open} onClick={onToggle}>
          {body}
          <Plus className="ld-entry-toggle" size={20} aria-hidden="true" />
        </button>
      ) : (
        <div className="ld-entry-head">{body}</div>
      )}
      <AnimatePresence initial={false}>
        {open && entry.detail && (
          <motion.p
            className="ld-entry-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span>{entry.detail}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Experience / education timeline whose spine draws itself as you scroll. */
export function Journey({ experience, education }: JourneyProps) {
  const tracks: Track[] = [
    { key: 'experience', label: 'Experience', entries: experience },
    { key: 'education', label: 'Education', entries: education },
  ].filter((t) => t.entries.length > 0)

  const [tab, setTab] = useState(tracks[0]?.key ?? 'experience')
  const [openId, setOpenId] = useState<string | null>(tracks[0]?.entries[0]?.id ?? null)
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  if (tracks.length === 0) return null
  const track = tracks.find((t) => t.key === tab) ?? tracks[0]

  const select = (t: Track) => {
    setTab(t.key)
    setOpenId(t.entries[0]?.id ?? null)
  }

  return (
    <section id="journey" className="ld-section" aria-labelledby="ld-journey-title">
      <div className="ld-wrap ld-journey">
        <div className="ld-journey-side">
          <SectionHead
            id="ld-journey-title"
            index="04"
            label="Journey"
            title={
              <>
                Where I&apos;ve <em>been</em>
              </>
            }
          />
          {tracks.length > 1 && (
            <LayoutGroup id="journey-tabs">
              <div className="ld-tabs" role="tablist" aria-label="Timeline">
                {tracks.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.key}
                    className="ld-tab"
                    onClick={() => select(t)}
                  >
                    {tab === t.key && <motion.span layoutId="journey-bg" className="ld-tab-bg" />}
                    <span className="ld-tab-text">
                      {t.label} <sup>{t.entries.length}</sup>
                    </span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          )}
        </div>

        <div className="ld-timeline">
          <span className="ld-spine" aria-hidden="true">
            <motion.span className="ld-spine-fill" style={{ scaleY: draw }} />
          </span>
          <ol ref={listRef} key={track.key} className="ld-entries">
            {track.entries.map((entry) => (
              <Entry
                key={entry.id}
                entry={entry}
                open={openId === entry.id}
                onToggle={() => setOpenId((id) => (id === entry.id ? null : entry.id))}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
