/** Pure helpers for the admin sign-in screen (unit-tested in node). */

export function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Working late'
}

const STATUS_FALLBACK: Record<number, string> = {
  401: 'Invalid username or password.',
  429: 'Too many attempts. Try again later.',
}

/** The server's own message when it gave one, otherwise a fallback for the status. */
export function loginErrorMessage(status: number, serverMessage?: string): string {
  const message = serverMessage?.trim()
  if (message) return message
  return STATUS_FALLBACK[status] ?? 'Sign-in failed. Please try again.'
}

export function sessionLengthLabel(seconds: number): string {
  const hours = seconds / 3600
  if (hours >= 1 && Number.isInteger(hours)) return `${hours} hour${hours === 1 ? '' : 's'}`
  const minutes = Math.round(seconds / 60)
  return `${minutes} minute${minutes === 1 ? '' : 's'}`
}
