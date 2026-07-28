'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionGPS({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: any) => void
}) {
  const [state, setState] = useState<'idle' | 'locating' | 'error'>('idle')

  const handleCheck = () => {
    setState('locating')
    if (!navigator.geolocation) {
      setState('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => { setState('idle'); onSuccess() },
      () => setState('error'),
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Radar animation */}
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {state === 'locating' && [0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '100%', height: '100%',
              borderRadius: '50%',
              border: '2px solid var(--rose-300)',
            }}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: state === 'error'
            ? 'rgba(244,63,94,0.08)'
            : 'linear-gradient(135deg, var(--rose-50), var(--rose-100))',
          border: `2px solid ${state === 'error' ? 'var(--rose-300)' : 'var(--rose-200)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
        }}>
          {state === 'error' ? '📡' : '📍'}
        </div>
      </div>

      {state === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(244,63,94,0.06)',
            border: '1px solid rgba(244,63,94,0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--charcoal-light)',
            textAlign: 'center',
          }}
        >
          No se pudo obtener la ubicación.
          <br />
          <button
            onClick={() => onSuccess()}
            style={{
              background: 'none', border: 'none',
              color: 'var(--rose-500)', cursor: 'pointer',
              fontWeight: 600, marginTop: '0.5rem',
              textDecoration: 'underline', textDecorationStyle: 'dotted',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            }}
          >
            Continuar de todos modos
          </button>
        </motion.div>
      )}

      <button
        onClick={handleCheck}
        disabled={state === 'locating'}
        className="btn-primary"
        style={{ width: '100%', opacity: state === 'locating' ? 0.7 : 1 }}
      >
        {state === 'locating' ? (
          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            Localizando...
          </motion.span>
        ) : (
          <><span>📍</span> Ya llegamos</>
        )}
      </button>
    </div>
  )
}
