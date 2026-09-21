import { requireAdmin } from '@/lib/auth/require-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
    try {
        const formData = await request.formData()
        const file = formData.get('file') as unknown as File

        if (!(file instanceof File)) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
        }

        if (file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            return NextResponse.json({ error: 'Upload a JPEG, PNG, WebP, or GIF up to 8 MB.' }, { status: 400 })
        }
        const apiKey = process.env.IMGBB_API_KEY
        if (!apiKey) {
            return NextResponse.json({ success: false, message: 'ImgBB API key not configured' }, { status: 500 })
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')

        const imgBbFormData = new FormData()
        imgBbFormData.append('image', base64Image)

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            signal: AbortSignal.timeout(15000),
            method: 'POST',
            body: imgBbFormData,
        })

        const data = await response.json()

        if (data.success) {
            return NextResponse.json({
                success: true,
                url: data.data.url,
                message: 'File uploaded successfully'
            })
        } else {
            console.error('ImgBB Error:', data)
            return NextResponse.json({ success: false, message: 'Upload failed: ' + (data.error?.message || 'Unknown error') }, { status: 500 })
        }

    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
    }
}
