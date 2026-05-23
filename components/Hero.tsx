'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { Github, Linkedin, Twitter, ExternalLink, Facebook, Youtube, ArrowUpRight, MessageCircle } from 'lucide-react'
import type { PublicProfile } from '@/lib/site-data'

interface HeroProps {
  profile: PublicProfile
  projectCount?: number
  skillCount?: number
}

// Minimal Animated counter component
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 1500
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    const timer = setTimeout(() => requestAnimationFrame(step), 800)
    return () => clearTimeout(timer)
  }, [value])

  return <span>{count}{suffix}</span>
}

const Hero = ({ profile, projectCount = 0, skillCount = 0 }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      const offsetTop = (aboutSection as HTMLElement).offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Github size={16} />
      case 'linkedin': return <Linkedin size={16} />
      case 'twitter': return <Twitter size={16} />
      case 'facebook': return <Facebook size={16} />
      case 'youtube': return <Youtube size={16} />
      default: return <ExternalLink size={16} />
    }
  }

  // Pure fade-in staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28">
      <div className="relative z-10 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[calc(100vh-200px)] py-12">
          
          {/* Typography-led content */}
          <motion.div
            className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Minimal Status badge */}
            <motion.div variants={childVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.01] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-400"></span>
                </span>
                <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">Available for work</span>
              </div>
            </motion.div>

            {/* Crisp headline */}
            <motion.div variants={childVariants}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-2 leading-[1.1]">
                {profile?.name || 'Developer'}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={childVariants} className="mb-5">
              <p className="text-md sm:text-lg font-medium text-zinc-400 tracking-wide uppercase">
                {profile?.title || 'Full Stack Engineer'}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={childVariants}
              className="text-[14px] md:text-[15px] text-zinc-500 max-w-lg lg:mx-0 mx-auto leading-relaxed mb-8"
            >
              {profile?.description || 'Designing and engineering clean, high-performance web products with clean aesthetics and user experiences.'}
            </motion.p>

            {/* Flat high-end CTAs */}
            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center"
            >
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white text-black text-[11px] font-semibold tracking-wider uppercase border border-white hover:bg-zinc-200 transition-all duration-300 flex justify-center items-center gap-2"
                onClick={() => {
                  if (profile?.resume) {
                    window.open(profile.resume, '_blank')
                  } else {
                    scrollToAbout()
                  }
                }}
              >
                <span>{profile?.resume ? 'Download CV' : 'Explore Profile'}</span>
              </button>

              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-white/10 text-white text-[11px] font-semibold tracking-wider uppercase bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 flex justify-center items-center gap-2"
                onClick={() => {
                  const contactSection = document.querySelector('#contact')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <MessageCircle size={14} className="text-zinc-400" />
                <span>Get In Touch</span>
              </button>
            </motion.div>

            {/* Restrained Social Links */}
            {profile?.socialLinks && (
              <motion.div
                variants={childVariants}
                className="flex justify-center lg:justify-start gap-4 mt-8"
              >
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${profile.name} on ${platform}`}
                      className="text-zinc-500 hover:text-white transition-colors duration-300 p-1"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  )
                })}
              </motion.div>
            )}

            {/* Flat quiet Stats */}
            <motion.div
              variants={childVariants}
              className="flex justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-white/[0.04]"
            >
              {[
                { value: projectCount || 0, suffix: '+', label: 'Projects' },
                { value: skillCount || 0, suffix: '+', label: 'Skills' },
                { value: 3, suffix: '+', label: 'Years Exp' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Minimalist Image Container */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Ultra fine 1px circle frame */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden border border-white/[0.06] bg-white/[0.01] p-2 hover:border-white/10 transition-colors duration-500">
                <div className="w-full h-full rounded-full overflow-hidden grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700">
                  {profile?.heroImage ? (
                    <img
                      src={profile.heroImage}
                      alt={`${profile.name} portrait`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Understated Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-10 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToAbout}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-semibold">Scroll</span>
          <div className="w-[1px] h-6 bg-zinc-700/60" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
