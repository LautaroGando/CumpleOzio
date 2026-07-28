import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import AmbientBackground from './_components/AmbientBackground'
import { AdventureProvider } from './_components/adventure-context'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Para Ozio — Una aventura hecha con amor',
  description:
    'Una experiencia interactiva y romántica creada especialmente para vos. Un viaje, una historia, un cumpleaños para recordar siempre.',
  keywords: ['cumpleaños', 'viaje', 'Villa Ventana', 'amor', 'recuerdos'],
  openGraph: {
    title: 'Para Ozio — Una aventura hecha con amor',
    description: 'Un viaje, una historia, un cumpleaños para recordar.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="min-h-dvh relative">
        <AdventureProvider>
          <AmbientBackground />
          <div className="relative z-10 min-h-dvh">
            {children}
          </div>
        </AdventureProvider>
      </body>
    </html>
  )
}
