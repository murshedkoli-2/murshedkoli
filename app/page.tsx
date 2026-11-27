import { serializeJsonLd } from '@/lib/json-ld'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { LandingHero } from '@/components/site/landing/LandingHero'
import { SkillMarquee } from '@/components/site/landing/SkillMarquee'
import { WorkIndex } from '@/components/site/landing/WorkIndex'
import { AboutBento } from '@/components/site/landing/AboutBento'
import { Capabilities } from '@/components/site/landing/Capabilities'
import { Journey } from '@/components/site/landing/Journey'
import { CertificateRail } from '@/components/site/landing/CertificateRail'
import { ContactFinale } from '@/components/site/landing/ContactFinale'
import { ScrollRail } from '@/components/site/landing/ScrollRail'
import '@/components/site/landing/landing.css'
import {
  getProfile,
  getHeroStats,
  getFeaturedProjects,
  getSkillsGrouped,
  getExperience,
  getEducation,
  getCertificates,
  getServices,
} from '@/lib/data/portfolio'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

const RAIL_SECTIONS: { id: string; label: string }[] = [
  { id: 'top', label: 'Intro' },
  { id: 'projects', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Capabilities' },
  { id: 'journey', label: 'Journey' },
  { id: 'certificates', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

/** ISR: served static (instant navigation), regenerated in the background every 10 min. */
export const revalidate = 600

/** Landing page: every section is data-driven and hides itself when it has nothing to show. */
export default async function Home() {
  const [profile, stats, featured, skills, experience, education, certificates, services] =
    await Promise.all([
      getProfile(),
      getHeroStats(),
      getFeaturedProjects(6),
      getSkillsGrouped(24),
      getExperience(),
      getEducation(),
      getCertificates(),
      getServices(),
    ])

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title || 'Full-Stack MERN Developer',
    url: siteUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: profile.socialLinks ? Object.values(profile.socialLinks).filter(Boolean) : [],
    knowsAbout: [
      'MongoDB',
      'Express.js',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'REST APIs',
      'SaaS Architecture',
    ],
  }

  // Sections hide themselves when empty; keep the rail in step with what renders.
  const rendered: Record<string, boolean> = {
    projects: featured.length > 0,
    journey: experience.length > 0 || education.length > 0,
    certificates: certificates.length > 0,
  }
  const railSections = RAIL_SECTIONS.filter((s) => rendered[s.id] ?? true)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <ScrollRail sections={railSections} />
      <main className="ld">
        {/* Live dot field, rotating statement, tilting portrait, counters, kinetic wordmark */}
        <LandingHero profile={profile} stats={stats} />
        <SkillMarquee skills={skills} />

        {/* Each section below hides itself when it has no data */}
        <WorkIndex projects={featured} />
        <AboutBento profile={profile} currentRole={experience.find((e) => e.current) ?? null} />
        <Capabilities services={services} skills={skills} />
        <Journey experience={experience} education={education} />
        <CertificateRail certificates={certificates} />
        <ContactFinale profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
