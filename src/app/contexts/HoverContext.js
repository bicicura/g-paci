import { useState, useContext, createContext } from 'react'

const HoverContext = createContext()

export const useHover = () => {
  return useContext(HoverContext)
}

export const HoverProvider = ({ children }) => {
  const [hoverItem, setHoverItem] = useState(null)
  const [isHovering, setIsHovering] = useState(false) // flag

  const value = {
    hoverItem,
    setHoverItem,
    isHovering,
    setIsHovering,
  }

  return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}
