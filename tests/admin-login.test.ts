import { describe, expect, test } from 'vitest'
import { greetingFor, loginErrorMessage, sessionLengthLabel } from '@/lib/admin-login'

describe('greetingFor', () => {
  test('greets by time of day', () => {
    expect(greetingFor(6)).toBe('Good morning')
    expect(greetingFor(13)).toBe('Good afternoon')
    expect(greetingFor(19)).toBe('Good evening')
  })

  test('calls the small hours late-night work', () => {
    expect(greetingFor(23)).toBe('Working late')
    expect(greetingFor(2)).toBe('Working late')
  })
})

describe('loginErrorMessage', () => {
  test('prefers the message the server sent', () => {
    expect(loginErrorMessage(500, 'Admin credentials or session secret are not configured.')).toBe(
      'Admin credentials or session secret are not configured.',
    )
  })

  test('falls back by status when the server sent nothing', () => {
    expect(loginErrorMessage(401)).toBe('Invalid username or password.')
    expect(loginErrorMessage(429)).toBe('Too many attempts. Try again later.')
    expect(loginErrorMessage(503)).toBe('Sign-in failed. Please try again.')
  })

  test('ignores a blank server message', () => {
    expect(loginErrorMessage(401, '   ')).toBe('Invalid username or password.')
  })
})

describe('sessionLengthLabel', () => {
  test('formats whole hours', () => {
    expect(sessionLengthLabel(60 * 60 * 8)).toBe('8 hours')
    expect(sessionLengthLabel(60 * 60)).toBe('1 hour')
  })

  test('falls back to minutes below an hour', () => {
    expect(sessionLengthLabel(30 * 60)).toBe('30 minutes')
  })
})
