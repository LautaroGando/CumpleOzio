'use client'

import { motion } from 'framer-motion'
import type { DestinationWithStatus } from '@/app/actions/destinations'

const ICON_MAP: Record<string, string> = {
  car: '🚗', cup: '☕', mountain: '⛰️', plate: '🍽️',
  tree: '🌳', cake: '🧁', lantern: '🏮', wine: '🥂',
  croissant: '🥐', heart: '♥', gift: '🎁', star: '⭐',
}

interface Props {
  destination: DestinationWithStatus
  position: [number, number]
  index: number
  isRecentlyUnlocked: boolean
  onSelect: () => void
}

export default function DestinationNode({
  destination,
  position,
  index,
  isRecentlyUnlocked,
  onSelect,
}: Props) {
  const [cx, cy] = position
  const isLocked = destination.status === 'LOCKED'
  const isSpecial = destination.isSpecial
  const isFinal = destination.isFinal

  // Larger node radii for better visibility
  const nodeRadius = isSpecial ? 34 : isFinal ? 30 : 26

  // Number badge radius
  const badgeR = 11

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{ cursor: 'pointer' }}
      onClick={onSelect}
    >
      {/* Recently unlocked burst */}
      {isRecentlyUnlocked && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={cx + Math.cos((i * Math.PI) / 4) * 50}
              cy={cy + Math.sin((i * Math.PI) / 4) * 50}
              r={4}
              fill="var(--gold-300)"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          ))}
          <motion.circle
            cx={cx}
            cy={cy}
            r={nodeRadius + 16}
            fill="none"
            stroke="var(--gold-300)"
            strokeWidth="2.5"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </>
      )}

      {/* Outer glow ring (unlocked) */}
      {!isLocked && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={nodeRadius + 10}
          fill="none"
          stroke={isSpecial ? 'var(--gold-300)' : 'var(--rose-300)'}
          strokeWidth="2"
          opacity="0.35"
          animate={{ r: [nodeRadius + 8, nodeRadius + 16, nodeRadius + 8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Defs for gradients */}
      <defs>
        <radialGradient id="roseGradient" cx="40%" cy="35%">
          <stop offset="0%" stopColor="var(--rose-200)" />
          <stop offset="100%" stopColor="var(--rose-400)" />
        </radialGradient>
        <radialGradient id="goldGradient" cx="40%" cy="35%">
          <stop offset="0%" stopColor="var(--gold-200)" />
          <stop offset="100%" stopColor="var(--gold-400)" />
        </radialGradient>
      </defs>

      {/* Node circle */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={nodeRadius}
        fill={
          isLocked
            ? 'rgba(156, 163, 175, 0.22)'
            : isSpecial
            ? 'url(#goldGradient)'
            : 'url(#roseGradient)'
        }
        stroke={
          isLocked
            ? 'rgba(156, 163, 175, 0.5)'
            : isSpecial
            ? 'var(--gold-300)'
            : 'var(--rose-300)'
        }
        strokeWidth={isLocked ? 1.5 : 2.5}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          filter: isLocked
            ? 'none'
            : `drop-shadow(0 3px 10px ${isSpecial ? 'rgba(252, 211, 77, 0.55)' : 'rgba(251, 113, 133, 0.45)'})`,
        }}
      />

      {/* Icon / Lock icon */}
      {isLocked ? (
        <text
          x={cx}
          y={cy + 7}
          textAnchor="middle"
          fontSize={nodeRadius * 0.85}
          fill="rgba(107, 114, 128, 0.75)"
        >
          🔒
        </text>
      ) : (
        <text
          x={cx}
          y={cy + 7}
          textAnchor="middle"
          fontSize={isSpecial ? nodeRadius * 0.9 : nodeRadius * 0.8}
        >
          {ICON_MAP[destination.icon] ?? '✦'}
        </text>
      )}

      {/* Order number badge */}
      <circle
        cx={cx + nodeRadius - 4}
        cy={cy - nodeRadius + 4}
        r={badgeR}
        fill="white"
        stroke={isLocked ? 'rgba(156,163,175,0.5)' : 'var(--rose-300)'}
        strokeWidth="1.5"
      />
      <text
        x={cx + nodeRadius - 4}
        y={cy - nodeRadius + 8.5}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-body)"
        fontWeight="700"
        fill={isLocked ? 'var(--charcoal-lighter)' : 'var(--rose-500)'}
      >
        {destination.order}
      </text>

      {/* Label: name + time (unlocked) */}
      {!isLocked && (
        <>
          <text
            x={cx}
            y={cy + nodeRadius + 20}
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-display)"
            fontWeight="600"
            fill="var(--charcoal)"
            style={{ fontStyle: 'italic' }}
          >
            {destination.name.length > 20
              ? destination.name.slice(0, 18) + '…'
              : destination.name}
          </text>
          <text
            x={cx}
            y={cy + nodeRadius + 35}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-body)"
            fill="var(--charcoal-lighter)"
          >
            {destination.date}
          </text>
        </>
      )}

      {/* Locked label: date only */}
      {isLocked && (
        <text
          x={cx}
          y={cy + nodeRadius + 19}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--font-body)"
          fill="var(--charcoal-lighter)"
          opacity="0.75"
        >
          {destination.date}
        </text>
      )}
    </motion.g>
  )
}
