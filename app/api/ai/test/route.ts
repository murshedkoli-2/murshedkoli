import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { testAIConnection } from '@/lib/ai/nvidia-nim'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { apiKey, model } = await req.json().catch(() => ({}))
    const result = await testAIConnection(apiKey, model)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Diagnostic test failed' },
      { status: 500 }
    )
  }
}
