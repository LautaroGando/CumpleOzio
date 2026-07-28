'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { DestinationWithStatus } from '@/app/actions/destinations'
import { adminUpdateDestination, adminUpdateLetter } from '@/app/actions/destinations'

const ICON_MAP: Record<string, string> = {
  car: '🚗', cup: '☕', mountain: '⛰️', plate: '🍽️',
  tree: '🌳', cake: '🧁', lantern: '🏮', wine: '🥂',
  croissant: '🥐', heart: '♥', gift: '🎁', star: '⭐',
}

type Tab = 'destinos' | 'carta'

interface Props {
  destinations: DestinationWithStatus[]
  letter: { content: string; signature: string }
}

export default function AdminClient({ destinations, letter }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('destinos')
  const [letterContent, setLetterContent] = useState(letter.content)
  const [letterSig, setLetterSig] = useState(letter.signature)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [localDests, setLocalDests] = useState(destinations)
  const [unlocking, setUnlocking] = useState<string | null>(null)

  const handleSaveLetter = async () => {
    setSaving(true)
    const result = await adminUpdateLetter(letterContent, letterSig)
    setSaving(false)
    if (result.success) {
      setSavedMsg('Carta guardada ✓')
      setTimeout(() => setSavedMsg(''), 3000)
    }
  }

  const handleUnlock = async (id: string) => {
    setUnlocking(id)
    const result = await adminUpdateDestination(id, { status: 'UNLOCKED' })
    if (result.success) {
      setLocalDests((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'UNLOCKED' } : d))
      )
    }
    setUnlocking(null)
  }

  const handleLock = async (id: string) => {
    setUnlocking(id)
    const result = await adminUpdateDestination(id, { status: 'LOCKED' })
    if (result.success) {
      setLocalDests((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'LOCKED' } : d))
      )
    }
    setUnlocking(null)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const unlockedCount = localDests.filter((d) => d.status === 'UNLOCKED').length

  return (
    <main className="min-h-dvh pb-10" style={{ background: 'var(--rose-50)' }}>
      {/* Header */}
      <div
        className="glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between"
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        <div>
          <h1
            className="font-display"
            style={{ fontSize: '1.5rem', color: 'var(--charcoal)' }}
          >
            Panel de administración
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--charcoal-lighter)' }}>
            {unlockedCount} / {localDests.length} destinos desbloqueados
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-ghost text-sm py-2 px-4"
        >
          Salir
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
        {[
          { label: 'Total', value: localDests.length, emoji: '✦' },
          { label: 'Desbloqueados', value: unlockedCount, emoji: '🔓' },
          { label: 'Bloqueados', value: localDests.length - unlockedCount, emoji: '🔒' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card text-center py-3 px-2"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <div style={{ fontSize: '1.25rem' }}>{stat.emoji}</div>
            <div
              className="font-display font-bold"
              style={{ fontSize: '1.5rem', color: 'var(--charcoal)' }}
            >
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--charcoal-lighter)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mx-4 mt-5">
        {(['destinos', 'carta'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl font-body font-medium text-sm capitalize transition-all"
            style={{
              background: tab === t ? 'var(--rose-400)' : 'white',
              color: tab === t ? 'white' : 'var(--charcoal-light)',
              border: '1.5px solid',
              borderColor: tab === t ? 'var(--rose-400)' : 'var(--rose-100)',
            }}
          >
            {t === 'destinos' ? '🗺️ Destinos' : '✉️ Carta'}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-4">
        <AnimatePresence mode="wait">
          {/* Destinos tab */}
          {tab === 'destinos' && (
            <motion.div
              key="destinos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {localDests.map((dest) => (
                <div
                  key={dest.id}
                  className="glass-card p-4 flex items-center gap-3"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: dest.status === 'UNLOCKED' ? 'var(--rose-100)' : 'var(--rose-50)',
                    }}
                  >
                    {dest.status === 'UNLOCKED' ? ICON_MAP[dest.icon] ?? '✦' : '🔒'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-display font-semibold text-sm truncate"
                      style={{ color: 'var(--charcoal)' }}
                    >
                      {dest.order}. {dest.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--charcoal-lighter)' }}>
                      {dest.date}
                    </p>
                    {dest.photoUrl && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs" style={{ color: 'var(--rose-400)' }}>📷 Foto subida</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5">
                    {dest.status === 'LOCKED' ? (
                      <button
                        onClick={() => handleUnlock(dest.id)}
                        disabled={unlocking === dest.id}
                        className="text-xs py-1 px-3 rounded-full font-medium transition-all"
                        style={{
                          background: 'var(--rose-400)',
                          color: 'white',
                          opacity: unlocking === dest.id ? 0.6 : 1,
                        }}
                      >
                        {unlocking === dest.id ? '…' : 'Desbloquear'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLock(dest.id)}
                        disabled={unlocking === dest.id}
                        className="text-xs py-1 px-3 rounded-full font-medium transition-all"
                        style={{
                          background: 'var(--rose-100)',
                          color: 'var(--rose-500)',
                          opacity: unlocking === dest.id ? 0.6 : 1,
                        }}
                      >
                        {unlocking === dest.id ? '…' : 'Bloquear'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Carta tab */}
          {tab === 'carta' && (
            <motion.div
              key="carta"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="glass-card p-5" style={{ borderRadius: 'var(--radius-xl)' }}>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--charcoal)' }}
                >
                  Contenido de la carta
                </label>
                <textarea
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={12}
                  className="w-full rounded-xl text-sm resize-none"
                  style={{
                    border: '1.5px solid var(--rose-200)',
                    padding: '0.75rem',
                    background: 'var(--cream)',
                    color: 'var(--charcoal)',
                    outline: 'none',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div className="glass-card p-5" style={{ borderRadius: 'var(--radius-xl)' }}>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--charcoal)' }}
                >
                  Firma
                </label>
                <input
                  value={letterSig}
                  onChange={(e) => setLetterSig(e.target.value)}
                  className="w-full rounded-xl text-sm"
                  style={{
                    border: '1.5px solid var(--rose-200)',
                    padding: '0.75rem',
                    background: 'var(--cream)',
                    color: 'var(--charcoal)',
                    outline: 'none',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveLetter}
                  disabled={saving}
                  className="btn-primary flex-1"
                  style={{ opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Guardando…' : '💾 Guardar carta'}
                </button>
                {savedMsg && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm"
                    style={{ color: 'var(--rose-400)' }}
                  >
                    {savedMsg}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
