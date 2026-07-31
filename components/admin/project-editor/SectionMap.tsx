'use client'

import { ArrowRight } from 'lucide-react'
import { SECTIONS, summariseSection, type SectionId } from './sections'

interface SectionMapProps {
  project: Record<string, unknown>
  onOpen: (id: SectionId) => void
}

/**
 * The edit landing screen: a map of what this project has, not a form.
 *
 * Every card states what is already filled in, so you can go straight to the
 * one thing you came to change instead of scrolling past the rest.
 */
export function SectionMap({ project, onOpen }: SectionMapProps) {
  return (
    <div className="map-grid">
      {SECTIONS.map((section) => {
        const { meta, filled, preview } = summariseSection(section.id, project)
        const Icon = section.icon

        return (
          <button key={section.id} type="button" onClick={() => onOpen(section.id)} className="map-card">
            <span className="map-card-top">
              <Icon size={15} style={{ color: filled ? 'var(--accent)' : 'var(--ink-muted)' }} />
              <span className="map-card-title">{section.label}</span>
              <ArrowRight size={15} className="map-card-arrow" />
            </span>
            <span className={`map-card-meta ${filled ? 'filled' : ''}`}>{meta}</span>
            <span className="map-card-preview">{preview}</span>
          </button>
        )
      })}
    </div>
  )
}
