'use server'

import { prisma } from '@/app/_lib/db'
import { revalidatePath } from 'next/cache'
import { DESTINATIONS_SEED } from '@/app/_lib/destinations-data'

export type DestinationWithStatus = {
  id: string
  order: number
  name: string
  description: string
  icon: string
  date: string
  dayLabel: string
  timeLabel: string
  status: 'LOCKED' | 'UNLOCKED'
  photoUrl: string | null
  comment: string | null
  unlockedAt: Date | null
  isSpecial?: boolean
  isFinal?: boolean
}

/**
 * Get all destinations. Seeds them from static data if DB is empty.
 */
export async function getDestinations(): Promise<DestinationWithStatus[]> {
  const count = await prisma.destination.count()

  if (count === 0) {
    await prisma.destination.createMany({
      data: DESTINATIONS_SEED.map((d) => ({
        order: d.order,
        name: d.name,
        description: d.description,
        icon: d.icon,
        date: d.date,
        dayLabel: d.dayLabel,
        timeLabel: d.timeLabel,
      })),
    })
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { order: 'asc' },
  })

  return destinations.map((d) => {
    const seed = DESTINATIONS_SEED.find((s) => s.order === d.order)
    return {
      ...d,
      isSpecial: seed?.isSpecial,
      isFinal: seed?.isFinal,
    }
  })
}

/**
 * Get a single destination by ID.
 */
export async function getDestinationById(id: string): Promise<DestinationWithStatus | null> {
  const d = await prisma.destination.findUnique({ where: { id } })
  if (!d) return null
  const seed = DESTINATIONS_SEED.find((s) => s.order === d.order)
  return { ...d, isSpecial: seed?.isSpecial, isFinal: seed?.isFinal }
}

/**
 * Unlock a destination with a photo URL and optional comment.
 */
export async function unlockDestination(
  id: string,
  photoUrl: string,
  comment?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dest = await prisma.destination.findUnique({ where: { id } })
    if (!dest) return { success: false, error: 'Destino no encontrado' }
    if (dest.status === 'UNLOCKED') return { success: false, error: 'Ya está desbloqueado' }

    await prisma.destination.update({
      where: { id },
      data: {
        status: 'UNLOCKED',
        photoUrl,
        comment: comment || null,
        unlockedAt: new Date(),
      },
    })

    revalidatePath('/mapa')
    revalidatePath(`/destino/${id}`)
    revalidatePath('/galeria')
    revalidatePath('/recuerdos')

    return { success: true }
  } catch {
    return { success: false, error: 'Error al desbloquear el destino' }
  }
}

/**
 * Get letter content. Creates default if none exists.
 */
export async function getLetter(): Promise<{ content: string; signature: string }> {
  let letter = await prisma.letter.findFirst()
  if (!letter) {
    const { LETTER_DEFAULT } = await import('@/app/_lib/destinations-data')
    letter = await prisma.letter.create({
      data: { content: LETTER_DEFAULT },
    })
  }
  return { content: letter.content, signature: letter.signature }
}
