'use client'

import { useRef, useState } from 'react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import type { FieldGroupProps, MediaValue } from './types'

/** Uploads one file to /api/upload and hands back the stored URL. */
function GalleryUploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) onUpload(data.url)
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="cert-drop-zone"
        style={{ minHeight: 80, padding: 20, fontSize: 12.5, color: 'var(--ink-muted)' }}
      >
        {uploading ? 'Uploading…' : '+ Add gallery image'}
      </button>
    </>
  )
}

/** Cover image, logo, and the gallery grid. */
export function MediaFields({ value, onChange }: FieldGroupProps<MediaValue>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ImageUpload
          label="Cover Image"
          value={value.coverImage}
          onChange={(url) => onChange({ coverImage: url })}
          previewSize="large"
        />
        <ImageUpload
          label="Logo"
          value={value.logoUrl}
          onChange={(url) => onChange({ logoUrl: url })}
          previewSize="medium"
        />
      </div>

      <div>
        <span className="pe-label">Gallery Images</span>
        {value.gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {value.gallery.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative group aspect-video overflow-hidden"
                style={{ border: '1px solid var(--line)', borderRadius: 6, background: 'var(--surface-2)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button
                  type="button"
                  onClick={() => onChange({ gallery: value.gallery.filter((_, idx) => idx !== i) })}
                  aria-label={`Remove gallery image ${i + 1}`}
                  className="absolute top-1.5 right-1.5 w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderRadius: 999, background: 'var(--ink)', color: 'var(--canvas)' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <GalleryUploadButton onUpload={(url) => onChange({ gallery: [...value.gallery, url] })} />
      </div>
    </div>
  )
}
