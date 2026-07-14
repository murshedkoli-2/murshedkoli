'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { FeaturedProject } from '@/lib/data/portfolio'
import { ProjectModal } from './ProjectModal'

interface ModalContextValue {
  open: (project: FeaturedProject) => void
  close: () => void
}

const ModalContext = createContext<ModalContextValue>({
  open: () => {},
  close: () => {},
})

export function useProjectModal() {
  return useContext(ModalContext)
}

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<FeaturedProject | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<FeaturedProject>
      setProject(custom.detail)
    }
    window.addEventListener('open-project-modal', handler)
    return () => window.removeEventListener('open-project-modal', handler)
  }, [])

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  const close = () => setProject(null)

  return (
    <ModalContext.Provider value={{ open: (p) => setProject(p), close }}>
      {children}
      {project && <ProjectModal project={project} onClose={close} />}
    </ModalContext.Provider>
  )
}
