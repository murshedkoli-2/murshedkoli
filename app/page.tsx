import { Nav } from '@/components/blueprint/Nav'
import { HeroTitleBlock } from '@/components/blueprint/HeroTitleBlock'
import { SpecSheets } from '@/components/blueprint/SpecSheets'
import { SkillsWithProof } from '@/components/blueprint/SkillsWithProof'
import { TimelineSection } from '@/components/blueprint/TimelineSection'
import { CertificatesGrid } from '@/components/blueprint/CertificatesGrid'
import { ContactSection } from '@/components/blueprint/ContactSection'
import { BlueprintFooter } from '@/components/blueprint/BlueprintFooter'
import {
  getProfile,
  getHeroStats,
  getFeaturedProjects,
  getSkillsGrouped,
  getExperience,
  getEducation,
  getCertificates,
} from '@/lib/data/portfolio'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

/**
 * The Blueprint homepage — fully server-rendered (PRD R1/§6).
 * Every section receives its data as props from the server; there is no
 * client-side fetching and no "Loading…" state on this page.
 */
export default async function Home() {
  const [profile, stats, featured, skills, experience, education, certificates] =
    await Promise.all([
      getProfile(),
      getHeroStats(),
      getFeaturedProjects(4),
      getSkillsGrouped(16),
      getExperience(),
      getEducation(),
      getCertificates(),
    ])

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Murshed Al Main',
    jobTitle: 'Full-stack developer',
    url: siteUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: profile.socialLinks ? Object.values(profile.socialLinks).filter(Boolean) : [],
  }

  return (
    <div className="blueprint-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Nav resumeUrl={profile.resume} />
      <main>
        <HeroTitleBlock profile={profile} stats={stats} />
        <SpecSheets projects={featured} />
        <SkillsWithProof columns={skills} />
        <TimelineSection experience={experience} education={education} />
        <CertificatesGrid certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <BlueprintFooter />
    </div>
  )
}
