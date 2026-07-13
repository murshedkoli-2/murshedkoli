'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Code,
  Zap,
  LayoutDashboard,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Facebook,
  Youtube,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Briefcase,
  GraduationCap,
  Mail,
  Pencil,
  Award,
  ExternalLink,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { AIGenerateButton } from '@/components/AIGenerateButton'

// --- Interfaces ---

interface Project {
  id: string
  title: string
  slug?: string
  description: string
  technologies: string[]
  techStack?: Array<{ name: string; category: string; icon?: string }>
  projectType?: ProjectType
  lifecycleStatus?: string
  publishStatus?: string
  logoUrl?: string
  coverImage?: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: boolean
  overallProgress?: number
}

type ProjectType = 'webapp' | 'android' | 'desktop' | 'api'

interface Profile {
  id?: string
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  heroImage?: string
  resume?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
    facebook?: string
    youtube?: string
  }
}

interface Skill {
  id?: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
  isEnabled?: boolean
}

interface Experience {
  id?: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  order: number
}

interface Education {
  id?: string
  institution: string
  degree: string
  field?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  order: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

interface Certification {
  id?: string
  name: string
  issuer: string
  date: string
  url?: string
  description?: string
  order: number
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, handleLogout, mobileMenuOpen, setMobileMenuOpen, unreadCount = 0 }: any) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 md:hidden backdrop-blur-md bg-black/60"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 bg-[#050507] border-r border-white/[0.04] shadow-2xl shadow-black/40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 font-semibold text-lg text-white">
            <div className="relative w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-sm font-semibold text-white font-mono shadow-sm">
              A
            </div>
            <span className="text-white font-medium text-base tracking-wider font-sans uppercase">Admin<span className="text-zinc-600">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 relative ${isActive
                  ? 'text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-350 hover:bg-white/[0.02]'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute inset-0 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon size={16} className={`relative z-10 ${isActive ? 'text-white' : ''}`} />
                <span className="relative z-10">{item.label}</span>
                {item.badge > 0 && (
                  <span className="relative z-10 ml-auto bg-white text-zinc-950 text-[10px] font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">{item.badge}</span>
                )}
                {isActive && !item.badge && <ChevronRight size={14} className="relative z-10 ml-auto text-white/60" />}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-zinc-500 hover:bg-white/[0.02] hover:text-white transition-all duration-300"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  )
}

const StatCard = ({ title, value, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="relative bg-white/[0.01] border border-white/[0.04] p-5 sm:p-6 rounded-xl hover:border-white/[0.1] transition-all duration-300 group shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1.5">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">{value}</h3>
      </div>
      <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-400 group-hover:text-white transition-colors duration-300">
        <Icon size={18} />
      </div>
    </div>
  </motion.div>
)

// --- Main Dashboard Component ---

export default function AdminDashboard() {
  const technologyOptionsByType: Record<ProjectType, string[]> = {
    webapp: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'Prisma',
      'Tailwind CSS',
      'Framer Motion',
      'Redux',
      'GraphQL',
      'Firebase',
      'Docker',
      'AWS',
      'Vercel',
      'Git',
    ],
    android: [
      'Kotlin',
      'Java',
      'Flutter',
      'Dart',
      'React Native',
      'Expo',
      'Jetpack Compose',
      'XML',
      'Android SDK',
      'Retrofit',
      'OkHttp',
      'Room',
      'SQLite',
      'Firebase',
      'Dagger Hilt',
      'Coroutines',
      'Flow',
      'LiveData',
      'ViewModel',
      'Gradle',
      'MVVM',
      'Git',
    ],
    desktop: [
      'Electron',
      'Tauri',
      'Python',
      'Qt',
      'C++',
      'C#',
      '.NET',
      'WPF',
      'JavaFX',
      'Rust',
      'SQLite',
    ],
    api: [
      'Node.js',
      'Express.js',
      'FastAPI',
      'Python',
      'Go',
      'Rust',
      'GraphQL',
      'REST',
      'gRPC',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS Lambda',
    ],
  }

  const skillCategories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'tools', label: 'Tools' },
    { value: 'languages', label: 'Languages' },
    { value: 'vibe-coding', label: 'Vibe Coding' },
    { value: 'ai', label: 'AI' },
  ]

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState(technologyOptionsByType.webapp[0])

  const detectProjectType = (project: Project): ProjectType => {
    if (project.projectType === 'android' || project.projectType === 'webapp') return project.projectType
    const hasAndroidTech = project.technologies.some((tech) => technologyOptionsByType.android.includes(tech))
    return hasAndroidTech ? 'android' : 'webapp'
  }
  const [editingProfile, setEditingProfile] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  // New State
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [educations, setEducations] = useState<Education[]>([])
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [editingSettings, setEditingSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: '',
    siteDescription: '',
    copyrightText: '',
    maintenanceMode: false,
    googleAiKey: '',
    openRouterKey: '',
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loginStatus = localStorage.getItem('adminLoggedIn')
    if (loginStatus !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      const [projectsRes, profileRes, skillsRes, expRes, eduRes, certRes, msgRes, settingsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/certifications'),
        fetch('/api/contact'),
        fetch('/api/settings')
      ])

      if (projectsRes.status !== 404 && projectsRes.ok) setProjects(await projectsRes.json())
      if (profileRes.status !== 404 && profileRes.ok) setProfile(await profileRes.json())
      if (skillsRes.status !== 404 && skillsRes.ok) setSkills(await skillsRes.json())
      if (expRes.status !== 404 && expRes.ok) setExperiences(await expRes.json())
      if (eduRes.status !== 404 && eduRes.ok) setEducations(await eduRes.json())
      if (certRes.status !== 404 && certRes.ok) setCertifications(await certRes.json())
      if (msgRes.status !== 404 && msgRes.ok) setMessages(await msgRes.json())
      if (settingsRes.status !== 404 && settingsRes.ok) {
        const s = await settingsRes.json()
        setSettings(s)
        setSettingsForm({
          siteTitle: s.siteTitle || '',
          siteDescription: s.siteDescription || '',
          copyrightText: s.copyrightText || '',
          maintenanceMode: s.maintenanceMode || false,
          googleAiKey: s.googleAiKey || '',
          openRouterKey: s.openRouterKey || '',
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    router.push('/admin/login')
  }

  const confirmWithToast = (message: string) => {
    return new Promise<boolean>((resolve) => {
      let resolved = false

      toast(message, {
        duration: 10000,
        action: {
          label: 'Confirm',
          onClick: () => {
            resolved = true
            resolve(true)
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {
            resolved = true
            resolve(false)
          },
        },
        onDismiss: () => {
          if (!resolved) resolve(false)
        },
      })
    })
  }

  // --- Actions ---

  const handleSaveExperience = async () => {
    if (!editingExperience) return
    setLoading(true)
    try {
      const url = editingExperience.id ? `/api/experience` : '/api/experience'
      const method = editingExperience.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExperience),
      })
      if (response.ok) {
        setEditingExperience(null)
        await fetchData()
        toast.success('Experience saved.')
      } else {
        toast.error('Could not save experience.')
      }
    } catch (error) {
      console.error('Error saving experience:', error)
      toast.error('Could not save experience.')
    } finally {
      setLoading(false)
    }
  }

  const deleteExperience = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this experience?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Experience deleted.')
      } else {
        toast.error('Could not delete experience.')
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast.error('Could not delete experience.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEducation = async () => {
    if (!editingEducation) return
    setLoading(true)
    try {
      const url = editingEducation.id ? `/api/education` : '/api/education'
      const method = editingEducation.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEducation),
      })
      if (response.ok) {
        setEditingEducation(null)
        await fetchData()
        toast.success('Education saved.')
      } else {
        toast.error('Could not save education.')
      }
    } catch (error) {
      console.error('Error saving education:', error)
      toast.error('Could not save education.')
    } finally {
      setLoading(false)
    }
  }

  const deleteEducation = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this education item?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/education?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Education deleted.')
      } else {
        toast.error('Could not delete education.')
      }
    } catch (error) {
      console.error('Error deleting education:', error)
      toast.error('Could not delete education.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProject = async (project: Project) => {
    setLoading(true)
    try {
      const method = project.id ? 'PUT' : 'POST'
      const url = project.id ? `/api/projects/${project.id}` : '/api/projects'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })

      if (response.ok) {
        await fetchData()
        setEditingProject(null)
        toast.success('Project saved.')
      } else {
        toast.error('Could not save project.')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Could not save project.')
    }
    setLoading(false)
  }

  const handleDeleteProject = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this project?')
    if (!confirmed) return
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Project deleted.')
      } else {
        toast.error('Could not delete project.')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Could not delete project.')
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (response.ok) {
        setEditingProfile(false)
        await fetchData()
        toast.success('Profile saved.')
      } else {
        toast.error('Could not save profile.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Could not save profile.')
    }
    setLoading(false)
  }

  const saveSkill = async () => {
    if (!editingSkill) return
    setLoading(true)
    try {
      const url = editingSkill.id ? `/api/skills/${editingSkill.id}` : '/api/skills'
      const method = editingSkill.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkill),
      })
      if (response.ok) {
        setEditingSkill(null)
        await fetchData()
        toast.success('Skill saved.')
      } else {
        toast.error('Could not save skill.')
      }
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Could not save skill.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && profile) {
          setProfile({ ...profile, heroImage: data.url })
        }
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteSkill = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this skill?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Skill deleted.')
      } else {
        toast.error('Could not delete skill.')
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Could not delete skill.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this message?')
    if (!confirmed) return
    try {
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Message deleted.')
      } else {
        toast.error('Could not delete message.')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Could not delete message.')
    }
  }

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchData()
        toast.success(`Message status set to ${status}.`)
      } else {
        toast.error('Could not update message status.')
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Could not update message status.')
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      for (const [key, value] of Object.entries(settingsForm)) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      }
      setEditingSettings(false)
      await fetchData()
      toast.success('Settings saved.')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Could not save settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCertification = async () => {
    if (!editingCertification) return
    setLoading(true)
    try {
      const url = editingCertification.id ? `/api/certifications` : '/api/certifications'
      const method = editingCertification.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCertification),
      })
      if (response.ok) {
        setEditingCertification(null)
        await fetchData()
        toast.success('Certification saved.')
      } else {
        toast.error('Could not save certification.')
      }
    } catch (error) {
      console.error('Error saving certification:', error)
      toast.error('Could not save certification.')
    } finally {
      setLoading(false)
    }
  }

  const deleteCertification = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this certification?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/certifications?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Certification deleted.')
      } else {
        toast.error('Could not delete certification.')
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
      toast.error('Could not delete certification.')
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

  if (!isAuthenticated) return <div className="min-h-screen bg-[#050507]" />

  return (
    <div className="admin-dashboard min-h-screen font-sans bg-[#050507] text-zinc-300">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 bg-[#050507]/85 border-b border-white/[0.04] min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-white/[0.06] rounded-xl transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider text-white truncate font-mono">{activeTab}</h2>
          </div>

          {/* Header Actions per tab could go here */}
          {activeTab === 'projects' && !editingProject && (
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider transition-all duration-300 border border-white shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Project</span>
            </Link>
          )}
          {activeTab === 'skills' && !editingSkill && (
            <button
              onClick={() => setEditingSkill({
                name: '', category: 'frontend',
                proficiency: 50, icon: '', order: skills.length, isEnabled: true
              })}
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider transition-all duration-300 border border-white shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Skill</span>
            </button>
          )}
          {activeTab === 'certifications' && !editingCertification && (
            <button
              onClick={() => setEditingCertification({
                name: '', issuer: '', date: new Date().toISOString().split('T')[0], order: certifications.length
              })}
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider transition-all duration-300 border border-white shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Certification</span>
            </button>
          )}
        </header>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard title="Total Projects" value={projects.length} icon={FileText} delay={0} />
                <StatCard title="Featured" value={projects.filter(p => p.featured).length} icon={Eye} delay={0.05} />
                <StatCard title="Skills" value={skills.length} icon={Zap} delay={0.1} />
                <StatCard title="Certifications" value={certifications.length} icon={Award} delay={0.12} />
                <StatCard title="Experience" value={experiences.length} icon={Briefcase} delay={0.15} />
                <StatCard title="Education" value={educations.length} icon={GraduationCap} delay={0.2} />
                <StatCard title="Unread Messages" value={unreadCount} icon={Mail} delay={0.25} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Messages */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">Recent Messages</h3>
                    <button onClick={() => setActiveTab('messages')} className="text-xs text-zinc-500 hover:text-white font-mono uppercase tracking-wider">View All</button>
                  </div>
                  <div className="space-y-3">
                    {messages.length === 0 && <p className="text-zinc-500 text-xs font-mono">No messages yet.</p>}
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-xl border transition-all duration-300 ${msg.status === 'unread' ? 'bg-white/[0.03] border-white/[0.1]' : 'bg-white/[0.01] border-white/[0.04]'}`}>
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="text-xs font-semibold text-white truncate">{msg.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-xs text-zinc-400 truncate">{msg.subject || 'No subject'}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-wider ${msg.status === 'unread' ? 'bg-white/[0.08] text-white border border-white/[0.08]' : msg.status === 'replied' ? 'bg-white/[0.03] text-zinc-400 border border-white/[0.04]' : 'bg-white/[0.01] text-zinc-600 border border-white/[0.03]'}`}>{msg.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider font-mono">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { tab: 'projects', icon: FileText, label: 'Projects' },
                      { tab: 'skills', icon: Zap, label: 'Skills' },
                      { tab: 'profile', icon: Users, label: 'Profile' },
                      { tab: 'experience', icon: Briefcase, label: 'Experience' },
                      { tab: 'education', icon: GraduationCap, label: 'Education' },
                      { tab: 'certifications', icon: Award, label: 'Certifications' },
                      { tab: 'messages', icon: Mail, label: 'Messages' },
                    ].map(({ tab, icon: Icon, label }) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300 text-left flex flex-col gap-2.5 group">
                        <Icon className="text-zinc-500 group-hover:text-white transition-colors duration-300" size={16} />
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors duration-300">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/20">
                      <Edit size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProfile(false)} className="px-3 py-1.5 text-gray-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleSaveProfile} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                        {editingProfile ? (
                          <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" />
                        ) : (
                          <p className="p-2 text-gray-300">{profile.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
                          {editingProfile && (
                            <AIGenerateButton 
                              onGenerate={(text) => setProfile({ ...profile, title: text })}
                              promptContext={{ field: 'profile-title', contextData: { title: profile.title } }}
                            />
                          )}
                        </div>
                        {editingProfile ? (
                          <input type="text" value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" />
                        ) : (
                          <p className="p-2 text-gray-300">{profile.title}</p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bio</label>
                          {editingProfile && (
                            <AIGenerateButton 
                              onGenerate={(text) => setProfile({ ...profile, description: text })}
                              promptContext={{ field: 'profile-description', contextData: { name: profile.name, title: profile.title } }}
                            />
                          )}
                        </div>
                        {editingProfile ? (
                          <textarea rows={4} value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs resize-none" />
                        ) : (
                          <p className="p-2 text-gray-300 leading-relaxed">{profile.description}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                        {editingProfile ? (
                          <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" />
                        ) : (
                          <p className="p-2 text-gray-300">{profile.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Location</label>
                        {editingProfile ? (
                          <input type="text" value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" />
                        ) : (
                          <p className="p-2 text-gray-300">{profile.location || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
                        {editingProfile ? (
                          <input type="text" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" placeholder="e.g. +880 1XXX-XXXXXX" />
                        ) : (
                          <p className="p-2 text-gray-300">{profile.phone || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Hero Image URL</label>
                        {editingProfile ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={profile.heroImage || ''}
                                onChange={e => setProfile({ ...profile, heroImage: e.target.value })}
className="flex-1 px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs text-sm"
                                placeholder="/image.png"
                              />
                              <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/20 flex items-center gap-2">
                                {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={uploading}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-400">
                              Upload an image directly or paste a URL.
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-white/10 border border-white/20 shrink-0">
                              {profile.heroImage ? (
                                <Image src={profile.heroImage} alt="Hero" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                              )}
                            </div>
                            <p className="p-2 text-gray-300 truncate text-sm flex-1">{profile.heroImage || 'Default Image'}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Resume URL</label>
                        {editingProfile ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.resume || ''}
                              onChange={e => setProfile({ ...profile, resume: e.target.value })}
                              className="flex-1 px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs text-sm"
                              placeholder="/resume.pdf"
                            />
                            <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/20 flex items-center gap-2">
                              {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                              Upload
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (!file) return
                                  setUploading(true)
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  try {
                                    const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                    if (response.ok) {
                                      const data = await response.json()
                                      if (data.success) setProfile({ ...profile, resume: data.url })
                                    }
                                  } catch (error) {
                                    console.error('Error uploading resume:', error)
                                  } finally {
                                    setUploading(false)
                                  }
                                }}
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="p-2 text-gray-300 truncate flex-1">{profile.resume || 'Not set'}</p>
                            {profile.resume && (
                              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded hover:bg-white/20 text-white">
                                <Eye size={16} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="font-semibold mb-4 flex items-center gap-2"><Globe size={16} className="text-gray-400" /> Social Connections</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'github', label: 'GitHub', icon: Github },
                          { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                          { key: 'twitter', label: 'Twitter', icon: Twitter },
                          { key: 'website', label: 'Website', icon: Globe },
                        ].map(({ key, label, icon: Icon }) => {
                          const val = profile.socialLinks?.[key as keyof typeof profile.socialLinks] || ''
                          return (
                            <div key={key} className="space-y-1">
                              <label className="text-xs text-gray-400 ml-1">{label}</label>
                              {editingProfile ? (
                                <div className="relative">
                                  <Icon size={16} className="absolute left-3 top-3 text-gray-500" />
                                  <input
                                    type="url"
                                    value={val}
                                    onChange={e => setProfile({
                                      ...profile,
                                      socialLinks: { ...profile.socialLinks, [key]: e.target.value }
                                    })}
                                    className="w-full pl-10 pr-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                                    placeholder={`https://${key}.com/...`}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg">
                                  <Icon size={16} className="text-gray-400" />
                                  <span className="text-sm truncate text-gray-300">{val || 'Not linked'}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {editingProject && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 mb-8 relative"
                >
                  <button onClick={() => setEditingProject(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                  <h3 className="text-lg font-semibold mb-6">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Project Title</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingProject({ ...editingProject, title: text })}
                            promptContext={{ field: 'project-title', contextData: { title: editingProject.title } }}
                          />
                        </div>
                        <input
                          value={editingProject.title}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Description</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingProject({ ...editingProject, description: text })}
                            promptContext={{ field: 'project-description', contextData: { title: editingProject.title, type: editingProject.projectType || 'webapp' } }}
                          />
                        </div>
                        <textarea
                          value={editingProject.description}
                          onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs resize-none"
                          rows={4}
                          placeholder="What does this project do?"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Project Type</label>
                        <select
                          value={editingProject.projectType || 'webapp'}
                          onChange={(e) => {
                            const nextType = e.target.value as ProjectType
                            const nextOptions = technologyOptionsByType[nextType]
                            setEditingProject({
                              ...editingProject,
                              projectType: nextType,
                              technologies: editingProject.technologies.filter((tech) => nextOptions.includes(tech)),
                            })
                            setSelectedTechnology(nextOptions[0])
                          }}
                          className="w-full px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        >
                          <option value="webapp">Web App</option>
                          <option value="android">Android</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Technologies</label>
                        {(() => {
                          const currentType = editingProject.projectType || 'webapp'
                          const typeTechnologies = technologyOptionsByType[currentType]
                          const availableTechnologies = typeTechnologies.filter(
                            (tech) => !editingProject.technologies.includes(tech)
                          )

                          return (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <select
                                  value={availableTechnologies.length === 0
                                    ? ''
                                    : (availableTechnologies.includes(selectedTechnology) ? selectedTechnology : availableTechnologies[0])}
                                  onChange={(e) => setSelectedTechnology(e.target.value)}
                                  className="flex-1 px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                                  disabled={availableTechnologies.length === 0}
                                >
                                  {availableTechnologies.length === 0 ? (
                                    <option value="">All technologies added</option>
                                  ) : (
                                    availableTechnologies.map((tech) => (
                                      <option key={tech} value={tech}>{tech}</option>
                                    ))
                                  )}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const techToAdd = availableTechnologies.includes(selectedTechnology)
                                      ? selectedTechnology
                                      : availableTechnologies[0]
                                    if (!techToAdd) return
                                    setEditingProject({
                                      ...editingProject,
                                      technologies: [...editingProject.technologies, techToAdd],
                                    })
                                    const remaining = availableTechnologies.filter((tech) => tech !== techToAdd)
                                    if (remaining.length > 0) setSelectedTechnology(remaining[0])
                                  }}
                                  disabled={availableTechnologies.length === 0}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 min-h-[36px]">
                                {editingProject.technologies.length === 0 && (
                                  <span className="text-xs text-gray-400">No technologies selected.</span>
                                )}
                                {editingProject.technologies.map((tech) => (
                                  <button
                                    type="button"
                                    key={tech}
                                    onClick={() => {
                                      const updated = editingProject.technologies.filter((item) => item !== tech)
                                      setEditingProject({ ...editingProject, technologies: updated })
                                      if (!updated.includes(selectedTechnology)) {
                                        setSelectedTechnology(tech)
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/40 border border-white/10 rounded text-xs text-gray-300 hover:border-white/20 transition-colors"
                                    title="Remove technology"
                                  >
                                    {tech}
                                    <X size={12} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Project Icon / Logo (optional)</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-black/40 border border-white/10 rounded-lg overflow-hidden flex-shrink-0">
                            {editingProject.logoUrl ? (
                              <Image src={editingProject.logoUrl} alt="Logo" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-500 text-xs font-semibold">
                                {editingProject.title?.charAt(0)?.toUpperCase() || 'L'}
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/20 flex items-center gap-2">
                            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                            Upload Logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setUploading(true)
                                const formData = new FormData()
                                formData.append('file', file)
                                try {
                                  const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                  if (response.ok) {
                                    const data = await response.json()
                                    if (data.success) setEditingProject({ ...editingProject, logoUrl: data.url })
                                  }
                                } catch (error) {
                                  console.error('Error uploading project logo:', error)
                                } finally {
                                  setUploading(false)
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                          {editingProject.logoUrl && (
                            <button
                              onClick={() => setEditingProject({ ...editingProject, logoUrl: '' })}
className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                              title="Remove Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Project Preview Image</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-10 bg-black/40 border border-white/10 rounded overflow-hidden flex-shrink-0">
                            {editingProject.imageUrl ? (
                              <Image src={editingProject.imageUrl} alt="Preview" className="w-full h-full object-cover" width={64} height={40} unoptimized />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-500">
                                <FileText size={16} />
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors border border-white/20 flex items-center gap-2">
                            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setUploading(true)
                                const formData = new FormData()
                                formData.append('file', file)
                                try {
                                  const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                  if (response.ok) {
                                    const data = await response.json()
                                    if (data.success) setEditingProject({ ...editingProject, imageUrl: data.url })
                                  }
                                } catch (error) {
                                  console.error('Error uploading project image:', error)
                                } finally {
                                  setUploading(false)
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                          {editingProject.imageUrl && (
                            <button
                              onClick={() => setEditingProject({ ...editingProject, imageUrl: '' })}
                              className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                              title="Remove Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">GitHub URL</label>
                          <input
                            value={editingProject.githubUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5">Demo URL</label>
                          <input
                            value={editingProject.demoUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingProject.featured}
                          onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-white/20 bg-black/40"
                        />
                        <label htmlFor="featured" className="text-sm cursor-pointer select-none">Feature this project on homepage</label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                    <button onClick={() => handleSaveProject(editingProject)} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                      Save Project
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 && (
                  <div className="col-span-full text-center py-16 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                    <Code size={32} className="mx-auto mb-3 text-zinc-650" />
                    <h4 className="text-white text-xs font-semibold tracking-wider uppercase font-mono mb-1">No Projects Found</h4>
                    <p className="text-zinc-500 text-[10px] font-mono">Create one using the new project button to get started.</p>
                  </div>
                )}
                {projects.map((project) => {
                  const technologies = project.techStack && project.techStack.length > 0
                    ? project.techStack.map(t => t.name)
                    : project.technologies || []
                  
                  const lifecycleColors: Record<string, string> = {
                    idea: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
                    planning: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    design: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
                    development: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    testing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                    deployment: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
                    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      className="bg-white/[0.01] border border-white/[0.04] rounded-xl overflow-hidden group hover:border-white/[0.08] transition-colors flex flex-col"
                    >
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg ${project.featured ? 'bg-orange-500/10 text-orange-400' : 'bg-white/10 text-gray-400'}`}>
                            {project.featured ? <Zap size={20} /> : <Code size={20} />}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/projects/${project.id}`}
className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                            >
                              <Edit size={16} />
                            </Link>
                            {/* Delete button disabled */}
                            {/* <button onClick={() => handleDeleteProject(project.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16} /></button> */}
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-3 mb-2 p-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md border border-white/20 overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                              {project.logoUrl ? (
                                <Image src={project.logoUrl} alt={`${project.title} logo`} className="w-full h-full object-cover" width={28} height={28} unoptimized />
                              ) : (
                                <span className="text-[10px] text-gray-400 font-semibold">{project.title.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold truncate">{project.title}</h3>
                          </div>
                        </div>
                        
                        {/* Status badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              project.projectType === 'android'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : project.projectType === 'api'
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {project.projectType === 'android' ? 'Android' : project.projectType === 'api' ? 'API' : 'Web App'}
                          </span>
                          {project.lifecycleStatus && (
                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${lifecycleColors[project.lifecycleStatus] || lifecycleColors.idea}`}>
                              {project.lifecycleStatus}
                            </span>
                          )}
                          {project.publishStatus === 'draft' && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-white/5 text-gray-400 border-white/20">
                              Draft
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        {project.overallProgress !== undefined && project.overallProgress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-gray-400">Progress</span>
                              <span className="text-[10px] text-gray-300">{project.overallProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                style={{ width: `${project.overallProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {technologies.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2 py-1 bg-black/40 border border-white/10 rounded text-xs text-gray-400">{t}</span>
                          ))}
                          {technologies.length > 3 && <span className="px-2 py-1 text-xs text-gray-500">+{technologies.length - 3}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {editingSkill && !editingSkill.id && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4 text-gray-200">{editingSkill.id ? 'Edit Skill' : 'Add New Skill'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-400 block">Skill Name (SEO optimized)</label>
                        <AIGenerateButton 
                          onGenerate={(text) => setEditingSkill({ ...editingSkill, name: text })}
                          promptContext={{ field: "Skill Name", contextData: { currentName: editingSkill.name || '' } }}
                          className="!p-1 scale-75 origin-right"
                        />
                      </div>
                      <input
                        value={editingSkill.name}
                        onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Icon</label>
                      <input
                        value={editingSkill.icon || ''}
                        onChange={e => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        placeholder="e.g. ⚛️"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Category</label>
                      <select
                        value={editingSkill.category}
                        onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                      >
                        {skillCategories.map((category) => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Proficiency ({editingSkill.proficiency}%)</label>
                      <input
                        type="range"
                        min="0" max="100"
                        value={editingSkill.proficiency}
                        onChange={e => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingSkill.isEnabled !== false}
                        onChange={e => setEditingSkill({ ...editingSkill, isEnabled: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 backdrop-blur-md"
                      />
                      <span className="text-sm text-gray-200">Show on portfolio</span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 text-gray-300 text-sm">Cancel</button>
                      <button onClick={saveSkill} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">Save Skill</button>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map(category => {
                  const catSkills = skills.filter(s => s.category === category.value)
                  if (catSkills.length === 0 && !editingSkill) return null
                  return (
                    <div key={category.value} className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {category.label}
                      </h3>
                      <div className="space-y-2">
                        {catSkills.map(skill => (
                          editingSkill?.id === skill.id ? (
                            <motion.div key={skill.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/[0.06] rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                <div className="md:col-span-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs text-gray-400 block">Skill Name</label>
                                    <AIGenerateButton 
                                      onGenerate={(text) => setEditingSkill({ ...editingSkill!, name: text })}
                                      promptContext={{ field: "Skill Name", contextData: { currentName: editingSkill?.name || '' } }}
                                      className="!p-1 scale-75 origin-right"
                                    />
                                  </div>
                                  <input
                                    value={editingSkill!.name}
                                    onChange={e => setEditingSkill({ ...editingSkill!, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                                  />
                                </div>
                                <div>
<label className="text-xs text-gray-400 mb-1 block">Icon</label>
                                  <input
                                    value={editingSkill!.icon || ''}
                                    onChange={e => setEditingSkill({ ...editingSkill!, icon: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                                    placeholder="e.g. ⚛️"
                                  />
                                </div>
                                <div>
<label className="text-xs text-gray-400 mb-1 block">Category</label>
                                  <select
                                    value={editingSkill!.category}
                                    onChange={e => setEditingSkill({ ...editingSkill!, category: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                                  >
                                    {skillCategories.map((category) => (
                                      <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 mb-1 block">Proficiency ({editingSkill!.proficiency}%)</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editingSkill!.proficiency}
                                    onChange={e => setEditingSkill({ ...editingSkill!, proficiency: parseInt(e.target.value) })}
className="w-full accent-blue-600 bg-transparent"
                                  />
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editingSkill!.isEnabled !== false}
                                    onChange={e => setEditingSkill({ ...editingSkill!, isEnabled: e.target.checked })}
className="w-4 h-4 rounded border-white/20 bg-white/5"
                                  />
<span className="text-sm text-gray-300">Show on portfolio</span>
                                </label>
                                <div className="flex gap-2">
                                  <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 text-gray-300 text-sm">Cancel</button>
                                  <button onClick={saveSkill} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">Save Skill</button>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div key={skill.id} className={`bg-white/5 backdrop-blur-md border rounded-lg p-3 flex items-center justify-between group hover:border-white/20 transition-colors ${skill.isEnabled === false ? 'border-red-500/30 opacity-60' : 'border-white/10'}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded bg-black/40 flex items-center justify-center text-gray-400 font-bold text-xs border ${skill.isEnabled === false ? 'border-red-500/30' : 'border-white/10'}`}>
                                  {skill.icon ? (
                                    <span className="text-base leading-none">{skill.icon}</span>
                                  ) : (
                                    skill.name.substring(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={`font-medium text-sm ${skill.isEnabled === false ? 'text-gray-400' : 'text-gray-200'}`}>{skill.name}</p>
                                    {skill.isEnabled === false && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Hidden</span>
                                    )}
                                  </div>
                                  <div className="w-24 h-1 bg-white/10 rounded-full mt-1.5">
                                    <div className={`h-full rounded-full ${skill.isEnabled === false ? 'bg-gray-500' : 'bg-blue-600'}`} style={{ width: `${skill.proficiency}%` }} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingSkill(skill)} className="p-1.5 hover:bg-white/10 rounded text-blue-400"><Edit size={14} /></button>
                                <button onClick={() => deleteSkill(skill.id!)} className="p-1.5 hover:bg-white/10 rounded text-red-400"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          )
                        ))}
                        {catSkills.length === 0 && <p className="text-gray-500 text-sm italic">No skills in this category</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-200">Experience</h3>
                {!editingExperience && (
                  <button
                    onClick={() => setEditingExperience({
                      company: '', position: '', description: '',
                      startDate: '', current: false, order: experiences.length
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                )}
              </div>

              {editingExperience && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4 text-gray-200">{editingExperience.id ? 'Edit Experience' : 'Add New Experience'}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Company</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingExperience({ ...editingExperience, company: text })}
                            promptContext={{ field: 'experience-company', contextData: { company: editingExperience.company } }}
                          />
                        </div>
                        <input
                          value={editingExperience.company}
                          onChange={e => setEditingExperience({ ...editingExperience, company: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Position</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingExperience({ ...editingExperience, position: text })}
                            promptContext={{ field: 'experience-position', contextData: { position: editingExperience.position } }}
                          />
                        </div>
                        <input
                          value={editingExperience.position}
                          onChange={e => setEditingExperience({ ...editingExperience, position: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs text-gray-400 block">Description</label>
                        <AIGenerateButton 
                          onGenerate={(text) => setEditingExperience({ ...editingExperience, description: text })}
                          promptContext={{ field: 'experience-description', contextData: { position: editingExperience.position, company: editingExperience.company } }}
                        />
                      </div>
                      <textarea
                        value={editingExperience.description}
                        onChange={e => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={editingExperience.startDate ? new Date(editingExperience.startDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={editingExperience.endDate ? new Date(editingExperience.endDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                          disabled={editingExperience.current}
                          className={`w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs ${editingExperience.current ? 'opacity-50' : ''}`}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingExperience.current}
                            onChange={e => setEditingExperience({ ...editingExperience, current: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 backdrop-blur-md"
                          />
                          <span className="text-sm">Current Position</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Location</label>
                      <input
                        value={editingExperience.location || ''}
                        onChange={e => setEditingExperience({ ...editingExperience, location: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingExperience(null)} className="px-4 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
                    <button onClick={handleSaveExperience} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <Save size={16} /> Save Experience
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <motion.div
                    key={exp.id}
                    layout
                    className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 group hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 font-mono uppercase tracking-wider">{exp.position}</h4>
                        <h5 className="text-sm text-zinc-400 mb-2 font-mono">{exp.company}</h5>
                        <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-4">
                          <span>{new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                          {exp.location && <span>• {exp.location}</span>}
                        </div>
                        <p className="text-xs text-zinc-450 whitespace-pre-line leading-relaxed">{exp.description}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                        <button onClick={() => setEditingExperience(exp)} className="p-2 hover:bg-white/[0.06] rounded-lg text-zinc-400 hover:text-white"><Edit size={14} /></button>
                        <button onClick={() => deleteExperience(exp.id!)} className="p-2 hover:bg-white/[0.06] rounded-lg text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {experiences.length === 0 && !editingExperience && (
                  <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                    <Briefcase size={32} className="mx-auto mb-3 text-zinc-600" />
                    <h4 className="text-white text-xs font-semibold tracking-wider uppercase font-mono mb-1">No Experience Found</h4>
                    <p className="text-zinc-500 text-[10px] font-mono">Add your professional experience items to display them.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-200">Education</h3>
                {!editingEducation && (
                  <button
                    onClick={() => setEditingEducation({
                      institution: '', degree: '', field: '', description: '',
                      startDate: '', current: false, order: educations.length
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={16} /> Add Education
                  </button>
                )}
              </div>

              {editingEducation && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4 text-gray-200">{editingEducation.id ? 'Edit Education' : 'Add New Education'}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Institution</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingEducation({ ...editingEducation, institution: text })}
                            promptContext={{ field: 'education-institution', contextData: { institution: editingEducation.institution } }}
                          />
                        </div>
                        <input
                          value={editingEducation.institution}
                          onChange={e => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Degree</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingEducation({ ...editingEducation, degree: text })}
                            promptContext={{ field: 'education-degree', contextData: { degree: editingEducation.degree } }}
                          />
                        </div>
                        <input
                          value={editingEducation.degree}
                          onChange={e => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Field of Study</label>
                      <input
                        value={editingEducation.field || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, field: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs text-gray-400 block">Description</label>
                        <AIGenerateButton 
                          onGenerate={(text) => setEditingEducation({ ...editingEducation, description: text })}
                          promptContext={{ field: 'education-description', contextData: { institution: editingEducation.institution, degree: editingEducation.degree, currentDesc: editingEducation.description } }}
                        />
                      </div>
                      <textarea
                        value={editingEducation.description || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={editingEducation.startDate ? new Date(editingEducation.startDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={editingEducation.endDate ? new Date(editingEducation.endDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                          disabled={editingEducation.current}
                          className={`w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs ${editingEducation.current ? 'opacity-50' : ''}`}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingEducation.current}
                            onChange={e => setEditingEducation({ ...editingEducation, current: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 backdrop-blur-md"
                          />
                          <span className="text-sm">Current Student</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">GPA</label>
                      <input
                        value={editingEducation.gpa || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, gpa: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingEducation(null)} className="px-4 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
                    <button onClick={handleSaveEducation} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <Save size={16} /> Save Education
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {educations.map((edu) => (
                  <motion.div
                    key={edu.id}
                    layout
                    className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 group hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 font-mono uppercase tracking-wider">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                        <h5 className="text-sm text-zinc-400 mb-2 font-mono">{edu.institution}</h5>
                        <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-4">
                          <span>{new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {edu.current ? 'Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                          {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                        </div>
                        <p className="text-xs text-zinc-450 whitespace-pre-line leading-relaxed">{edu.description}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                        <button onClick={() => setEditingEducation(edu)} className="p-2 hover:bg-white/[0.06] rounded-lg text-zinc-400 hover:text-white"><Edit size={14} /></button>
                        <button onClick={() => deleteEducation(edu.id!)} className="p-2 hover:bg-white/[0.06] rounded-lg text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {educations.length === 0 && !editingEducation && (
                  <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                    <GraduationCap size={32} className="mx-auto mb-3 text-zinc-650" />
                    <h4 className="text-white text-xs font-semibold tracking-wider uppercase font-mono mb-1">No Education Found</h4>
                    <p className="text-zinc-500 text-[10px] font-mono">Add your academic background milestones to display them.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-200">Certifications</h3>
                {!editingCertification && (
                  <button
                    onClick={() => setEditingCertification({
                      name: '', issuer: '', date: new Date().toISOString().split('T')[0], order: certifications.length
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={16} /> Add Certification
                  </button>
                )}
              </div>

              {editingCertification && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4 text-gray-200">{editingCertification.id ? 'Edit Certification' : 'Add New Certification'}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Certification Name</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingCertification({ ...editingCertification, name: text })}
                            promptContext={{ field: 'certification-name', contextData: { name: editingCertification.name } }}
                          />
                        </div>
                        <input
                          value={editingCertification.name}
                          onChange={e => setEditingCertification({ ...editingCertification, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          placeholder="e.g. AWS Solutions Architect"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="text-xs text-gray-400 block">Issuer</label>
                          <AIGenerateButton 
                            onGenerate={(text) => setEditingCertification({ ...editingCertification, issuer: text })}
                            promptContext={{ field: 'certification-issuer', contextData: { issuer: editingCertification.issuer } }}
                          />
                        </div>
                        <input
                          value={editingCertification.issuer}
                          onChange={e => setEditingCertification({ ...editingCertification, issuer: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          placeholder="e.g. Amazon Web Services"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Issue Date</label>
                        <input
                          type="date"
                          value={editingCertification.date ? new Date(editingCertification.date).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingCertification({ ...editingCertification, date: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Credential URL (optional)</label>
                        <input
                          type="url"
                          value={editingCertification.url || ''}
                          onChange={e => setEditingCertification({ ...editingCertification, url: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs text-gray-400 block">Description (optional)</label>
                        <AIGenerateButton 
                          onGenerate={(text) => setEditingCertification({ ...editingCertification, description: text })}
                          promptContext={{ field: 'certification-description', contextData: { name: editingCertification.name, currentDesc: editingCertification.description } }}
                        />
                      </div>
                      <textarea
                        value={editingCertification.description || ''}
                        onChange={e => setEditingCertification({ ...editingCertification, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs min-h-[100px]"
                        placeholder="Brief description of the certification..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingCertification(null)} className="px-4 py-2 text-gray-300 hover:text-white text-sm">Cancel</button>
                    <button onClick={handleSaveCertification} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <Save size={16} /> Save Certification
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    layout
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 group hover:border-white/20 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                            <Award size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">{cert.name}</h4>
                            <h5 className="text-lg text-yellow-400">{cert.issuer}</h5>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        {cert.description && (
                          <p className="text-gray-200 whitespace-pre-line mb-4">{cert.description}</p>
                        )}
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                          >
                            <ExternalLink size={14} />
                            View Credential
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button onClick={() => setEditingCertification(cert)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit size={16} /></button>
                        <button onClick={() => deleteCertification(cert.id!)} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {certifications.length === 0 && !editingCertification && (
                  <div className="col-span-full text-center py-16 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                    <Award size={32} className="mx-auto mb-3 text-zinc-650" />
                    <h4 className="text-white text-xs font-semibold tracking-wider uppercase font-mono mb-1">No Certifications Found</h4>
                    <p className="text-zinc-500 text-[10px] font-mono">Add your professional certifications or credentials to display them.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold uppercase tracking-wider text-white font-mono">Messages</h3>
                {unreadCount > 0 && <span className="text-[10px] font-semibold font-mono uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-white px-2.5 py-0.5 rounded-md">{unreadCount} unread</span>}
              </div>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.005]">
                    <Mail size={32} className="mx-auto mb-3 text-zinc-600" />
                    <h4 className="text-white text-xs font-semibold tracking-wider uppercase font-mono mb-1">No Messages Found</h4>
                    <p className="text-zinc-500 text-[10px] font-mono">You will see incoming client contact messages here.</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isExpanded = expandedMessages[msg.id] ?? false
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`bg-white/[0.01] border ${msg.status === 'unread' ? 'border-white/[0.12] bg-white/[0.02]' : 'border-white/[0.04]'} rounded-xl p-6`}
                    >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-base font-bold text-white mb-1 font-mono uppercase tracking-wider">{msg.name}</h4>
                        <p className="text-zinc-500 text-xs font-mono">{msg.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-wider border ${msg.status === 'unread' ? 'bg-white/[0.08] text-white border-white/[0.08]' : msg.status === 'replied' ? 'bg-white/[0.03] text-zinc-400 border-white/[0.04]' : 'bg-white/[0.01] text-zinc-650 border-white/[0.03]'}`}>{msg.status}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => setExpandedMessages((prev) => ({ ...prev, [msg.id]: !isExpanded }))}
                          className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                    </div>
                    {msg.subject && <h5 className="font-semibold text-gray-200 mb-2">{msg.subject}</h5>}
                    {isExpanded ? (
                      <p className="text-gray-300 whitespace-pre-wrap mb-4">{msg.message}</p>
                    ) : (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-4">{msg.message}</p>
                    )}
                    <div className="flex gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                        disabled={msg.status === 'read'}
                        className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(msg.id, 'replied')}
                        disabled={msg.status === 'replied'}
                        className="text-xs px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark as Replied
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-auto">Delete</button>
                    </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">

              {/* ── Site Settings Card ── */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Site Settings</h3>
                  {!editingSettings ? (
                    <button onClick={() => setEditingSettings(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"><Pencil size={14} /> Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingSettings(false); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSaveSettings} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Site Title</label>
                      {editingSettings && (
                        <AIGenerateButton 
                          onGenerate={(text) => setSettingsForm({ ...settingsForm, siteTitle: text })}
                          promptContext={{ field: 'settings-site-title', contextData: { title: settingsForm.siteTitle } }}
                        />
                      )}
                    </div>
                    {editingSettings ? (
                      <input type="text" value={settingsForm.siteTitle} onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" placeholder="My Portfolio" />
                    ) : (
                      <p className="p-2 text-gray-300">{settings.siteTitle || 'Not set'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">SEO Description</label>
                      {editingSettings && (
                        <AIGenerateButton 
                          onGenerate={(text) => setSettingsForm({ ...settingsForm, siteDescription: text })}
                          promptContext={{ field: 'settings-seo-description', contextData: { title: settingsForm.siteTitle } }}
                        />
                      )}
                    </div>
                    {editingSettings ? (
                      <textarea value={settingsForm.siteDescription} onChange={e => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs resize-none" placeholder="Meta description for search engines" />
                    ) : (
                      <p className="p-2 text-gray-300">{settings.siteDescription || 'Not set'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Copyright Text</label>
                      {editingSettings && (
                        <AIGenerateButton 
                          onGenerate={(text) => setSettingsForm({ ...settingsForm, copyrightText: text })}
                          promptContext={{ field: 'settings-copyright-text', contextData: { copyright: settingsForm.copyrightText } }}
                        />
                      )}
                    </div>
                    {editingSettings ? (
                      <input type="text" value={settingsForm.copyrightText} onChange={e => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })} className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs" placeholder="All rights reserved." />
                    ) : (
                      <p className="p-2 text-gray-300">{settings.copyrightText || 'Not set'}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/10">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Maintenance Mode</label>
                      <p className="text-xs text-gray-400 mt-1">Show a maintenance page to visitors</p>
                    </div>
                    {editingSettings ? (
                      <button onClick={() => setSettingsForm({ ...settingsForm, maintenanceMode: !settingsForm.maintenanceMode })} className={`w-12 h-6 rounded-full transition-colors ${settingsForm.maintenanceMode ? 'bg-red-500' : 'bg-white/20'} relative`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settingsForm.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    ) : (
                      <span className={`text-sm font-medium ${settings.maintenanceMode ? 'text-red-400' : 'text-green-400'}`}>{settings.maintenanceMode ? 'On' : 'Off'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── AI Configuration Card ── */}
              <div className="bg-white/5 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                      AI Configuration
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">API keys for AI-powered content generation across the admin panel</p>
                  </div>
                  {!editingSettings ? (
                    <button onClick={() => setEditingSettings(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 rounded-lg text-sm"><Pencil size={14} /> Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSettings(false)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSaveSettings} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-5">
                  {/* Google AI */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">G</span>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Google AI API Key</label>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-medium">Primary</span>
                    </div>
                    {editingSettings ? (
                      <input
                        type="password"
                        value={settingsForm.googleAiKey}
                        onChange={e => setSettingsForm({ ...settingsForm, googleAiKey: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs font-mono text-sm"
                        placeholder="AIzaSy..."
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2 bg-black/30 border border-white/10 rounded-lg">
                        <span className="font-mono text-sm text-gray-300">{settings.googleAiKey ? '••••••••••••••••' : 'Not configured'}</span>
                        {settings.googleAiKey && <span className="ml-auto text-[10px] text-green-400">✓ Set</span>}
                      </div>
                    )}
                  </div>

                  {/* OpenRouter AI */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">OR</span>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">OpenRouter API Key</label>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">Fallback</span>
                    </div>
                    {editingSettings ? (
                      <input
                        type="password"
                        value={settingsForm.openRouterKey}
                        onChange={e => setSettingsForm({ ...settingsForm, openRouterKey: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.01] border border-white/[0.06] rounded-lg focus:outline-none focus:border-white/20 transition-all font-mono text-xs font-mono text-sm"
                        placeholder="sk-or-v1-..."
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2 bg-black/30 border border-white/10 rounded-lg">
                        <span className="font-mono text-sm text-gray-300">{settings.openRouterKey ? '••••••••••••••••' : 'Not configured'}</span>
                        {settings.openRouterKey && <span className="ml-auto text-[10px] text-green-400">✓ Set</span>}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 pt-1">
                    Google AI is used as the primary model. OpenRouter is the fallback when Google AI is unavailable or quota exceeded.
                  </p>
                </div>
              </div>

            </motion.div>
          )}


        </div>
      </main>
    </div>
  )
}
