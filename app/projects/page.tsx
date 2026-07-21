import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Container } from '@/components/site/ui/Container'
import { Eyebrow } from '@/components/site/ui/Eyebrow'
import { ProjectsGrid } from '@/components/site/projects/ProjectsGrid'
import { getProfile, getAllPublishedProjects } from '@/lib/data/portfolio'

export const metadata: Metadata = {
  title: 'Work',
  description: 'A selection of projects — web apps, mobile, and more.',
}

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getAllPublishedProjects()])

  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <main>
        <section style={{ paddingBlock: 'clamp(3.5rem, 2rem + 6vw, 6rem)' }}>
          <Container>
            <Eyebrow>work</Eyebrow>
            <h1 style={{ fontSize: 'var(--text-h2)', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              Projects
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '1.075rem', maxWidth: '38rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Things I&rsquo;ve designed and built. Filter by type or browse the full collection.
            </p>
            <Suspense fallback={null}>
              <ProjectsGrid projects={projects} />
            </Suspense>
          </Container>
        </section>
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
