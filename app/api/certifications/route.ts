import { NextRequest } from 'next/server'
import { handlers } from '@/lib/content/certifications'
export const GET = handlers.GET
export const POST = handlers.POST
export async function PUT(request: NextRequest) { return handlers.PUT(request) }
export async function DELETE(request: NextRequest) { return handlers.DELETE(request) }
