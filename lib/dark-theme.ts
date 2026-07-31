import type { CSSProperties } from 'react'

/**
 * Homepage "dark gallery" palette as a CSS-variable scope.
 *
 * Spread onto a wrapper's `style` to re-resolve every token-driven color
 * (var(--ink), var(--surface), …) to the dark editorial scheme, regardless
 * of the visitor's light/dark theme toggle. Used by the homepage nav/footer
 * and the projects pages so public surfaces share one composition.
 */
export const DARK_THEME_SCOPE = {
  '--canvas': '#0b0b0c',
  '--surface': '#141416',
  '--surface-2': '#1a1a1d',
  '--ink': '#ececea',
  '--ink-muted': 'rgba(255, 255, 255, 0.6)',
  '--line': 'rgba(255, 255, 255, 0.09)',
  '--line-strong': 'rgba(255, 255, 255, 0.2)',
  '--accent': '#f5b04c',
  '--accent-ink': '#0b0b0c',
  '--accent-soft': 'rgba(245, 176, 76, 0.14)',
  '--comment': 'rgba(255, 255, 255, 0.45)',
} as CSSProperties
