'use client'

import { useState, type KeyboardEvent, type Ref } from 'react'
import { Eye, EyeOff, Lock, TriangleAlert } from 'lucide-react'

interface PasswordFieldProps {
  value: string
  onChange: (value: string) => void
  invalid: boolean
  ref?: Ref<HTMLInputElement>
}

/** Password input with a show/hide toggle and a Caps Lock warning. */
export function PasswordField({ value, onChange, invalid, ref }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const readCaps = (e: KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState('CapsLock'))

  return (
    <div className="lgx-field">
      <label htmlFor="password" className="lgx-label">
        Password
      </label>
      <div className="lgx-control" data-invalid={invalid}>
        <Lock size={17} className="lgx-control-icon" aria-hidden="true" />
        <input
          ref={ref}
          id="password"
          className="lgx-input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={readCaps}
          onKeyUp={readCaps}
          onBlur={() => setCapsLock(false)}
          autoComplete="current-password"
          aria-invalid={invalid || undefined}
          aria-describedby={capsLock ? 'caps-warning' : undefined}
          required
        />
        <button
          type="button"
          className="lgx-reveal"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {capsLock && (
        <p id="caps-warning" className="lgx-caps" role="status">
          <TriangleAlert size={14} aria-hidden="true" /> Caps Lock is on
        </p>
      )}
    </div>
  )
}
