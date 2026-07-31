'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

/**
 * Admin form primitives.
 *
 * Every color resolves from the global theme tokens (--surface, --line, --ink,
 * --accent) via the `.pe-*` classes in app/admin/admin.css, so these follow the
 * light/dark toggle and share the homepage's single amber accent. No fixed
 * hexes, no gradients, no glow — the site's flat editorial system, in a form.
 */

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="pe-label">{label}</label>}
        <input ref={ref} className={`pe-input ${error ? 'err' : ''} ${className}`} {...props} />
        {error && <p className="pe-help err">{error}</p>}
        {helperText && !error && <p className="pe-help">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Textarea Component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="pe-label">{label}</label>}
        <textarea ref={ref} className={`pe-textarea ${error ? 'err' : ''} ${className}`} {...props} />
        {error && <p className="pe-help err">{error}</p>}
        {helperText && !error && <p className="pe-help">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="pe-label">{label}</label>}
        <div className="relative">
          <select ref={ref} className={`pe-select ${error ? 'err' : ''} ${className}`} {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--ink-muted)' }}
            aria-hidden
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {error && <p className="pe-help err">{error}</p>}
        {helperText && !error && <p className="pe-help">{helperText}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`pe-btn pe-btn-${variant} pe-btn-${size} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Card Component
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`pe-card ${hover ? 'pe-card-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="pe-empty">
      {icon && (
        <div className="mb-4 flex justify-center" style={{ color: 'var(--ink-muted)' }}>
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>{title}</h4>
      {description && (
        <p className="text-xs leading-relaxed mb-5 max-w-[300px] mx-auto" style={{ color: 'var(--ink-muted)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
