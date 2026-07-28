'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionRiddle({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: { text?: string }) => void
}) {
  const [answer, setAnswer]     = useState('')
  const [status, setStatus]     = useState<'idle' | 'error' | 'success'>('idle')
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

    const correct  = normalize(mission.riddleAnswer || '')
    const provided = normalize(answer)

    if (provided.includes(correct) || (correct.includes(provided) && provided.length > 3)) {
      setStatus('success')
      setTimeout(() => onSuccess({ text: answer }), 600)
    } else {
      setStatus('error')
      setAttempts(a => a + 1)
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="input-romantic"
          style={{
            borderColor: status === 'error' ? '#f43f5e' : status === 'success' ? '#10b981' : undefined,
            boxShadow: status === 'error'
              ? '0 0 0 4px rgba(244,63,94,0.08)'
              : status === 'success'
                ? '0 0 0 4px rgba(16,185,129,0.08)'
                : undefined,
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(244,63,94,0.06)',
              border: '1px solid rgba(244,63,94,0.15)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--rose-600)',
            }}
          >
            <span>🤔</span>
            <span>
              {attempts === 1
                ? 'Esa no es... piénsalo un poco más.'
                : attempts === 2
                  ? 'Casi... piensa en lo que te rodea.'
                  : 'Pista: tiene que ver con el destino.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={!answer.trim() || status === 'success'}
        className="btn-primary"
        style={{ width: '100%', opacity: !answer.trim() ? 0.5 : 1 }}
      >
        {status === 'success' ? '✓ ¡Correcto!' : 'Confirmar respuesta'}
      </button>
    </form>
  )
}
