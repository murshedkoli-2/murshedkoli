import { notFound } from 'next/navigation'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { DARK_THEME_SCOPE } from '@/lib/dark-theme'
import { getAllPublishedSlugs, getProjectBySlug, getProfile } from '@/lib/data/portfolio'
import { ProjectDetailView, type ProjectDetailData, type ProjectDetailLink } from './ProjectDetailView'

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, profile] = await Promise.all([getProjectBySlug(slug), getProfile()])

  if (!project) notFound()

  const p = project as unknown as {
    demoUrl?: string | null
    demoUrlEnabled?: boolean
    githubUrl?: string | null
    githubUrlEnabled?: boolean
    clientLiveUrl?: string | null
    clientLiveUrlEnabled?: boolean
    androidDownloadUrl?: string | null
    androidDownloadUrlEnabled?: boolean
  }

  const links: ProjectDetailLink[] = []
  if (p.clientLiveUrlEnabled && p.clientLiveUrl) links.push({ label: 'Visit site', url: p.clientLiveUrl, icon: 'live' })
  if (p.demoUrlEnabled && p.demoUrl) links.push({ label: 'Live demo', url: p.demoUrl, icon: 'demo' })
  if (p.androidDownloadUrlEnabled && p.androidDownloadUrl) links.push({ label: 'Download app', url: p.androidDownloadUrl, icon: 'android' })
  if (p.githubUrlEnabled && p.githubUrl) links.push({ label: 'Source', url: p.githubUrl, icon: 'github' })

  const stackFromTech = (project.techStack as unknown as { name: string }[] | undefined)?.map((t) => t.name).filter(Boolean) ?? []
  const stack = stackFromTech.length ? stackFromTech : project.technologies

  const data: ProjectDetailData = {
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    outcome: project.outcome ?? null,
    role: project.role ?? null,
    projectType: project.projectType || 'webapp',
    isLive: Boolean((p.demoUrlEnabled && p.demoUrl) || (p.clientLiveUrlEnabled && p.clientLiveUrl)),
    coverImage: project.coverImage,
    gallery: project.gallery ?? [],
    stack,
    links,
  }

  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resume} dark />
      <main style={{ ...DARK_THEME_SCOPE, background: 'var(--canvas)', color: 'var(--ink)' }}>
        <ProjectDetailView project={data} />
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} dark />
    </>
  )
}
