'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { assertProjectAdmin, createProjectRecord, updateProjectRecord, deleteProjectRecord } from '@/lib/projects/service'
import { CreateProjectInput, UpdateProjectInput, ProjectLifecycleStatus, UpdateFeaturesSchema, UpdateModulesSchema, UpdateFlowSchema, UpdateTechStackSchema, UpdateApiStructureSchema, UpdateDatabaseDesignSchema, UpdateDeploymentSchema } from '@/lib/validations/project'
import { HttpError } from '@/lib/http'

type ActionResponse<T = unknown> = { success: boolean; data?: T; error?: string }

async function action<T>(operation: () => Promise<T>): Promise<ActionResponse<T>> {
  try { return { success: true, data: await operation() } }
  catch (error) {
    const code = (error as { code?: string })?.code
    const message = error instanceof HttpError ? error.message :
      error instanceof z.ZodError ? 'Invalid project input' :
      code === 'P2002' ? 'A project with this slug already exists' :
      code === 'P2025' ? 'Project not found' : 'Project operation failed'
    return { success: false, error: message }
  }
}

export async function getProjects(options?: { lifecycleStatus?: string; publishStatus?: string; featured?: boolean; limit?: number }) {
  return action(async () => {
    await assertProjectAdmin()
    const filter = z.object({
      lifecycleStatus: ProjectLifecycleStatus.optional(),
      publishStatus: z.enum(['draft', 'published', 'archived']).optional(),
      featured: z.boolean().optional(), limit: z.number().int().min(1).max(1000).optional(),
    }).parse(options ?? {})
    const { limit, ...where } = filter
    return prisma.project.findMany({ where, take: limit, orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }] })
  })
}

export async function getProjectById(id: string) {
  return action(async () => {
    await assertProjectAdmin()
    return prisma.project.findUniqueOrThrow({ where: { id: z.string().regex(/^[a-f0-9]{24}$/i).parse(id) } })
  })
}

export async function getProjectBySlug(slug: string) {
  return action(async () => {
    await assertProjectAdmin()
    return prisma.project.findUniqueOrThrow({ where: { slug } })
  })
}

export async function createProject(input: CreateProjectInput) { return action(() => createProjectRecord(input)) }
export async function updateProject(input: UpdateProjectInput) { return action(() => updateProjectRecord(input)) }
export async function deleteProject(id: string) { return action(() => deleteProjectRecord(id)) }

export async function updateProjectFeatures(input: z.input<typeof UpdateFeaturesSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateFeaturesSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectModules(input: z.input<typeof UpdateModulesSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateModulesSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectFlow(input: z.input<typeof UpdateFlowSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateFlowSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectTechStack(input: z.input<typeof UpdateTechStackSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateTechStackSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectApiStructure(input: z.input<typeof UpdateApiStructureSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateApiStructureSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectDatabaseDesign(input: z.input<typeof UpdateDatabaseDesignSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateDatabaseDesignSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectDeployment(input: z.input<typeof UpdateDeploymentSchema>) {
  return action(async () => { const { projectId, ...data } = UpdateDeploymentSchema.parse(input); return updateProjectRecord({ id: projectId, ...data }) })
}
export async function updateProjectLifecycleStatus(id: string, lifecycleStatus: string) {
  return action(() => updateProjectRecord({ id, lifecycleStatus }))
}

export async function getProjectStats() {
  return action(async () => {
    await assertProjectAdmin()
    const projects = await prisma.project.findMany({ select: { lifecycleStatus: true, publishStatus: true } })
    const byLifecycle = Object.fromEntries(ProjectLifecycleStatus.options.map((status) => [status, projects.filter((p) => p.lifecycleStatus === status).length]))
    return { total: projects.length, byLifecycle, byPublishStatus: {
      published: projects.filter((p) => p.publishStatus === 'published').length,
      draft: projects.filter((p) => p.publishStatus === 'draft').length,
    } }
  })
}
