'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialised from the attribute the no-flash script already set, so the
  // provider agrees with the pre-paint value and there is no hydration flip.
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    setThemeState(readInitialTheme())
  }, [])

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* storage unavailable — ignore, session-only theme */
    }
  }, [])

  const toggle = useCallback(() => {
    applyTheme(readInitialTheme() === 'dark' ? 'light' : 'dark')
  }, [applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
