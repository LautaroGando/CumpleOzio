'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { DestinationWithStatus } from '@/app/actions/destinations'

interface Props {
  destinations: DestinationWithStatus[]
}

// Deterministic rotation based on destination order (avoids hydration mismatch)
function getRotation(order: number): number {
  const rotations = [-4, 3, -2, 5, -3, 4, -1, 3, -5, 2, -3, 4, -2, 1]
  return rotations[(order - 1) % rotations.length]
}

export default function GaleriaClient({ destinations }: Props) {
  const [lightbox, setLightbox] = useState<DestinationWithStatus | null>(null)

  return (
    <>
      {/* Polaroid grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
        }}
      >
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 30, rotate: getRotation(dest.order) }}
            animate={{ opacity: 1, y: 0, rotate: getRotation(dest.order) }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{
              rotate: 0,
              scale: 1.06,
              zIndex: 10,
              transition: { duration: 0.2 },
            }}
            className="polaroid cursor-pointer"
            onClick={() => setLightbox(dest)}
          >
            {/* Photo */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: '4/3', borderRadius: '2px' }}
            >
              {dest.photoUrl && (
                <Image
                  src={dest.photoUrl}
                  alt={dest.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 150px, 220px"
                />
              )}
            </div>

            {/* Polaroid caption */}
            <div className="mt-3 text-center px-1">
              <p
                className="font-display-italic leading-tight"
                style={{ color: 'var(--charcoal)', fontSize: '1rem' }}
              >
                {dest.name}
              </p>
              <p
                className="mt-1"
                style={{ color: 'var(--charcoal-lighter)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}
              >
                {dest.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
              className="polaroid relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '1rem 1rem 3.5rem' }}
            >
              {lightbox.photoUrl && (
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '4/3', borderRadius: '2px' }}
                >
                  <Image
                    src={lightbox.photoUrl}
                    alt={lightbox.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 600px"
                  />
                </div>
              )}

              <div className="text-center mt-4">
                <p
                  className="font-display"
                  style={{ color: 'var(--charcoal)', fontSize: '1.5rem', lineHeight: 1.2 }}
                >
                  {lightbox.name}
                </p>
                <p
                  className="mt-1"
                  style={{ color: 'var(--charcoal-lighter)', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}
                >
                  {lightbox.date}
                </p>
                {lightbox.comment && (
                  <p
                    className="font-display-italic mt-3"
                    style={{ color: 'var(--charcoal-light)', fontSize: '1.15rem', lineHeight: 1.6 }}
                  >
                    &ldquo;{lightbox.comment}&rdquo;
                  </p>
                )}
              </div>

              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer hover:bg-black/20 transition-colors"
                style={{
                  background: 'rgba(0,0,0,0.15)',
                  color: 'var(--charcoal)',
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
