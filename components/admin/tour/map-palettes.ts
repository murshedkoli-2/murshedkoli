export type PaletteKey = 'forest' | 'night' | 'delta'

export interface MapPalette {
  label: string
  bg: string
  ink: string
  muted: string
  land: string
  fill: string
  fillHover: string
  labelOnFill: string
}

export const MAP_PALETTES: Record<PaletteKey, MapPalette> = {
  forest: { label: 'Forest', bg: '#f6f1e4', ink: '#1f2a1f', muted: '#6c6a5c', land: '#e3dbc6', fill: '#1d6b46', fillHover: '#2b8a5c', labelOnFill: '#ffffff' },
  night: { label: 'Night', bg: '#10141c', ink: '#f2efe6', muted: '#9aa0ab', land: '#222a37', fill: '#e2a03f', fillHover: '#f1b65b', labelOnFill: '#10141c' },
  delta: { label: 'Delta', bg: '#eef4f7', ink: '#13303f', muted: '#5b7380', land: '#d3e1e9', fill: '#1f6f9c', fillHover: '#2f8bbf', labelOnFill: '#ffffff' },
}

/** CSS custom properties consumed by .trv-poster in tour.css. */
export function paletteVars(p: MapPalette): Record<string, string> {
  return {
    '--p-bg': p.bg, '--p-ink': p.ink, '--p-muted': p.muted, '--p-land': p.land,
    '--p-stroke': p.bg, '--p-fill': p.fill, '--p-fill-hover': p.fillHover, '--p-label-on-fill': p.labelOnFill,
  }
}
