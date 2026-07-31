'use client'

import { motion } from 'framer-motion'
import { Globe, Smartphone, Laptop, Server, Check } from 'lucide-react'

const PROJECT_TYPES = [
  { value: 'webapp', label: 'Web App', icon: Globe, desc: 'Runs in a browser' },
  { value: 'android', label: 'Android', icon: Smartphone, desc: 'Installed on a phone' },
  { value: 'desktop', label: 'Desktop', icon: Laptop, desc: 'Native desktop app' },
  { value: 'api', label: 'Backend', icon: Server, desc: 'Service or API, no UI' },
]

interface TypeStepProps {
  value: string
  onChange: (value: string) => void
}

export function TypeStep({ value, onChange }: TypeStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PROJECT_TYPES.map((type) => {
        const Icon = type.icon
        const selected = value === type.value

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            aria-pressed={selected}
            className="text-left"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '18px 20px',
              borderRadius: 8,
              cursor: 'pointer',
              background: selected ? 'var(--accent-soft)' : 'var(--surface)',
              border: `1px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
              transition: 'border-color 160ms ease, background 160ms ease',
            }}
          >
            <div className="flex items-center justify-between w-full">
              <Icon size={19} style={{ color: selected ? 'var(--accent)' : 'var(--ink-muted)' }} />
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 999,
                    background: 'var(--accent)',
                    color: 'var(--accent-ink)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Check size={11} strokeWidth={3} />
                </motion.span>
              )}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{type.label}</p>
              <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.4 }}>{type.desc}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
