interface TechTagProps {
  label: string
}

/** Small pill for a technology or category label. */
export function TechTag({ label }: TechTagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 11px',
        borderRadius: 999,
        background: 'var(--surface-2)',
        color: 'var(--ink-muted)',
        border: '1px solid var(--line)',
        fontSize: '0.8rem',
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
