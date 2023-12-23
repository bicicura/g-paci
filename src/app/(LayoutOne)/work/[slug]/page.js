'use client'

import MainContent from '@/app/components/MainContent'
import { CarouselProvider } from '@/app/contexts/CarouselContext'

export default function Page() {
  return (
    <CarouselProvider>
      <MainContent />
    </CarouselProvider>
  )
}
