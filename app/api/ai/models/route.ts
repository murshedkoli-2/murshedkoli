import { rateLimit } from '@/lib/rate-limit'
import { HttpError } from '@/lib/http'
import { z } from 'zod'
import { readAIRequest } from '@/lib/ai/request'
import { apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { fetchLiveNvidiaModels, getResolvedAIKeys } from '@/lib/ai/nvidia-nim'
import { requireAdmin } from '@/lib/auth/require-admin'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    if (!(await rateLimit('ai:' + auth.sub, 20, 60000)).ok) throw new HttpError(429, 'Too many AI requests')
    const { nvidiaKey } = await getResolvedAIKeys()
    const models = await fetchLiveNvidiaModels(nvidiaKey)
    return NextResponse.json({
      success: true,
      count: models.length,
      models,
    })
  } catch (error) { return apiError(error) }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = z.object({ apiKey: z.string().max(2000).optional(), model: z.string().max(200).optional() }).parse(await readAIRequest(req, auth.sub))
    const { nvidiaKey } = await getResolvedAIKeys()
    const keyToUse = body.apiKey || nvidiaKey

    const models = await fetchLiveNvidiaModels(keyToUse)

    return NextResponse.json({
      success: true,
      count: models.length,
      models,
    })
  } catch (error) { return apiError(error) }
}
