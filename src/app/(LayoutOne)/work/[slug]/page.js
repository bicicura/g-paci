'use client'

import Carousel from '@/app/components/Carousel/Carousel'
import PixiComponent from '@/app/components/SlitPixiVanilla'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { useContext } from 'react'

export default function Page() {
  const { isInfoActive } = useContext(NavigationContext)

  return (
    <main className="text-sm">
      <Carousel />
      {isInfoActive && <PixiComponent />}
    </main>
  )
}
