'use client'

// ClientContainer.js
import { useState } from 'react'
import Navbar from './Navigation/Navbar.js'
import { HoverProvider } from '../contexts/HoverContext.js'
import Loader from './Loader.js'

const ClientContainer = ({ children }) => {
  const [showLoader, setShowLoader] = useState(true)

  const handleVideoPlayedOnce = () => {
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <Loader onVideoPlayedOnce={handleVideoPlayedOnce} />}
      <HoverProvider>
        <Navbar />
        {children}
      </HoverProvider>
    </>
  )
}

export default ClientContainer
