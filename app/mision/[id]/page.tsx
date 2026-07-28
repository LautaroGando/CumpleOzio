import type { Metadata } from 'next'
import MisionClient from './MisionClient'

export const metadata: Metadata = {
  title: 'Misión — Para Ozio',
  description: 'Completar misión',
}

export default function MisionPage() {
  return <MisionClient />
}
