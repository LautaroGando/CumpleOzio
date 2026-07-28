'use client'

import { motion } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionMessage({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: any) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {mission.messageText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'var(--rose-50)',
            border: '1px solid var(--rose-100)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'var(--charcoal)',
            lineHeight: 1.9,
            whiteSpace: 'pre-line',
          }}>
            {mission.messageText}
          </p>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => onSuccess()}
        className="btn-primary"
        style={{ width: '100%' }}
      >
        Continuar →
      </motion.button>
    </div>
  )
}
