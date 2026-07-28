'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ResetConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ResetConfirmModal({ isOpen, onConfirm, onCancel }: ResetConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(15, 15, 30, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 201,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '2rem',
                boxShadow: '0 32px 80px rgba(15,15,30,0.2), 0 4px 16px rgba(0,0,0,0.08)',
                border: '1px solid rgba(253,164,175,0.3)',
                overflow: 'hidden',
                pointerEvents: 'auto',
              }}
            >
              {/* Top accent bar */}
              <div style={{
                height: '5px',
                background: 'linear-gradient(90deg, #fb7185, #f43f5e)',
              }} />

              <div style={{ padding: '2rem 1.75rem 1.75rem' }}>
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(251,113,133,0.08))',
                    border: '2px solid rgba(244,63,94,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    fontSize: '1.75rem',
                  }}
                >
                  🔄
                </motion.div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  textAlign: 'center',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                }}>
                  Reiniciar aventura
                </h2>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--charcoal-lighter)',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                }}>
                  Esto borrará todo el progreso, las fotos y los recuerdos guardados. Esta acción no se puede deshacer.
                </p>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--rose-100), transparent)',
                  marginBottom: '1.25rem',
                }} />

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={onConfirm}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.5rem',
                      background: 'linear-gradient(135deg, #fb7185, #f43f5e)',
                      color: '#fff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      boxShadow: '0 4px 16px rgba(244,63,94,0.3)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  >
                    Sí, reiniciar
                  </button>

                  <button
                    onClick={onCancel}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.5rem',
                      background: 'transparent',
                      color: 'var(--charcoal-lighter)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      borderRadius: '9999px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
