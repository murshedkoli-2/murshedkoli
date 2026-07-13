import { SectionHeading } from './primitives'
import type { CertificateView } from '@/lib/data/portfolio'

interface CertificatesGridProps {
  certificates: CertificateView[]
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  if (!certificates.length) return null

  return (
    <section id="certificates" aria-labelledby="certificates-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading eyebrow="Credentials" title="Certificates" id="certificates-heading" />

      <div className="bp-certs-grid" style={{ marginTop: 40 }}>
        {certificates.map((cert) => (
          <article key={cert.id} className="bp-cell" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="bp-mono" style={{ color: 'var(--muted)' }}>{cert.date}</span>
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
            {cert.credentialId ? (
              <p className="bp-mono" style={{ color: 'var(--muted)', fontSize: 11 }}>
                ID: {cert.credentialId}
              </p>
            ) : null}
            {cert.verifyUrl ? (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bp-mono"
                style={{ color: 'var(--amber)', textDecoration: 'none', marginTop: 'auto', paddingTop: 8 }}
              >
                VERIFY ↗
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
