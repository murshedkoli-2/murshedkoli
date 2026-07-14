import {
  ModuleItemType,
  TaskItemType,
  FeatureItemType,
  RoadmapPhaseType,
  ProjectLifecycleStatusType
} from '@/lib/validations/project'

/**
 * Calculate progress based on completed tasks within a module
 */
export function calculateModuleProgress(module: ModuleItemType): number {
  if (!module.tasks || module.tasks.length === 0) {
    // If no tasks, use module status
    switch (module.status) {
      case 'completed': return 100
      case 'in_progress': return 50
      default: return 0
    }
  }

  const completedTasks = module.tasks.filter(
    task => task.status === 'completed'
  ).length
  
  return Math.round((completedTasks / module.tasks.length) * 100)
}

/**
 * Calculate progress based on completed features
 */
export function calculateFeaturesProgress(features: FeatureItemType[]): number {
  if (!features || features.length === 0) return 0
  const done = features.filter(f => f.done).length
  return Math.round((done / features.length) * 100)
}

/**
 * Calculate overall project progress
 */
export function calculateOverallProgress(project: {
  modules?: ModuleItemType[]
  features?: FeatureItemType[]
  roadmap?: RoadmapPhaseType[]
}): number {
  const weights = {
    modules: 0.5,
    features: 0.3,
    roadmap: 0.2
  }

  let totalWeight = 0
  let weightedProgress = 0

  // Calculate modules progress
  if (project.modules && project.modules.length > 0) {
    const modulesProgress = project.modules.reduce((acc, module) => {
      return acc + calculateModuleProgress(module)
    }, 0) / project.modules.length

    weightedProgress += modulesProgress * weights.modules
    totalWeight += weights.modules
  }

  // Calculate features progress
  if (project.features && project.features.length > 0) {
    const featuresProgress = calculateFeaturesProgress(project.features)
    weightedProgress += featuresProgress * weights.features
    totalWeight += weights.features
  }

  // Calculate roadmap progress
  if (project.roadmap && project.roadmap.length > 0) {
    const roadmapProgress = project.roadmap.reduce((acc, phase) => {
      return acc + (phase.progress || 0)
    }, 0) / project.roadmap.length

    weightedProgress += roadmapProgress * weights.roadmap
    totalWeight += weights.roadmap
  }

  // If no data available, return 0
  if (totalWeight === 0) return 0

  // Normalize by actual weights used
  return Math.round(weightedProgress / totalWeight)
}

/**
 * Get task statistics from modules
 */
export function getTaskStats(modules: ModuleItemType[]): {
  total: number
  backlog: number
  todo: number
  inProgress: number
  review: number
  completed: number
} {
  const stats = {
    total: 0,
    backlog: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    completed: 0
  }

  modules.forEach(module => {
    module.tasks?.forEach(task => {
      stats.total++
      switch (task.status) {
        case 'backlog': stats.backlog++; break
        case 'todo': stats.todo++; break
        case 'in_progress': stats.inProgress++; break
        case 'review': stats.review++; break
        case 'completed': stats.completed++; break
      }
    })
  })

  return stats
}

/**
 * Get feature statistics
 */
export function getFeatureStats(features: FeatureItemType[]): {
  total: number
  planned: number
  inProgress: number
  completed: number
} {
  return {
    total: features.length,
    planned: features.filter(f => !f.done).length,
    inProgress: 0,
    completed: features.filter(f => f.done).length
  }
}

/**
 * Get lifecycle status info with color and label
 */
export function getLifecycleStatusInfo(status: ProjectLifecycleStatusType): {
  label: string
  color: string
  bgColor: string
  borderColor: string
  order: number
} {
  const statusMap: Record<ProjectLifecycleStatusType, {
    label: string
    color: string
    bgColor: string
    borderColor: string
    order: number
  }> = {
    idea: {
      label: 'Idea',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      order: 0
    },
    planning: {
      label: 'Planning',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      order: 1
    },
    design: {
      label: 'Design',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      order: 2
    },
    development: {
      label: 'Development',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      order: 3
    },
    testing: {
      label: 'Testing',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      order: 4
    },
    deployment: {
      label: 'Deployment',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      order: 5
    },
    live: {
      label: 'Live',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      order: 6
    }
  }

  return statusMap[status]
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get priority color classes
 */
export function getPriorityColor(priority: string): {
  color: string
  bgColor: string
  borderColor: string
} {
  const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    low: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    },
    medium: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    high: {
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    urgent: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  }

  return colors[priority] || colors.medium
}

/**
 * Get task status color classes
 */
export function getTaskStatusColor(status: string): {
  color: string
  bgColor: string
  borderColor: string
} {
  const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    backlog: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    },
    todo: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    in_progress: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    review: {
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    completed: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    }
  }

  return colors[status] || colors.backlog
}

/**
 * Get feature status color classes
 */
export function getFeatureStatusColor(status: string): {
  color: string
  bgColor: string
  borderColor: string
} {
  const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    planned: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    },
    in_progress: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    completed: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    }
  }

  return colors[status] || colors.planned
}

/**
 * Get tech category color classes
 */
export function getTechCategoryColor(category: string): {
  color: string
  bgColor: string
  borderColor: string
} {
  const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    frontend: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    backend: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    database: {
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    devops: {
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    ai: {
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    },
    other: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30'
    }
  }

  return colors[category] || colors.other
}
