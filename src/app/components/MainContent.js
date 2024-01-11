'use client'

import Carousel from '@/app/components/Carousel/Carousel'
import PixiComponent from '@/app/components/SlitPixiVanilla'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'

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
      {carouselIsLoading ? (
        <div className="flex justify-center items-center w-full min-h-screen">
          <svg
            className="w-5 h-5 text-black animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <path
              fill="purple"
              className="opacity-50"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : !links.length && !loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <h2>Work in progress.</h2>
        </div>
      ) : (
        <Carousel />
      )}
      {isInfoActive && shouldShowFilter && <PixiComponent />}
    </main>
  )
}

export default MainContent
