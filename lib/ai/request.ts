import { z } from 'zod'
import { readJson, HttpError } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'

export async function readAIRequest(request: Request, username: string) {
  const limit = await rateLimit('ai:' + username, 20, 60000)
  if (!limit.ok) throw new HttpError(429, 'Too many AI requests. Please try again shortly.')
  return readJson(request, 64 * 1024)
}

export const chatSchema = z.object({
  userQuery: z.string().trim().min(1).max(8000).optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']), content: z.string().min(1).max(8000),
  })).max(20).optional(),
  model: z.string().trim().min(1).max(200).regex(/^[a-zA-Z0-9_./:-]+$/).optional(),
}).refine((data) => data.userQuery || data.messages?.length, 'Message content is required')

export const evaluationRequestSchema = z.object({
  stepId: z.string().regex(/^[a-f0-9]{24}$/i),
  taskId: z.string().min(1).max(200),
  userSubmission: z.object({
    answerText: z.string().max(16000).optional().default(''),
    codeSnippet: z.string().max(32000).optional().default(''),
    repoUrl: z.union([z.url({ protocol: /^https?$/ }), z.literal('')]).optional().default(''),
  }).refine((s) => s.answerText.trim() || s.codeSnippet.trim(), 'Paste an answer or code to evaluate; repository URLs alone cannot be inspected.'),
})

const evaluationSchema = z.object({
  score: z.number().finite().min(0).max(100),
  summary: z.string().min(1).max(4000),
  strengths: z.array(z.string().max(2000)).max(20),
  improvements: z.array(z.string().max(2000)).max(20),
  seniorTips: z.string().max(4000),
})

export function parseEvaluation(text: string) {
  const data = evaluationSchema.parse(JSON.parse(text.replace(/^\x60\x60\x60json\s*/i, '').replace(/\s*\x60\x60\x60$/i, '').trim()))
  return { ...data, passed: data.score >= 70 }
}
