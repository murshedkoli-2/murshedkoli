'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface EditableFieldProps {
  label: string
  value: string
  /** Persists the new value. Resolve false to keep the field in edit mode. */
  onSave: (next: string) => Promise<boolean>
  placeholder?: string
  multiline?: boolean
  type?: 'text' | 'email' | 'tel' | 'url'
  /** Shown in read mode when the value is empty. */
  emptyText?: string
  /** Rendered under the value in read mode — a thumbnail, a link, an upload button. */
  extra?: ReactNode
  /** Renders the stored value as something other than plain text. */
  renderValue?: (value: string) => ReactNode
}

/**
 * One field, read-only until you ask to edit it.
 *
 * Each field saves on its own, so a typo in one place can't be committed by a
 * page-wide save button, and an in-progress edit elsewhere can't be lost.
 */
export function EditableField({
  label,
  value,
  onSave,
  placeholder,
  multiline = false,
  type = 'text',
  emptyText = 'Not set',
  extra,
  renderValue,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // A save elsewhere (or a reload) can change the stored value under us.
  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = async () => {
    if (draft === value) { setEditing(false); return }
    setSaving(true)
    const ok = await onSave(draft)
    setSaving(false)
    if (ok) setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); cancel() }
    // Enter commits a single-line field; textareas keep Enter for newlines.
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit() }
  }

  if (!editing) {
    return (
      <div className="ef-row">
        <div className="ef-main">
          <span className="ef-label">{label}</span>
          <div className={`ef-value ${value ? '' : 'empty'}`}>
            {value ? (renderValue ? renderValue(value) : value) : emptyText}
          </div>
          {extra}
        </div>
        <button
          type="button"
          className="adm-icon-btn ef-edit"
          onClick={() => setEditing(true)}
          title={`Edit ${label}`}
          aria-label={`Edit ${label}`}
        >
          ✎
        </button>
      </div>
    )
  }

  return (
    <div className="ef-row editing">
      <div className="ef-main">
        <span className="ef-label">{label}</span>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="adm-textarea"
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className="adm-input"
            type={type}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
        )}
        <div className="ef-actions">
          <button className="adm-btn amber" onClick={commit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="adm-btn" onClick={cancel} disabled={saving}>
            Cancel
          </button>
          {!multiline && <span className="ef-hint">Enter to save · Esc to cancel</span>}
        </div>
      </div>
    </div>
  )
}
