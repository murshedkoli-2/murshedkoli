'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import {
  emptyCert,
  fileViewUrl,
  toDateInput,
  type Certificate,
} from '@/lib/admin/certificates'

type UploadState = 'idle' | 'uploading' | 'rendering' | 'done' | 'error'

interface CertificateFormProps {
  /** Omitted when creating. */
  certificateId?: string
}

/**
 * Full-page certificate editor, shared by /new and /[id].
 *
 * The list endpoint has no GET-by-id, so edit mode loads the collection and
 * picks its record out of it — the same request also yields the next order
 * value used when creating.
 */
export function CertificateForm({ certificateId }: CertificateFormProps) {
  const ready = useAdminGuard()
  const router = useRouter()

  const [cert, setCert] = useState<Certificate | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(certificateId)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/certifications')
      if (!res.ok) throw new Error('request failed')
      const all: Certificate[] = await res.json()

      if (certificateId) {
        const found = all.find((c) => c.id === certificateId)
        if (!found) { setNotFound(true); return }
        setCert({ ...found, date: toDateInput(found.date) })
        setUploadState(found.fileUrl ? 'done' : 'idle')
      } else {
        setCert(emptyCert(all.length))
      }
    } catch (error) {
      console.error('Certificate load failed:', error)
      toast.error('Could not load certificate.')
    } finally {
      setLoading(false)
    }
  }, [certificateId])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const patch = (changes: Partial<Certificate>) => {
    setCert((prev) => (prev ? { ...prev, ...changes } : prev))
    setDirty(true)
  }

  /** Uploads a blob through the certificate endpoint and returns its stored key. */
  const putFile = async (blob: Blob, filename: string): Promise<string | null> => {
    const form = new FormData()
    form.append('file', new File([blob], filename, { type: blob.type }))
    const res = await fetch('/api/upload/certificate', { method: 'POST', body: form })
    const data = await res.json()
    if (!data.success) throw new Error(data.message ?? 'Upload failed.')
    return data.url as string
  }

  /**
   * Rasterises page 1 and stores it alongside the PDF. A failure here is not
   * fatal — the certificate keeps its PDF and the card falls back to the plate.
   */
  const generateThumbnail = async (pdf: Blob): Promise<string | undefined> => {
    try {
      const { renderPdfFirstPage } = await import('@/lib/admin/pdf-thumbnail')
      const png = await renderPdfFirstPage(pdf)
      return (await putFile(png, 'preview.png')) ?? undefined
    } catch (error) {
      console.error('PDF preview generation failed:', error)
      toast.warning('Saved the PDF, but could not generate a preview image.')
      return undefined
    }
  }

  const uploadFile = async (file: File) => {
    setUploadState('uploading')
    try {
      const url = await putFile(file, file.name || 'certificate')
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'image'

      let thumbnailUrl: string | undefined
      if (fileType === 'pdf') {
        setUploadState('rendering')
        thumbnailUrl = await generateThumbnail(file)
      }

      patch({ fileUrl: url ?? undefined, fileType, thumbnailUrl })
      setUploadState('done')
      toast.success('File uploaded.')
    } catch (error) {
      setUploadState('error')
      toast.error(error instanceof Error ? error.message : 'Upload failed.')
    }
  }

  /** Backfill for PDFs stored before previews existed. */
  const regeneratePreview = async () => {
    if (!cert?.fileUrl) return
    setUploadState('rendering')
    try {
      // stream=1 keeps this same-origin; the default redirect to R2 would be
      // blocked by the CSP's `connect-src 'self'`.
      const res = await fetch(`${fileViewUrl(cert.fileUrl)}&stream=1`)
      if (!res.ok) throw new Error('Could not fetch the stored PDF.')
      const thumbnailUrl = await generateThumbnail(await res.blob())
      if (thumbnailUrl) {
        patch({ thumbnailUrl })
        toast.success('Preview generated — save to keep it.')
      }
    } catch (error) {
      console.error('Preview regeneration failed:', error)
      toast.error('Could not generate a preview.')
    } finally {
      setUploadState('done')
    }
  }

  const removeFile = () => {
    patch({ fileUrl: undefined, fileType: undefined, thumbnailUrl: undefined })
    setUploadState('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const goBack = async () => {
    if (dirty) {
      const ok = await confirmDialog({
        title: 'Discard unsaved changes?',
        description: 'This certificate has edits that have not been saved.',
        confirmLabel: 'Discard changes',
        cancelLabel: 'Keep editing',
        tone: 'danger',
      })
      if (!ok) return
    }
    setDirty(false)
    router.push('/admin/certificates')
  }

  const save = async () => {
    if (!cert) return
    if (!cert.name.trim() || !cert.issuer.trim()) {
      toast.error('Name and issuer are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/certifications', {
        method: cert.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cert),
      })
      if (res.ok) {
        setDirty(false)
        toast.success(cert.id ? 'Certificate updated.' : 'Certificate created.')
        router.push('/admin/certificates')
        router.refresh()
      } else {
        toast.error('Could not save certificate.')
      }
    } catch (error) {
      console.error('Cert save failed:', error)
      toast.error('Could not save certificate.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  const shellProps = {
    active: 'certificates' as const,
    title: isEdit ? 'Edit certificate' : 'New certificate',
    subtitle: isEdit ? cert?.name || undefined : 'Add a qualification to your portfolio',
  }

  if (notFound) {
    return (
      <AdminShell {...shellProps} title="Certificate not found">
        <div className="pe-empty">
          <p style={{ marginBottom: 16 }}>That certificate no longer exists.</p>
          <button className="pe-btn pe-btn-secondary pe-btn-md" onClick={() => router.push('/admin/certificates')}>
            Back to certificates
          </button>
        </div>
      </AdminShell>
    )
  }

  if (loading || !cert) {
    return (
      <AdminShell {...shellProps}>
        <div className="adm-empty">Loading…</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      {...shellProps}
      actions={
        <div className="flex items-center gap-3">
          {dirty && (
            <span
              className="adm-mono hidden sm:flex items-center gap-2"
              style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }} aria-hidden />
              Unsaved
            </span>
          )}
          <button className="adm-btn" onClick={goBack}>Cancel</button>
          <button
            className="adm-btn amber"
            onClick={save}
            disabled={saving || uploadState === 'uploading' || uploadState === 'rendering'}
          >
            {saving ? 'Saving…' : 'Save certificate'}
          </button>
        </div>
      }
    >
      <div style={{ maxWidth: 760 }}>
        <button onClick={goBack} className="pe-btn pe-btn-ghost pe-btn-sm" style={{ marginBottom: 20 }}>
          ← All certificates
        </button>

        <div className="adm-panel">
          <div className="adm-body">
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label" htmlFor="cert-name">Title</label>
                <input
                  id="cert-name"
                  className="adm-input"
                  value={cert.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Complete Web Development"
                  autoFocus
                />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="cert-issuer">Issuer</label>
                <input
                  id="cert-issuer"
                  className="adm-input"
                  value={cert.issuer}
                  onChange={(e) => patch({ issuer: e.target.value })}
                  placeholder="e.g. Programming Hero"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="cert-date">Issue date</label>
                <input
                  id="cert-date"
                  type="date"
                  className="adm-input"
                  value={toDateInput(cert.date)}
                  onChange={(e) => patch({ date: e.target.value })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="cert-url">Verify URL</label>
                <input
                  id="cert-url"
                  className="adm-input"
                  value={cert.url || ''}
                  onChange={(e) => patch({ url: e.target.value })}
                  placeholder="https://…"
                />
              </div>

              <div className="adm-field adm-col-2">
                <label className="adm-label">Certificate file (PDF or image)</label>

                {cert.fileUrl ? (
                  <div className="cert-file-preview">
                    {cert.fileType === 'pdf' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                        <div className="cert-file-pill">
                          <span className="cert-file-icon">📄</span>
                          <a href={fileViewUrl(cert.fileUrl)} target="_blank" rel="noopener noreferrer" className="cert-file-link">
                            View PDF
                          </a>
                          <button className="cert-file-remove" onClick={removeFile} title="Remove file">✕</button>
                        </div>

                        {cert.thumbnailUrl ? (
                          <div>
                            <span className="cert-drop-sub" style={{ display: 'block', marginBottom: 6 }}>
                              Card preview
                            </span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fileViewUrl(cert.thumbnailUrl)} alt="Generated first-page preview" className="cert-img-preview" />
                          </div>
                        ) : (
                          <div>
                            <span className="cert-drop-sub" style={{ display: 'block', marginBottom: 6 }}>
                              No card preview yet
                            </span>
                            <button
                              type="button"
                              className="adm-btn"
                              onClick={regeneratePreview}
                              disabled={uploadState === 'rendering'}
                            >
                              {uploadState === 'rendering' ? 'Rendering…' : 'Generate preview'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="cert-img-preview-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fileViewUrl(cert.fileUrl)} alt="Certificate preview" className="cert-img-preview" />
                        <button className="cert-file-remove cert-img-remove" onClick={removeFile} title="Remove file">✕</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`cert-drop-zone${dragOver ? ' drag-over' : ''}${uploadState === 'uploading' || uploadState === 'rendering' ? ' uploading' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) uploadFile(file)
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      className="cert-file-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadFile(file)
                      }}
                    />
                    {uploadState === 'uploading' || uploadState === 'rendering' ? (
                      <span className="cert-drop-hint">
                        {uploadState === 'rendering' ? 'Generating preview…' : 'Uploading…'}
                      </span>
                    ) : (
                      <>
                        <span className="cert-drop-icon">⬆</span>
                        <span className="cert-drop-hint">Drop PDF or image here, or click to browse</span>
                        <span className="cert-drop-sub">JPEG · PNG · WebP · GIF · PDF — max 10 MB</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="adm-field adm-col-2">
                <label className="adm-label" htmlFor="cert-desc">Description (optional)</label>
                <textarea
                  id="cert-desc"
                  className="adm-textarea"
                  value={cert.description || ''}
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4"
          style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}
        >
          <button className="adm-btn" onClick={goBack}>Cancel</button>
          <button
            className="adm-btn amber"
            onClick={save}
            disabled={saving || uploadState === 'uploading' || uploadState === 'rendering'}
          >
            {saving ? 'Saving…' : 'Save certificate'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
