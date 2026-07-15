import { z } from 'zod'

export const serviceCreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().max(80).optional().nullable(),
  order: z.number().int().min(0).default(0),
  isEnabled: z.boolean().default(true),
})

export const serviceUpdateSchema = serviceCreateSchema.partial()

export type ServiceCreate = z.infer<typeof serviceCreateSchema>
export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>
