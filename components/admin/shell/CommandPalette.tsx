'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownLeft, Search, type LucideIcon } from 'lucide-react'
import { searchCommands, type CommandEntry } from '@/lib/admin/commands'

export interface PaletteCommand extends CommandEntry {
  icon: LucideIcon
  hint?: string
  run: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  commands: PaletteCommand[]
}

const EASE = [0.16, 1, 0.3, 1] as const

/** ⌘K / Ctrl+K launcher: fuzzy-search every page and quick action, run with Enter. */
export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  return (
    <AnimatePresence>
      {open && <PaletteDialog key="palette" onClose={onClose} commands={commands} />}
    </AnimatePresence>
  )
}

function PaletteDialog({ onClose, commands }: Omit<CommandPaletteProps, 'open'>) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const results = useMemo(() => searchCommands(commands, query), [commands, query])
  const active = Math.min(cursor, Math.max(0, results.length - 1))

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (command: PaletteCommand | undefined) => {
    if (!command) return
    onClose()
    command.run()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((active + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((active - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <motion.div
      className="ash-palette-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="ash-palette-scrim" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="ash-palette"
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <div className="ash-palette-search">
          <Search size={18} aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setCursor(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or run an action…"
            aria-label="Search commands"
            aria-controls="ash-palette-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            role="combobox"
            aria-expanded="true"
          />
          <kbd>Esc</kbd>
        </div>

        <ul ref={listRef} id="ash-palette-list" role="listbox" className="ash-palette-list">
          {results.length === 0 && <li className="ash-palette-empty">No matches for “{query}”.</li>}
          {results.map((command, i) => {
            const header = i === 0 || results[i - 1].group !== command.group ? command.group : null
            const Icon = command.icon
            return (
              <li key={command.id} role="presentation">
                {header && <p className="ash-palette-group">{header}</p>}
                <button
                  type="button"
                  id={`cmd-${command.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  className="ash-palette-item"
                  onPointerMove={() => setCursor(i)}
                  onClick={() => run(command)}
                >
                  <span className="ash-palette-icon">
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="ash-palette-label">{command.label}</span>
                  {command.hint && <span className="ash-palette-hint">{command.hint}</span>}
                  <CornerDownLeft size={14} className="ash-palette-enter" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>

        <footer className="ash-palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>Ctrl</kbd>
            <kbd>K</kbd> toggle
          </span>
        </footer>
      </motion.div>
    </motion.div>
  )
}
