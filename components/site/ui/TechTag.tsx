interface TechTagProps {
  label: string
}

/** Small monospace chip for a technology or category label. */
export function TechTag({ label }: TechTagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 9px',
        borderRadius: 5,
        background: 'var(--surface-2)',
        color: 'var(--ink-muted)',
        border: '1px solid var(--line)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.74rem',
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
