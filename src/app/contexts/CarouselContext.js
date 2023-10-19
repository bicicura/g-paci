import { useState, useEffect, createContext } from 'react'

export const CarouselContext = createContext()

export const CarouselProvider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/work')
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <CarouselContext.Provider
      value={{
        currentSlide,
        opacity,
        changeSlide,
        data,
        loading,
        error,
        imagesLoaded,
        setImagesLoaded,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}
