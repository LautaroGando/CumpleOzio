'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionButtonHold({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: any) => void
}) {
  const holdMs      = (mission.buttonHoldSeconds ?? 3) * 1000
  const [pct, setPct]      = useState(0)
  const [holding, setHolding] = useState(false)
  const [done, setDone]      = useState(false)

  const intervalRef = useRef<any>(null)
  const startRef    = useRef<number>(0)

  const R    = 54
  const circ = 2 * Math.PI * R

  const begin = () => {
    if (done) return
    setHolding(true)
    startRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const p = Math.min(elapsed / holdMs, 1)
      setPct(p)
      if (p >= 1) {
        clearInterval(intervalRef.current)
        setHolding(false)
        setDone(true)
        setTimeout(() => onSuccess(), 800)
      }
    }, 30)
  }

  const cancel = () => {
    if (done) return
    clearInterval(intervalRef.current)
    setHolding(false)
    setPct(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Ring + Button */}
      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 130 130" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={R} fill="none" stroke="var(--rose-100)" strokeWidth="5" />
          {!done && (
            <circle
              cx="65" cy="65" r={R}
              fill="none"
              stroke="url(#holdGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 0.03s linear' }}
            />
          )}
          {done && (
            <circle cx="65" cy="65" r={R} fill="none" stroke="var(--rose-400)" strokeWidth="5" />
          )}
          <defs>
            <linearGradient id="holdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--rose-300)" />
              <stop offset="100%" stopColor="var(--rose-500)" />
            </linearGradient>
          </defs>
        </svg>

        <motion.button
          animate={holding ? { scale: 0.93 } : done ? { scale: 1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onMouseDown={begin}
          onMouseUp={cancel}
          onMouseLeave={cancel}
          onTouchStart={(e) => { e.preventDefault(); begin() }}
          onTouchEnd={cancel}
          style={{
            width: '120px', height: '120px',
            borderRadius: '50%',
            background: done
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : holding
                ? 'linear-gradient(135deg, var(--rose-500), var(--rose-600))'
                : 'linear-gradient(135deg, var(--rose-400), var(--rose-500))',
            border: 'none',
            cursor: done ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.35rem',
            boxShadow: holding
              ? '0 0 0 8px rgba(244,63,94,0.15), 0 8px 28px rgba(244,63,94,0.4)'
              : '0 6px 20px rgba(244,63,94,0.3)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '2rem', lineHeight: 1 }}>{done ? '✓' : holding ? '👆' : '✋'}</span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.85)',
          }}>
            {done ? 'Listo' : holding ? 'Aguanta' : 'Mantén'}
          </span>
        </motion.button>
      </div>

      {/* Hint */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        color: 'var(--charcoal-lighter)',
        textAlign: 'center',
        minHeight: '1.25rem',
      }}>
        {holding ? 'No sueltes...' : done ? '¡Perfecto! 🎉' : `Mantén presionado ${mission.buttonHoldSeconds ?? 3} segundos`}
      </p>
    </div>
  )
}
