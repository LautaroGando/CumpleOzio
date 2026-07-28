'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  isPetal: boolean
}

export default function AmbientBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 20,
      size: 5 + Math.random() * 5,
      opacity: 0.25 + Math.random() * 0.35,
      duration: 14 + Math.random() * 14,
      delay: Math.random() * 16,
      isPetal: i % 2 === 0,
    }))
    setParticles(generated)
  }, [])

  return (
    <div
      className="ambient-bg"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      {/* Top-right large rose glow */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-8%',
        width: 'clamp(300px, 55vw, 700px)',
        height: 'clamp(300px, 55vw, 700px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(253,164,175,0.18) 0%, rgba(255,228,230,0.08) 45%, transparent 70%)',
      }} />

      {/* Bottom-left warm cream glow */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-5%',
        width: 'clamp(200px, 45vw, 600px)',
        height: 'clamp(200px, 45vw, 600px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(252,211,77,0.09) 0%, transparent 65%)',
      }} />

      {/* Center subtle vignette glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(200px, 50vw, 500px)',
        height: 'clamp(200px, 50vw, 500px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)',
      }} />

      {/* Falling petals */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: `-${p.size * 2}px`,
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            borderRadius: p.isPetal ? '50% 0 50% 0' : '50%',
            background: p.isPetal
              ? `linear-gradient(135deg, var(--rose-200), var(--rose-300))`
              : `linear-gradient(135deg, var(--gold-200), var(--gold-300))`,
            opacity: p.opacity,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
