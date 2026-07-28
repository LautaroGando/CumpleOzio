'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionPhoto({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: { photoUrl?: string }) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 800
      const MAX_HEIGHT = 800
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        const base64 = canvas.toDataURL('image/jpeg', 0.6)
        
        setPreview(base64)
        setTimeout(() => {
          setIsUploading(false)
          onSuccess({ photoUrl: base64 })
        }, 1500)
      } else {
        // Fallback in case canvas fails (rare)
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          setPreview(base64)
          setTimeout(() => {
            setIsUploading(false)
            onSuccess({ photoUrl: base64 })
          }, 1500)
        }
        reader.readAsDataURL(file)
      }
      
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Preview or Prompt */}
      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: '100%', aspectRatio: '4/3',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <img src={preview} alt="Tu foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', aspectRatio: '4/3',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--rose-200)',
            background: 'var(--rose-50)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.75rem', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>📷</span>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--charcoal-lighter)', textAlign: 'center',
          }}>
            {mission.photoPrompt ?? 'Toca para abrir la cámara'}
          </p>
        </div>
      )}

      {isUploading ? (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--charcoal-lighter)',
          }}
        >
          <span>⏳</span> Procesando...
        </motion.div>
      ) : !preview ? (
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary" style={{ width: '100%' }}>
          <span>📷</span> Tomar foto
        </button>
      ) : null}
    </div>
  )
}
