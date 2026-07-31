'use client'

import { Input, Textarea } from '@/components/ui/FormElements'
import { AIGenerateButton } from '@/components/AIGenerateButton'
import type { FieldGroupProps, StoryValue } from './types'

/** The long-form prose: full write-up, outcome, and your role. */
export function StoryFields({ value, onChange }: FieldGroupProps<StoryValue>) {
  return (
    <div className="flex flex-col gap-5">
      <Textarea
        label={
          <span className="flex items-center justify-between w-full">
            <span>Long Description</span>
            <AIGenerateButton
              onGenerate={(text) => onChange({ longDescription: text })}
              promptContext={{ field: 'Long Description', contextData: { outcome: value.outcome, role: value.role } }}
              className="!px-2 !py-1"
            />
          </span>
        }
        value={value.longDescription}
        onChange={(e) => onChange({ longDescription: e.target.value })}
        placeholder="Detailed write-up with features, goals, tech highlights…"
        rows={10}
        helperText="Markdown. Also what AI crawlers read."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Outcome"
          value={value.outcome}
          onChange={(e) => onChange({ outcome: e.target.value })}
          placeholder="e.g. Shipped to 12K users · Load time down 60%"
        />
        <Input
          label="Your Role"
          value={value.role}
          onChange={(e) => onChange({ role: e.target.value })}
          placeholder="e.g. Lead Full-Stack Engineer"
        />
      </div>
    </div>
  )
}
