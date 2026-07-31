'use client'

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, FileText } from 'lucide-react'
import type { CertificateView } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'
import { Lightbox, type LightboxImage } from '@/components/site/ui/Lightbox'

interface CertificatesSectionProps {
  certificates: CertificateView[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState<number | null>(null)

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
    <section
      style={{
        background: '#0b0b0c',
        color: '#ececea',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      }}
    >
      <Container>
        <HomeSectionHeader
          title="Certificates &"
          accent="credentials"
          meta={`${String(certificates.length).padStart(2, '0')} verified`}
        />

        <div>
          {certificates.map((c, idx) => {
            const isImage = Boolean(c.fileUrl && c.fileType === 'image')
            const isPdf = Boolean(c.fileUrl && c.fileType === 'pdf')
            return (
              <motion.div
                key={c.id}
                className="svc-row"
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#ececea', lineHeight: 1.35 }}>
                    {c.title}
                  </div>
                  <div className="hp-meta" style={{ marginTop: 8 }}>
                    {c.issuer}
                    {c.date ? ` · ${c.date}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  {c.description && (
                    <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.92rem', lineHeight: 1.6, flex: '1 1 16rem', minWidth: '12rem' }}>
                      {c.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 18, flexShrink: 0 }}>
                    {isImage && (
                      <button type="button" onClick={() => openCert(c)} style={linkBtn}>
                        <FileText size={14} /> view
                      </button>
                    )}
                    {isPdf && (
                      <a href={c.fileUrl as string} target="_blank" rel="noopener noreferrer" style={linkBtn}>
                        <FileText size={14} /> pdf
                      </a>
                    )}
                    {c.verifyUrl && (
                      <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" style={linkBtn}>
                        <ExternalLink size={14} /> verify
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>

      <Lightbox images={lightboxImages} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </section>
  )
}

const linkBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'var(--font-mono)',
  fontSize: '0.78rem',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#f5b04c',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}
