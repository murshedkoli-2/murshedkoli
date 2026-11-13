/**
 * Point-cloud shapes for the homepage 3D scene.
 *
 * Every shape is a flat [x, y, z, x, y, z, …] array that fits inside a unit
 * sphere, so the scene can morph between shapes by easing each coordinate.
 */

export type ShapeKey = 'sphere' | 'torus' | 'helix' | 'wave'

export interface ShapeOption {
  key: ShapeKey
  label: string
}

export const SHAPES: readonly ShapeOption[] = [
  { key: 'sphere', label: 'Sphere' },
  { key: 'torus', label: 'Torus' },
  { key: 'helix', label: 'Helix' },
  { key: 'wave', label: 'Wave' },
]

const TAU = Math.PI * 2
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

type PointFn = (index: number, count: number) => [number, number, number]

/** Even coverage of a sphere surface (Fibonacci lattice). */
const sphere: PointFn = (i, count) => {
  const y = 1 - (2 * (i + 0.5)) / count
  const radius = Math.sqrt(1 - y * y)
  const angle = i * GOLDEN_ANGLE
  return [Math.cos(angle) * radius * 0.92, y * 0.92, Math.sin(angle) * radius * 0.92]
}

const TORUS_RING = 0.62
const TORUS_TUBE = 0.26

const torus: PointFn = (i, count) => {
  const around = (i / count) * TAU
  const tube = i * GOLDEN_ANGLE
  const reach = TORUS_RING + TORUS_TUBE * Math.cos(tube)
  return [Math.cos(around) * reach, TORUS_TUBE * Math.sin(tube), Math.sin(around) * reach]
}

const HELIX_RADIUS = 0.36
const HELIX_TURNS = 2.5

/** Double helix: two strands, with every third point on a rung between them. */
const helix: PointFn = (i, count) => {
  const t = i / count
  const angle = t * TAU * HELIX_TURNS
  const y = (t - 0.5) * 1.7
  const slot = i % 3
  if (slot === 2) {
    const across = ((i * 7) % 11) / 10 - 0.5 // -0.5 … 0.5 along the rung
    return [Math.cos(angle) * HELIX_RADIUS * across * 2, y, Math.sin(angle) * HELIX_RADIUS * across * 2]
  }
  const side = slot === 0 ? 1 : -1
  return [Math.cos(angle) * HELIX_RADIUS * side, y, Math.sin(angle) * HELIX_RADIUS * side]
}

/** A rippling square sheet. */
const wave: PointFn = (i, count) => {
  const side = Math.ceil(Math.sqrt(count))
  const x = ((i % side) / (side - 1)) * 2 - 1
  const z = (Math.floor(i / side) / (side - 1)) * 2 - 1
  const y = 0.16 * Math.sin(x * 3.4) * Math.cos(z * 3.4)
  return [x * 0.66, y, z * 0.66]
}

const BUILDERS: Record<ShapeKey, PointFn> = { sphere, torus, helix, wave }

export function buildShape(key: ShapeKey, count: number): Float32Array {
  const points = new Float32Array(count * 3)
  const at = BUILDERS[key]
  for (let i = 0; i < count; i++) {
    const [x, y, z] = at(i, count)
    points[i * 3] = x
    points[i * 3 + 1] = y
    points[i * 3 + 2] = z
  }
  return points
}
