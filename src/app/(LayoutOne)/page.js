'use client'

import { CarouselProvider } from '@/app/contexts/CarouselContext'
import MainContent from '../components/MainContent'

export default function Page() {
  return (
    <CarouselProvider>
      <MainContent />
    </CarouselProvider>
  )
}
