'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, Gift, Camera, Sparkles } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',          label: 'Carta',     Icon: Mail },
  { href: '/mapa',      label: 'Sorpresas', Icon: Gift },
  { href: '/galeria',   label: 'Álbum',     Icon: Camera },
  { href: '/recuerdos', label: 'Recuerdos', Icon: Sparkles },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(244, 63, 94, 0.1)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '12px 8px',
                textDecoration: 'none',
                position: 'relative',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--rose-500)',
                  }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? 'var(--rose-500)' : '#a1a1aa'}
                />
              </motion.div>

              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--rose-500)' : '#a1a1aa',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
