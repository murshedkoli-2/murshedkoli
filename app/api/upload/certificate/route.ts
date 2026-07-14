import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_PDF_TYPE = 'application/pdf'
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  if (!accountId || !accessKeyId || !secretAccessKey) return null
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

async function uploadImageToImgBB(base64: string, apiKey: string): Promise<string> {
  const form = new FormData()
  form.append('image', base64)
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error?.message ?? 'ImgBB upload failed')
  return data.data.url as string
}

// Returns the object key (e.g. "certificates/uuid-name.pdf") stored in DB.
// Presigned URLs are generated on demand via /api/upload/certificate/view
async function uploadToR2(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const client = getR2Client()
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME
  if (!client || !bucket) throw new Error('Cloudflare R2 not configured')

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `certificates/${randomUUID()}-${safeFileName}`

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  )

  return key
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ success: false, message: 'File exceeds 10 MB limit' }, { status: 400 })
    }

    const mimeType = file.type
    const isPdf = mimeType === ALLOWED_PDF_TYPE
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { success: false, message: 'Only PDF and image files (JPEG, PNG, WebP, GIF) are accepted' },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileType = isPdf ? 'pdf' : 'image'

    const r2Ready =
      process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME

    if (isPdf) {
      if (!r2Ready) {
        return NextResponse.json(
          { success: false, message: 'PDF upload requires Cloudflare R2 configuration' },
          { status: 503 },
        )
      }
      const key = await uploadToR2(buffer, mimeType, file.name || 'certificate.pdf')
      // Return key — viewer uses /api/upload/certificate/view?key=... for presigned URL
      return NextResponse.json({ success: true, url: key, fileType })
    }

    // Images: prefer R2, fall back to ImgBB
    if (r2Ready) {
      const key = await uploadToR2(buffer, mimeType, file.name || 'certificate.jpg')
      return NextResponse.json({ success: true, url: key, fileType })
    }

    const imgBbKey = process.env.IMGBB_API_KEY
    if (!imgBbKey) {
      return NextResponse.json({ success: false, message: 'No upload service configured' }, { status: 503 })
    }
    const url = await uploadImageToImgBB(buffer.toString('base64'), imgBbKey)
    return NextResponse.json({ success: true, url, fileType })
  } catch (error) {
    console.error('Certificate file upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
