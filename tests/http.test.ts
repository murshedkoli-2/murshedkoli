import { expect, it } from 'vitest'
import { readJson } from '@/lib/http'
import { skillSchema, suppliedFields } from '@/lib/validations/content'

it('rejects oversized streamed JSON without relying on Content-Length', async () => {
  const request = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ text: 'a'.repeat(100) }) })
  await expect(readJson(request, 32)).rejects.toMatchObject({ status: 413 })
})
it('reports malformed JSON as a client error', async () => {
  await expect(readJson(new Request('http://localhost', { method: 'POST', body: '{' }))).rejects.toMatchObject({ status: 400 })
})
it('keeps zero and false values without injecting defaults during a partial edit', () => {
  const input = { proficiency: 0, isEnabled: false }
  expect(suppliedFields(input, skillSchema.partial().parse(input))).toEqual(input)
})
