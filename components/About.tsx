'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Code, Palette, Zap, ArrowRight, MapPin, Mail, Phone, Briefcase } from 'lucide-react'

interface ProfileData {
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  avatar?: string
  resume?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// 3D Tilt card component
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(10px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const features = [
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.',
      border: 'border-white/[0.04]',
      iconColor: 'text-zinc-400'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Modern Design',
      description: 'Creating beautiful, responsive interfaces with attention to user experience.',
      border: 'border-white/[0.04]',
      iconColor: 'text-zinc-400'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Performance',
      description: 'Optimizing applications for speed, accessibility, and search engines.',
      border: 'border-white/[0.04]',
      iconColor: 'text-zinc-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } }
  }

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] mb-6"
          >
            <Briefcase size={12} className="text-zinc-400" />
            <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">Who I Am</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            About Me
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400/90 leading-relaxed">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                profile?.description || 'I\'m a passionate web developer with expertise in modern technologies.'
              )}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content — Profile Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  profile?.name ? `Meet ${profile.name}` : 'My Journey'
                )}
              </h3>
            </motion.div>
            
            {!loading && profile && (
              <div className="grid gap-4">
                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="glass-card rounded-2xl p-5 group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-zinc-400">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <p className="text-[11px] text-zinc-500 tracking-wider uppercase">Professional Title</p>
                          <p className="text-white font-medium text-sm mt-0.5">{profile.title}</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
                
                {profile.location && (
                  <motion.div variants={itemVariants}>
                    <TiltCard>
                      <div className="glass-card rounded-2xl p-5 group">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-zinc-400">
                            <MapPin size={16} />
                          </div>
                          <div>
                            <p className="text-[11px] text-zinc-500 tracking-wider uppercase">Location</p>
                            <p className="text-white font-medium text-sm mt-0.5">{profile.location}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="glass-card rounded-2xl p-5 group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-zinc-400">
                          <Mail size={16} />
                        </div>
                        <div>
                          <p className="text-[11px] text-zinc-500 tracking-wider uppercase">Contact</p>
                          <p className="text-white font-medium text-sm mt-0.5">{profile.email}</p>
                          {profile.phone && <p className="text-zinc-500 text-[12px] mt-0.5">{profile.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            )}
            
            {(loading || !profile) && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[88px] bg-white/[0.03] rounded-2xl animate-pulse border border-white/[0.04]" />
                ))}
              </div>
            )}
            
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-4 px-6 py-2.5 rounded-lg border border-white/10 text-white text-[11px] font-semibold tracking-wider uppercase bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  const projectsSection = document.querySelector('#projects')
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                View Projects
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content — Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                What I Bring
              </h3>
              <p className="text-gray-400 text-base mb-8">
                Core values that drive my development approach
              </p>
            </motion.div>
            
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <TiltCard>
                  <div className="group glass-card rounded-2xl p-6 transition-all duration-500">
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] ${feature.iconColor}`}>
                        <div>{feature.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-white mb-2 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-zinc-400 text-[13px] leading-relaxed transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
