'use client'

import { motion } from 'framer-motion'
import { useAdventure } from '@/app/_components/adventure-context'
import Navigation from '@/app/_components/Navigation'
import { STORY_CHAPTERS } from '@/app/_lib/story-data'

export default function RecuerdosPage() {
  const { state, isLoaded } = useAdventure()
  const isCompleted = state.completedMissionIds.length > 0

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, var(--rose-50) 0%, var(--cream) 60%, rgba(254,243,199,0.3) 100%)',
      paddingBottom: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle warm glows */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(252,211,77,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <Navigation />

      <div style={{
        maxWidth: '600px', margin: '0 auto',
        padding: 'clamp(3.5rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem) 0',
        position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            {isCompleted ? 'Aventura completada' : 'Libro de recuerdos'}
          </h1>
          <div style={{
            width: '40px', height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--rose-500), transparent)',
            margin: '0 auto',
          }} />
        </motion.div>

        {/* Empty state */}
        {!isLoaded || state.memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: 'center', padding: '4rem 1rem',
              border: '1px dashed var(--rose-200)',
              borderRadius: 'var(--radius-2xl)',
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: '1.1rem', color: 'var(--charcoal-lighter)', lineHeight: 1.7,
            }}>
              Las páginas se irán llenando<br />a medida que vivamos la aventura.
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STORY_CHAPTERS.map((chap, chapIdx) => {
              const chapterMemories = state.memories.filter(m =>
                chap.missions.some(mis => mis.id === m.missionId)
              )
              if (chapterMemories.length === 0) return null

              return (
                <motion.div
                  key={chap.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7 }}
                  style={{ position: 'relative', paddingLeft: '2rem', paddingBottom: '2.5rem' }}
                >
                  {/* Timeline vertical line */}
                  {chapIdx < STORY_CHAPTERS.length - 1 && (
                    <div style={{
                      position: 'absolute', left: '7px', top: '28px', bottom: 0,
                      width: '1px',
                      background: 'linear-gradient(to bottom, rgba(244,63,94,0.3), rgba(244,63,94,0.05))',
                    }} />
                  )}

                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: 0, top: '4px',
                    width: '15px', height: '15px', borderRadius: '50%',
                    background: 'var(--rose-500)',
                    boxShadow: '0 0 0 4px rgba(244,63,94,0.15)',
                  }} />

                  {/* Day + time */}
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    color: 'var(--rose-500)', marginBottom: '0.25rem',
                  }}>
                    {chap.dayLabel} · {chap.timeLabel}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem', fontWeight: 600,
                    color: 'var(--charcoal)', marginBottom: '1rem',
                  }}>
                    {chap.title}
                  </h3>

                  {/* Memory cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {chapterMemories.map(mem => (
                      <div key={mem.missionId}>
                        {mem.photoUrl && (
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            style={{
                              background: '#fff',
                              borderRadius: 'var(--radius-xl)',
                              overflow: 'hidden',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                              border: '1px solid rgba(253, 164, 175, 0.25)',
                              padding: '8px',
                            }}
                          >
                            <img
                              src={mem.photoUrl}
                              alt="Recuerdo"
                              style={{ width: '100%', display: 'block', borderRadius: 'calc(var(--radius-xl) - 4px)' }}
                            />
                          </motion.div>
                        )}
                        {mem.text && (
                          <div style={{
                            background: '#fff',
                            border: '1px solid rgba(253, 164, 175, 0.25)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1rem 1.25rem',
                          }}>
                            <p style={{
                              fontFamily: 'var(--font-display)', fontStyle: 'italic',
                              fontSize: '1rem', color: 'var(--charcoal-light)',
                              lineHeight: 1.7,
                            }}>
                              "{mem.text}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
