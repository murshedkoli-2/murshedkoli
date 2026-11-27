'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import type { ProfileView } from '@/lib/data/portfolio'
import { socialEntries } from '@/lib/landing'
import { ContactForm } from '@/components/site/home/ContactForm'
import { Magnetic } from './Magnetic'

const COPIED_MS = 1800

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <div className="ld-email">
      <a href={`mailto:${email}`} className="ld-email-addr">
        <Mail size={18} aria-hidden="true" />
        {email}
      </a>
      <button type="button" className="ld-round" onClick={copy} aria-label="Copy email address">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'ok' : 'copy'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="ld-sr" role="status">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </div>
  )
}

/** Closing call to action: a headline that slides in with scroll, direct email and the form. */
export function ContactFinale({ profile }: { profile: ProfileView }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const shiftA = useTransform(scrollYProgress, [0, 1], ['-18%', '0%'])
  const shiftB = useTransform(scrollYProgress, [0, 1], ['18%', '0%'])
  const socials = socialEntries(profile.socialLinks)

  return (
    <section ref={ref} id="contact" className="ld-section ld-contact" aria-labelledby="ld-contact-title">
      <div className="ld-wrap">
        <h2 id="ld-contact-title" className="ld-contact-title">
          <motion.span style={{ x: shiftA }}>Let&apos;s build</motion.span>
          <motion.span style={{ x: shiftB }}>
            something <em>remarkable.</em>
          </motion.span>
        </h2>

        <div className="ld-contact-grid">
          <div className="ld-contact-side">
            <p className="ld-contact-lede">
              Have a product in mind, an engineering role, or a stubborn problem? Tell me about it — I usually reply
              within a day.
            </p>
            {profile.email && <CopyEmail email={profile.email} />}
            {socials.length > 0 && (
              <ul className="ld-socials">
                {socials.map((s) => (
                  <li key={s.key}>
                    <Magnetic strength={0.2}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="ld-social">
                        {s.label} <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ld-contact-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
