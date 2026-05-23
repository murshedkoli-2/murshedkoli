'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ExternalLink, Github, Eye, Rocket, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface ProjectData {
  id: string
  title: string
  slug?: string
  description: string
  longDescription?: string
  projectType?: 'webapp' | 'android' | 'desktop' | 'api'
  lifecycleStatus?: string
  publishStatus?: string
  logoUrl?: string
  coverImage?: string
  technologies: string[]
  techStack?: Array<{ name: string; category: string; icon?: string }>
  githubUrl?: string
  demoUrl?: string
  clientProjectUrl?: string
  adminProjectUrl?: string
  clientLiveUrl?: string
  adminLiveUrl?: string
  androidDownloadUrl?: string
  githubUrlEnabled?: boolean
  demoUrlEnabled?: boolean
  clientProjectUrlEnabled?: boolean
  adminProjectUrlEnabled?: boolean
  clientLiveUrlEnabled?: boolean
  adminLiveUrlEnabled?: boolean
  androidDownloadUrlEnabled?: boolean
  featured: boolean
  order: number
  overallProgress?: number
  createdAt: string
  updatedAt: string
}

const ProjectCard = ({ project, index, isInView, isFeatured = false }: { 
  project: ProjectData, 
  index: number, 
  isInView: boolean,
  isFeatured?: boolean 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const technologies = project.techStack && project.techStack.length > 0 
    ? project.techStack.map(t => t.name)
    : project.technologies || []

  const getProjectTypeStyles = (type?: string) => {
    return { bg: 'bg-white/[0.02]', text: 'text-zinc-400', border: 'border-white/[0.05]' }
  }

  const typeStyles = getProjectTypeStyles(project.projectType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden ${
        isFeatured ? 'md:col-span-1' : ''
      }`}
    >
      {/* Card container */}
      <div className="relative h-full bg-white/[0.01] backdrop-blur-sm border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/[0.08] hover:shadow-xl" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Image section */}
        <div className={`relative overflow-hidden ${isFeatured ? 'h-56 md:h-64' : 'h-48'}`}>
          {(project.coverImage) ? (
            <Image
              src={project.coverImage || ''}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              fill
              unoptimized
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${typeStyles.bg} flex items-center justify-center`}>
              <Rocket size={48} className="text-white/30" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Progress badge */}
          {project.overallProgress !== undefined && project.overallProgress > 0 && project.overallProgress < 100 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 flex items-center gap-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/[0.04]"
            >
              <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-zinc-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.overallProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{project.overallProgress}%</span>
            </motion.div>
          )}

          {/* Project type & status badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-[#050507]/80 text-zinc-400 border border-white/[0.04] backdrop-blur-sm">
              {project.projectType === 'android' ? 'Android' : project.projectType === 'api' ? 'API' : 'Web App'}
            </span>
            {project.lifecycleStatus && project.lifecycleStatus !== 'live' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-[#050507]/80 text-zinc-500 border border-white/[0.04] backdrop-blur-sm">
                {project.lifecycleStatus}
              </span>
            )}
          </div>

          {/* Quick action buttons (visible on hover) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {project.demoUrlEnabled !== false && project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.githubUrlEnabled !== false && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-lg border border-white/5"
              >
                <Github size={16} />
              </a>
            )}
            {project.slug && (
              <a
                href={`/projects/${project.slug}`}
                className="p-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-lg border border-white/5"
              >
                <Eye size={16} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Content section */}
        <div className="p-6">
          {/* Title with logo */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.01] overflow-hidden flex items-center justify-center shrink-0">
              {project.logoUrl ? (
                <Image src={project.logoUrl} alt={`${project.title} logo`} className="w-full h-full object-cover" width={32} height={32} unoptimized />
              ) : (
                <span className="text-xs text-zinc-400 font-bold">{project.title.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h4 className="text-base font-semibold text-white transition-colors line-clamp-1">
              {project.title}
            </h4>
          </div>

          {/* Description */}
          <p className="text-zinc-500 text-[13px] leading-relaxed mb-4 line-clamp-2 transition-colors">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-5">
            {technologies.slice(0, isFeatured ? 5 : 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-white/[0.01] text-zinc-400 rounded border border-white/[0.04] text-[10px] font-medium"
              >
                {tech}
              </span>
            ))}
            {technologies.length > (isFeatured ? 5 : 4) && (
              <span className="px-2 py-0.5 text-zinc-600 text-[10px]">
                +{technologies.length - (isFeatured ? 5 : 4)}
              </span>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-3.5 flex-wrap">
              {project.githubUrlEnabled !== false && project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-[12px] font-medium transition-colors"
                >
                  <Github size={13} />
                  <span>Code</span>
                </a>
              )}
              {project.demoUrlEnabled !== false && project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-[12px] font-medium transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Demo</span>
                </a>
              )}
            </div>
            {project.slug && (
              <a
                href={`/projects/${project.slug}`}
                className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors group/link"
              >
                <span>Details</span>
                <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const fallbackProjects: ProjectData[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js, featuring real-time inventory, payment processing, and admin dashboard.',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB', 'Tailwind CSS'],
      projectType: 'webapp',
      lifecycleStatus: 'live',
      githubUrl: '#',
      demoUrl: '#',
      featured: true,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: '3D Portfolio Website',
      description: 'An interactive portfolio website with Three.js animations, particle systems, and immersive 3D elements.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'WebGL', 'GLSL'],
      projectType: 'webapp',
      lifecycleStatus: 'live',
      githubUrl: '#',
      demoUrl: '#',
      featured: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const displayProjects = projects.length > 0 ? projects : fallbackProjects
  const featuredProjects = displayProjects.filter(project => project.featured)
  const otherProjects = displayProjects.filter(project => !project.featured)

  return (
    <section id="projects" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] mb-6"
          >
            <Rocket size={12} className="text-zinc-400" />
            <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">My Work</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            {loading ? 'Loading projects...' : `Explore projects showcasing my skills and passion for development.`}
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {!loading && featuredProjects.length > 0 && (
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              className="text-lg font-semibold text-white mb-6 flex items-center gap-2.5"
            >
              <span className="w-5 h-[1px] bg-zinc-800" />
              Featured Work
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isInView={isInView} isFeatured />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {!loading && otherProjects.length > 0 && (
          <div>
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-white mb-6 flex items-center gap-2.5"
            >
              <span className="w-5 h-[1px] bg-zinc-800" />
              Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <p className="text-zinc-500 text-sm">
              Want to see more or discuss a project?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2 rounded-lg bg-white text-black text-[11px] font-semibold tracking-wider uppercase hover:bg-zinc-200 transition-colors flex items-center gap-2"
              onClick={() => {
                const contactSection = document.querySelector('#contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Get In Touch
              <ArrowRight size={12} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
