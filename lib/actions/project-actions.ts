'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  UpdateFeaturesSchema,
  UpdateModulesSchema,
  UpdateFlowSchema,
  UpdateTechStackSchema,
  UpdateApiStructureSchema,
  UpdateDatabaseDesignSchema,
  UpdateDeploymentSchema,
  CreateProjectInput,
  UpdateProjectInput
} from '@/lib/validations/project'
import { calculateOverallProgress } from '@/lib/utils/project-helpers'

// Type for action response
type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get all projects with optional filtering
 */
export async function getProjects(options?: {
  lifecycleStatus?: string
  publishStatus?: string
  featured?: boolean
  limit?: number
}): Promise<ActionResponse> {
  try {
    const where: Record<string, unknown> = {}
    
    if (options?.lifecycleStatus) {
      where.lifecycleStatus = options.lifecycleStatus
    }
    if (options?.publishStatus) {
      where.publishStatus = options.publishStatus
    }
    if (options?.featured !== undefined) {
      where.featured = options.featured
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      take: options?.limit
    })

    return { success: true, data: projects }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { success: false, error: 'Failed to fetch projects' }
  }
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<ActionResponse> {
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    return { success: true, data: project }
  } catch (error) {
    console.error('Error fetching project:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ActionResponse> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug }
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    return { success: true, data: project }
  } catch (error) {
    console.error('Error fetching project:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput): Promise<ActionResponse> {
  try {
    const validated = CreateProjectSchema.parse(input)
    
    // Check if slug already exists
    const existing = await prisma.project.findUnique({
      where: { slug: validated.slug }
    })
    
    if (existing) {
      return { success: false, error: 'A project with this slug already exists' }
    }

    // Calculate initial progress
    const overallProgress = calculateOverallProgress({
      modules: validated.modules,
      features: validated.features,
      roadmap: validated.roadmap
    })

    const project = await prisma.project.create({
      data: {
        ...(validated as any),
        overallProgress,
        githubUrl: validated.githubUrl || null,
        demoUrl: validated.demoUrl || null
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/projects')
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create project' }
  }
}

/**
 * Update a project
 */
export async function updateProject(input: UpdateProjectInput): Promise<ActionResponse> {
  try {
    const validated = UpdateProjectSchema.parse(input)
    const { id, ...updateData } = validated

    // If slug is being updated, check for duplicates
    if (updateData.slug) {
      const existing = await prisma.project.findFirst({
        where: {
          slug: updateData.slug,
          NOT: { id }
        }
      })
      
      if (existing) {
        return { success: false, error: 'A project with this slug already exists' }
      }
    }

    // Calculate progress if relevant fields are updated
    let overallProgress: number | undefined
    if (updateData.modules || updateData.features || updateData.roadmap) {
      const currentProject = await prisma.project.findUnique({ where: { id } })
      if (currentProject) {
        overallProgress = calculateOverallProgress({
          modules: updateData.modules || (currentProject.modules as any[]),
          features: updateData.features || (currentProject.features as any[]),
          roadmap: updateData.roadmap || (currentProject.roadmap as any[])
        })
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(updateData as any),
        ...(overallProgress !== undefined && { overallProgress }),
        githubUrl: updateData.githubUrl || null,
        demoUrl: updateData.demoUrl || null
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/projects')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update project' }
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    await prisma.project.delete({
      where: { id }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/projects')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error: 'Failed to delete project' }
  }
}

/**
 * Update project features
 */
export async function updateProjectFeatures(input: {
  projectId: string
  features: any[]
}): Promise<ActionResponse> {
  try {
    const validated = UpdateFeaturesSchema.parse(input)
    
    const currentProject = await prisma.project.findUnique({
      where: { id: validated.projectId }
    })
    
    if (!currentProject) {
      return { success: false, error: 'Project not found' }
    }

    const overallProgress = calculateOverallProgress({
      modules: currentProject.modules as any[],
      features: validated.features,
      roadmap: currentProject.roadmap as any[]
    })

    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        features: validated.features as any,
        overallProgress
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating features:', error)
    return { success: false, error: 'Failed to update features' }
  }
}

/**
 * Update project modules
 */
export async function updateProjectModules(input: {
  projectId: string
  modules: any[]
}): Promise<ActionResponse> {
  try {
    const validated = UpdateModulesSchema.parse(input)
    
    const currentProject = await prisma.project.findUnique({
      where: { id: validated.projectId }
    })
    
    if (!currentProject) {
      return { success: false, error: 'Project not found' }
    }

    const overallProgress = calculateOverallProgress({
      modules: validated.modules,
      features: currentProject.features as any[],
      roadmap: currentProject.roadmap as any[]
    })

    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        modules: validated.modules,
        overallProgress
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating modules:', error)
    return { success: false, error: 'Failed to update modules' }
  }
}

/**
 * Update project flow diagram
 */
export async function updateProjectFlow(input: {
  projectId: string
  flowDiagram: { nodes: any[]; edges: any[] }
}): Promise<ActionResponse> {
  try {
    const validated = UpdateFlowSchema.parse(input)
    
    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        flowDiagram: validated.flowDiagram
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating flow diagram:', error)
    return { success: false, error: 'Failed to update flow diagram' }
  }
}

/**
 * Update project tech stack
 */
export async function updateProjectTechStack(input: {
  projectId: string
  techStack: any[]
}): Promise<ActionResponse> {
  try {
    const validated = UpdateTechStackSchema.parse(input)
    
    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        techStack: validated.techStack,
        // Also update legacy technologies field for backward compatibility
        technologies: validated.techStack.map(t => t.name)
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating tech stack:', error)
    return { success: false, error: 'Failed to update tech stack' }
  }
}

/**
 * Update project API structure
 */
export async function updateProjectApiStructure(input: {
  projectId: string
  apiStructure: any[]
}): Promise<ActionResponse> {
  try {
    const validated = UpdateApiStructureSchema.parse(input)
    
    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        apiStructure: validated.apiStructure
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating API structure:', error)
    return { success: false, error: 'Failed to update API structure' }
  }
}

/**
 * Update project database design
 */
export async function updateProjectDatabaseDesign(input: {
  projectId: string
  databaseDesign: any[]
}): Promise<ActionResponse> {
  try {
    const validated = UpdateDatabaseDesignSchema.parse(input)
    
    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        databaseDesign: validated.databaseDesign
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating database design:', error)
    return { success: false, error: 'Failed to update database design' }
  }
}

/**
 * Update project deployment info
 */
export async function updateProjectDeployment(input: {
  projectId: string
  deployment: any
}): Promise<ActionResponse> {
  try {
    const validated = UpdateDeploymentSchema.parse(input)
    
    const project = await prisma.project.update({
      where: { id: validated.projectId },
      data: {
        deployment: validated.deployment
      }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating deployment:', error)
    return { success: false, error: 'Failed to update deployment info' }
  }
}

/**
 * Update project lifecycle status
 */
export async function updateProjectLifecycleStatus(
  id: string,
  lifecycleStatus: string
): Promise<ActionResponse> {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { lifecycleStatus: lifecycleStatus as any }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath(`/projects/${project.slug}`)
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Error updating lifecycle status:', error)
    return { success: false, error: 'Failed to update lifecycle status' }
  }
}

/**
 * Get project statistics
 */
export async function getProjectStats(): Promise<ActionResponse> {
  try {
    const [
      total,
      idea,
      planning,
      design,
      development,
      testing,
      deployment,
      live,
      published,
      draft
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { lifecycleStatus: 'idea' } }),
      prisma.project.count({ where: { lifecycleStatus: 'planning' } }),
      prisma.project.count({ where: { lifecycleStatus: 'design' } }),
      prisma.project.count({ where: { lifecycleStatus: 'development' } }),
      prisma.project.count({ where: { lifecycleStatus: 'testing' } }),
      prisma.project.count({ where: { lifecycleStatus: 'deployment' } }),
      prisma.project.count({ where: { lifecycleStatus: 'live' } }),
      prisma.project.count({ where: { publishStatus: 'published' } }),
      prisma.project.count({ where: { publishStatus: 'draft' } })
    ])

    return {
      success: true,
      data: {
        total,
        byLifecycle: { idea, planning, design, development, testing, deployment, live },
        byPublishStatus: { published, draft }
      }
    }
  } catch (error) {
    console.error('Error fetching project stats:', error)
    return { success: false, error: 'Failed to fetch project statistics' }
  }
}
