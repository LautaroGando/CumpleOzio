'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DestinationWithStatus } from '@/app/actions/destinations'
import DestinationNode from './DestinationNode'
import UnlockPanel from './UnlockPanel'

interface Props {
  destinations: DestinationWithStatus[]
}

// Positions for each of the 14 nodes on the illustrated path
// Expressed as [x%, y%] relative to the SVG viewBox (0 0 400 1100)
const NODE_POSITIONS: [number, number][] = [
  [200, 65],
  [376, 165],
  [40, 271],
  [344, 384],
  [88, 503],
  [344, 609],
  [72, 721],
  [360, 834],
  [56, 946],
  [376, 1053],
  [104, 1159],
  [296, 1246],
  [200, 1340],
  [200, 1434],
]

// The SVG path that winds through all node positions
const WINDING_PATH = `
  M 200 65
  C 312 96, 408 121, 376 165
  C 344 209, 104 234, 40 271
  C -24 315, 264 353, 344 384
  C 424 419, 168 471, 88 503
  C 0 540, 296 578, 344 609
  C 392 644, 104 684, 72 721
  C 32 761, 328 796, 360 834
  C 392 874, 104 911, 56 946
  C 5 984, 344 1019, 376 1053
  C 416 1090, 176 1124, 104 1159
  C 40 1194, 232 1215, 296 1246
  C 360 1281, 224 1309, 200 1340
  L 200 1434
`

export default function InteractiveMap({ destinations }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null)
  const [localDestinations, setLocalDestinations] = useState(destinations)

  const unlockedCount = localDestinations.filter((d) => d.status === 'UNLOCKED').length

  const handleUnlocked = (id: string) => {
    setRecentlyUnlocked(id)
    setLocalDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'UNLOCKED' } : d))
    )
    setSelectedId(null)
    setTimeout(() => setRecentlyUnlocked(null), 4000)
  }

  const selectedDest = selectedId
    ? localDestinations.find((d) => d.id === selectedId) ?? null
    : null

  return (
    <div className="relative w-full">
      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <div
          className="glass-card flex items-center gap-3"
          style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem' }}
        >
          <span style={{ color: 'var(--rose-400)', fontSize: '1rem' }}>✦</span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--charcoal)',
              letterSpacing: '0.01em',
            }}
          >
            {unlockedCount} de {localDestinations.length} recuerdos
          </span>
          <span style={{ color: 'var(--rose-400)', fontSize: '1rem' }}>✦</span>
        </div>
      </motion.div>

      {/* SVG Map */}
      <div className="relative w-full" style={{ background: 'transparent' }}>
        <svg
          viewBox="-70 0 540 1550"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ overflow: 'visible' }}
        >
          {/* Decorative background shapes */}
          <MapDecorations />

          {/* Path segments — draw progressively unlocked */}
          {localDestinations.map((dest, idx) => {
            if (idx === 0) return null
            const prev = localDestinations[idx - 1]
            const isSegmentUnlocked =
              prev.status === 'UNLOCKED' || dest.status === 'UNLOCKED'
            return (
              <PathSegment
                key={`seg-${dest.id}`}
                from={NODE_POSITIONS[idx - 1]}
                to={NODE_POSITIONS[idx]}
                unlocked={isSegmentUnlocked}
                delay={idx * 0.1}
              />
            )
          })}

          {/* Main winding path (base, dimmed) */}
          <path
            d={WINDING_PATH}
            stroke="var(--rose-200)"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />

          {/* Destination nodes */}
          {localDestinations.map((dest, idx) => (
            <DestinationNode
              key={dest.id}
              destination={dest}
              position={NODE_POSITIONS[idx]}
              index={idx}
              isRecentlyUnlocked={recentlyUnlocked === dest.id}
              onSelect={() => {
                if (dest.status === 'UNLOCKED') {
                  window.location.href = `/destino/${dest.id}`
                } else {
                  setSelectedId(selectedId === dest.id ? null : dest.id)
                }
              }}
            />
          ))}
        </svg>
      </div>

      {/* Unlock panel drawer */}
      <AnimatePresence>
        {selectedDest && selectedDest.status === 'LOCKED' && (
          <UnlockPanel
            destination={selectedDest}
            onClose={() => setSelectedId(null)}
            onUnlocked={handleUnlocked}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── PathSegment ─────────────────────────────────────────────── */
function PathSegment({
  from,
  to,
  unlocked,
  delay,
}: {
  from: [number, number]
  to: [number, number]
  unlocked: boolean
  delay: number
}) {
  if (!unlocked) return null
  return (
    <motion.line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="url(#pathGradient)"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    />
  )
}

/* ── Map decorations (flowers, trees, hearts) ─────────────────── */
function MapDecorations() {
  return (
    <>
      <defs>
        <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--rose-300)" />
          <stop offset="100%" stopColor="var(--rose-400)" />
        </linearGradient>
      </defs>

      {/* Flowers */}
      {[
        [-48, 209], [448, 321], [-24, 559], [440, 671],
        [-56, 884], [448, 984], [-24, 1209],
      ].map(([x, y], i) => (
        <g key={`flower-${i}`} transform={`translate(${x}, ${y})`} opacity="0.55">
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <ellipse
              key={j}
              cx={Math.cos((angle * Math.PI) / 180) * 7}
              cy={Math.sin((angle * Math.PI) / 180) * 7}
              rx="4"
              ry="5"
              transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 7} ${Math.sin((angle * Math.PI) / 180) * 7})`}
              fill="var(--rose-200)"
            />
          ))}
          <circle cx="0" cy="0" r="3.5" fill="var(--gold-300)" />
        </g>
      ))}

      {/* Small hearts */}
      {[
        [448, 184], [-56, 409], [456, 534], [-53, 796],
        [448, 909], [-56, 1134],
      ].map(([x, y], i) => (
        <text
          key={`heart-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          fontSize="14"
          fill="var(--rose-300)"
          opacity="0.5"
        >
          ♡
        </text>
      ))}

      {/* Trees */}
      {[[30, 550], [370, 625], [30, 860]].map(([x, y], i) => (
        <g key={`tree-${i}`} transform={`translate(${x}, ${y})`} opacity="0.45">
          <polygon points="0,-18 12,6 -12,6" fill="var(--rose-200)" />
          <polygon points="0,-12 9,3 -9,3" fill="var(--rose-300)" transform="translate(0, 8)" />
          <rect x="-3" y="6" width="6" height="10" rx="1" fill="var(--charcoal-lighter)" />
        </g>
      ))}

      {/* Stars */}
      {[[360, 1000], [40, 1070]].map(([x, y], i) => (
        <text key={`star-${i}`} x={x} y={y} textAnchor="middle" fontSize="12" fill="var(--gold-300)" opacity="0.6">
          ✦
        </text>
      ))}
    </>
  )
}
