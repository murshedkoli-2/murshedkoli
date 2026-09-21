'use client'

import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSyncExternalStore } from 'react'
import { useTheme } from '@/components/site/ThemeProvider'

const subscribeMounted = () => () => {}

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const reduce = useReducedMotion()
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false)

  // Avoid rendering the theme-specific icon until mounted so SSR markup
  // (which can't know the client theme) matches the first client paint.


  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 999,
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        color: 'var(--ink)',
        cursor: 'pointer',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? theme : 'placeholder'}
          initial={reduce ? false : { rotate: -90, opacity: 0 }}
          animate={reduce ? {} : { rotate: 0, opacity: 1 }}
          exit={reduce ? {} : { rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex' }}
        >
          {mounted && isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
