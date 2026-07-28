'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiEffectProps {
  fire: boolean
}

export default function ConfettiEffect({ fire }: ConfettiEffectProps) {
  useEffect(() => {
    if (fire) {
      const duration = 2.5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 40 * (timeLeft / duration)
        
        // Soft pastel colors matching the theme
        const colors = ['#fecdd3', '#fda4af', '#fcd34d', '#ffffff']

        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random() * 0.5 + 0.25, y: Math.random() * 0.2 + 0.2 },
          colors: colors,
          disableForReducedMotion: true
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [fire])

  return null
}
