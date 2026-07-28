import type { Metadata } from 'next'
import Navigation from '@/app/_components/Navigation'
import MapaClient from './_components/MapaClient'

export const metadata: Metadata = {
  title: 'El mapa — Para Ozio',
  description: 'Cada destino de nuestra aventura.',
}

export default function MapaPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, var(--rose-50) 0%, var(--cream) 60%, rgba(254,243,199,0.3) 100%)',
      paddingBottom: '2rem',
      position: 'relative',
    }}>
      <Navigation />

      <div style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: 'clamp(3.5rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem) 0',
      }}>
        {/* Page header */}
        <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 7vw, 3.2rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}>
            Nuestra aventura
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--charcoal-lighter)',
            lineHeight: 1.6,
            maxWidth: '30ch',
          }}>
            Completa cada sorpresa para descubrir qué sigue.
          </p>
        </div>

        <MapaClient />
      </div>
    </main>
  )
}
