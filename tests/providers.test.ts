import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ settings: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ prisma: { settings: { findUnique: mocks.settings } } }))
import { generateUnifiedAICompletion } from '@/lib/ai/nvidia-nim'
beforeEach(() => {
  mocks.settings.mockResolvedValue(null)
  for (const key of ['NVIDIA_API_KEY', 'NVIDIA_NIM_API_KEY', 'GOOGLE_AI_API_KEY', 'OPENROUTER_API_KEY']) vi.stubEnv(key, '')
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })
it('returns an explicit unavailable error without configured providers', async () => {
  await expect(generateUnifiedAICompletion({ prompt: 'Evaluate JSON score' })).rejects.toMatchObject({ status: 503 })
})
it('applies a timeout signal and output budget to the last fallback provider', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-placeholder')
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'Answer' } }] }), { status: 200 }))
  vi.stubGlobal('fetch', fetcher)
  expect((await generateUnifiedAICompletion({ prompt: 'Hello', maxTokens: 100 })).text).toBe('Answer')
  const options = fetcher.mock.calls[0][1]
  expect(options.signal).toBeInstanceOf(AbortSignal)
  expect(JSON.parse(options.body).max_tokens).toBe(100)
})
it('does not return a synthetic answer after provider rejection', async () => {
  vi.stubEnv('OPENROUTER_API_KEY', 'test-placeholder')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unavailable', { status: 503 })))
  await expect(generateUnifiedAICompletion({ prompt: 'Evaluate JSON score' })).rejects.toMatchObject({ status: 503 })
})
