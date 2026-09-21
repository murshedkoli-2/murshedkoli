import { z } from 'zod'
const text = z.string().max(20000)
const status = z.enum(['todo', 'in_progress', 'completed'])
const link = z.union([z.url({ protocol: /^https?$/ }), z.literal('')]).nullish()
const task = z.object({
  id: z.string().min(1).max(200), title: z.string().min(1).max(500), description: text,
  estimatedMinutes: z.number().min(0).max(100000), status,
  completedAt: z.string().nullish(),
  exam: z.object({ prompt: text, rubric: z.array(text).max(100), referenceSolution: text, testQuestions: z.array(text).max(100).optional() }),
  submission: z.object({ answerText: text, codeSnippet: z.string().max(32000).optional(), repoUrl: link, submittedAt: z.string().optional() }).optional(),
  evaluation: z.object({
    score: z.number().min(0).max(100), passed: z.boolean(), summary: text,
    strengths: z.array(text).max(100), improvements: z.array(text).max(100), seniorTips: text,
    evaluatedAt: z.string(), evaluator: z.enum(['ai', 'self']),
  }).optional(),
})
export const careerSchema = z.object({
  title: z.string().min(1).max(500), stage: z.string().max(500).optional(),
  stageNumber: z.number().int().min(1).max(100).optional(),
  stepNumber: z.number().int().min(1).max(10000).optional(),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'system-design', 'monetization']).optional(),
  description: text.min(1), keyConcepts: z.array(text).max(100).optional(),
  testQuestions: z.array(text).max(100).optional(), deliverable: text.min(1),
  deliverableUrl: link, notes: text.nullish(), tasks: z.array(task).max(100).optional(),
  order: z.number().int().min(0).max(10000).optional(), status: status.optional(),
})
export const careerSeedSchema = z.object({ action: z.literal('seed'), force: z.boolean().optional() })
