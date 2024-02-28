'use client'

// ClientContainer.js
import Navbar from './Navigation/Navbar.js'
import { HoverProvider } from '../contexts/HoverContext.js'
import { useState, useEffect } from 'react'
import NavigationProvider from '../contexts/NavigationContext.js'
import { usePathname } from 'next/navigation.js'
import useMobileDetect from '@/app/hooks/useMobileDetect.js'
import EffectsProvider from '../contexts/EffectsContext.js'
import ContinuousImageFilterWrapper from './ContinuousImageFilterWrapper.js'
import ImgSlideEffect from './ImgSlideEffect.js'

const ClientContainer = ({ children }) => {
  const [showIntro, setShowIntro] = useState(true)
  const [introOpacity, setIntroOpacity] = useState(1)
  const [opacity, setOpacity] = useState(0)
  const isMobile = useMobileDetect()
  const pathname = usePathname()

  const dismissIntro = () => {
    setIntroOpacity(0)
    setTimeout(() => setShowIntro(false), 300) // Match the duration with Tailwind's duration-300
  }

  useEffect(() => {
    setOpacity(1) // Trigger the fade-in effect
  }, [])

  return (
    <EffectsProvider>
      {showIntro && pathname === '/' && !isMobile ? (
        // <ContinuousImageFilterWrapper
        //   opacity={introOpacity}
        //   onDismiss={dismissIntro}
        // />
        <ImgSlideEffect />
      ) : (
        <div
          className={`transition-opacity duration-500 ${
            opacity === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <NavigationProvider>
            <HoverProvider>
              <Navbar />
              {children}
            </HoverProvider>
          </NavigationProvider>
        </div>
      )}
    </EffectsProvider>
  )
}

export default ClientContainer
