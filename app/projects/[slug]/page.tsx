import { notFound } from 'next/navigation'
import { Nav } from '@/components/blueprint/Nav'
import { BlueprintFooter } from '@/components/blueprint/BlueprintFooter'
import { getAllPublishedSlugs, getProjectBySlug, getProfile } from '@/lib/data/portfolio'
import { ProjectDetailBlueprint } from './ProjectDetailBlueprint'

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Murshed Al Main`,
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
  const [project, profile] = await Promise.all([
    getProjectBySlug(slug),
    getProfile(),
  ])

  if (!project) notFound()

  const isLive = Boolean(
    (project.demoUrlEnabled && project.demoUrl) ||
    (project.clientLiveUrlEnabled && project.clientLiveUrl)
  )

  const data = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    longDescription: project.longDescription,
    outcome: (project as unknown as { outcome?: string }).outcome || null,
    role: (project as unknown as { role?: string }).role || null,
    coverImage: project.coverImage,
    gallery: project.gallery,
    lifecycleStatus: project.lifecycleStatus,
    projectType: project.projectType || 'webapp',
    overallProgress: project.overallProgress,
    isLive,
    features: project.features as unknown as any[],
    roadmap: project.roadmap as unknown as any[],
    techStack: project.techStack as unknown as any[],
    technologies: project.technologies,
    modules: project.modules as unknown as any[],
    deployment: project.deployment as unknown as any,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    clientLiveUrl: project.clientLiveUrl,
    demoUrlEnabled: project.demoUrlEnabled,
    githubUrlEnabled: project.githubUrlEnabled,
    clientLiveUrlEnabled: project.clientLiveUrlEnabled,
  }

  return (
    <div className="blueprint-page">
      <Nav resumeUrl={profile.resume} />
      <main>
        <ProjectDetailBlueprint project={data} />
      </main>
      <BlueprintFooter />
    </div>
  )
}
