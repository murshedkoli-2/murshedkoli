import { serializeJsonLd } from '@/lib/json-ld'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/home/Hero'
import { WorkSection } from '@/components/site/home/WorkSection'
import { AboutSection } from '@/components/site/home/AboutSection'
import { CapabilitiesSection } from '@/components/site/home/CapabilitiesSection'
import { TimelineSection } from '@/components/site/home/TimelineSection'
import { CertificatesSection } from '@/components/site/home/CertificatesSection'
import { ContactSection } from '@/components/site/home/ContactSection'
import '@/components/site/home/home.css'
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <main className="apple-light-main">
        {/* Statement, actions and the interactive 3D point cloud */}
        <Hero profile={profile} stats={stats} />

        {/* Selected projects as 3D tilt cards (hidden when empty) */}
        <WorkSection projects={featured} />

        <AboutSection profile={profile} />

        {/* Services and tech stack (each hidden when empty) */}
        <CapabilitiesSection services={services} skills={skills} />

        <TimelineSection experience={experience} education={education} />

        <CertificatesSection certificates={certificates} />

        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
