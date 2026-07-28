'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin'
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    if (res.ok) {
      router.push(redirect)
    } else {
      setError('PIN incorrecto. Intentá de nuevo.')
      setPin('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* PIN dots */}
      <div className="flex gap-3 justify-center my-6">
        {Array.from({ length: pin.length > 8 ? pin.length : 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{
              background: i < pin.length ? 'var(--rose-400)' : 'var(--rose-100)',
              transform: i < pin.length ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Ingresá el PIN de acceso"
        className="w-full text-center rounded-2xl text-lg tracking-widest"
        style={{
          border: '1.5px solid var(--rose-200)',
          padding: '0.875rem',
          background: 'white',
          color: 'var(--charcoal)',
          outline: 'none',
          fontFamily: 'var(--font-body)',
        }}
        autoFocus
      />

      {error && (
        <p className="text-sm text-center" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !pin}
        className="btn-primary w-full"
        style={{ opacity: loading || !pin ? 0.6 : 1 }}
      >
        {loading ? 'Verificando…' : 'Ingresar al panel'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'var(--rose-50)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-sm p-8"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h1
            className="font-display"
            style={{ fontSize: '1.8rem', color: 'var(--charcoal)' }}
          >
            Panel privado
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--charcoal-lighter)' }}
          >
            Ingresá el PIN para administrar la experiencia
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </motion.div>
    </main>
  )
}
