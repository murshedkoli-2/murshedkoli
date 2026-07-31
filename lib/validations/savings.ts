import { z } from 'zod'

export const savingsCreateSchema = z.object({
  name: z.string().min(1).max(160),
  bank: z.string().max(160).optional().nullable(),
  accountNo: z.string().max(80).optional().nullable(),
  type: z.string().max(80).optional().nullable(),
  currency: z.string().min(1).max(10).default('BDT'),
  amount: z.number().min(0).default(0),
  notes: z.string().max(600).optional().nullable(),
})

export const savingsUpdateSchema = savingsCreateSchema.partial()

export type SavingsCreate = z.infer<typeof savingsCreateSchema>
export type SavingsUpdate = z.infer<typeof savingsUpdateSchema>
