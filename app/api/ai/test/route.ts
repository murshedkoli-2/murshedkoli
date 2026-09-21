import { z } from 'zod'
import { readAIRequest } from '@/lib/ai/request'
import { apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { testAIConnection } from '@/lib/ai/nvidia-nim'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { apiKey, model } = z.object({ apiKey: z.string().max(2000).optional(), model: z.string().max(200).optional() }).parse(await readAIRequest(req, auth.sub))
    const result = await testAIConnection(apiKey, model)
    return NextResponse.json(result)
  } catch (error) { return apiError(error) }
}
