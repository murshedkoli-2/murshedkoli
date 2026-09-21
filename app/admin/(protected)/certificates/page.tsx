'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { fileViewUrl, previewImageUrl, toDateInput, type Certificate } from '@/lib/admin/certificates'

/** "2021-07-18" → "Jul 2021" — the month is enough on a card. */
function displayDate(value: string): string {
  const iso = toDateInput(value)
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default function CertificatesManager() {
  const ready = useAdminGuard()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [search, setSearch] = useState('')

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an asynchronous API read; results arrive after I/O.
    if (ready) load()
  }, [ready, load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return certs
    return certs.filter(
      (c) => c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
    )
  }, [certs, search])

  const remove = async (c: Certificate) => {
    const ok = await confirmDialog({
      title: 'Delete this certificate?',
      description: <><strong>{c.name}</strong> will be permanently removed from your portfolio.</>,
      confirmLabel: 'Delete certificate',
      tone: 'danger',
    })
    if (!ok) return
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
        <Link href="/admin/certificates/new" className="adm-btn amber">
          + New certificate
        </Link>
      }
    >
      {certs.length > 0 && (
        <div className="pcard-toolbar">
          <span className="adm-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {filtered.length} of {certs.length}
          </span>
          <input
            className="adm-search"
            placeholder="Search certificates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="pe-empty">
          {certs.length === 0 ? 'No certificates yet. Add your first one.' : 'No certificates match your search.'}
        </div>
      ) : (
        <div className="pcard-grid">
          {filtered.map((c) => {
            const isPdf = Boolean(c.fileUrl) && c.fileType === 'pdf'
            const preview = previewImageUrl(c)

            return (
              <article key={c.id} className="pcard">
                <div className="pcard-media pcard-media--contain">
                  {preview ? (
                    // Presigned R2 URLs; next/image would need per-host config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" loading="lazy" />
                  ) : (
                    <span className="pcard-doc" aria-hidden>
                      <span className="pcard-doc-icon">{isPdf ? '📄' : '✦'}</span>
                      <span className="pcard-doc-label">{isPdf ? 'PDF' : 'no file'}</span>
                    </span>
                  )}
                </div>

                <div className="pcard-body">
                  <h3 className="pcard-title">
                    {/* Stretched link — the whole card opens the editor. */}
                    <Link href={`/admin/certificates/${c.id}`} className="pcard-link">
                      {c.name}
                    </Link>
                  </h3>

                  <div className="pcard-meta">
                    <span className="pcard-issuer">{c.issuer}</span>
                    <span className="pcard-date">{displayDate(c.date)}</span>
                  </div>

                  {c.description && <p className="pcard-desc">{c.description}</p>}

                  <div className="pcard-foot">
                    <span className={c.url ? 'pcard-ok' : 'pcard-warn'}>
                      {c.url ? '✓ Verifiable' : '✗ No verify link'}
                    </span>
                    {c.fileUrl && (
                      <span className="pcard-time">{isPdf ? 'PDF attached' : 'Image attached'}</span>
                    )}
                  </div>
                </div>

                <div className="pcard-actions">
                  {c.fileUrl && (
                    <a
                      className="adm-icon-btn"
                      href={fileViewUrl(c.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={isPdf ? 'View PDF' : 'View image'}
                      aria-label={`Open the file for ${c.name}`}
                    >
                      {isPdf ? '📄' : '🖼'}
                    </a>
                  )}
                  {c.url && (
                    <a
                      className="adm-icon-btn"
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open verify link"
                      aria-label={`Verify ${c.name}`}
                    >
                      ↗
                    </a>
                  )}
                  <button
                    className="adm-icon-btn danger"
                    onClick={() => remove(c)}
                    title="Delete"
                    aria-label={`Delete ${c.name}`}
                  >
                    🗑
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </AdminShell>
  )
}
