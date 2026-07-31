export interface Certificate {
  id?: string
  name: string
  issuer: string
  date: string
  url?: string
  fileUrl?: string
  fileType?: string
  /** Page-1 raster of a PDF; absent for image uploads and older PDF records. */
  thumbnailUrl?: string
  description?: string
  order: number
}

/**
 * What a certificate card should display as its feature image, if anything.
 * Images are their own preview; PDFs need the generated thumbnail.
 */
export function previewImageUrl(c: Certificate): string | null {
  if (c.fileType !== 'pdf' && c.fileUrl) return fileViewUrl(c.fileUrl)
  if (c.thumbnailUrl) return fileViewUrl(c.thumbnailUrl)
  return null
}

/**
 * R2 keys (certificates/…) are served via a presigned URL; ImgBB direct URLs
 * pass through unchanged.
 */
export function fileViewUrl(fileUrl: string): string {
  if (fileUrl.startsWith('certificates/')) {
    return `/api/upload/certificate/view?key=${encodeURIComponent(fileUrl)}`
  }
  return fileUrl
}

export function emptyCert(order: number): Certificate {
  return {
    name: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    url: '',
    description: '',
    order,
  }
}

/** Normalises whatever the API returns into the yyyy-mm-dd an <input type="date"> needs. */
export function toDateInput(value: string): string {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().split('T')[0]
}
