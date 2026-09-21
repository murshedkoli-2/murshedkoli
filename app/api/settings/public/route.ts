import { NextResponse } from 'next/server'
import { getSettingsMap } from '@/lib/site-data'

export async function GET() {
  return NextResponse.json(await getSettingsMap())
}
