'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { DestinationWithStatus } from '@/app/actions/destinations'

const ICON_MAP: Record<string, string> = {
  car: '🚗', cup: '☕', mountain: '⛰️', plate: '🍽️',
  tree: '🌳', cake: '🧁', lantern: '🏮', wine: '🥂',
  croissant: '🥐', heart: '♥', gift: '🎁', star: '⭐',
}

interface Props {
  destination: DestinationWithStatus
  prevDest: DestinationWithStatus | null
  nextDest: DestinationWithStatus | null
}

export default function DestinationDetail({ destination, prevDest, nextDest }: Props) {
  const isSpecial = destination.isSpecial
  const isFinal = destination.isFinal

  return (
    <main className="min-h-dvh" style={{ background: 'var(--rose-50)', paddingBottom: '8rem' }}>
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 z-30"
      >
        <Link
          href="/mapa"
          className="btn-ghost inline-flex items-center gap-2 text-sm py-2 px-4"
        >
          ← Volver al mapa
        </Link>
      </motion.div>

      {/* Hero photo */}
      {destination.photoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full"
          style={{ height: 'clamp(260px, 45vw, 500px)' }}
        >
          <Image
            src={destination.photoUrl}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(255,241,242,0.9) 100%)',
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="container-app py-8">
        {/* Icon + order */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span
            className="text-4xl"
            style={{
              filter: isSpecial ? 'drop-shadow(0 2px 8px rgba(252,211,77,0.5))' : undefined,
            }}
          >
            {ICON_MAP[destination.icon] ?? '✦'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
          style={{ marginBottom: '2rem' }}
        >
          <p
            className="font-body text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--rose-400)', letterSpacing: '0.12em', marginBottom: '1.25rem' }}
          >
            {destination.date}
          </p>
          <h1
            className="font-display"
            style={{ color: 'var(--charcoal)', lineHeight: 1.15 }}
          >
            {destination.name}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="divider-rose"
          style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}
        />

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex justify-center px-4 w-full"
        >
          <p
            className="font-display-italic text-center max-w-lg leading-relaxed"
            style={{
              color: 'var(--charcoal)',
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            }}
          >
            {destination.description}
          </p>
        </motion.div>

        {/* Comment */}
        {destination.comment && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex justify-center px-4"
            style={{ marginTop: '2.5rem' }}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 2.5rem',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,241,242,0.6))',
                backdropFilter: 'blur(10px)',
                borderRadius: '1.5rem',
                border: '1px solid rgba(253, 164, 175, 0.4)',
                boxShadow: '0 4px 20px rgba(251, 113, 133, 0.1)',
                maxWidth: '100%',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '1rem',
                  color: 'var(--rose-400)',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  opacity: 0.6,
                }}
              >
                ❝
              </span>
              <p
                className="font-display-italic text-center"
                style={{ color: 'var(--charcoal)', fontSize: '1.15rem', lineHeight: 1.6, zIndex: 1 }}
              >
                {destination.comment}
              </p>
            </div>
          </motion.div>
        )}

        {/* Special: Birthday message */}
        {isSpecial && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="text-center mt-8 p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, var(--gold-50), var(--rose-100))',
              border: '2px solid var(--gold-200)',
            }}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display" style={{ color: 'var(--charcoal)', fontSize: '2rem' }}>
              ¡Feliz cumpleaños, Ozio!
            </h2>
            <p
              className="font-display-italic mt-3"
              style={{ color: 'var(--charcoal-light)', fontSize: '1.1rem' }}
            >
              Este año que empieza merece todo lo mejor del mundo. Y vos te lo merecés.
            </p>
          </motion.div>
        )}

        {/* Final: Complete journey */}
        {isFinal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Link href="/galeria" className="btn-primary">
              📸 Ver el álbum completo
            </Link>
          </motion.div>
        )}

        {/* Unlockedat */}
        {destination.unlockedAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs"
            style={{ color: 'var(--charcoal-lighter)', marginTop: '3.5rem', marginBottom: '1rem' }}
          >
            Desbloqueado el{' '}
            {new Date(destination.unlockedAt).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </motion.p>
        )}

        {/* Navigation prev / next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row justify-center items-center"
          style={{ marginTop: '3rem', gap: '2rem' }}
        >
          {prevDest && (
            <Link href={`/destino/${prevDest.id}`} className="btn-ghost">
              ← {prevDest.name.length > 20 ? prevDest.name.slice(0, 18) + '…' : prevDest.name}
            </Link>
          )}
          <Link href="/mapa" className="btn-ghost">
            🗺️ Ver mapa
          </Link>
          {nextDest && (
            <Link href={`/destino/${nextDest.id}`} className="btn-primary">
              {nextDest.name.length > 20 ? nextDest.name.slice(0, 18) + '…' : nextDest.name} →
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  )
}
