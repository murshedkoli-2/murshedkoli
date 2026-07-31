'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AIGenerateButtonProps {
  onGenerate: (generatedText: string) => void
  promptContext: {
    field: string
    contextData: Record<string, any>
  }
  className?: string
}

export function AIGenerateButton({ onGenerate, promptContext, className = '' }: AIGenerateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptContext),
      })
      if (!response.ok) {
        throw new Error('Failed to generate content')
      }
      const data = await response.json()
      if (data.text) {
        onGenerate(data.text)
      }
    } catch (error) {
      console.error('AI Generation error:', error)
      // Transient failure, not a decision — a toast is the right primitive here.
      toast.error('Could not generate content. Check that your API keys are configured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className={`pe-btn pe-btn-ghost pe-btn-sm ${className}`}
      title="Auto-generate via AI"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Sparkles size={13} />
      )}
      <span>Generate AI</span>
    </button>
  )
}
