'use client'

// ClientContainer.js
import Navbar from './Navigation/Navbar.js'
import { HoverProvider } from '../contexts/HoverContext.js'

const ClientContainer = ({ children }) => {
  return (
    <>
      <HoverProvider>
        <Navbar />
        {children}
      </HoverProvider>
    </>
  )
}

export default ClientContainer
