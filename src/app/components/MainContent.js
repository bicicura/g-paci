'use client'

import Carousel from '@/app/components/Carousel/Carousel'
import PixiComponent from '@/app/components/SlitPixiVanilla'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'
import Spinner from './Spinner'

const MainContent = () => {
  const { loading: carouselIsLoading } = useContext(CarouselContext)
  const { isInfoActive, loading, links } = useContext(NavigationContext)
  const { infoEffectConfig, isLoading } = useContext(EffectsContext)

  const [shouldShowFilter, setShouldShowFilter] = useState(false)

  useEffect(() => {
    if (!isLoading && infoEffectConfig.active === false) {
    } else if (!isLoading && infoEffectConfig.active === true) {
      setShouldShowFilter(true)
    }
  }, [infoEffectConfig, isLoading])

  return (
    <main className="text-sm">
      {!links.length && !loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <h2>Work in progress.</h2>
        </div>
      ) : (
        <Carousel />
      )}
      {isInfoActive && <PixiComponent />}
    </main>
  )
}

export default MainContent
