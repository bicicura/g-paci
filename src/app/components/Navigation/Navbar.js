import { useState, useEffect, useCallback } from 'react'
import useMobileDetect from '@/app/hooks/useMobileDetect'
import Navlist from './NavLinksList'
import NavWorkBtn from './NavWorkBtn'
import NavSocialBtns from './NavSocialBtns'
import NavInfoSection from './NavInfoSection'

const Navbar = () => {
  const [isWorkActive, setIsWorkActive] = useState(false)
  const [isInfoActive, setIsInfoActive] = useState(false)
  const isMobile = useMobileDetect()

  const toggleNavigation = () => {
    setIsWorkActive(!isWorkActive)
  }

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
      className="fixed top-0 left-0 flex justify-between w-full p-3 lg:p-12 lg:bg-white"
      style={{
        zIndex: 2000,
      }}
    >
      <NavWorkBtn
        isWorkActive={isWorkActive}
        toggleNavigation={toggleNavigation}
      />
      <NavSocialBtns
        isMobile={isMobile}
        setIsInfoActive={setIsInfoActive}
        isInfoActive={isInfoActive}
        isWorkActive={isWorkActive}
      />
      <NavInfoSection isInfoActive={isInfoActive} />
      <Navlist
        toggleNavigation={toggleNavigation}
        isWorkActive={isWorkActive}
      />
    </header>
  )
}

export default Navbar
