import { readJson, apiError } from '@/lib/http'
import { objectId } from '@/lib/validations/content'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const allowedStatuses = ['unread', 'read', 'replied'] as const

const updateStatus = async (request: NextRequest, id: string) => {
  const data = z.object({ status: z.enum(allowedStatuses) }).parse(await readJson(request, 4096))
  const nextStatus = data?.status

  if (!allowedStatuses.includes(nextStatus)) {
    return NextResponse.json(
      { error: 'Invalid status value' },
      { status: 400 }
    )
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { status: nextStatus }
  })

  return NextResponse.json(contact)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const id = objectId.parse((await params).id)
    return await updateStatus(request, id)
  } catch (error) { return apiError(error) }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const id = objectId.parse((await params).id)
    return await updateStatus(request, id)
  } catch (error) { return apiError(error) }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const id = objectId.parse((await params).id)
    await prisma.contact.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) { return apiError(error) }
}
