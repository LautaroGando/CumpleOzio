import { getDestinations, getLetter } from '@/app/actions/destinations'
import AdminClient from './_components/AdminClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel admin — cumple-ozio',
}

export default async function AdminPage() {
  const [destinations, letter] = await Promise.all([
    getDestinations(),
    getLetter(),
  ])

  return <AdminClient destinations={destinations} letter={letter} />
}
