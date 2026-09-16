import { NextRequest, NextResponse } from 'next/server'
import { fetchLiveNvidiaModels, getResolvedAIKeys } from '@/lib/ai/nvidia-nim'
import { requireAdmin } from '@/lib/auth/require-admin'

export async function GET(req: NextRequest) {
  try {
    const { nvidiaKey } = await getResolvedAIKeys()
    const models = await fetchLiveNvidiaModels(nvidiaKey)
    return NextResponse.json({
      success: true,
      count: models.length,
      models,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Could not fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json().catch(() => ({}))
    const { nvidiaKey } = await getResolvedAIKeys()
    const keyToUse = body.apiKey || nvidiaKey

    const models = await fetchLiveNvidiaModels(keyToUse)

    return NextResponse.json({
      success: true,
      count: models.length,
      models,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Could not fetch models' },
      { status: 500 }
    )
  }
}
