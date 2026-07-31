'use client'

import { Input, Textarea } from '@/components/ui/FormElements'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import type { FieldGroupProps, IdentityValue } from './types'
import { slugify } from './types'

/** Title, slug, and the short SEO description — the only required fields. */
export function IdentityFields({ value, onChange }: FieldGroupProps<IdentityValue>) {
  const handleTitle = (title: string) => {
    // Keep the slug in step with the title until the user edits the slug directly.
    const shouldFollow = !value.slug || value.slug === slugify(value.title)
    onChange(shouldFollow ? { title, slug: slugify(title) } : { title })
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        label={
          <span className="flex items-center justify-between w-full">
            <span>Project Title <span className="req">*</span></span>
            <AIGenerateButton
              onGenerate={handleTitle}
              promptContext={{ field: 'Project Title', contextData: { description: value.description } }}
              className="!px-2 !py-1"
            />
          </span>
        }
        value={value.title}
        onChange={(e) => handleTitle(e.target.value)}
        placeholder="e.g., Nexus AI Platform"
      />

      <Input
        label={<span>URL Slug <span className="req">*</span></span>}
        value={value.slug}
        onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
        placeholder="nexus-ai-platform"
        helperText={value.slug ? `/projects/${value.slug}` : 'Lowercase letters, numbers and hyphens only.'}
      />

      <Textarea
        label={
          <span className="flex items-center justify-between w-full">
            <span>Short Description <span className="req">*</span></span>
            <AIGenerateButton
              onGenerate={(text) => onChange({ description: text })}
              promptContext={{ field: 'Short Description', contextData: { title: value.title } }}
              className="!px-2 !py-1"
            />
          </span>
        }
        value={value.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="A concise description of what this project does…"
        rows={3}
        helperText="Used for search results and project cards."
      />
    </div>
  )
}
