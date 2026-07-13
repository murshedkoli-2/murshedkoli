import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Blueprint design-system primitives.
 * Server components only — no client state. Styling comes from the
 * `.bp-*` classes defined in globals.css (scoped under `.blueprint-page`).
 */

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
}

export function Container({ children, className = '', as = 'div' }: ContainerProps) {
  const Tag = as
  return <Tag className={`bp-container ${className}`}>{children}</Tag>
}

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  id?: string
  className?: string
}

/** "// EYEBROW" mono amber label above an Archivo heading. */
export function SectionHeading({ eyebrow, title, id, className = '' }: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="bp-eyebrow">// {eyebrow}</p>
      <h2 id={id} className="bp-h2" style={{ marginTop: 14 }}>
        {title}
      </h2>
    </div>
  )
}

interface MonoLabelProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MonoLabel({ children, className = '', style }: MonoLabelProps) {
  return (
    <span className={`bp-mono ${className}`} style={style}>
      {children}
    </span>
  )
}

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: ButtonVariant
  download?: string | boolean
  external?: boolean
  className?: string
  ariaLabel?: string
}

/** IBM Plex Mono uppercase button rendered as a link. */
export function Button({
  children,
  href,
  variant = 'primary',
  download,
  external,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const classes = `bp-btn ${variant === 'primary' ? 'bp-btn-primary' : 'bp-btn-ghost'} ${className}`

  if (!href) {
    return (
      <span className={classes} aria-label={ariaLabel}>
        {children}
      </span>
    )
  }

  // Downloads and external links bypass the client router.
  if (download || external || href.startsWith('http')) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        download={download === true ? '' : download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}
