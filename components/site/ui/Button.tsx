'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost'
type Size = 'md' | 'lg'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  style?: React.CSSProperties
}

interface LinkButtonProps extends CommonProps {
  href: string
  external?: boolean
  onClick?: never
  type?: never
}

interface ActionButtonProps extends CommonProps {
  href?: undefined
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

type ButtonProps = LinkButtonProps | ActionButtonProps

function styleFor(variant: Variant, size: Size): React.CSSProperties {
  const pad = size === 'lg' ? '14px 24px' : '11px 18px'
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    padding: pad,
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: size === 'lg' ? '0.9rem' : '0.82rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    lineHeight: 1,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background 200ms var(--ease), border-color 200ms var(--ease), color 200ms var(--ease)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }
  if (variant === 'primary') {
    return { ...base, background: 'var(--accent)', color: 'var(--accent-ink)' }
  }
  return { ...base, background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--line-strong)' }
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className } = props
  const reduce = useReducedMotion()
  const style = { ...styleFor(variant, size), ...props.style }
  const hover = reduce ? undefined : { y: -2, boxShadow: 'var(--shadow-md)' }
  const tap = reduce ? undefined : { y: 0, scale: 0.98 }

  if (props.href !== undefined) {
    const external = props.external
    return (
      <motion.span whileHover={hover} whileTap={tap} style={{ display: 'inline-flex' }}>
        <Link
          href={props.href}
          className={className}
          style={style}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </Link>
      </motion.span>
    )
  }

  return (
    <motion.button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      style={{ ...style, opacity: props.disabled ? 0.6 : 1 }}
      whileHover={props.disabled ? undefined : hover}
      whileTap={props.disabled ? undefined : tap}
    >
      {children}
    </motion.button>
  )
}
