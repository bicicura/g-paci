import React, { useState, useContext, createContext } from 'react'

const HoverContext = createContext()

export const useHover = () => {
  return useContext(HoverContext)
}

export const HoverProvider = ({ children }) => {
  const [hoverItem, setHoverItem] = useState(null)

  const value = {
    hoverItem,
    setHoverItem,
  }

  return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}
