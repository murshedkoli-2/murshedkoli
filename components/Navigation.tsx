'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Download } from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [siteName, setSiteName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const settings = await res.json()
          setSiteName(settings.siteName || '')
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const downloadResume = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/resume')
      if (!response.ok) throw new Error('Failed to generate resume')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Morshed_al_main_resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download resume:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      
      const sections = ['home', 'about', 'skills', 'experience', 'education', 'certifications', 'projects', 'contact']
      const scrollPosition = window.scrollY + 120

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Education', href: '#education', id: 'education' },
    { name: 'Certifications', href: '#certifications', id: 'certifications' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ]

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      const offsetTop = (element as HTMLElement).offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-[#050507]/80 backdrop-blur-md border-b border-white/[0.04]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="flex justify-between items-center">
          {/* Minimalist Logo */}
          <div
            onClick={() => scrollToSection('#home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-[14px] font-semibold tracking-[0.25em] text-white uppercase transition-opacity duration-300 hover:opacity-80">
              {siteName ? siteName : 'Morshed Koli'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-3 py-1.5 text-[12px] font-medium tracking-wider uppercase transition-colors duration-300 ${
                    activeSection === item.id 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:text-white/90'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-3 right-3 h-[1px] bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Elegant thin-border Resume button */}
            <button
              onClick={downloadResume}
              disabled={isGenerating}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 text-white text-[11px] font-medium tracking-wider uppercase bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <span>{isGenerating ? 'Generating' : 'Resume'}</span>
              <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-[#050507] border border-white/[0.05] rounded-xl mt-3 p-3 flex flex-col gap-1 shadow-2xl">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-[12px] font-medium tracking-wider uppercase transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'bg-white/[0.03] text-white border-l-2 border-white pl-3' 
                        : 'text-zinc-400 hover:bg-white/[0.01] hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
                
                <div className="h-px bg-white/[0.05] my-2" />
                
                <button
                  onClick={() => {
                    downloadResume()
                    setIsOpen(false)
                  }}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white text-black font-semibold text-[11px] tracking-wider uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <Download size={13} className={isGenerating ? 'animate-pulse' : ''} />
                  {isGenerating ? 'Generating...' : 'Download Resume'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
