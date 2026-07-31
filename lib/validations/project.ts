import { z } from 'zod'

/**
 * Prisma returns `null` for an unset optional field (`String?`), but Zod's
 * `.optional()` only accepts `undefined`. Reading a document and saving it back
 * unchanged therefore failed validation — see TechStackItem.icon.
 *
 * These helpers accept what the database actually returns and normalise it, so
 * a round-trip is always valid.
 */
// The trailing `.optional()` keeps the key optional in the inferred type; a bare
// transform would make callers pass `icon: undefined` explicitly.
const optionalString = z.string().nullish().transform((v) => v ?? undefined).optional()
const optionalBool = z.boolean().nullish().transform((v) => v ?? undefined).optional()
const boolWithDefault = (fallback: boolean) =>
  z.boolean().nullish().transform((v) => v ?? fallback)
const intWithDefault = (fallback: number) =>
  z.number().int().nullish().transform((v) => v ?? fallback)

// Enums
export const ProjectLifecycleStatus = z.enum([
  'idea',
  'planning',
  'design',
  'development',
  'testing',
  'deployment',
  'live'
])

export const FeatureStatus = z.enum(['planned', 'in_progress', 'completed'])

export const TaskStatus = z.enum(['backlog', 'todo', 'in_progress', 'review', 'completed'])

export const TaskPriority = z.enum(['low', 'medium', 'high', 'urgent'])

export const TechCategory = z.enum(['frontend', 'backend', 'database', 'devops', 'ai', 'other'])

export const FlowNodeType = z.enum(['api', 'ui', 'database', 'logic', 'service', 'external'])

// Tech Stack Item
export const TechStackItemSchema = z.object({
  name: z.string().min(1, 'Tech name is required'),
  category: TechCategory,
  icon: optionalString
})

// Feature Item
export const FeatureItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Feature title is required'),
  done: boolWithDefault(false),
  order: intWithDefault(0)
})

// Task Item
export const TaskItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Task title is required'),
  description: optionalString,
  assignedTo: optionalString,
  status: TaskStatus,
  priority: TaskPriority,
  startDate: optionalString,
  endDate: optionalString,
  order: intWithDefault(0)
})

// Module Item
export const ModuleItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Module name is required'),
  description: optionalString,
  status: FeatureStatus,
  tasks: z.array(TaskItemSchema).default([]),
  order: intWithDefault(0)
})

// Roadmap Phase
export const RoadmapPhaseSchema = z.object({
  id: z.string(),
  phaseName: z.string().min(1, 'Phase name is required'),
  description: optionalString,
  order: intWithDefault(0),
  progress: z.number().int().min(0).max(100).default(0)
})

// Flow Node
export const FlowNodeSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Node label is required'),
  type: FlowNodeType,
  positionX: z.number(),
  positionY: z.number(),
  data: optionalString
})

// Flow Edge
export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: optionalString,
  animated: optionalBool
})

// Flow Diagram
export const FlowDiagramSchema = z.object({
  nodes: z.array(FlowNodeSchema).default([]),
  edges: z.array(FlowEdgeSchema).default([])
})

// API Endpoint
export const ApiEndpointSchema = z.object({
  id: z.string(),
  endpoint: z.string().min(1, 'Endpoint is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  description: optionalString,
  requestBody: optionalString,
  responseBody: optionalString
})

// Database Collection
export const DatabaseCollectionSchema = z.object({
  id: z.string(),
  collection: z.string().min(1, 'Collection name is required'),
  fields: z.string(),
  description: optionalString
})

// Deployment Info
export const DeploymentInfoSchema = z.object({
  platform: optionalString,
  domain: optionalString,
  environment: optionalString,
  ciCd: optionalString,
  repository: optionalString,
  branch: optionalString
})

// Create Project Schema
export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().min(1, 'Description is required'),
  longDescription: optionalString,
  outcome: optionalString,
  role: optionalString,
  projectType: z.string().default('webapp'),
  lifecycleStatus: ProjectLifecycleStatus.default('idea'),
  publishStatus: z.enum(['draft', 'published', 'archived']).default('draft'),
  coverImage: optionalString,
  logoUrl: optionalString,
  gallery: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  techStack: z.array(TechStackItemSchema).default([]),
  features: z.array(FeatureItemSchema).default([]),
  modules: z.array(ModuleItemSchema).default([]),
  roadmap: z.array(RoadmapPhaseSchema).default([]),
  flowDiagram: FlowDiagramSchema.optional(),
  apiStructure: z.array(ApiEndpointSchema).default([]),
  databaseDesign: z.array(DatabaseCollectionSchema).default([]),
  deployment: DeploymentInfoSchema.optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  clientProjectUrl: z.string().url().optional().or(z.literal('')),
  adminProjectUrl: z.string().url().optional().or(z.literal('')),
  clientLiveUrl: z.string().url().optional().or(z.literal('')),
  adminLiveUrl: z.string().url().optional().or(z.literal('')),
  androidDownloadUrl: z.string().url().optional().or(z.literal('')),
  githubUrlEnabled: z.boolean().default(true),
  demoUrlEnabled: z.boolean().default(true),
  clientProjectUrlEnabled: z.boolean().default(false),
  adminProjectUrlEnabled: z.boolean().default(false),
  clientLiveUrlEnabled: z.boolean().default(false),
  adminLiveUrlEnabled: z.boolean().default(false),
  androidDownloadUrlEnabled: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().default(0)
})

// Update Project Schema
export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string()
})

// Update Features Schema
export const UpdateFeaturesSchema = z.object({
  projectId: z.string(),
  features: z.array(FeatureItemSchema)
})

// Update Modules Schema
export const UpdateModulesSchema = z.object({
  projectId: z.string(),
  modules: z.array(ModuleItemSchema)
})

// Update Flow Schema
export const UpdateFlowSchema = z.object({
  projectId: z.string(),
  flowDiagram: FlowDiagramSchema
})

// Update Tech Stack Schema
export const UpdateTechStackSchema = z.object({
  projectId: z.string(),
  techStack: z.array(TechStackItemSchema)
})

// Update API Structure Schema
export const UpdateApiStructureSchema = z.object({
  projectId: z.string(),
  apiStructure: z.array(ApiEndpointSchema)
})

// Update Database Design Schema
export const UpdateDatabaseDesignSchema = z.object({
  projectId: z.string(),
  databaseDesign: z.array(DatabaseCollectionSchema)
})

// Update Deployment Schema
export const UpdateDeploymentSchema = z.object({
  projectId: z.string(),
  deployment: DeploymentInfoSchema
})

// Export types
export type ProjectLifecycleStatusType = z.infer<typeof ProjectLifecycleStatus>
export type FeatureStatusType = z.infer<typeof FeatureStatus>
export type TaskStatusType = z.infer<typeof TaskStatus>
export type TaskPriorityType = z.infer<typeof TaskPriority>
export type TechCategoryType = z.infer<typeof TechCategory>
export type FlowNodeTypeType = z.infer<typeof FlowNodeType>
export type TechStackItemType = z.infer<typeof TechStackItemSchema>
export type FeatureItemType = z.infer<typeof FeatureItemSchema>
export type TaskItemType = z.infer<typeof TaskItemSchema>
export type ModuleItemType = z.infer<typeof ModuleItemSchema>
export type RoadmapPhaseType = z.infer<typeof RoadmapPhaseSchema>
export type FlowNodeDataType = z.infer<typeof FlowNodeSchema>
export type FlowEdgeDataType = z.infer<typeof FlowEdgeSchema>
export type FlowDiagramType = z.infer<typeof FlowDiagramSchema>
export type ApiEndpointType = z.infer<typeof ApiEndpointSchema>
export type DatabaseCollectionType = z.infer<typeof DatabaseCollectionSchema>
export type DeploymentInfoType = z.infer<typeof DeploymentInfoSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
