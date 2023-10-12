'use client'

import Navbar from './Navigation/Navbar.js'
import HoverCarousel from './Carousel/HoverCarousel.js'
import { HoverProvider } from '../contexts/HoverContext.js'

const ClientContainer = ({ children }) => {
  return (
    <HoverProvider>
      <Navbar />
      {children}
    </HoverProvider>
  )
}

export default ClientContainer
