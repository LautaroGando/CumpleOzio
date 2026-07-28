'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { DestinationWithStatus } from '@/app/actions/destinations'

interface Props {
  destinations: DestinationWithStatus[]
}

const ICON_MAP: Record<string, string> = {
  car: '🚗', cup: '☕', mountain: '⛰️', plate: '🍽️',
  tree: '🌳', cake: '🧁', lantern: '🏮', wine: '🥂',
  croissant: '🥐', heart: '♥', gift: '🎁', star: '⭐',
}

function formatTimestamp(dateStr: string | Date) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }) + ' · ' + date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RecuerdosClient({ destinations }: Props) {
  return (
    <div
      style={{
        maxWidth: '580px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.25rem',
      }}
    >
      {destinations.map((dest, i) => (
        <motion.article
          key={dest.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link href={`/destino/${dest.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 28px 70px rgba(251, 113, 133, 0.22)' }}
              transition={{ duration: 0.3 }}
              className="paper-texture"
              style={{
                borderRadius: '1.75rem',
                overflow: 'hidden',
                boxShadow: '0 6px 28px rgba(251, 113, 133, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                border: '1px solid rgba(253, 164, 175, 0.2)',
              }}
            >
              {/* Photo */}
              {dest.photoUrl && (
                <div className="relative w-full overflow-hidden" style={{ height: '240px' }}>
                  <Image
                    src={dest.photoUrl}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    style={{ transition: 'transform 0.7s ease' }}
                    sizes="(max-width: 640px) 95vw, 580px"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(253,250,247,0.9) 100%)',
                    }}
                  />
                  {/* Order badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '999px',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--rose-500)',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(253,164,175,0.35)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    #{dest.order}
                  </div>
                </div>
              )}

              {/* Card body */}
              <div style={{ padding: 'clamp(1.4rem, 4vw, 2rem)' }}>

                {/* Header: icon + date + title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.1rem' }}>
                  {/* Icon */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, var(--rose-100), rgba(254,228,230,0.7))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      boxShadow: '0 2px 10px rgba(251,113,133,0.18)',
                    }}
                  >
                    {ICON_MAP[dest.icon] ?? '✦'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--rose-400)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '5px',
                      }}
                    >
                      {dest.date}
                    </p>
                    <h2
                      className="font-display"
                      style={{
                        color: 'var(--charcoal)',
                        fontSize: 'clamp(1.35rem, 3.5vw, 1.7rem)',
                        lineHeight: 1.15,
                        margin: 0,
                      }}
                    >
                      {dest.name}
                    </h2>
                  </div>

                  {/* Show order badge only if no photo */}
                  {!dest.photoUrl && (
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--charcoal-lighter)',
                        fontFamily: 'var(--font-body)',
                        paddingTop: '2px',
                      }}
                    >
                      #{dest.order}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--rose-200) 40%, var(--rose-200) 60%, transparent)',
                    marginBottom: '1.1rem',
                  }}
                />

                {/* Description */}
                <p
                  className="font-display-italic"
                  style={{
                    color: 'var(--charcoal-light)',
                    fontSize: 'clamp(1.05rem, 2.8vw, 1.15rem)',
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  {dest.description}
                </p>

                {/* Comment */}
                {dest.comment && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{
                      marginTop: '1.25rem',
                      padding: '1rem 1.25rem',
                      background: 'linear-gradient(135deg, rgba(255,241,242,0.85), rgba(255,249,250,0.6))',
                      borderRadius: '1rem',
                      borderLeft: '3px solid var(--rose-300)',
                      display: 'flex',
                      gap: '0.65rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: 'var(--rose-300)', fontSize: '1.1rem', lineHeight: 1.6, flexShrink: 0 }}>❝</span>
                    <p
                      className="font-display-italic"
                      style={{
                        color: 'var(--charcoal)',
                        fontSize: '1.05rem',
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {dest.comment}
                    </p>
                  </motion.div>
                )}

                {/* Timestamp footer */}
                {dest.unlockedAt && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--rose-100))' }} />
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        color: 'var(--charcoal-lighter)',
                        letterSpacing: '0.02em',
                        flexShrink: 0,
                      }}
                    >
                      📍 {formatTimestamp(dest.unlockedAt)}
                    </p>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--rose-100), transparent)' }} />
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
        </motion.article>
      ))}

      {/* End flourish */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center py-6"
        style={{ color: 'var(--rose-300)', fontSize: '1.6rem', letterSpacing: '0.5rem' }}
      >
        ✦ ♡ ✦
      </motion.div>
    </div>
  )
}
