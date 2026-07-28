'use client'

import { motion } from 'framer-motion'
import { useAdventure } from '@/app/_components/adventure-context'
import Navigation from '@/app/_components/Navigation'
import { STORY_CHAPTERS } from '@/app/_lib/story-data'

export default function GaleriaPage() {
  const { state, isLoaded } = useAdventure()

  const photos = state.memories.filter(m => m.photoUrl)

  const getChapterTitle = (missionId: string) => {
    for (const c of STORY_CHAPTERS) {
      if (c.missions.some(m => m.id === missionId)) return c.title
    }
    return ''
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, var(--rose-50) 0%, var(--cream) 60%)',
      paddingBottom: '2rem',
    }}>
      <Navigation />

      <div style={{
        maxWidth: '660px',
        margin: '0 auto',
        padding: 'clamp(3.5rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem) 0',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const,
            color: 'var(--rose-400)', marginBottom: '0.5rem',
          }}>
            {photos.length > 0 ? `${photos.length} foto${photos.length !== 1 ? 's' : ''} guardada${photos.length !== 1 ? 's' : ''}` : 'Álbum'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
            fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.1,
          }}>
            Nuestros momentos
          </h1>
        </div>

        {/* Grid or empty */}
        {!isLoaded || photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '4rem 1rem',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px dashed var(--rose-200)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: '1.1rem', color: 'var(--charcoal-lighter)', lineHeight: 1.7,
            }}>
              Aquí aparecerán tus fotos<br />a medida que avancemos en la aventura.
            </p>
          </motion.div>
        ) : (
          <div style={{ columns: '2', columnGap: '1rem', gap: '1rem' }}>
            {photos.map((mem, i) => (
              <motion.div
                key={mem.missionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="polaroid"
                style={{ marginBottom: '1rem', breakInside: 'avoid', display: 'block' }}
              >
                <img
                  src={mem.photoUrl}
                  alt="Recuerdo"
                  style={{
                    width: '100%', display: 'block',
                    borderRadius: '2px',
                    backgroundColor: 'var(--rose-50)',
                  }}
                />
                <div style={{ paddingTop: '0.75rem', textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    fontSize: '0.9rem', color: 'var(--charcoal-lighter)',
                  }}>
                    {getChapterTitle(mem.missionId)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
