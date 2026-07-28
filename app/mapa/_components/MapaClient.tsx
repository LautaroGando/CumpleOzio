'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { useAdventure } from '@/app/_components/adventure-context'
import { STORY_CHAPTERS } from '@/app/_lib/story-data'
import ResetConfirmModal from '@/app/_components/ResetConfirmModal'

const DAY_ICONS: Record<string, string> = {
  Viernes: '🌙',
  Sábado: '⛰️',
  Domingo: '🌿',
}

const CHAPTER_ICONS: Record<string, string> = {
  chap_1: '🚗',
  chap_2: '☕',
  chap_3: '🪨',
  chap_4: '🏔️',
  chap_5: '🍃',
  chap_6: '💧',
  chap_7: '🌅',
  chap_8: '🍷',
  chap_9: '💎',
  chap_10: '🌲',
  chap_11: '🏠',
}

export default function MapaClient() {
  const router = useRouter()
  const { state, currentChapter, isLoaded, resetProgress } = useAdventure()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  const handleReset = () => {
    resetProgress()
    window.location.reload()
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-2xl" style={{ background: 'var(--rose-100)', animation: 'pulse 2s infinite' }} />
        ))}
      </div>
    )
  }

  const currentIndex = STORY_CHAPTERS.findIndex(c => c.id === state.currentChapterId)
  const isFullyDone = state.currentChapterId === 'chap_11' && state.completedMissionIds.includes('m_11_1')

  // Group chapters by day
  const grouped = STORY_CHAPTERS.reduce<Record<string, typeof STORY_CHAPTERS>>((acc, chap) => {
    if (!acc[chap.dayLabel]) acc[chap.dayLabel] = []
    acc[chap.dayLabel].push(chap)
    return acc
  }, {})

  return (
    <div className="w-full">

      {/* Reset Modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--charcoal-lighter)', letterSpacing: '0.05em' }}>
            PROGRESO
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--rose-500)' }}>
              {currentIndex} / {STORY_CHAPTERS.length - 1}
            </span>
            <button
              onClick={() => setShowResetModal(true)}
              title="Reiniciar progreso"
              style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: 'rgba(244,63,94,0.06)',
                border: '1px solid rgba(244,63,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'var(--rose-400)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(244,63,94,0.12)'
                e.currentTarget.style.transform = 'rotate(-45deg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(244,63,94,0.06)'
                e.currentTarget.style.transform = ''
              }}
            >
              <RotateCcw size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div style={{ height: '4px', background: 'var(--rose-100)', borderRadius: '9999px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (STORY_CHAPTERS.length - 1)) * 100}%` }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--rose-400), var(--rose-500))',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([day, chapters]) => {
          const dayIndex = STORY_CHAPTERS.findIndex(c => c.dayLabel === day)
          const isDayUnlocked = dayIndex <= currentIndex

          return (
            <div key={day}>
              {/* Day Header */}
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: '1.4rem' }}>{DAY_ICONS[day] ?? '📅'}</span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                  color: isDayUnlocked ? 'var(--charcoal)' : 'var(--charcoal-lighter)',
                  fontWeight: 600,
                }}>
                  {day}
                </h2>
                <div style={{ flex: 1, height: '1px', background: isDayUnlocked ? 'var(--rose-200)' : 'var(--rose-100)' }} />
              </div>

              {/* Chapters for this day */}
              <div className="flex flex-col gap-3 pl-2">
                {chapters.map((chap) => {
                  const chapIndex = STORY_CHAPTERS.findIndex(c => c.id === chap.id)
                  const isCompleted = chapIndex < currentIndex || (isFullyDone && chapIndex === STORY_CHAPTERS.length - 1)
                  const isCurrent = chapIndex === currentIndex && !isFullyDone
                  const isLocked = chapIndex > currentIndex

                  return (
                    <ChapterCard
                      key={chap.id}
                      chap={chap}
                      chapIcon={CHAPTER_ICONS[chap.id] ?? '⭐'}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      isLocked={isLocked}
                      isExpanded={expandedId === chap.id}
                      onExpand={() => setExpandedId(prev => prev === chap.id ? null : chap.id)}
                      onStartMission={() => router.push(`/mision/${state.currentMissionId}`)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Final CTA */}
      {isFullyDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
          style={{ marginTop: '3rem', marginBottom: '2rem', paddingTop: '1rem' }}
        >
          <button onClick={() => router.push('/recuerdos')} className="btn-primary">
            <span>✨</span>
            Ver nuestros recuerdos
          </button>
        </motion.div>
      )}
    </div>
  )
}

interface ChapterCardProps {
  chap: (typeof STORY_CHAPTERS)[0]
  chapIcon: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked: boolean
  isExpanded: boolean
  onExpand: () => void
  onStartMission: () => void
}

function ChapterCard({ chap, chapIcon, isCompleted, isCurrent, isLocked, isExpanded, onExpand, onStartMission }: ChapterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={!isLocked ? onExpand : undefined}
      style={{
        borderRadius: 'var(--radius-xl)',
        border: isCurrent
          ? '1.5px solid var(--rose-300)'
          : isCompleted
            ? '1.5px solid var(--rose-100)'
            : '1.5px solid rgba(0,0,0,0.06)',
        background: isCurrent
          ? 'linear-gradient(135deg, rgba(255,241,242,0.9), rgba(255,228,230,0.7))'
          : isCompleted
            ? 'rgba(255,255,255,0.6)'
            : 'rgba(248,248,252,0.4)',
        backdropFilter: 'blur(12px)',
        boxShadow: isCurrent
          ? '0 4px 24px rgba(244,63,94,0.12), 0 1px 4px rgba(244,63,94,0.06)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        cursor: isLocked ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
        {/* Icon / Status */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isLocked ? '1rem' : '1.3rem',
          background: isCurrent
            ? 'linear-gradient(135deg, var(--rose-400), var(--rose-500))'
            : isCompleted
              ? 'var(--rose-50)'
              : 'rgba(0,0,0,0.04)',
          boxShadow: isCurrent ? '0 4px 12px rgba(244,63,94,0.3)' : 'none',
          color: isCompleted && !isCurrent ? 'var(--rose-400)' : '#fff',
        }}>
          {isLocked ? '🔒' : isCompleted && !isCurrent ? '✓' : chapIcon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isCurrent ? 'var(--rose-500)' : 'var(--charcoal-lighter)',
            }}>
              {chap.timeLabel}
            </span>
            {isCurrent && (
              <span style={{
                fontSize: '0.6rem', fontFamily: 'var(--font-body)', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--rose-500)',
                background: 'rgba(244,63,94,0.08)',
                padding: '2px 8px', borderRadius: '9999px',
              }}>
                Ahora
              </span>
            )}
          </div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: isLocked ? 'var(--charcoal-lighter)' : 'var(--charcoal)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {isLocked ? '???' : chap.title}
          </p>
        </div>

        {/* Chevron */}
        {!isLocked && (
          <div style={{
            color: 'var(--charcoal-lighter)',
            fontSize: '0.9rem',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}>
            ›
          </div>
        )}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.25rem 1.25rem',
              borderTop: '1px solid rgba(244,63,94,0.10)',
              marginTop: '0',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--charcoal-light)',
                lineHeight: 1.7,
                marginTop: '1rem',
                marginBottom: isCurrent ? '1.25rem' : '0',
              }}>
                {isCompleted ? chap.description : chap.description}
              </p>

              {isCurrent && (
                <button
                  onClick={(e) => { e.stopPropagation(); onStartMission() }}
                  className="btn-primary w-full"
                >
                  <span>✨</span>
                  Ir a la misión
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
