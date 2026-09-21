import { NextRequest } from 'next/server'
import { handlers } from '@/lib/content/experience'
type Context = { params: Promise<{ id: string }> }
export async function PUT(request: NextRequest, context: Context) { return handlers.PUT(request, context) }
export async function DELETE(request: NextRequest, context: Context) { return handlers.DELETE(request, context) }
