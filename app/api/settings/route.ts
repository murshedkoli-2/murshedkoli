import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { PUBLIC_SETTING_KEYS, SECRET_SETTING_KEYS, SECRET_MASK, isSecretSetting, maskSettings } from '@/lib/settings'
import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { readJson, apiError } from '@/lib/http'

const settingSchema = z.object({
  key: z.enum([...PUBLIC_SETTING_KEYS, ...SECRET_SETTING_KEYS, 'nvidiaNimModel', 'maintenanceMode']),
  value: z.union([z.string().max(10000), z.boolean(), z.array(z.string().max(200)).max(100)]),
  description: z.string().max(1000).optional(),
}).superRefine(({ key, value }, ctx) => {
  const bool = ['availability', 'availableForWork', 'maintenanceMode'].includes(key)
  const valid = bool ? typeof value === 'boolean' : key === 'siteKeywords' ? typeof value === 'string' || Array.isArray(value) : typeof value === 'string'
  if (!valid) ctx.addIssue({ code: 'custom', path: ['value'], message: 'Invalid setting value type' })
})

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    return NextResponse.json(maskSettings(await prisma.settings.findMany()), { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiError(error) }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const data = settingSchema.parse(await readJson(request))
    // The mask keeps the stored key. An empty string explicitly clears it.
    if (isSecretSetting(data.key) && data.value === SECRET_MASK) return NextResponse.json({ ok: true })
    const setting = await prisma.settings.upsert({ where: { key: data.key }, update: data, create: data })
    invalidatePortfolio()
    return NextResponse.json(maskSettings([setting]))
  } catch (error) { return apiError(error) }
}
