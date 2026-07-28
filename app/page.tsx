'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LETTER_DEFAULT } from './_lib/destinations-data'

type Phase = 'idle' | 'opening' | 'unfolding' | 'reading' | 'done'

export default function HomePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [displayedText, setDisplayedText] = useState('')
  const [textComplete, setTextComplete] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'reading') return
    let i = 0
    setDisplayedText('')
    setTextComplete(false)
    const interval = setInterval(() => {
      if (i < LETTER_DEFAULT.length) {
        setDisplayedText(LETTER_DEFAULT.slice(0, i + 1))
        i++
      } else {
        setTextComplete(true)
        clearInterval(interval)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [phase])

  const handleLetterClick = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => setPhase('unfolding'), 900)
    setTimeout(() => setPhase('reading'), 1600)
  }

  const handleBegin = () => {
    router.push('/mapa')
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
        marginBottom: 'calc(-72px - env(safe-area-inset-bottom))',
        overflowX: 'hidden',
      }}
    >
      {/* Heading — absolutely positioned at top so it never shifts the envelope */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            key="heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: 'clamp(2rem, 6vw, 4rem)',
              left: 0,
              right: 0,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="font-display-italic"
              style={{ color: 'var(--rose-400)', fontSize: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: '0.5rem' }}
            >
              Para Ozio
            </motion.p>
            <h1
              className="font-display shimmer-text"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.15, marginBottom: '0.75rem' }}
            >
              Una sorpresa hecha con amor
            </h1>
            <div className="divider-rose" style={{ width: '80px', margin: '0 auto' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter scene — always perfectly centered */}
      <div
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px' }}
      >
        <AnimatePresence mode="wait">
          {/* Envelope */}
          {(phase === 'idle' || phase === 'opening') && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.82, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.35 } }}
              transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
              className="cursor-pointer select-none flex flex-col items-center"
              onClick={handleLetterClick}
            >
              <motion.div
                animate={
                  phase === 'opening'
                    ? { rotateY: [0, -8, 8, -5, 0], scale: [1, 1.04, 1] }
                    : {}
                }
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <EnvelopeSVG />
              </motion.div>

              {phase === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-center mt-4 flex flex-col items-center gap-2"
                >
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="font-body text-sm"
                    style={{ color: 'var(--rose-400)', letterSpacing: '0.04em' }}
                  >
                    ✉ Toca la carta para abrirla
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Letter card — reading phase */}
          {(phase === 'unfolding' || phase === 'reading' || phase === 'done') && (
            <motion.div
              key="letter-open"
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 'min(92vw, 560px)',
                position: 'relative',
              }}
            >
              {/* Decorative corner flourishes */}
              <div style={{
                position: 'absolute', top: '-8px', left: '-8px',
                color: 'var(--rose-300)', fontSize: '1.4rem', opacity: 0.6,
                fontFamily: 'serif', lineHeight: 1,
              }}>❧</div>
              <div style={{
                position: 'absolute', top: '-8px', right: '-8px',
                color: 'var(--rose-300)', fontSize: '1.4rem', opacity: 0.6,
                fontFamily: 'serif', lineHeight: 1, transform: 'scaleX(-1)',
              }}>❧</div>

              <div
                className="paper-texture rounded-3xl relative"
                style={{
                  boxShadow: '0 20px 60px rgba(251, 113, 133, 0.18), 0 4px 16px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(253, 164, 175, 0.25)',
                  padding: 'clamp(1.5rem, 5vw, 2.25rem)',
                }}
              >
                {/* Decorative top ornament */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--rose-200))' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--rose-200)', fontSize: '0.6rem' }}>✦</span>
                    <span style={{ color: 'var(--rose-400)', fontSize: '1.4rem' }}>♡</span>
                    <span style={{ color: 'var(--rose-200)', fontSize: '0.6rem' }}>✦</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--rose-200), transparent)' }} />
                </div>

                {/* Letter text */}
                <div
                  className="font-display-italic leading-relaxed"
                  style={{
                    color: 'var(--charcoal)',
                    fontSize: 'clamp(1rem, 2.8vw, 1.15rem)',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.8,
                  }}
                >
                  {displayedText}
                  {!textComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.55 }}
                      style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1.1em',
                        background: 'var(--rose-400)',
                        marginLeft: '3px',
                        verticalAlign: 'middle',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </div>

                {/* Signature */}
                {textComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="mt-6"
                    style={{ textAlign: 'right' }}
                  >
                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, var(--rose-200))',
                      marginBottom: '1rem',
                    }} />
                    <p
                      className="font-display-italic"
                      style={{ color: 'var(--rose-500)', fontSize: 'clamp(1.05rem, 3vw, 1.25rem)' }}
                    >
                      Con todo mi amor ❤️
                    </p>
                  </motion.div>
                )}

                {/* CTA */}
                {textComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    className="mt-6 flex justify-center"
                  >
                    <button
                      onClick={handleBegin}
                      id="begin-adventure-btn"
                      className="btn-primary"
                      style={{ whiteSpace: 'nowrap', width: 'fit-content' }}
                    >
                      <span>✨</span>
                      Descubrir la sorpresa
                    </button>
                  </motion.div>
                )}

                {/* Bottom ornament */}
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--rose-200))' }} />
                  <span style={{ color: 'var(--gold-400)', fontSize: '0.9rem' }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--rose-200), transparent)' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function EnvelopeSVG() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      style={{
        width: 'min(75vw, 340px)',
        filter: 'drop-shadow(0 16px 48px rgba(251, 113, 133, 0.28))',
      }}
    >
      <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Envelope body */}
        <rect x="4" y="40" width="312" height="176" rx="12" fill="#fff5f6" stroke="#fecdd3" strokeWidth="1.5" />

        {/* Back shadow fold */}
        <path d="M4 52 L160 130 L316 52" fill="none" stroke="#fda4af" strokeWidth="1" opacity="0.4" />

        {/* Front flap (closed) */}
        <path d="M4 40 L160 128 L316 40 Z" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" />

        {/* Side folds */}
        <path d="M4 40 L4 216 L100 140 Z" fill="#ffe4e6" stroke="#fecdd3" strokeWidth="1" opacity="0.6" />
        <path d="M316 40 L316 216 L220 140 Z" fill="#ffe4e6" stroke="#fecdd3" strokeWidth="1" opacity="0.6" />

        {/* Bottom fold */}
        <path d="M4 216 L100 140 L160 180 L220 140 L316 216 Z" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />

        {/* Wax seal with glow */}
        <circle cx="160" cy="185" r="22" fill="rgba(251,113,133,0.2)" />
        <circle cx="160" cy="185" r="18" fill="#fb7185" opacity="0.9" />
        <circle cx="160" cy="185" r="14" fill="#f43f5e" opacity="0.85" />
        <text x="160" y="190" textAnchor="middle" fill="white" fontSize="12" fontFamily="serif">♡</text>

        {/* Gold detail lines */}
        <line x1="55" y1="162" x2="98" y2="162" stroke="#fcd34d" strokeWidth="0.8" opacity="0.6" />
        <line x1="222" y1="162" x2="265" y2="162" stroke="#fcd34d" strokeWidth="0.8" opacity="0.6" />
      </svg>

      <p
        className="text-center mt-3 font-display-italic"
        style={{ color: 'var(--rose-400)', fontSize: '1rem', letterSpacing: '0.01em' }}
      >
        Para Ozio, con amor
      </p>
    </motion.div>
  )
}
