'use client'

import { useMemo, useState } from 'react'
import { ExternalLink, FileText, Award } from 'lucide-react'
import type { CertificateView } from '@/lib/data/portfolio'
import { Section } from '@/components/site/ui/Section'
import { Card } from '@/components/site/ui/Card'
import { Lightbox, type LightboxImage } from '@/components/site/ui/Lightbox'

interface CertificatesSectionProps {
  certificates: CertificateView[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [index, setIndex] = useState<number | null>(null)

  // Only image certs participate in the lightbox; map cert id -> lightbox index.
  const imageCerts = useMemo(
    () => certificates.filter((c) => c.fileUrl && c.fileType === 'image'),
    [certificates],
  )
  const lightboxImages: LightboxImage[] = imageCerts.map((c) => ({ src: c.fileUrl as string, alt: c.title }))

  if (certificates.length === 0) return null

  const openCert = (cert: CertificateView) => {
    const i = imageCerts.findIndex((c) => c.id === cert.id)
    if (i >= 0) setIndex(i)
  }

  return (
    <Section eyebrow="Credentials" title="Certificates">
      <div className="certs-grid">
        {certificates.map((c) => {
          const isImage = Boolean(c.fileUrl && c.fileType === 'image')
          const isPdf = Boolean(c.fileUrl && c.fileType === 'pdf')
          return (
            <Card key={c.id} interactive style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Award size={22} style={{ color: 'var(--accent)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', lineHeight: 1.3 }}>{c.title}</div>
              <div style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
                {c.issuer}
                {c.date ? ` · ${c.date}` : ''}
              </div>
              {c.description && (
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem', lineHeight: 1.55 }}>{c.description}</p>
              )}
              <div style={{ display: 'flex', gap: 14, marginTop: 'auto', paddingTop: 6, flexWrap: 'wrap' }}>
                {isImage && (
                  <button
                    type="button"
                    onClick={() => openCert(c)}
                    style={linkBtn}
                  >
                    <FileText size={15} /> View
                  </button>
                )}
                {isPdf && (
                  <a href={c.fileUrl as string} target="_blank" rel="noopener noreferrer" style={linkBtn}>
                    <FileText size={15} /> View PDF
                  </a>
                )}
                {c.verifyUrl && (
                  <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" style={linkBtn}>
                    <ExternalLink size={15} /> Verify
                  </a>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <Lightbox images={lightboxImages} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </Section>
  )
}

const linkBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}
