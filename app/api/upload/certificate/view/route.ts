import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

// GET /api/upload/certificate/view?key=certificates/uuid-name.pdf
// Generates a 1-hour presigned URL and redirects to it.
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')

  if (!key || !key.startsWith('certificates/')) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }

  const client = getR2Client()
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME

  if (!client || !bucket) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 503 })
  }

  const signed = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }, // 1 hour
  )

  return NextResponse.redirect(signed)
}
