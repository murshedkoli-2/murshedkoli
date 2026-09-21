import { z } from 'zod'

export const objectId = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid ID')
const text = z.string().trim().min(1).max(500)
const optionalText = z.string().max(20000).nullish()
const asset = z.string().max(2000).refine((v) => !v || /^https?:\/\//.test(v) || /^\/(?!\/)/.test(v), 'Use an HTTP(S) URL or local path').nullish()
const link = z.union([z.url({ protocol: /^https?$/ }), z.literal('')]).nullish()
const date = z.coerce.date()
const endDate = z.preprocess((v) => v === '' ? null : v, date.nullish())

export const skillSchema = z.object({
  name: text, category: text, proficiency: z.number().int().min(0).max(100).default(50),
  icon: optionalText, order: z.number().int().default(0), isEnabled: z.boolean().default(true),
})
export const experienceSchema = z.object({
  company: text, position: text, description: z.string().max(20000),
  startDate: date, endDate, current: z.boolean().default(false),
  location: optionalText, order: z.number().int().default(0),
})
export const educationSchema = z.object({
  institution: text, degree: text, field: optionalText, description: optionalText,
  startDate: date, endDate, current: z.boolean().default(false),
  gpa: optionalText, order: z.number().int().default(0),
})
export const certificationSchema = z.object({
  name: text, issuer: text, date, url: link, fileUrl: z.union([asset, z.string().regex(/^certificates\/[a-zA-Z0-9_. -]+$/)]),
  fileType: z.enum(['image', 'pdf']).nullish(), thumbnailUrl: z.union([asset, z.string().regex(/^certificates\/[a-zA-Z0-9_. -]+$/)]),
  description: optionalText, order: z.number().int().default(0),
})
export const profileSchema = z.object({
  name: text, title: text, description: z.string().max(20000), email: z.email().max(200),
  phone: optionalText, location: optionalText, avatar: asset, heroImage: asset,
  heroPortrait: asset, storyImage: asset, resume: asset,
  socialLinks: z.object({
    github: link, linkedin: link, twitter: link, website: link, facebook: link, youtube: link,
  }).optional(),
})

/** Defaults apply on create only; absent fields on a patch must stay absent. */
export function suppliedFields<T extends Record<string, unknown>>(input: Record<string, unknown>, parsed: T): Partial<T> {
  return Object.fromEntries(Object.entries(parsed).filter(([key]) => Object.hasOwn(input, key))) as Partial<T>
}
