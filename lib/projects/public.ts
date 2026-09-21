import type { Prisma } from '@prisma/client'

// Deliberately exclude tasks, deployment configuration, and internal architecture.
export const publicProjectSelect = {
  id: true, title: true, slug: true, description: true, longDescription: true,
  outcome: true, role: true, projectType: true, lifecycleStatus: true,
  coverImage: true, logoUrl: true, gallery: true, technologies: true, techStack: true,
  featured: true, order: true, updatedAt: true,
  githubUrl: true, githubUrlEnabled: true, demoUrl: true, demoUrlEnabled: true,
  clientLiveUrl: true, clientLiveUrlEnabled: true,
  androidDownloadUrl: true, androidDownloadUrlEnabled: true,
} satisfies Prisma.ProjectSelect

export type PublicProject = Prisma.ProjectGetPayload<{ select: typeof publicProjectSelect }>

export function toPublicProject(project: PublicProject): PublicProject {
  // Use explicit construction, so even a full database record cannot leak extra keys.
  return {
    id: project.id, title: project.title, slug: project.slug, description: project.description,
    longDescription: project.longDescription, outcome: project.outcome, role: project.role,
    projectType: project.projectType, lifecycleStatus: project.lifecycleStatus,
    coverImage: project.coverImage, logoUrl: project.logoUrl, gallery: project.gallery,
    technologies: project.technologies, techStack: project.techStack,
    featured: project.featured, order: project.order, updatedAt: project.updatedAt,
    githubUrlEnabled: project.githubUrlEnabled,
    githubUrl: project.githubUrlEnabled ? project.githubUrl : null,
    demoUrlEnabled: project.demoUrlEnabled,
    demoUrl: project.demoUrlEnabled ? project.demoUrl : null,
    clientLiveUrlEnabled: project.clientLiveUrlEnabled,
    clientLiveUrl: project.clientLiveUrlEnabled ? project.clientLiveUrl : null,
    androidDownloadUrlEnabled: project.androidDownloadUrlEnabled,
    androidDownloadUrl: project.androidDownloadUrlEnabled ? project.androidDownloadUrl : null,
  }
}
