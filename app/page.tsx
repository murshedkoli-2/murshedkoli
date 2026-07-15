import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/home/Hero'
import {
  getProfile,
  getHeroStats,
} from '@/lib/data/portfolio'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

/** Soft-luxury homepage — fully server-rendered; sections receive data as props. */
export default async function Home() {
  const [profile, stats] = await Promise.all([getProfile(), getHeroStats()])

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
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
