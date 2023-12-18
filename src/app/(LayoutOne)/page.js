'use client'

import Carousel from '../components/Carousel/Carousel'
import SlitScanEffect from '../components/Effects/SlitScanEffect'
import PixiComponent from '../components/Effects/DefaultSlit'
import { NavigationContext } from '../contexts/NavigationContext'
import { useContext } from 'react'

export default function Home() {
  const { isInfoActive } = useContext(NavigationContext)

  return (
    <main className="text-sm">
      <Carousel />
      {isInfoActive && <PixiComponent />}
    </main>
  )
}
