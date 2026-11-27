'use client'

import type { ReactNode } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

interface ToolbarProps {
  query: string
  onQuery: (query: string) => void
  placeholder?: string
  filters?: FilterOption[]
  filter?: string
  onFilter?: (value: string) => void
  /** Unique per page so the sliding chip indicator doesn't jump between toolbars. */
  id: string
  end?: ReactNode
}

/** Search box plus segmented filter chips with a sliding indicator. */
export function Toolbar({ query, onQuery, placeholder = 'Search…', filters, filter, onFilter, id, end }: ToolbarProps) {
  return (
    <div className="kit-toolbar">
      <label className="kit-search">
        <Search size={16} aria-hidden="true" />
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
        {query && (
          <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </label>

      {filters && filters.length > 1 && onFilter && (
        <LayoutGroup id={`kit-filter-${id}`}>
          <div className="kit-segments" role="tablist" aria-label="Filter">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                className="kit-segment"
                onClick={() => onFilter(f.value)}
              >
                {filter === f.value && <motion.span layoutId="kit-seg" className="kit-segment-bg" />}
                <span className="kit-segment-text">
                  {f.label}
                  {f.count !== undefined && <sup>{f.count}</sup>}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      )}

      {end ? <div className="kit-toolbar-end">{end}</div> : null}
    </div>
  )
}
