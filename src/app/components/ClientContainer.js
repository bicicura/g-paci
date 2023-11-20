'use client'

// ClientContainer.js
import Navbar from './Navigation/Navbar.js'
import { HoverProvider } from '../contexts/HoverContext.js'
import { useState, useEffect } from 'react'
import ContinuousImageFilter from './ContinuousImageFilter.js'
import NavigationProvider from '../contexts/NavigationContext.js'

const ClientContainer = ({ children }) => {
  const [showIntro, setShowIntro] = useState(true)
  const [introOpacity, setIntroOpacity] = useState(1)
  const [opacity, setOpacity] = useState(0)

  const dismissIntro = () => {
    setIntroOpacity(0)
    setTimeout(() => setShowIntro(false), 300) // Match the duration with Tailwind's duration-300
  }

  useEffect(() => {
    setOpacity(1) // Trigger the fade-in effect
  }, [])

  return (
    <>
      {showIntro && (
        <div className="flex items-center justify-center w-full min-h-screen">
          <div className="w-2/6">
            <ContinuousImageFilter
              opacity={introOpacity}
              onDismiss={dismissIntro}
            />
          </div>
        </div>
      )}
      {!showIntro && (
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
    </>
  )
}

export default ClientContainer
