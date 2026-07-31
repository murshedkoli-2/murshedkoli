'use client'

import { Input, Select } from '@/components/ui/FormElements'
import { ToggleSwitch } from './LinksFields'
import type { FieldGroupProps, StatusValue, LifecycleStatus, PublishStatus } from './types'
import { LIFECYCLE_OPTIONS, PUBLISH_OPTIONS } from './types'

/** Where the project sits in its lifecycle, and whether the public site shows it. */
export function StatusFields({ value, onChange }: FieldGroupProps<StatusValue>) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Lifecycle Stage"
          value={value.lifecycleStatus}
          onChange={(e) => onChange({ lifecycleStatus: e.target.value as LifecycleStatus })}
          options={LIFECYCLE_OPTIONS}
        />
        <Select
          label="Publish Status"
          value={value.publishStatus}
          onChange={(e) => onChange({ publishStatus: e.target.value as PublishStatus })}
          options={PUBLISH_OPTIONS}
          helperText="Only published projects appear on the site."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Input
          label="Display Order"
          type="number"
          value={value.order}
          onChange={(e) => onChange({ order: parseInt(e.target.value) || 0 })}
          helperText="Lower numbers sort first."
        />
        <div>
          <span className="pe-label">Featured</span>
          <label className="flex items-center gap-3 cursor-pointer">
            <ToggleSwitch
              checked={value.featured}
              onChange={(v) => onChange({ featured: v })}
              label="Featured"
            />
            <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
              Show in the homepage&rsquo;s selected work
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
