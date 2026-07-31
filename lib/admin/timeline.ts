/** Shared types and date formatting for the Experience and Education managers. */

export interface Experience {
  id?: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  order: number
}

export interface Education {
  id?: string
  institution: string
  degree: string
  field?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  order: number
}

/** Normalises an API date into the yyyy-mm-dd an <input type="date"> needs. */
export function toDateInput(value?: string): string {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().split('T')[0]
}

export function period(start?: string, end?: string, current?: boolean): string {
  const format = (v: string) =>
    new Date(v).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const from = start ? format(start) : '—'
  const to = current ? 'Present' : end ? format(end) : '—'
  return `${from} — ${to}`
}
