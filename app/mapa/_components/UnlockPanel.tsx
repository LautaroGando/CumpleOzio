'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useActionState } from 'react'
import type { DestinationWithStatus } from '@/app/actions/destinations'
import { unlockDestination } from '@/app/actions/destinations'

interface Props {
  destination: DestinationWithStatus
  onClose: () => void
  onUnlocked: (id: string) => void
}

export default function UnlockPanel({ destination, onClose, onUnlocked }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [comment, setComment] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Por favor, seleccioná una foto.')
      return
    }
    setUploading(true)
    setError(null)

    try {
      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Error al subir la foto')
      const { url } = await uploadRes.json()

      // Unlock destination
      const result = await unlockDestination(destination.id, url, comment)
      if (!result.success) throw new Error(result.error ?? 'Error desconocido')

      onUnlocked(destination.id)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      key="unlock-panel"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ maxHeight: '85dvh' }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-50 glass-card overflow-y-auto"
        style={{
          borderRadius: '1.5rem 1.5rem 0 0',
          padding: 'clamp(1.5rem, 4vw, 2rem)',
          maxHeight: '85dvh',
          background: 'rgba(255, 249, 250, 0.96)',
        }}
      >
        {/* Handle */}
        <div
          className="mx-auto mb-5"
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'var(--rose-200)',
          }}
        />

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
            style={{ background: 'var(--rose-100)' }}
          >
            <span style={{ fontSize: '1.8rem' }}>🔒</span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              color: 'var(--charcoal)',
            }}
          >
            {destination.name}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--charcoal-lighter)' }}
          >
            {destination.date} · Para desbloquear este recuerdo, subí una foto del momento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo upload area */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="sr-only"
              id="photo-input"
            />

            {preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setFile(null) }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  ✕
                </button>
              </motion.div>
            ) : (
              <label
                htmlFor="photo-input"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition-all"
                style={{
                  border: '2px dashed var(--rose-200)',
                  padding: '2.5rem 1rem',
                  background: 'var(--rose-50)',
                  color: 'var(--charcoal-lighter)',
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>📷</span>
                <div className="text-center">
                  <p className="font-medium text-sm" style={{ color: 'var(--charcoal)' }}>
                    Subí una foto de este momento
                  </p>
                  <p className="text-xs mt-0.5">JPG, PNG o HEIC · máximo 10MB</p>
                </div>
              </label>
            )}
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--charcoal)' }}
            >
              Comentario <span style={{ color: 'var(--charcoal-lighter)' }}>(opcional)</span>
            </label>
            <textarea
              id="comment"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Un pensamiento, una emoción, un detalle…"
              className="w-full rounded-xl text-sm resize-none"
              style={{
                border: '1.5px solid var(--rose-200)',
                padding: '0.75rem 1rem',
                background: 'white',
                color: 'var(--charcoal)',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                lineHeight: '1.6',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-center" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="btn-primary flex-1"
              style={{
                opacity: uploading || !file ? 0.6 : 1,
                cursor: uploading || !file ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block' }}
                  >
                    ⟳
                  </motion.span>
                  Desbloqueando…
                </>
              ) : (
                <>✨ Desbloquear recuerdo</>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
