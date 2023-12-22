'use client'

import { useState, useEffect, useCallback, useContext } from 'react'
import useMobileDetect from '@/app/hooks/useMobileDetect'
import Navlist from './NavLinksList'
import NavWorkBtn from './NavWorkBtn'
import NavSocialBtns from './NavSocialBtns'
import { NavigationContext } from '@/app/contexts/NavigationContext'

const Navbar = () => {
  const {
    isInfoActive,
    setIsInfoActive,
    isWorkActive,
    setIsWorkActive,
    toggleNavigation,
  } = useContext(NavigationContext)
  const isMobile = useMobileDetect()

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
        isInfoActive ? 'lg:backdrop-blur-lg' : 'lg:bg-white'
      } left-0 flex justify-between w-full p-3 lg:p-0`}
      style={{
        zIndex: 5003,
      }}
    >
      <NavWorkBtn toggleNavigation={toggleNavigation} />
      <NavSocialBtns isMobile={isMobile} />

      <Navlist toggleNavigation={toggleNavigation} />
    </header>
  )
}

export default Navbar
