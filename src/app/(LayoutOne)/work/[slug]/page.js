'use client'

import Carousel from '@/app/components/Carousel/Carousel'
import PixiComponent from '@/app/components/SlitPixiVanilla'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { useContext } from 'react'

export default function Page() {
  const { isInfoActive, loading, links } = useContext(NavigationContext)

  return (
    <main className="text-sm">
      {links.length && !loading ? (
        <Carousel />
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center">
          <h2>Work in progress.</h2>
        </div>
      )}
      {isInfoActive && <PixiComponent />}
    </main>
  )
}
