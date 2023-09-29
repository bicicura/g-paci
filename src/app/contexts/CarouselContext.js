import { useState, createContext } from 'react'

export const CarouselContext = createContext()

export const CarouselProvider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [opacity, setOpacity] = useState(1)

  const changeSlide = direction => {
    setOpacity(0)
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentSlide(prevSlide => (prevSlide >= 3 ? 1 : prevSlide + 1))
      } else {
        setCurrentSlide(prevSlide => (prevSlide <= 1 ? 3 : prevSlide - 1))
      }
      setOpacity(1)
    }, 200) // Asume una transición de 200ms
  }

  return (
    <CarouselContext.Provider value={{ currentSlide, opacity, changeSlide }}>
      {children}
    </CarouselContext.Provider>
  )
}
