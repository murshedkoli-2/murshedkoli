'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Select, Button, Card, EmptyState } from '@/components/ui/FormElements'
import { TechStackItemType, TechCategoryType } from '@/lib/validations/project'
import { Plus, Cpu, Database, Globe, Server, Sparkles, Package, X } from 'lucide-react'

interface TechStackTabProps {
  techStack: TechStackItemType[]
  onChange: (techStack: TechStackItemType[]) => void
  /** Omitted by the create wizard, which defers all saving to the final step. */
  onSave?: () => void
  isLoading?: boolean
}

const CATEGORY_CONFIG: Record<TechCategoryType, { icon: React.ReactNode; label: string }> = {
  frontend: { icon: <Globe size={16} />, label: 'Frontend' },
  backend: { icon: <Server size={16} />, label: 'Backend' },
  database: { icon: <Database size={16} />, label: 'Database' },
  devops: { icon: <Package size={16} />, label: 'DevOps' },
  ai: { icon: <Sparkles size={16} />, label: 'AI / ML' },
  other: { icon: <Cpu size={16} />, label: 'Other' }
}

// Popular tech suggestions
const TECH_SUGGESTIONS: Record<TechCategoryType, string[]> = {
  frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'TypeScript', 'Tailwind CSS', 'Sass'],
  backend: ['Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', 'Go', 'Rust'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'GitHub Actions', 'Jenkins'],
  ai: ['TensorFlow', 'PyTorch', 'OpenAI', 'Langchain', 'Hugging Face', 'scikit-learn', 'Pandas', 'NumPy'],
  other: ['GraphQL', 'REST API', 'WebSocket', 'gRPC', 'OAuth', 'JWT', 'Stripe', 'Socket.io']
}

export function TechStackTab({ techStack, onChange, onSave, isLoading }: TechStackTabProps) {
  const [newTech, setNewTech] = useState({
    name: '',
    category: 'frontend' as TechCategoryType,
    icon: ''
  })
  const [selectedCategory, setSelectedCategory] = useState<TechCategoryType | 'all'>('all')

  const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
  }))

  const addTech = (name?: string, category?: TechCategoryType) => {
    const techName = name || newTech.name
    const techCategory = category || newTech.category

    if (!techName.trim()) return

    // Check for duplicates
    if (techStack.some(t => t.name.toLowerCase() === techName.toLowerCase())) {
      return
    }

    const tech: TechStackItemType = {
      name: techName,
      category: techCategory,
      icon: newTech.icon || undefined
    }

    onChange([...techStack, tech])
    setNewTech({ name: '', category: 'frontend', icon: '' })
  }

  const removeTech = (name: string) => {
    onChange(techStack.filter(t => t.name !== name))
  }

  const filteredTechStack = selectedCategory === 'all'
    ? techStack
    : techStack.filter(t => t.category === selectedCategory)

  const groupedTechStack = Object.keys(CATEGORY_CONFIG).reduce((acc, category) => {
    acc[category as TechCategoryType] = techStack.filter(t => t.category === category)
    return acc
  }, {} as Record<TechCategoryType, TechStackItemType[]>)

  const getSuggestions = () => {
    const category = newTech.category
    const existing = techStack.map(t => t.name.toLowerCase())
    return TECH_SUGGESTIONS[category].filter(s => !existing.includes(s.toLowerCase()))
  }

  return (
    <div className="space-y-6">
      {/* Add New Tech */}
      <Card>
        <span className="pe-label">Add Technology</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Technology name..."
              aria-label="Technology name"
              value={newTech.name}
              onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addTech()}
            />
          </div>
          <Select
            aria-label="Category"
            value={newTech.category}
            onChange={(e) => setNewTech(prev => ({ ...prev, category: e.target.value as TechCategoryType }))}
            options={categoryOptions}
          />
          <Button onClick={() => addTech()} leftIcon={<Plus size={15} />} disabled={!newTech.name.trim()}>
            Add Tech
          </Button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="mt-5">
          <span className="pe-label">Quick add</span>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().slice(0, 8).map((tech) => (
              <button key={tech} onClick={() => addTech(tech, newTech.category)} className="pe-chip">
                + {tech}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`pe-chip ${selectedCategory === 'all' ? 'on' : ''}`}
        >
          All ({techStack.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
          const count = groupedTechStack[category as TechCategoryType]?.length || 0
          if (count === 0) return null

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as TechCategoryType)}
              className={`pe-chip ${selectedCategory === category ? 'on' : ''}`}
            >
              {config.icon}
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Tech Stack Grid */}
      {techStack.length === 0 ? (
        <EmptyState
          icon={<Cpu size={32} />}
          title="No technologies added"
          description="Add the technologies used in this project"
        />
      ) : selectedCategory === 'all' ? (
        // Grouped view
        <div className="space-y-6">
          {Object.entries(groupedTechStack).map(([category, techs]) => {
            if (techs.length === 0) return null
            const config = CATEGORY_CONFIG[category as TechCategoryType]

            return (
              <Card key={category}>
                <div className="flex items-center gap-2.5 mb-4">
                  <span style={{ color: 'var(--accent)', display: 'flex' }}>{config.icon}</span>
                  <h3 style={{ fontFamily: 'var(--adm-display)', fontSize: 13.5, fontWeight: 700 }}>
                    {config.label}
                  </h3>
                  <span className="adm-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    {techs.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {techs.map((tech) => (
                      <motion.span
                        key={tech.name}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="pe-chip group"
                        style={{ cursor: 'default' }}
                      >
                        {tech.icon ? <span>{tech.icon}</span> : config.icon}
                        <span style={{ color: 'var(--ink)' }}>{tech.name}</span>
                        <button
                          onClick={() => removeTech(tech.name)}
                          aria-label={`Remove ${tech.name}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                        >
                          <X size={13} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        // Filtered view
        <Card>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filteredTechStack.map((tech) => (
                <motion.span
                  key={tech.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pe-chip group"
                  style={{ cursor: 'default' }}
                >
                  {CATEGORY_CONFIG[tech.category].icon}
                  <span style={{ color: 'var(--ink)' }}>{tech.name}</span>
                  <button
                    onClick={() => removeTech(tech.name)}
                    aria-label={`Remove ${tech.name}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                  >
                    <X size={13} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      )}

      {/* Save Button */}
      {onSave && techStack.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={onSave} isLoading={isLoading}>
            Save Tech Stack
          </Button>
        </div>
      )}
    </div>
  )
}
