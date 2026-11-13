import { BD_DISTRICTS } from '@/lib/data/bd-districts'
import { BD_DISTRICT_SHAPES, BD_MAP_VIEWBOX } from '@/lib/data/bd-district-paths'
import type { MapPalette } from './map-palettes'

const EXPORT_WIDTH = 1200
const HEADER = 190
const FOOTER = 70
const SIDE = 70

interface ExportOptions {
  palette: MapPalette
  visited: ReadonlySet<string>
  title: string
  owner: string
  showLabels: boolean
}

const escapeXml = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)

/** Standalone SVG of the map with concrete colors (no CSS variables). */
function mapSvg({ palette, visited, showLabels }: ExportOptions): { svg: string; width: number; height: number } {
  const [, , vw, vh] = BD_MAP_VIEWBOX.split(' ').map(Number)
  const paths = BD_DISTRICTS.map((d) => {
    const shape = BD_DISTRICT_SHAPES[d.id]
    const fill = visited.has(d.id) ? palette.fill : palette.land
    return `<path d="${shape.d}" fill="${fill}" stroke="${palette.bg}" stroke-width="0.9" stroke-linejoin="round"/>`
  }).join('')
  const labels = showLabels ? BD_DISTRICTS.map((d) => {
    const { cx, cy } = BD_DISTRICT_SHAPES[d.id]
    const on = visited.has(d.id)
    return `<text x="${cx}" y="${cy}" font-family="Inter, system-ui, sans-serif" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="${on ? palette.fill : palette.land}" stroke-width="2" fill="${on ? palette.labelOnFill : palette.ink}">${escapeXml(d.name)}</text>`
  }).join('') : ''
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BD_MAP_VIEWBOX}" width="${vw}" height="${vh}">${paths}${labels}</svg>`,
    width: vw,
    height: vh,
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Map image failed to render'))
    img.src = src
  })
}

/** Renders the travel map poster to a PNG and triggers a download. */
export async function downloadMapPng(options: ExportOptions): Promise<void> {
  const { palette, visited, title, owner } = options
  const { svg, width, height } = mapSvg(options)
  const mapWidth = EXPORT_WIDTH - SIDE * 2
  const mapHeight = Math.round((height / width) * mapWidth)

  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH
  canvas.height = HEADER + mapHeight + FOOTER
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')

  ctx.fillStyle = palette.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = palette.muted
  ctx.font = '500 20px ui-monospace, monospace'
  ctx.fillText((owner ? `${owner} · ` : '') + 'TRAVEL MAP', SIDE, 78)
  ctx.fillStyle = palette.ink
  ctx.font = '700 54px system-ui, sans-serif'
  ctx.fillText(title || 'My Bangladesh', SIDE, 140)

  ctx.textAlign = 'right'
  ctx.fillStyle = palette.fill
  ctx.font = '700 96px system-ui, sans-serif'
  ctx.fillText(String(visited.size), EXPORT_WIDTH - SIDE - 70, 145)
  ctx.fillStyle = palette.muted
  ctx.font = '500 28px ui-monospace, monospace'
  ctx.fillText('/64', EXPORT_WIDTH - SIDE, 145)
  ctx.textAlign = 'left'

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = await loadImage(url)
    ctx.drawImage(img, SIDE, HEADER, mapWidth, mapHeight)
  } finally {
    URL.revokeObjectURL(url)
  }

  ctx.fillStyle = palette.muted
  ctx.font = '500 16px ui-monospace, monospace'
  ctx.fillText(`${visited.size} of 64 districts · ${Math.round((visited.size / 64) * 100)}%`, SIDE, canvas.height - 32)
  ctx.textAlign = 'right'
  ctx.fillText('Boundaries: geoBoundaries (BBS/OCHA), CC BY 3.0 IGO', EXPORT_WIDTH - SIDE, canvas.height - 32)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Could not create the PNG')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `bangladesh-travel-map-${visited.size}-of-64.png`
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}
