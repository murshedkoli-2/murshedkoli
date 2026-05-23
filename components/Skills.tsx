'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Zap, Layers } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
  isEnabled?: boolean
}

const SkillCard = ({ skill, index, isInView }: { skill: Skill; index: number; isInView: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) scale(1.02)`
    
    // Update glow position
    const glowEl = cardRef.current.querySelector('.glow-follow') as HTMLElement
    if (glowEl) {
      glowEl.style.left = `${e.clientX - rect.left}px`
      glowEl.style.top = `${e.clientY - rect.top}px`
    }
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
    setIsHovered(false)
  }

  const getSkillGradient = (proficiency: number) => {
    return 'from-white to-zinc-400'
  }

  const getSkillGlow = (proficiency: number) => {
    return 'rgba(255, 255, 255, 0.01)'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return '🤖'
      case 'frontend': return '🎨'
      case 'backend': return '⚙️'
      case 'tools': return '🛠️'
      case 'languages': return '💻'
      case 'vibe-coding': return '🎵'
      default: return '✨'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.6) }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-default"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card background */}
        <div className="relative bg-white/[0.01] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500"
          style={{ boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)' }}
        >

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {skill.icon && (
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{skill.icon}</span>
                )}
                <div>
                  <h3 className="text-white font-medium text-[14px] group-hover:text-zinc-200 transition-colors">{skill.name}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    {getCategoryIcon(skill.category)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-zinc-500" />
                <span className="font-semibold text-xs text-zinc-400">
                  {skill.proficiency}%
                </span>
              </div>
            </div>

            <div className="relative h-1 bg-white/[0.02] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.2 + Math.min(index * 0.03, 0.6), ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-zinc-400"
              >
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const response = await fetch('/api/skills', {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!response.ok) throw new Error(`Failed to fetch skills: ${response.status}`)
        
        const data = await response.json()
        const enabledSkills = Array.isArray(data) ? data.filter((skill: Skill) => skill.isEnabled !== false) : []
        setSkills(enabledSkills)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchSkills, 50)
    return () => clearTimeout(timer)
  }, [])

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const categories = ['all', ...Object.keys(skillsByCategory)]

  const formatCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All Skills',
      ai: 'AI & ML',
      'vibe-coding': 'Vibe Coding',
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'Tools & DevOps',
      languages: 'Languages',
    }
    return labels[category] || category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeCategory)

  return (
    <section id="skills" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Header */}
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
            <Layers size={12} className="text-zinc-400" />
            <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">Technical Expertise</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Category Filter */}
        {!loading && !error && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-[11px] font-semibold tracking-wider uppercase border transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white border-white/5 hover:border-white/10'
                }`}
              >
                <span>{formatCategoryLabel(category)}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && !error && filteredSkills.length > 0 && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSkills
                .sort((a, b) => b.proficiency - a.proficiency)
                .map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
                ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💻</div>
            <p className="text-gray-400 text-lg">No skills data available yet.</p>
          </motion.div>
        )}

        {/* Always Learning */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <div className="relative overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.01] p-6 md:p-8">
              <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl border border-white/[0.06] bg-white/[0.01] flex items-center justify-center text-zinc-400">
                    <Zap size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-white mb-1.5">
                    Always Learning & Growing
                  </h3>
                  <p className="text-zinc-500 text-[13px] max-w-2xl leading-relaxed">
                    Technology evolves rapidly, and I&apos;m committed to continuous learning. 
                    Currently exploring AI/ML integration, Web3 systems, and high-performance interactive architectures.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Skills
