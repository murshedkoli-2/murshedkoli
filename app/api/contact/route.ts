import { readJson, apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { rateLimit, clientIp } from '@/lib/rate-limit'

// Reading messages is admin-only (contains submitters' personal data).
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(5000),
})

// Public endpoint (contact form). Rate-limited + validated.
export async function POST(request: NextRequest) {
  try {
  const ip = clientIp(request.headers)
  const { ok } = await rateLimit(`contact:${ip}`, 5, 60_000)
  if (!ok) {
    return NextResponse.json({ error: 'Too many messages. Please try again shortly.' }, { status: 429 })
  }

    const body = await readJson(request, 16384)
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? undefined,
        message: parsed.data.message,
        status: 'unread',
      },
    })

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (error) {
    return apiError(error)
  }
}
