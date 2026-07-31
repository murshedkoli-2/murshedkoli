import { z } from 'zod'

export const tourCreateSchema = z.object({
  name: z.string().min(1).max(160),
  region: z.enum(['bangladesh', 'international']).default('bangladesh'),
  country: z.string().max(120).optional().nullable(),
  notes: z.string().max(600).optional().nullable(),
  visited: z.boolean().default(false),
  visitedAt: z.coerce.date().optional().nullable(),
  order: z.number().int().min(0).default(0),
})

export const tourUpdateSchema = tourCreateSchema.partial()

export type TourCreate = z.infer<typeof tourCreateSchema>
export type TourUpdate = z.infer<typeof tourUpdateSchema>
