import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/home/Hero'
import { AboutTeaser } from '@/components/site/home/AboutTeaser'
import { ServicesSection } from '@/components/site/home/ServicesSection'
import { FeaturedProjects } from '@/components/site/home/FeaturedProjects'
import { SkillsSection } from '@/components/site/home/SkillsSection'
import { TimelineSection } from '@/components/site/home/TimelineSection'
import { CertificatesSection } from '@/components/site/home/CertificatesSection'
import { ContactSection } from '@/components/site/home/ContactSection'
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

/** Dev-minimalist homepage — fully server-rendered; sections receive data as props. */
export default async function Home() {
  const [profile, stats, featured, skills, experience, education, certificates, services] = await Promise.all([
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
    jobTitle: profile.title,
    url: siteUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: profile.socialLinks ? Object.values(profile.socialLinks).filter(Boolean) : [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <main>
        <Hero profile={profile} stats={stats} />
        <AboutTeaser profile={profile} />
        <ServicesSection services={services} />
        <FeaturedProjects projects={featured} />
        <SkillsSection columns={skills} />
        <TimelineSection experience={experience} education={education} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
