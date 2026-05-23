'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageSquare, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileData {
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent successfully!')
      } else {
        toast.error('Could not send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Could not send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = profile ? [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      value: profile.email,
      link: `mailto:${profile.email}`,
      color: 'from-blue-500 to-cyan-500'
    },
    ...(profile.phone ? [{
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      value: profile.phone,
      link: `tel:${profile.phone.replace(/\D/g, '')}`,
      color: 'from-green-500 to-emerald-500'
    }] : []),
    ...(profile.location ? [{
      icon: <MapPin className="w-5 h-5" />,
      title: 'Location',
      value: profile.location,
      link: '#',
      color: 'from-purple-500 to-pink-500'
    }] : [])
  ] : []

  const socialLinks = profile?.socialLinks ? [
    ...(profile.socialLinks.github ? [{
      icon: <Github className="w-5 h-5" />,
      name: 'GitHub',
      url: profile.socialLinks.github,
      hoverColor: 'hover:bg-gray-700 hover:border-gray-500'
    }] : []),
    ...(profile.socialLinks.linkedin ? [{
      icon: <Linkedin className="w-5 h-5" />,
      name: 'LinkedIn',
      url: profile.socialLinks.linkedin,
      hoverColor: 'hover:bg-blue-600/20 hover:border-blue-500'
    }] : []),
    ...(profile.socialLinks.twitter ? [{
      icon: <Twitter className="w-5 h-5" />,
      name: 'Twitter',
      url: profile.socialLinks.twitter,
      hoverColor: 'hover:bg-sky-500/20 hover:border-sky-400'
    }] : [])
  ] : []

  return (
    <section id="contact" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] mb-6"
          >
            <MessageSquare size={12} className="text-zinc-400" />
            <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">Let&apos;s Connect</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Send size={16} className="text-zinc-400" />
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-1.5"
                  >
                    <label htmlFor="name" className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-750 text-xs focus:border-white/20 focus:bg-white/[0.02] focus:outline-none transition-all font-mono"
                      placeholder="Your name"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-1.5"
                  >
                    <label htmlFor="email" className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-750 text-xs focus:border-white/20 focus:bg-white/[0.02] focus:outline-none transition-all font-mono"
                      placeholder="your.email@example.com"
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-1.5"
                >
                  <label htmlFor="subject" className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-750 text-xs focus:border-white/20 focus:bg-white/[0.02] focus:outline-none transition-all font-mono"
                    placeholder="What's this about?"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-1.5"
                >
                  <label htmlFor="message" className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-755 text-xs focus:border-white/20 focus:bg-white/[0.02] focus:outline-none transition-all resize-none font-mono"
                    placeholder="Tell me about your project..."
                  />
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-100 transition-all font-mono uppercase tracking-[0.2em] text-xs font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-white/[0.01] border border-white/[0.04] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.title}
                      href={info.link}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="group flex items-center gap-4 p-4 bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] rounded-xl transition-all duration-300"
                    >
                      <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-400 group-hover:text-white transition-colors duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{info.title}</p>
                        <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors font-mono">{info.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Follow Me</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/[0.12] transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="p-5 bg-white/[0.01] rounded-xl border border-white/[0.04] flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">Quick Response</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  I typically respond within 24 hours. Let&apos;s build something amazing together!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
