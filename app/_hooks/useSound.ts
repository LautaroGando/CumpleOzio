'use client'

import { useCallback } from 'react'

type SoundType = 'success' | 'unlock' | 'soft-click'

export function useSound() {
  const play = useCallback((type: SoundType) => {
    // In a real application, you would load real sound files.
    // For now, we will create a subtle oscillator beep using the Web Audio API
    // which provides a very elegant, soft sound without needing external assets.
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      if (type === 'success') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.5)
      } else if (type === 'unlock') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime) // A4
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3) // A5
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.8)
      } else {
        // soft click
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.1)
      }
    } catch (e) {
      console.log('Audio playback failed', e)
    }
  }, [])

  return play
}
