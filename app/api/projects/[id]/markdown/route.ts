import { requireAdmin } from '@/lib/auth/require-admin'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

function generateProjectMarkdown(project: any): string {
  const lines: string[] = []
  
  // Header
  lines.push(`# ${project.title}`)
  lines.push('')
  lines.push(`> Generated on ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  // Project Overview
  lines.push('## 📋 Project Overview')
  lines.push('')
  lines.push(`**Project Type:** ${project.projectType || 'webapp'}`)
  lines.push(`**Status:** ${project.lifecycleStatus || 'idea'}`)
  lines.push(`**Progress:** ${project.overallProgress || 0}%`)
  lines.push('')
  lines.push('### Description')
  lines.push(project.description || 'No description provided.')
  lines.push('')
  
  if (project.longDescription) {
    lines.push('### Detailed Description')
    lines.push(project.longDescription)
    lines.push('')
  }
  
  // Links
  if (project.githubUrl || project.demoUrl) {
    lines.push('### Links')
    if (project.githubUrl) lines.push(`- **GitHub:** ${project.githubUrl}`)
    if (project.demoUrl) lines.push(`- **Demo:** ${project.demoUrl}`)
    lines.push('')
  }
  
  // Tech Stack
  if (project.techStack && project.techStack.length > 0) {
    lines.push('## 🛠️ Tech Stack')
    lines.push('')
    
    const categories = ['frontend', 'backend', 'database', 'devops', 'ai', 'other']
    for (const category of categories) {
      const techInCategory = project.techStack.filter((t: any) => t.category === category)
      if (techInCategory.length > 0) {
        lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`)
        for (const tech of techInCategory) {
          lines.push(`- ${tech.name}`)
        }
        lines.push('')
      }
    }
  } else if (project.technologies && project.technologies.length > 0) {
    lines.push('## 🛠️ Technologies')
    lines.push('')
    for (const tech of project.technologies) {
      lines.push(`- ${tech}`)
    }
    lines.push('')
  }
  
  // Features
  if (project.features && project.features.length > 0) {
    lines.push('## ✨ Features')
    lines.push('')
    
    const statusEmoji: Record<string, string> = {
      'completed': '✅',
      'in_progress': '🔄',
      'planned': '📋'
    }
    
    for (const feature of project.features) {
      const emoji = statusEmoji[feature.status] || '📋'
      lines.push(`### ${emoji} ${feature.title}`)
      if (feature.description) {
        lines.push(feature.description)
      }
      lines.push(`- **Status:** ${feature.status}`)
      lines.push('')
    }
  }
  
  // Modules and Tasks
  if (project.modules && project.modules.length > 0) {
    lines.push('## 📦 Modules & Tasks')
    lines.push('')
    
    for (const mod of project.modules) {
      lines.push(`### ${mod.name}`)
      if (mod.description) {
        lines.push(mod.description)
      }
      lines.push(`**Status:** ${mod.status}`)
      lines.push('')
      
      if (mod.tasks && mod.tasks.length > 0) {
        lines.push('#### Tasks')
        lines.push('')
        lines.push('| Task | Status | Priority | Assigned To |')
        lines.push('|------|--------|----------|-------------|')
        
        for (const task of mod.tasks) {
          const status = task.status || 'backlog'
          const priority = task.priority || 'medium'
          const assignee = task.assignedTo || '-'
          lines.push(`| ${task.title} | ${status} | ${priority} | ${assignee} |`)
        }
        lines.push('')
      }
    }
  }
  
  // API Structure
  if (project.apiStructure && project.apiStructure.length > 0) {
    lines.push('## 🔌 API Structure')
    lines.push('')
    
    for (const api of project.apiStructure) {
      lines.push(`### \`${api.method}\` ${api.endpoint}`)
      lines.push('')
      if (api.description) {
        lines.push(api.description)
        lines.push('')
      }
      
      if (api.requestBody) {
        lines.push('**Request Body:**')
        lines.push('```json')
        lines.push(api.requestBody)
        lines.push('```')
        lines.push('')
      }
      
      if (api.responseBody) {
        lines.push('**Response:**')
        lines.push('```json')
        lines.push(api.responseBody)
        lines.push('```')
        lines.push('')
      }
    }
  }
  
  // Database Design
  if (project.databaseDesign && project.databaseDesign.length > 0) {
    lines.push('## 🗄️ Database Design')
    lines.push('')
    
    for (const collection of project.databaseDesign) {
      lines.push(`### ${collection.collection}`)
      lines.push('')
      if (collection.description) {
        lines.push(collection.description)
        lines.push('')
      }
      
      if (collection.fields) {
        lines.push('**Schema:**')
        lines.push('```json')
        lines.push(collection.fields)
        lines.push('```')
        lines.push('')
      }
    }
  }
  
  // Flow Diagram (text representation)
  if (project.flowDiagram?.nodes && project.flowDiagram.nodes.length > 0) {
    lines.push('## 🔀 Application Flow')
    lines.push('')
    lines.push('### Components')
    lines.push('')
    
    const typeEmoji: Record<string, string> = {
      'api': '🔌',
      'ui': '🖥️',
      'database': '🗄️',
      'logic': '⚙️',
      'service': '🔧',
      'external': '🌐'
    }
    
    for (const node of project.flowDiagram.nodes) {
      const emoji = typeEmoji[node.type] || '📦'
      lines.push(`- ${emoji} **${node.label}** (${node.type})`)
    }
    lines.push('')
    
    if (project.flowDiagram.edges && project.flowDiagram.edges.length > 0) {
      lines.push('### Connections')
      lines.push('')
      
      const nodeMap = new Map(project.flowDiagram.nodes.map((n: any) => [n.id, n.label]))
      
      for (const edge of project.flowDiagram.edges) {
        const sourceLabel = nodeMap.get(edge.source) || edge.source
        const targetLabel = nodeMap.get(edge.target) || edge.target
        const label = edge.label ? ` (${edge.label})` : ''
        lines.push(`- ${sourceLabel} → ${targetLabel}${label}`)
      }
      lines.push('')
    }
  }
  
  // Deployment Info
  if (project.deployment) {
    lines.push('## 🚀 Deployment')
    lines.push('')
    
    const d = project.deployment
    if (d.platform) lines.push(`- **Platform:** ${d.platform}`)
    if (d.domain) lines.push(`- **Domain:** ${d.domain}`)
    if (d.environment) lines.push(`- **Environment:** ${d.environment}`)
    if (d.repository) lines.push(`- **Repository:** ${d.repository}`)
    if (d.branch) lines.push(`- **Branch:** ${d.branch}`)
    if (d.ciCd) lines.push(`- **CI/CD:** ${d.ciCd}`)
    lines.push('')
  }
  
  // Roadmap
  if (project.roadmap && project.roadmap.length > 0) {
    lines.push('## 🗺️ Roadmap')
    lines.push('')
    
    for (const phase of project.roadmap) {
      const progress = phase.progress || 0
      const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10))
      lines.push(`### Phase ${phase.order + 1}: ${phase.phaseName}`)
      if (phase.description) {
        lines.push(phase.description)
      }
      lines.push(`Progress: [${progressBar}] ${progress}%`)
      lines.push('')
    }
  }
  
  // AI Context Section
  lines.push('---')
  lines.push('')
  lines.push('## 🤖 AI Development Context')
  lines.push('')
  lines.push('This section provides structured context for AI assistants to help build this project.')
  lines.push('')
  
  lines.push('### Project Summary')
  lines.push('```yaml')
  lines.push(`name: "${project.title}"`)
  lines.push(`type: ${project.projectType || 'webapp'}`)
  lines.push(`status: ${project.lifecycleStatus || 'idea'}`)
  lines.push(`progress: ${project.overallProgress || 0}%`)
  if (project.techStack && project.techStack.length > 0) {
    lines.push('tech_stack:')
    for (const tech of project.techStack) {
      lines.push(`  - name: "${tech.name}"`)
      lines.push(`    category: ${tech.category}`)
    }
  }
  lines.push('```')
  lines.push('')
  
  // Feature checklist
  if (project.features && project.features.length > 0) {
    lines.push('### Feature Checklist')
    lines.push('')
    for (const feature of project.features) {
      const checkbox = feature.status === 'completed' ? '[x]' : '[ ]'
      lines.push(`- ${checkbox} ${feature.title}`)
    }
    lines.push('')
  }
  
  // Task summary
  if (project.modules && project.modules.length > 0) {
    const allTasks = project.modules.flatMap((m: any) => m.tasks || [])
    if (allTasks.length > 0) {
      const tasksByStatus = {
        backlog: allTasks.filter((t: any) => t.status === 'backlog').length,
        todo: allTasks.filter((t: any) => t.status === 'todo').length,
        in_progress: allTasks.filter((t: any) => t.status === 'in_progress').length,
        review: allTasks.filter((t: any) => t.status === 'review').length,
        completed: allTasks.filter((t: any) => t.status === 'completed').length
      }
      
      lines.push('### Task Summary')
      lines.push('')
      lines.push(`- **Total Tasks:** ${allTasks.length}`)
      lines.push(`- **Backlog:** ${tasksByStatus.backlog}`)
      lines.push(`- **To Do:** ${tasksByStatus.todo}`)
      lines.push(`- **In Progress:** ${tasksByStatus.in_progress}`)
      lines.push(`- **In Review:** ${tasksByStatus.review}`)
      lines.push(`- **Completed:** ${tasksByStatus.completed}`)
      lines.push('')
    }
  }
  
  lines.push('### Instructions for AI')
  lines.push('')
  lines.push('When working on this project, please:')
  lines.push('')
  lines.push('1. **Respect the tech stack** - Use only the technologies listed above')
  lines.push('2. **Follow the API structure** - Implement endpoints as documented')
  lines.push('3. **Use the database schema** - Follow the collection/table designs')
  lines.push('4. **Complete features in order** - Start with planned features')
  lines.push('5. **Update progress** - Mark tasks as completed when done')
  lines.push('')
  
  lines.push('---')
  lines.push(`*Generated by Portfolio Project Manager*`)
  
  return lines.join('\n')
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    
    const project = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    const markdown = generateProjectMarkdown(project)
    const filename = `${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}-ai-context.md`
    
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    })
  } catch (error) {
    console.error('Error generating markdown:', error)
    return NextResponse.json(
      { error: 'Failed to generate markdown' },
      { status: 500 }
    )
  }
}
