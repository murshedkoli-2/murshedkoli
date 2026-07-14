'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'

interface Certificate {
  id?: string
  name: string
  issuer: string
  date: string
  url?: string
  fileUrl?: string
  fileType?: string
  description?: string
  order: number
}

// R2 keys (certificates/…) are served via presigned URL; ImgBB direct URLs pass through unchanged.
function fileViewUrl(fileUrl: string): string {
  if (fileUrl.startsWith('certificates/')) {
    return `/api/upload/certificate/view?key=${encodeURIComponent(fileUrl)}`
  }
  return fileUrl
}

function emptyCert(order: number): Certificate {
  return { name: '', issuer: '', date: new Date().toISOString().split('T')[0], url: '', description: '', order }
}

function toDateInput(value: string): string {
  if (!value) return ''
  return new Date(value).toISOString().split('T')[0]
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export default function CertificatesManager() {
  const ready = useAdminGuard()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/certifications')
      if (res.ok) setCerts(await res.json())
    } catch (error) {
      console.error('Certificates load failed:', error)
      toast.error('Could not load certificates.')
    }
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  const uploadFile = async (file: File) => {
    setUploadState('uploading')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload/certificate', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) {
        setEditing((prev) => prev ? { ...prev, fileUrl: data.url, fileType: data.fileType } : prev)
        setUploadState('done')
        toast.success('File uploaded.')
      } else {
        setUploadState('error')
        toast.error(data.message ?? 'Upload failed.')
      }
    } catch {
      setUploadState('error')
      toast.error('Upload failed.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const removeFile = () => {
    setEditing((prev) => prev ? { ...prev, fileUrl: undefined, fileType: undefined } : prev)
    setUploadState('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openEditor = (cert: Certificate) => {
    setEditing(cert)
    setUploadState(cert.fileUrl ? 'done' : 'idle')
  }

  const save = async () => {
    if (!editing || !editing.name.trim() || !editing.issuer.trim()) {
      toast.error('Name and issuer are required.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/certifications', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        setEditing(null)
        setUploadState('idle')
        await load()
        toast.success('Certificate saved.')
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

  const remove = async (c: Certificate) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return
    try {
      const res = await fetch(`/api/certifications?id=${c.id}`, { method: 'DELETE' })
      if (res.ok) {
        setCerts((prev) => prev.filter((x) => x.id !== c.id))
        toast.success('Certificate deleted.')
      } else {
        toast.error('Could not delete certificate.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Could not delete certificate.')
    }
  }

  if (!ready) return null

  return (
    <AdminShell
      active="certificates"
      title="Certificates"
      subtitle={`${certs.length} total`}
      badges={{ certificates: certs.length }}
      actions={
        <button className="adm-btn amber" onClick={() => openEditor(emptyCert(certs.length))}>
          + New certificate
        </button>
      }
    >
      <div className="adm-panel">
        {editing && (
          <div className="adm-editor">
            <h3>{editing.id ? 'Edit certificate' : 'New certificate'}</h3>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Complete Web Development"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Issuer</label>
                <input
                  className="adm-input"
                  value={editing.issuer}
                  onChange={(e) => setEditing({ ...editing, issuer: e.target.value })}
                  placeholder="e.g. Programming Hero"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Issue date</label>
                <input
                  type="date"
                  className="adm-input"
                  value={toDateInput(editing.date)}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Verify URL</label>
                <input
                  className="adm-input"
                  value={editing.url || ''}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="https://…"
                />
              </div>

              {/* Certificate file upload */}
              <div className="adm-field adm-col-2">
                <label className="adm-label">Certificate file (PDF or image)</label>

                {editing.fileUrl ? (
                  <div className="cert-file-preview">
                    {editing.fileType === 'pdf' ? (
                      <div className="cert-file-pill">
                        <span className="cert-file-icon">📄</span>
                        <a href={fileViewUrl(editing.fileUrl)} target="_blank" rel="noopener noreferrer" className="cert-file-link">
                          View PDF
                        </a>
                        <button className="cert-file-remove" onClick={removeFile} title="Remove">✕</button>
                      </div>
                    ) : (
                      <div className="cert-img-preview-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fileViewUrl(editing.fileUrl)} alt="Certificate preview" className="cert-img-preview" />
                        <button className="cert-file-remove cert-img-remove" onClick={removeFile} title="Remove">✕</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`cert-drop-zone${dragOver ? ' drag-over' : ''}${uploadState === 'uploading' ? ' uploading' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      className="cert-file-input"
                      onChange={handleFileChange}
                    />
                    {uploadState === 'uploading' ? (
                      <span className="cert-drop-hint">Uploading…</span>
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
                <label className="adm-label">Description (optional)</label>
                <textarea
                  className="adm-textarea"
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
            </div>
            <div className="adm-editor-actions">
              <button className="adm-btn amber" onClick={save} disabled={saving || uploadState === 'uploading'}>
                {saving ? 'Saving…' : 'Save certificate'}
              </button>
              <button className="adm-btn" onClick={() => { setEditing(null); setUploadState('idle') }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="adm-panel-head">
          <h2>All certificates ({certs.length})</h2>
        </div>
        <div className="adm-rows">
          {certs.length === 0 ? (
            <div className="adm-empty">No certificates yet.</div>
          ) : (
            certs.map((c) => (
              <div className="adm-list-row" key={c.id}>
                <span className="adm-cat">{toDateInput(c.date)}</span>
                <div className="grow">
                  <b>{c.name}</b>
                  <div className="sub">
                    {c.issuer}
                    {c.url ? ' · verify link' : ''}
                    {c.fileUrl ? (c.fileType === 'pdf' ? ' · PDF' : ' · image') : ''}
                  </div>
                </div>
                {c.fileUrl && (
                  <a
                    className="adm-icon-btn"
                    href={fileViewUrl(c.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={c.fileType === 'pdf' ? 'View PDF' : 'View image'}
                  >
                    {c.fileType === 'pdf' ? '📄' : '🖼'}
                  </a>
                )}
                {c.url ? (
                  <a className="adm-icon-btn" href={c.url} target="_blank" rel="noopener noreferrer" title="Open verify link">
                    ↗
                  </a>
                ) : null}
                <div className="adm-row-actions">
                  <button className="adm-icon-btn" onClick={() => openEditor(c)} title="Edit">
                    ✎
                  </button>
                  <button className="adm-icon-btn danger" onClick={() => remove(c)} title="Delete">
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  )
}
