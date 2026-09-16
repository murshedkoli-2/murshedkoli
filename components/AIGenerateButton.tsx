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
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function AIGenerateButton({
  onGenerate,
  promptContext,
  label = 'AI Generate',
  className = '',
  size = 'sm',
}: AIGenerateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
        const providerName = data.provider === 'nvidia-nim' 
          ? `NVIDIA NIM (${data.model ? data.model.split('/').pop() : 'Active'})` 
          : data.provider || 'AI'
        toast.success(`Generated via ${providerName}`)
      }
    } catch (error) {
      console.error('AI Generation error:', error)
      toast.error('Could not generate content. Check your AI keys in Settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className={`adm-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: size === 'sm' ? '3px 8px' : '6px 12px',
        fontSize: size === 'sm' ? 11.5 : 13,
        fontWeight: 600,
        borderRadius: 8,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#10b981',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
      title="Auto-generate or polish content using NVIDIA NIM AI"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Sparkles size={12} style={{ color: '#10b981' }} />
      )}
      <span>{loading ? 'Thinking…' : label}</span>
    </button>
  )
}
