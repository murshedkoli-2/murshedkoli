import Image from 'next/image'
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Container } from '@/components/site/ui/Container'
import { Eyebrow } from '@/components/site/ui/Eyebrow'
import { Button } from '@/components/site/ui/Button'
import { ServicesSection } from '@/components/site/home/ServicesSection'
import { SkillsSection } from '@/components/site/home/SkillsSection'
import { TimelineSection } from '@/components/site/home/TimelineSection'
import { CertificatesSection } from '@/components/site/home/CertificatesSection'
import {
  getProfile,
  getServices,
  getSkillsGrouped,
  getExperience,
  getEducation,
  getCertificates,
} from '@/lib/data/portfolio'

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, skills, experience, and credentials.',
}

export const revalidate = 600

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export default async function AboutPage() {
  const [profile, services, skills, experience, education, certificates] = await Promise.all([
    getProfile(),
    getServices(),
    getSkillsGrouped(30),
    getExperience(),
    getEducation(),
    getCertificates(),
  ])

  const portrait = profile.avatar || profile.heroImage

  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <main>
        {/* Intro */}
        <section style={{ paddingBlock: 'clamp(3.5rem, 2rem + 6vw, 6.5rem)' }}>
          <Container>
            <div className="about-intro">
              <div>
                <Eyebrow>about me</Eyebrow>
                <h1 style={{ fontSize: 'var(--text-h2)', marginTop: '0.75rem', marginBottom: '1.5rem' }}>
                  {profile.name}
                </h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--ink-muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                  {profile.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  {profile.resume && (
                    <Button href={profile.resume} external>
                      <FileText size={16} /> download résumé
                    </Button>
                  )}
                  <Button href="/#contact" variant="ghost">
                    get in touch
                  </Button>
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: '1px solid var(--line-strong)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--surface-2)',
                }}
              >
                {portrait ? (
                  <Image src={portrait} alt={profile.name} fill priority sizes="(max-width: 800px) 80vw, 380px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '4rem', color: 'var(--accent)' }}>
                    {initials(profile.name)}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        <ServicesSection services={services} />
        <SkillsSection columns={skills} />
        <TimelineSection experience={experience} education={education} />
        <CertificatesSection certificates={certificates} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
