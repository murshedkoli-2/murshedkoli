'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, HelpCircle } from 'lucide-react'

export interface ConfirmOptions {
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` styles the action red and focuses Cancel first. */
  tone?: 'default' | 'danger'
}

const subscribeMounted = () => () => {}

interface PendingRequest extends ConfirmOptions {
  resolve: (value: boolean) => void
}

type Opener = (request: PendingRequest) => void

/**
 * Set by the mounted host. Module-level so `confirmDialog()` can be called from
 * plain event handlers without threading a hook through every component —
 * the same imperative shape as `sonner`'s `toast()`.
 */
let openRequest: Opener | null = null

/**
 * Promise-based replacement for `window.confirm`.
 *
 * Resolves `true` when confirmed, `false` on cancel, Escape, or backdrop click.
 * If the host is not mounted it resolves `false` — a destructive action must
 * never proceed just because the UI failed to render.
 */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  if (!openRequest) {
    console.error('[confirmDialog] <ConfirmDialogHost /> is not mounted; refusing to proceed.')
    return Promise.resolve(false)
  }
  return new Promise<boolean>((resolve) => {
    openRequest!({ ...options, resolve })
  })
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Renders confirmation dialogs for the whole app. Mount once, near the Toaster.
 */
export function ConfirmDialogHost() {
  const [request, setRequest] = useState<PendingRequest | null>(null)
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()



  useEffect(() => {
    openRequest = (next) => {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setRequest(next)
    }
    return () => { openRequest = null }
  }, [])

  const close = useCallback((result: boolean) => {
    setRequest((current) => {
      current?.resolve(result)
      return null
    })
    // Send focus back where it came from, so keyboard users don't land at the top.
    restoreFocusRef.current?.focus?.()
    restoreFocusRef.current = null
  }, [])

  // Escape to cancel, Tab kept inside the panel.
  useEffect(() => {
    if (!request) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close(false)
        return
      }
      if (e.key !== 'Tab') return

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [request, close])

  // Hold the page still while the dialog is up.
  useEffect(() => {
    if (!request) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [request])

  // Destructive dialogs open on Cancel so a stray Enter does nothing.
  useEffect(() => {
    if (!request) return
    const target = panelRef.current?.querySelector<HTMLElement>(
      request.tone === 'danger' ? '[data-cdlg-cancel]' : '[data-cdlg-confirm]'
    )
    target?.focus()
  }, [request])

  if (!mounted) return null

  const isDanger = request?.tone === 'danger'
  const Icon = isDanger ? AlertTriangle : HelpCircle

  return createPortal(
    <AnimatePresence>
      {request && (
        <div className="cdlg-root">
          <motion.div
            className="cdlg-scrim"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => close(false)}
          />
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cdlg-title"
            aria-describedby={request.description ? 'cdlg-desc' : undefined}
            className="cdlg-panel"
            initial={reduce ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={`cdlg-icon ${isDanger ? 'danger' : ''}`} aria-hidden>
              <Icon size={17} />
            </span>

            <h2 id="cdlg-title" className="cdlg-title">{request.title}</h2>

            {request.description && (
              <div id="cdlg-desc" className="cdlg-desc">{request.description}</div>
            )}

            <div className="cdlg-actions">
              <button
                type="button"
                data-cdlg-cancel
                className="cdlg-btn cdlg-btn-cancel"
                onClick={() => close(false)}
              >
                {request.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                data-cdlg-confirm
                className={`cdlg-btn ${isDanger ? 'cdlg-btn-danger' : 'cdlg-btn-confirm'}`}
                onClick={() => close(true)}
              >
                {request.confirmLabel || 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
