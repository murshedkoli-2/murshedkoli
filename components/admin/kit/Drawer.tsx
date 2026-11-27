'use client'

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

const EASE = [0.16, 1, 0.3, 1] as const
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const noopSubscribe = () => () => {}

/** Slide-over editor panel. Escape or the scrim closes it; focus is trapped while open. */
export function Drawer({ open, title, subtitle, onClose, children, footer }: DrawerProps) {
  // Portals need document.body, which only exists after hydration.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <DrawerPanel key="drawer" title={title} subtitle={subtitle} onClose={onClose} footer={footer}>
          {children}
        </DrawerPanel>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function DrawerPanel({ title, subtitle, onClose, children, footer }: Omit<DrawerProps, 'open'>) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Pages pass a fresh inline onClose each render; keep the latest without re-running setup.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('input, select, textarea')?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [])

  return (
    <div className="adm-app kit-drawer-root">
      <motion.div
        className="kit-drawer-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="kit-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <header className="kit-drawer-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="kit-drawer-body">{children}</div>
        {footer && <footer className="kit-drawer-foot">{footer}</footer>}
      </motion.div>
    </div>
  )
}
