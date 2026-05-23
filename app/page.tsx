import dynamic from 'next/dynamic'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Certifications from '@/components/Certifications'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { getHomePageData } from '@/lib/site-data'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'))

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

export default async function Home() {
  const { profile, settings, skills, experiences, education, certifications, projects } =
    await getHomePageData()

  const siteName = String(settings.siteName || profile.name || 'Portfolio')
  const siteDescription = String(
    settings.siteDescription ||
      profile.description ||
      'Professional portfolio showcasing projects, skills, and experience.'
  )

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 6)
  const featuredSkills = skills.slice(0, 12)

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#featured-projects`,
        name: 'Featured portfolio projects',
        itemListElement: featuredProjects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/projects/${project.slug}`,
          name: project.title,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#skills`,
        name: 'Core skills',
        itemListElement: featuredSkills.map((skill, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: skill.name,
        })),
      },
    ],
  }

  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <ParticleBackground />
      <Navigation />
      <Hero profile={profile} projectCount={projects.length} skillCount={skills.length} />
      <section
        aria-labelledby="portfolio-summary"
        className="relative z-10 px-6 pb-12"
      >
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/[0.04] bg-white/[0.01] px-8 py-10 backdrop-blur-sm">
          <h2 id="portfolio-summary" className="text-xl font-semibold text-white tracking-tight">
            Portfolio Summary
          </h2>
          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-zinc-400">
            {siteName} is the professional portfolio of {profile.name}, a {profile.title}. This digital space
            highlights professional projects, technical skill structures, education records, and contact details
            curated for both human visitors and index systems. The space currently includes {projects.length} published
            projects, {skills.length} skills, and {experiences.length} experience milestones.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-3 pt-8 border-t border-white/[0.04]">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Focus Areas
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                Full-stack web architectures, clean design systems, responsive UI interfaces, and high-performance API structures.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Core Stack
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                {featuredSkills.map((skill) => skill.name).join(', ') || siteDescription}
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Contact details
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                Email: {profile.email}
                {profile.phone ? ` | Phone: ${profile.phone}` : ''}
                {profile.location ? ` | Location: ${profile.location}` : ''}
              </p>
            </div>
          </div>
        </div>
      </section>
      <About />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
