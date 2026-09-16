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
        background: '#f5f5f7',
        color: '#1d1d1f',
        paddingBlock: 'var(--space-section)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container>
        <HomeSectionHeader
          title="Certificates &"
          accent="credentials"
          meta={`${String(certificates.length).padStart(2, '0')} verified`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {certificates.map((c, idx) => {
            const isImage = Boolean(c.fileUrl && c.fileType === 'image')
            const isPdf = Boolean(c.fileUrl && c.fileType === 'pdf')
            return (
              <motion.div
                key={c.id}
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '1.5rem',
                  borderRadius: 18,
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#86868b',
                      marginBottom: 6,
                    }}
                  >
                    {c.date} · {c.issuer}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                    {c.title}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => openCert(c)}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#d97706',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      VIEW CERTIFICATE →
                    </button>
                  )}
                  {isPdf && (
                    <a
                      href={c.fileUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#d97706',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <FileText size={13} />
                      <span>PDF DOCUMENT</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {lightboxImages.length > 0 && index !== null && (
          <Lightbox
            images={lightboxImages}
            index={index}
            onClose={() => setIndex(null)}
            onNavigate={(next) => setIndex(next)}
          />
        )}
      </Container>
    </section>
  )
}
