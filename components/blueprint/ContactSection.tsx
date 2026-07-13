import { SectionHeading, MonoLabel } from './primitives'
import type { ProfileView } from '@/lib/data/portfolio'

interface ContactSectionProps {
  profile: ProfileView
}

function MetaRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <MonoLabel style={{ color: 'var(--muted)' }}>{label}</MonoLabel>
      {href ? (
        <a href={href} style={{ color: 'var(--paper)', textDecoration: 'none', fontSize: 15 }}>
          {value}
        </a>
      ) : (
        <span style={{ color: 'var(--paper)', fontSize: 15 }}>{value}</span>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(15,36,64,0.6)',
  border: '1px solid var(--bp-line)',
  color: 'var(--paper)',
  padding: '12px 14px',
  fontFamily: 'var(--bp-font-body)',
  fontSize: 14.5,
}

export function ContactSection({ profile }: ContactSectionProps) {
  const socials = profile.socialLinks || {}
  const socialEntries = Object.entries(socials).filter(([, url]) => Boolean(url)) as [string, string][]

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bp-container" style={{ paddingBlock: 64 }}>
      <SectionHeading eyebrow="Say Hello" title="Start a conversation" id="contact-heading" />

      <div className="bp-contact-grid" style={{ marginTop: 40 }}>
        {/* Form UI — wired to a Server Action in a later phase */}
        <form className="bp-cell" style={{ padding: '24px 26px', display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="c-name" className="bp-mono" style={{ color: 'var(--muted)' }}>
              Name
            </label>
            <input id="c-name" name="name" type="text" style={inputStyle} autoComplete="name" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="c-email" className="bp-mono" style={{ color: 'var(--muted)' }}>
              Email
            </label>
            <input id="c-email" name="email" type="email" style={inputStyle} autoComplete="email" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="c-message" className="bp-mono" style={{ color: 'var(--muted)' }}>
              Message
            </label>
            <textarea id="c-message" name="message" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button type="submit" className="bp-btn bp-btn-primary" style={{ justifyContent: 'center' }}>
            SEND MESSAGE →
          </button>
        </form>

        {/* Direct contact metadata */}
        <div style={{ display: 'grid', gap: 22, alignContent: 'start' }}>
          {profile.email ? <MetaRow label="Email" value={profile.email} href={`mailto:${profile.email}`} /> : null}
          {profile.phone ? <MetaRow label="Phone" value={profile.phone} href={`tel:${profile.phone}`} /> : null}
          {profile.location ? <MetaRow label="Location" value={profile.location} /> : null}
          {socialEntries.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <MonoLabel style={{ color: 'var(--muted)' }}>Elsewhere</MonoLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {socialEntries.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bp-mono"
                    style={{ color: 'var(--paper)', textDecoration: 'none' }}
                  >
                    {key.toUpperCase()} ↗
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
