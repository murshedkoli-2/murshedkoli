import { z } from 'zod'
import { BD_DISTRICT_IDS } from '@/lib/data/bd-districts'
import { TRIP_NOTES_MAX } from '@/lib/tour/catalog'

const districtId = z.string().refine((id) => BD_DISTRICT_IDS.has(id), 'Unknown district')

export const tourCreateSchema = z.object({
  name: z.string().min(1).max(160),
  region: z.enum(['bangladesh', 'international']).default('bangladesh'),
  country: z.string().max(120).optional().nullable(),
  district: districtId.optional().nullable(),
  /** Catalogue link: a Bangladesh spot id or an ISO country code. Null for custom trips. */
  catalogId: z.string().max(120).regex(/^[A-Za-z0-9-]+$/).optional().nullable(),
  notes: z.string().max(TRIP_NOTES_MAX).optional().nullable(),
  visited: z.boolean().default(false),
  visitedAt: z.coerce.date().optional().nullable(),
  order: z.number().int().min(0).default(0),
})

export const tourUpdateSchema = tourCreateSchema.partial()

/** Full replacement of the ticked districts on the travel map. */
export const visitedDistrictsSchema = z.object({
  districtIds: z.array(districtId).max(64).transform((ids) => [...new Set(ids)]),
})

export type TourCreate = z.infer<typeof tourCreateSchema>
export type TourUpdate = z.infer<typeof tourUpdateSchema>
