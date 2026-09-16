'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Check } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import { toast } from 'sonner'
import { adminFetch } from '@/lib/admin/adminFetch'
import { generateId } from '@/lib/utils/project-helpers'
import type { TechStackItemType, TechCategoryType } from '@/lib/validations/project'
import type { WizardData } from './steps'

interface ImportResponse {
  title: string
  slug: string
  description: string
  longDescription: string
  coverImage: string
  githubUrl: string
  demoUrl: string
  features: string[]
  techStack: { name: string; category: TechCategoryType }[]
  topics: string[]
  hasReadme: boolean
  stars: number
  archived: boolean
}

interface GithubImportProps {
  onImport: (patch: Partial<WizardData>) => void
  /** Non-empty when the user has already typed into the form. */
  occupiedFields: string[]
}

/** What actually came back, so the user can see the import did something. */
interface ImportSummary {
  repo: string
  filled: string[]
  skipped: string[]
}

export function GithubImport({ onImport, occupiedFields }: GithubImportProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  const run = async () => {
    if (!url.trim() || loading) return
    setLoading(true)
    setSummary(null)

    try {
      const res = await adminFetch('/api/github/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Could not import from GitHub.')
        return
      }

      const repo = data as ImportResponse
      const patch: Partial<WizardData> = {}
      const filled: string[] = []
      const skipped: string[] = []

      // Never overwrite something the user already typed.
      const apply = <K extends keyof WizardData>(key: K, value: WizardData[K], label: string, has: boolean) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return
        if (has) { skipped.push(label); return }
        patch[key] = value
        filled.push(label)
      }

      apply('title', repo.title, 'title', occupiedFields.includes('title'))
      apply('slug', repo.slug, 'slug', occupiedFields.includes('slug'))
      apply('description', repo.description, 'description', occupiedFields.includes('description'))
      apply('longDescription', repo.longDescription, 'README', occupiedFields.includes('longDescription'))
      apply('coverImage', repo.coverImage, 'cover image', occupiedFields.includes('coverImage'))

      if (repo.githubUrl) {
        patch.githubUrl = repo.githubUrl
        patch.githubUrlEnabled = true
        filled.push('repo link')
      }
      if (repo.demoUrl) {
        patch.demoUrl = repo.demoUrl
        patch.demoUrlEnabled = true
        filled.push('demo link')
      }

      if (repo.features.length) {
        patch.features = repo.features.map((title, i) => ({
          id: generateId(),
          title,
          done: false,
          order: i,
        }))
        filled.push(`${repo.features.length} features`)
      }

      if (repo.techStack.length) {
        patch.techStack = repo.techStack.map<TechStackItemType>(t => ({
          name: t.name,
          category: t.category,
        }))
        filled.push(`${repo.techStack.length} technologies`)
      }

      onImport(patch)
      setSummary({ repo: repo.title, filled, skipped })

      if (!repo.hasReadme) {
        toast.warning('No README found — imported repository metadata only.')
      } else {
        toast.success(`Imported from ${repo.title}`)
      }
      if (repo.archived) {
        toast.warning('Heads up: this repository is archived on GitHub.')
      }
    } catch (error) {
      console.error('GitHub import failed:', error)
      toast.error('Could not reach the importer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gh-import">
      <div className="gh-import-head">
        <Github size={15} style={{ color: 'var(--accent)' }} />
        <span className="pe-label" style={{ margin: 0 }}>Start from a GitHub repo</span>
      </div>

      <p className="gh-import-hint">
        Paste a public repository and we&rsquo;ll read its README, languages and topics to fill in
        the rest of this wizard. Optional — anything you&rsquo;ve already typed is left alone.
      </p>

      <div className="gh-import-row">
        <input
          className="pe-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); run() } }}
          placeholder="github.com/owner/repo"
          aria-label="GitHub repository URL"
          spellCheck={false}
          disabled={loading}
        />
        <button
          type="button"
          onClick={run}
          disabled={!url.trim() || loading}
          className="pe-btn pe-btn-primary pe-btn-md"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Reading…
            </>
          ) : (
            <><Download size={15} /> Import</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="gh-import-result"
          >
            <p>
              <Check size={13} style={{ color: 'var(--accent)' }} />
              Filled in <strong>{summary.filled.join(', ')}</strong>.
            </p>
            {summary.skipped.length > 0 && (
              <p className="gh-import-skipped">
                Kept your existing {summary.skipped.join(', ')}.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
