import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth/require-admin'
import { CreateProjectSchema, UpdateProjectSchema } from '@/lib/validations/project'
import { calculateOverallProgress } from '@/lib/utils/project-helpers'
import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
import { HttpError } from '@/lib/http'

export async function assertProjectAdmin() {
  if (!(await isAdmin())) throw new HttpError(401, 'Unauthorized')
}

const linkKeys = ['githubUrl', 'demoUrl', 'clientProjectUrl', 'adminProjectUrl', 'clientLiveUrl', 'adminLiveUrl', 'androidDownloadUrl'] as const

export async function createProjectRecord(input: unknown) {
  await assertProjectAdmin()
  const validated = CreateProjectSchema.parse(input)
  const links = Object.fromEntries(linkKeys.map((key) => [key, validated[key] || null]))
  const project = await prisma.project.create({
    data: {
      ...validated, ...links,
      overallProgress: calculateOverallProgress(validated),
    } as Prisma.ProjectCreateInput,
  })
  invalidatePortfolio()
  return project
}

export async function updateProjectRecord(input: unknown) {
  await assertProjectAdmin()
  const validated = UpdateProjectSchema.parse(input)
  // Zod defaults must not turn a partial update into replacement data.
  const supplied = new Set(Object.keys(input as object))
  const patch = Object.fromEntries(Object.entries(validated).filter(([key]) => key !== 'id' && supplied.has(key)))
  for (const key of linkKeys) {
    if (supplied.has(key)) patch[key] = validated[key] || null
  }
  if (supplied.has('techStack') && !supplied.has('technologies')) {
    patch.technologies = validated.techStack?.map((tech) => tech.name) ?? []
  }
  if (supplied.has('features') || supplied.has('modules') || supplied.has('roadmap')) {
    const current = await prisma.project.findUnique({ where: { id: validated.id } })
    if (!current) throw new HttpError(404, 'Project not found')
    patch.overallProgress = calculateOverallProgress({
      features: validated.features !== undefined && supplied.has('features') ? validated.features : current.features,
      modules: validated.modules !== undefined && supplied.has('modules') ? validated.modules : current.modules,
      roadmap: validated.roadmap !== undefined && supplied.has('roadmap') ? validated.roadmap : current.roadmap,
    })
  }
  const project = await prisma.project.update({ where: { id: validated.id }, data: patch as Prisma.ProjectUpdateInput })
  invalidatePortfolio()
  return project
}

export async function deleteProjectRecord(id: string) {
  await assertProjectAdmin()
  if (!/^[a-f0-9]{24}$/i.test(id)) throw new HttpError(400, 'Invalid project ID')
  await prisma.project.delete({ where: { id } })
  invalidatePortfolio()
}
