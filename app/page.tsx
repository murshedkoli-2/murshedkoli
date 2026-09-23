import { serializeJsonLd } from '@/lib/json-ld'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/home/Hero'
import { TechStrip } from '@/components/site/home/TechStrip'
import { AboutPreview } from '@/components/site/home/AboutPreview'
import { FeaturedProjects } from '@/components/site/home/FeaturedProjects'
import { ExpertiseSection } from '@/components/site/home/ExpertiseSection'
import { SkillsSection } from '@/components/site/home/SkillsSection'
import { WorkProcess } from '@/components/site/home/WorkProcess'
import { TimelineSection } from '@/components/site/home/TimelineSection'
import { CertificatesSection } from '@/components/site/home/CertificatesSection'
import { FinalCTA } from '@/components/site/home/FinalCTA'
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

/**
 * Production-ready Full-Stack MERN Developer landing page.
 * Strictly data-driven, conditional rendering, Core Web Vitals optimized.
 */
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
        {/* 1. Hero: Two-column layout, positioning headline, availability, social proof */}
        <Hero profile={profile} stats={stats} />

        {/* 2. Tech Strip: Slim continuous marquee of core production technologies */}
        <TechStrip />

        {/* 3. About Preview: 01 / ABOUT, core statement, bio, and architectural disciplines */}
        <AboutPreview profile={profile} />

        {/* 4. Featured Projects: Selected Work case study cards (hides if 0 items) */}
        <FeaturedProjects projects={featured} />

        {/* 5. Expertise: What I Build (Frontend, Backend, Database, Dashboards, SaaS, AI) */}
        <ExpertiseSection services={services} />

        {/* 6. Tech Stack: Categorized taxonomy from DB skills (hides if 0 items) */}
        <SkillsSection columns={skills} />

        {/* 7. Work Process: 5-Stage engineering lifecycle (Discover -> Ship) */}
        <WorkProcess />

        {/* 8. Track Record: Experience & Education timeline (hides if 0 items) */}
        <TimelineSection experience={experience} education={education} />

        {/* 9. Verified Credentials: Image lightbox & PDF viewer (hides if 0 items) */}
        <CertificatesSection certificates={certificates} />

        {/* 10. Final Call To Action: "Have an idea? Let's turn it into a real product" */}
        <FinalCTA email={profile.email} available={profile.availability} />

        {/* 11. Contact Section: Working contact form, email, and social links */}
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
