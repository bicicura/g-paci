'use client'

import { useState, useEffect, useCallback, useContext } from 'react'
import useMobileDetect from '@/app/hooks/useMobileDetect'
import Navlist from './NavLinksList'
import NavWorkBtn from './NavWorkBtn'
import NavSocialBtns from './NavSocialBtns'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import NavInfoSection from './NavInfoSection'
import { EffectsContext } from '@/app/contexts/EffectsContext'

const Navbar = () => {
  const {
    isInfoActive,
    setIsInfoActive,
    isWorkActive,
    setIsWorkActive,
    toggleNavigation,
  } = useContext(NavigationContext)
  const isMobile = useMobileDetect()
  const { infoEffectConfig, isLoading } = useContext(EffectsContext)
  const [shouldShowInfoSection, setShouldShowInfoSection] = useState(false)

  useEffect(() => {
    if (!isLoading && infoEffectConfig.active === false) {
      setShouldShowInfoSection(true)
    } else if (!isLoading && infoEffectConfig.active === true) {
      setShouldShowInfoSection(false)
    }
  }, [infoEffectConfig, isLoading])

  const handleEscapeKey = useCallback(
    event => {
      if (event.key === 'Escape') {
        if (isWorkActive) {
          setIsWorkActive(false)
        }
        if (isInfoActive) {
          setIsInfoActive(false)
        }
      }
    },
    [isWorkActive, isInfoActive]
  ) // ahora handleEscapeKey está memorizado con useCallback

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey)
    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [handleEscapeKey])

  return (
    <header
      className={`fixed top-0 ${
        isInfoActive && !shouldShowInfoSection ? '' : ''
      } left-0 flex justify-between w-full p-3 lg:p-0`}
      style={{
        zIndex: 5003,
      }}
    >
      <NavWorkBtn toggleNavigation={toggleNavigation} />
      <NavSocialBtns isMobile={isMobile} />
      {shouldShowInfoSection && <NavInfoSection isInfoActive={isInfoActive} />}
      <Navlist toggleNavigation={toggleNavigation} />
    </header>
  )
}

export default Navbar
