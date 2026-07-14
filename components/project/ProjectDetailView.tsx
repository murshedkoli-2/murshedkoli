'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, ExternalLink, Github, Calendar, Clock,
  Target, CheckCircle2, Circle, ChevronDown, ChevronRight,
  Cpu, Database, Globe, Server, Sparkles, Package,
  Code, Workflow, Rocket
} from 'lucide-react'
import { ProgressBar, CircularProgress } from '@/components/ui/Progress'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/FormElements'
import { FlowBuilder } from '@/components/flow/FlowBuilder'
import { 
  getLifecycleStatusInfo, 
  getTechCategoryColor, 
  getFeatureStats, 
  formatDate 
} from '@/lib/utils/project-helpers'
import {
  ProjectLifecycleStatusType,
  TechCategoryType,
  TechStackItemType,
  FeatureItemType,
  ModuleItemType,
  RoadmapPhaseType,
  ApiEndpointType,
  DatabaseCollectionType
} from '@/lib/validations/project'

interface ProjectDetailViewProps {
  project: any
}

const CATEGORY_ICONS: Record<TechCategoryType, React.ReactNode> = {
  frontend: <Globe size={14} />,
  backend: <Server size={14} />,
  database: <Database size={14} />,
  devops: <Package size={14} />,
  ai: <Sparkles size={14} />,
  other: <Cpu size={14} />
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false)

  const statusInfo = getLifecycleStatusInfo(project.lifecycleStatus as ProjectLifecycleStatusType)
  const featureStats = getFeatureStats(project.features || [])

  const toggleModule = (id: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedModules(newExpanded)
  }

  // Group tech stack by category
  const groupedTechStack = (project.techStack || []).reduce((acc: Record<string, TechStackItemType[]>, tech: TechStackItemType) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        {project.coverImage && (
          <div className="absolute inset-0 h-96">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover opacity-20"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Back Link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            {project.logoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0"
              >
                <Image
                  src={project.logoUrl}
                  alt={`${project.title} logo`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </motion.div>
            )}

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-3 mb-3"
              >
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                  {statusInfo.label}
                </span>
                {project.featured && (
                  <Badge variant="warning">⭐ Featured</Badge>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {project.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 mb-6 max-w-2xl"
              >
                {project.description}
              </motion.p>

              {/* Progress & Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6"
              >
                {/* Progress */}
                <div className="flex items-center gap-3">
                  <CircularProgress value={project.overallProgress || 0} size={50} />
                  <div>
                    <p className="text-sm text-gray-400">Progress</p>
                    <p className="font-semibold">{project.overallProgress || 0}%</p>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  {project.demoUrlEnabled !== false && project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrlEnabled !== false && project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Github size={18} />
                      Source Code
                    </a>
                  )}
                  {project.clientLiveUrlEnabled && project.clientLiveUrl && (
                    <a
                      href={project.clientLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Client Live
                    </a>
                  )}
                  {project.adminLiveUrlEnabled && project.adminLiveUrl && (
                    <a
                      href={project.adminLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Admin Live
                    </a>
                  )}
                  {project.androidDownloadUrlEnabled && project.androidDownloadUrl && (
                    <a
                      href={project.androidDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Android App
                    </a>
                  )}
                  {project.clientProjectUrlEnabled && project.clientProjectUrl && (
                    <a
                      href={project.clientProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Client Project
                    </a>
                  )}
                  {project.adminProjectUrlEnabled && project.adminProjectUrl && (
                    <a
                      href={project.adminProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                      Admin Project
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Long Description */}
            {project.longDescription && (
              <Card>
                <h2 className="text-xl font-semibold mb-4">About This Project</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{project.longDescription}</p>
                </div>
              </Card>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target size={20} />
                    Features
                  </h2>
                  <span className="text-sm text-gray-400">
                    {featureStats.completed} of {featureStats.total} completed
                  </span>
                </div>

                <div className="space-y-3">
                  {project.features.map((feature: FeatureItemType) => {
                    const isDone = (feature as any).done ?? (feature as any).status === 'completed'
                    return (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg"
                      >
                        {isDone ? (
                          <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                        ) : (
                          <Circle className="text-gray-500 shrink-0 mt-0.5" size={18} />
                        )}
                        <p className={`font-medium ${isDone ? 'text-white' : 'text-gray-300'}`}>
                          {feature.title}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Modules & Tasks */}
            {project.modules && project.modules.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Code size={20} />
                  Modules & Tasks
                </h2>

                <div className="space-y-3">
                  {project.modules.map((module: ModuleItemType) => (
                    <div key={module.id} className="bg-zinc-900/50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left"
                      >
                        {expandedModules.has(module.id) ? (
                          <ChevronDown size={18} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-400" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{module.name}</h3>
                          {module.description && (
                            <p className="text-sm text-gray-500">{module.description}</p>
                          )}
                        </div>
                        <StatusBadge status={module.status} />
                        <Badge variant="default">{module.tasks.length} tasks</Badge>
                      </button>

                      {expandedModules.has(module.id) && module.tasks.length > 0 && (
                        <div className="border-t border-zinc-800 p-4 space-y-2">
                          {module.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/30"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />
                              ) : (
                                <Circle className="text-gray-500 shrink-0" size={16} />
                              )}
                              <span className={task.status === 'completed' ? 'text-gray-400' : 'text-white'}>
                                {task.title}
                              </span>
                              <StatusBadge status={task.status} className="ml-auto" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Flow Diagram */}
            {project.flowDiagram && project.flowDiagram.nodes && project.flowDiagram.nodes.length > 0 && (
              <Card className="!p-0 overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Workflow size={20} />
                    Architecture Flow
                  </h2>
                </div>
                <FlowBuilder
                  nodes={project.flowDiagram.nodes}
                  edges={project.flowDiagram.edges || []}
                  onChange={() => {}}
                  readOnly={true}
                />
              </Card>
            )}

            {/* Developer Info Toggle */}
            {((project.apiStructure && project.apiStructure.length > 0) || 
              (project.databaseDesign && project.databaseDesign.length > 0)) && (
              <div>
                <button
                  onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                  {showDeveloperInfo ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <Code size={18} />
                  <span>Developer Documentation</span>
                </button>

                {showDeveloperInfo && (
                  <div className="space-y-6">
                    {/* API Structure */}
                    {project.apiStructure && project.apiStructure.length > 0 && (
                      <Card>
                        <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
                        <div className="space-y-2">
                          {project.apiStructure.map((endpoint: ApiEndpointType) => (
                            <div key={endpoint.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg font-mono text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                                endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {endpoint.method}
                              </span>
                              <code className="text-gray-300">{endpoint.endpoint}</code>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Database Design */}
                    {project.databaseDesign && project.databaseDesign.length > 0 && (
                      <Card>
                        <h3 className="text-lg font-semibold mb-4">Database Collections</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {project.databaseDesign.map((collection: DatabaseCollectionType) => (
                            <div key={collection.id} className="p-3 bg-zinc-900/50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Database size={16} className="text-purple-400" />
                                <span className="font-medium">{collection.collection}</span>
                              </div>
                              {collection.description && (
                                <p className="text-xs text-gray-500">{collection.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cpu size={18} />
                  Tech Stack
                </h2>

                <div className="space-y-4">
                  {Object.entries(groupedTechStack).map(([category, techs]) => {
                    const colors = getTechCategoryColor(category)
                    return (
                      <div key={category}>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                          {CATEGORY_ICONS[category as TechCategoryType]}
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(techs as TechStackItemType[]).map((tech) => (
                            <span
                              key={tech.name}
                              className={`px-2.5 py-1 text-sm rounded-lg ${colors.bgColor} ${colors.color} border ${colors.borderColor}`}
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Roadmap */}
            {project.roadmap && project.roadmap.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Roadmap</h2>

                <div className="space-y-4">
                  {project.roadmap.map((phase: RoadmapPhaseType, index: number) => (
                    <div key={phase.id} className="relative pl-6">
                      {/* Timeline line */}
                      {index < project.roadmap.length - 1 && (
                        <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-zinc-800" />
                      )}
                      
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 ${
                        phase.progress >= 100 ? 'bg-emerald-500 border-emerald-500' :
                        phase.progress > 0 ? 'bg-blue-500 border-blue-500' :
                        'bg-zinc-800 border-zinc-700'
                      }`} />

                      <div>
                        <h3 className="font-medium">{phase.phaseName}</h3>
                        {phase.description && (
                          <p className="text-sm text-gray-500 mt-1">{phase.description}</p>
                        )}
                        <ProgressBar value={phase.progress} size="sm" className="mt-2" showLabel={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Deployment Info */}
            {project.deployment && project.deployment.platform && (
              <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Rocket size={18} />
                  Deployment
                </h2>

                <div className="space-y-3">
                  {project.deployment.platform && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Platform</p>
                      <p className="font-medium capitalize">{project.deployment.platform}</p>
                    </div>
                  )}
                  {project.deployment.environment && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Environment</p>
                      <p className="font-medium capitalize">{project.deployment.environment}</p>
                    </div>
                  )}
                  {project.deployment.domain && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Domain</p>
                      <a 
                        href={project.deployment.domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {project.deployment.domain}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Project Info */}
            <Card className="!bg-zinc-900/30">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="capitalize">{project.projectType || 'Web App'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span>{formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
