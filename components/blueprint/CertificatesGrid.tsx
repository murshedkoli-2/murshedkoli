import { SectionHeading } from './primitives'
import type { CertificateView } from '@/lib/data/portfolio'

interface CertificatesGridProps {
  certificates: CertificateView[]
}

function certFileHref(fileUrl: string): string {
  if (fileUrl.startsWith('certificates/')) {
    return `/api/upload/certificate/view?key=${encodeURIComponent(fileUrl)}`
  }
  return fileUrl
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  if (!certificates.length) return null

  return (
    <section id="certificates" aria-labelledby="certificates-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading eyebrow="Credentials" title="Certificates" id="certificates-heading" />

      <div className="bp-certs-grid" style={{ marginTop: 40 }}>
        {certificates.map((cert) => (
          <article
            key={cert.id}
            className="bp-cell"
            style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <span className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{cert.date}</span>

            <h3
              style={{
                fontFamily: 'var(--bp-font-display)',
                fontWeight: 700,
                fontSize: 17,
                color: 'var(--paper)',
                lineHeight: 1.2,
              }}
            >
              {cert.title}
            </h3>

            <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>{cert.issuer}</p>

            {cert.description ? (
              <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.55, marginTop: 2 }}>
                {cert.description}
              </p>
            ) : null}

            {cert.credentialId ? (
              <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
                ID: {cert.credentialId}
              </p>
            ) : null}

            {/* action row — pushed to bottom */}
            {(cert.verifyUrl || cert.fileUrl) && (
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: 10,
                  flexWrap: 'wrap',
                }}
              >
                {cert.fileUrl && (
                  <a
                    href={certFileHref(cert.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bp-cert-view-btn"
                  >
                    {cert.fileType === 'pdf' ? '↓ VIEW PDF' : '↓ VIEW CERT'}
                  </a>
                )}
                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bp-mono"
                    style={{ color: 'var(--amber)', textDecoration: 'none', fontSize: 12 }}
                  >
                    VERIFY ↗
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
