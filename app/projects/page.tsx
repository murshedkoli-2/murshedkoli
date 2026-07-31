import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Container } from '@/components/site/ui/Container'
import { ProjectsGrid } from '@/components/site/projects/ProjectsGrid'
import { getProfile, getAllPublishedProjects } from '@/lib/data/portfolio'
import { DARK_THEME_SCOPE } from '@/lib/dark-theme'

export const metadata: Metadata = {
  title: 'Work',
  description: 'A selection of projects — web apps, mobile, and more.',
}

export const revalidate = 600

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([getProfile(), getAllPublishedProjects()])

  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resume} dark />
      <main style={{ ...DARK_THEME_SCOPE, background: 'var(--canvas)', color: 'var(--ink)' }}>
        <section style={{ paddingBlock: 'clamp(4rem, 3rem + 6vw, 7rem)' }}>
          <Container>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: '1.25rem',
              }}
            >
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 1.6rem + 4vw, 4.6rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                All{' '}
                <span className="serif-accent" style={{ color: 'var(--accent)' }}>
                  work
                </span>
              </h1>
              <span className="hp-meta">{String(projects.length).padStart(2, '0')} projects</span>
            </div>
            <p
              style={{
                color: 'var(--ink-muted)',
                fontSize: '1.05rem',
                maxWidth: '38rem',
                marginBottom: '3rem',
                lineHeight: 1.7,
              }}
            >
              Things I&rsquo;ve designed and built. Filter by type or browse the full collection.
            </p>
            <Suspense fallback={null}>
              <ProjectsGrid projects={projects} />
            </Suspense>
          </Container>
        </section>
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} dark />
    </>
  )
}
