import { NextResponse } from 'next/server'
import { z } from 'zod'

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

/** Bound the actual stream, not just the caller-controlled Content-Length. */
export async function readJson(request: Request, maxBytes = 128 * 1024): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new HttpError(413, 'Request too large')
  const reader = request.body?.getReader()
  if (!reader) throw new HttpError(400, 'JSON body is required')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        throw new HttpError(413, 'Request too large')
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(400, 'Invalid JSON')
  } finally { reader.releaseLock() }
}

export function apiError(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
  if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input', details: error.flatten() }, { status: 400 })
  const code = (error as { code?: string })?.code
  if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (code === 'P2002') return NextResponse.json({ error: 'Record already exists' }, { status: 409 })
  console.error('API operation failed', error instanceof Error ? error.name : 'Unknown error')
  return NextResponse.json({ error: 'Operation failed. Please try again.' }, { status: 500 })
}
