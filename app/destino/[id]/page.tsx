import { getDestinationById, getDestinations } from '@/app/actions/destinations'
import { notFound } from 'next/navigation'
import DestinationDetail from './_components/DestinationDetail'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const dest = await getDestinationById(id)
  if (!dest) return {}
  return {
    title: `${dest.name} — Para Ozio`,
    description: dest.description,
  }
}

export default async function DestinationPage({ params }: Props) {
  const { id } = await params
  const [destination, allDestinations] = await Promise.all([
    getDestinationById(id),
    getDestinations(),
  ])

  if (!destination || destination.status === 'LOCKED') {
    notFound()
  }

  const currentIndex = allDestinations.findIndex((d) => d.id === id)
  const prevDest = currentIndex > 0 ? allDestinations[currentIndex - 1] : null
  const nextDest =
    currentIndex < allDestinations.length - 1 ? allDestinations[currentIndex + 1] : null

  return (
    <DestinationDetail
      destination={destination}
      prevDest={prevDest?.status === 'UNLOCKED' ? prevDest : null}
      nextDest={nextDest?.status === 'UNLOCKED' ? nextDest : null}
    />
  )
}
