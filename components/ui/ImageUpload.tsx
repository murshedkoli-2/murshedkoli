'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label: string
    previewSize?: 'small' | 'medium' | 'large'
    folder?: string
}

export function ImageUpload({ value, onChange, label, previewSize = 'medium', folder = 'portfolio' }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const previewSizes = {
        small: 'w-16 h-16',
        medium: 'w-32 h-32',
        large: 'w-full h-48'
    }

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                onChange(data.url)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(data.message || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }, [onChange])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            uploadFile(files[0])
        }
    }, [uploadFile])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            uploadFile(files[0])
        }
    }, [uploadFile])


    const handleRemove = () => {
        onChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div>
            <span className="pe-label">{label}</span>

            {value ? (
                <div className={`relative group ${previewSizes[previewSize]}`}>
                    <div
                        className="relative w-full h-full overflow-hidden"
                        style={{ borderRadius: 6, border: '1px solid var(--line)', background: 'var(--surface-2)' }}
                    >
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        aria-label={`Remove ${label}`}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--ink)', color: 'var(--canvas)' }}
                    >
                        <X size={13} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cert-drop-zone ${isDragging ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''} ${previewSizes[previewSize]}`}
                    style={{ justifyContent: 'center' }}
                >
                    {isUploading ? (
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--accent)' }} />
                    ) : (
                        <>
                            <Upload className="w-6 h-6" style={{ color: 'var(--ink-muted)' }} />
                            <span className="cert-drop-sub" style={{ marginTop: 6 }}>
                                Click or drag image
                            </span>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}
        </div>
    )
}
