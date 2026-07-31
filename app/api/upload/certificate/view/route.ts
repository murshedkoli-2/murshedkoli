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
// Redirects to a 1-hour presigned URL — the browser fetches from R2 directly.
//
// GET …&stream=1 proxies the bytes through this route instead. The admin needs
// that to read a stored PDF with fetch() when regenerating a card preview: the
// app's CSP sets `connect-src 'self'`, so a cross-origin R2 request is blocked.
// Rendering <img>/<a> keeps using the redirect, which stays CDN-efficient.
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')

  if (!key || !key.startsWith('certificates/')) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }
  // Defence in depth: the prefix check above already blocks traversal, but keys
  // are user-influenced (upload filenames) so reject any path games outright.
  if (key.includes('..')) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }

  const client = getR2Client()
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME

  if (!client || !bucket) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 503 })
  }

  if (request.nextUrl.searchParams.get('stream') === '1') {
    const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    if (!object.Body) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return new NextResponse(object.Body.transformToWebStream(), {
      headers: {
        'Content-Type': object.ContentType ?? 'application/octet-stream',
        'Cache-Control': 'private, max-age=300',
      },
    })
  }

  const signed = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }, // 1 hour
  )

  return NextResponse.redirect(signed)
}
