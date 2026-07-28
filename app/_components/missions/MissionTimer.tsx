'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mission } from '@/app/_lib/story-data'

export default function MissionTimer({ mission, onSuccess }: {
  mission: Mission
  onSuccess: (data?: any) => void
}) {
  const total       = mission.timerSeconds ?? 60
  const [timeLeft, setTimeLeft] = useState(total)
  const [running,  setRunning]  = useState(false)
  const [done,     setDone]     = useState(false)

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setRunning(false)
        setDone(true)
        return 0
      }
      return prev - 1
    })
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [running, tick])

  useEffect(() => {
    if (done) setTimeout(() => onSuccess(), 1200)
  }, [done, onSuccess])

  const progress   = (total - timeLeft) / total
  const R          = 54
  const circ       = 2 * Math.PI * R
  const dashOffset = circ * (1 - progress)

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Circle */}
      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 130 130" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={R} fill="none" stroke="var(--rose-100)" strokeWidth="5" />
          <circle
            cx="65" cy="65" r={R}
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--rose-300)" />
              <stop offset="100%" stopColor="var(--rose-500)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: done ? '2.5rem' : '2.8rem',
            fontWeight: 600,
            color: done ? 'var(--rose-500)' : 'var(--charcoal)',
            lineHeight: 1,
          }}>
            {done ? '✓' : `${mm}:${ss}`}
          </div>
          {running && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--charcoal-lighter)',
              letterSpacing: '0.05em',
              marginTop: '0.25rem',
            }}>
              {total >= 60 ? 'minutos' : 'segundos'}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      {!running && !done && timeLeft === total && (
        <button onClick={() => setRunning(true)} className="btn-primary" style={{ width: '100%' }}>
          <span>▶</span> Iniciar
        </button>
      )}

      {running && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'var(--charcoal-lighter)',
            textAlign: 'center',
          }}
        >
          No uses el celular. Solo espera...
        </motion.p>
      )}

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'var(--rose-500)',
            textAlign: 'center',
          }}
        >
          Perfecto ✨
        </motion.p>
      )}
    </div>
  )
}
