'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAdventure } from '@/app/_components/adventure-context'
import { STORY_CHAPTERS, Mission } from '@/app/_lib/story-data'
import { useSound } from '@/app/_hooks/useSound'
import ConfettiEffect from '@/app/_components/ConfettiEffect'
import MissionPhoto from '@/app/_components/missions/MissionPhoto'
import MissionRiddle from '@/app/_components/missions/MissionRiddle'
import MissionTimer from '@/app/_components/missions/MissionTimer'
import MissionGPS from '@/app/_components/missions/MissionGPS'
import MissionMessage from '@/app/_components/missions/MissionMessage'
import MissionButtonHold from '@/app/_components/missions/MissionButtonHold'

const MISSION_TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  PHOTO:       { icon: '📷', label: 'Foto',       color: 'rgba(139,92,246,0.1)' },
  RIDDLE:      { icon: '🔍', label: 'Adivinanza', color: 'rgba(59,130,246,0.1)' },
  TIMER:       { icon: '⏱️', label: 'Silencio',   color: 'rgba(16,185,129,0.1)' },
  GPS:         { icon: '📍', label: 'Ubicación',  color: 'rgba(251,146,60,0.1)'  },
  MESSAGE:     { icon: '💌', label: 'Mensaje',    color: 'rgba(244,63,94,0.1)'   },
  BUTTON_HOLD: { icon: '✋', label: 'Reto',       color: 'rgba(245,158,11,0.1)'  },
}

export default function MisionClient() {
  const params     = useParams()
  const router     = useRouter()
  const { isLoaded, completeMission } = useAdventure()
  const playSound  = useSound()

  const [isSuccess, setIsSuccess]         = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  if (!isLoaded) return null

  const missionId = params.id as string

  let mission: Mission | null = null
  let chapterTitle  = ''
  let chapterOrder  = 0

  for (const c of STORY_CHAPTERS) {
    const m = c.missions.find(x => x.id === missionId)
    if (m) {
      mission       = m
      chapterTitle  = c.title
      chapterOrder  = c.order
      break
    }
  }

  if (!mission) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <p style={{ color: 'var(--charcoal-lighter)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
        Misión no encontrada.
      </p>
    </div>
  )

  const meta = MISSION_TYPE_META[mission.type] ?? MISSION_TYPE_META.MESSAGE

  const handleSuccess = (memoryData?: { photoUrl?: string; text?: string }) => {
    setIsSuccess(true)
    setSuccessMessage(mission!.successMessage)
    playSound('success')
    setTimeout(() => {
      completeMission(missionId, memoryData)
      playSound('unlock')
      router.push('/mapa')
    }, 4000)
  }

  const renderMission = () => {
    switch (mission!.type) {
      case 'PHOTO':       return <MissionPhoto mission={mission!} onSuccess={handleSuccess} />
      case 'RIDDLE':      return <MissionRiddle mission={mission!} onSuccess={handleSuccess} />
      case 'TIMER':       return <MissionTimer mission={mission!} onSuccess={handleSuccess} />
      case 'GPS':         return <MissionGPS mission={mission!} onSuccess={handleSuccess} />
      case 'MESSAGE':     return <MissionMessage mission={mission!} onSuccess={handleSuccess} />
      case 'BUTTON_HOLD': return <MissionButtonHold mission={mission!} onSuccess={handleSuccess} />
      default: return null
    }
  }

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, var(--rose-50) 0%, var(--cream) 50%, rgba(254,243,199,0.3) 100%)',
      position: 'relative',
      overflowX: 'hidden',
      marginBottom: 'calc(-72px - env(safe-area-inset-bottom))',
    }}>
      {/* Back button */}
      <AnimatePresence>
        {!isSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 20 }}
          >
            <button
              onClick={() => router.push('/mapa')}
              style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(244,63,94,0.15)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                color: 'var(--charcoal-light)',
                transition: 'all 0.2s ease',
              }}
            >
              ←
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfettiEffect fire={isSuccess} />

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem, 6vw, 5rem) clamp(1rem, 5vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)',
      }}>
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="mission"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: '100%', maxWidth: '440px' }}
            >
              {/* Chapter badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.9rem',
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.15)',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--rose-500)',
                }}>
                  Capítulo {chapterOrder} · {chapterTitle}
                </span>
              </motion.div>

              {/* Mission title */}
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                }}
              >
                {mission.title}
              </motion.h1>

              {/* Mission card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: '0 2px 0 var(--rose-100), 0 20px 60px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(253,164,175,0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* Card top accent */}
                <div style={{
                  height: '5px',
                  background: 'linear-gradient(90deg, var(--rose-300), var(--rose-500))',
                  borderTopLeftRadius: 'var(--radius-2xl)',
                  borderTopRightRadius: 'var(--radius-2xl)',
                }} />

                {/* Mission type badge */}
                <div style={{ padding: '1.5rem 1.75rem 0' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    background: meta.color,
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                  }}>
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
                    color: 'var(--charcoal-light)',
                    lineHeight: 1.8,
                    marginBottom: '2rem',
                  }}>
                    {mission.description}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--rose-100), transparent)', margin: '0 1.75rem' }} />

                {/* Mission component */}
                <div style={{ padding: '1.75rem' }}>
                  {renderMission()}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ textAlign: 'center', maxWidth: '380px', width: '100%' }}
            >
              {/* Animated star */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
                style={{ fontSize: '5rem', marginBottom: '1.5rem', display: 'block', lineHeight: 1 }}
              >
                ✨
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 6vw, 2.8rem)',
                  color: 'var(--charcoal)',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                ¡Misión cumplida!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--rose-100)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 24px rgba(244,63,94,0.08)',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                  color: 'var(--rose-500)',
                  lineHeight: 1.7,
                }}>
                  "{successMessage}"
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--charcoal-lighter)',
                  marginTop: '1.5rem',
                }}
              >
                Volviendo al mapa...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
