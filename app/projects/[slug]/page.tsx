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

  const rawFeatures = (project.features as unknown as { id: string; title: string; done?: boolean; status?: string }[]) ?? []

  const data = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    longDescription: project.longDescription,
    coverImage: project.coverImage,
    gallery: project.gallery,
    projectType: project.projectType || 'webapp',
    isLive,
    // Normalise features — old records may have status instead of done
    features: rawFeatures.map(f => ({
      id: f.id,
      title: f.title,
      done: f.done ?? f.status === 'completed',
    })),
    techStack: project.techStack as unknown as { name: string; category: string }[],
    technologies: project.technologies,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    androidDownloadUrl: (project as unknown as { androidDownloadUrl?: string }).androidDownloadUrl || null,
    clientLiveUrl: project.clientLiveUrl,
    demoUrlEnabled: project.demoUrlEnabled,
    githubUrlEnabled: project.githubUrlEnabled,
    androidDownloadUrlEnabled: (project as unknown as { androidDownloadUrlEnabled?: boolean }).androidDownloadUrlEnabled ?? false,
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
