'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminShell } from '@/components/admin/AdminShell'
import { confirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminGuard } from '@/lib/admin/useAdminGuard'
import { ArrowUpRight, Award, BadgeCheck, FileText, Image as ImageIcon, LinkIcon, Paperclip, Plus, Trash2 } from 'lucide-react'
import { Toolbar } from '@/components/admin/kit/Toolbar'
import { StatStrip } from '@/components/admin/kit/StatStrip'
import { EmptyState } from '@/components/admin/kit/EmptyState'
import { matchesQuery } from '@/lib/admin/list'
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

  const filtered = useMemo(() => certs.filter((c) => matchesQuery(search, c.name, c.issuer, c.description)), [certs, search])
  const verifiable = certs.filter((c) => Boolean(c.url)).length
  const withFile = certs.filter((c) => Boolean(c.fileUrl)).length

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
          <Plus size={16} aria-hidden="true" /> New certificate
        </Link>
      }
    >
      <StatStrip
        stats={[
          { label: 'Certificates', value: certs.length, icon: Award, tone: 'accent' },
          { label: 'Verifiable', value: verifiable, icon: BadgeCheck, tone: 'good', note: certs.length - verifiable ? `${certs.length - verifiable} missing a link` : 'All have a verify link' },
          { label: 'With a file', value: withFile, icon: Paperclip, note: 'Image or PDF attached' },
        ]}
      />

      <Toolbar id="certificates" query={search} onQuery={setSearch} placeholder="Search name, issuer or notes…" />

      {filtered.length === 0 ? (
        <div className="adm-panel">
          <EmptyState
            icon={Award}
            title={certs.length === 0 ? 'No certificates yet' : 'No certificates match'}
            body={certs.length === 0 ? 'Add courses and credentials that back up your skills.' : 'Try a different search.'}
            action={certs.length === 0 && <Link href="/admin/certificates/new" className="adm-btn amber">New certificate</Link>}
          />
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
                      <span className="pcard-doc-icon">{isPdf ? <FileText size={30} strokeWidth={1.5} /> : <Award size={30} strokeWidth={1.5} />}</span>
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
                      {c.url ? <><BadgeCheck size={13} aria-hidden="true" /> Verifiable</> : <><LinkIcon size={13} aria-hidden="true" /> No verify link</>}
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
                      {isPdf ? <FileText size={15} /> : <ImageIcon size={15} />}
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
                      <ArrowUpRight size={15} />
                    </a>
                  )}
                  <button
                    className="adm-icon-btn danger"
                    onClick={() => remove(c)}
                    title="Delete"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 size={15} />
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
