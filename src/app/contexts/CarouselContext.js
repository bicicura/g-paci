import { useState, useEffect, createContext } from 'react'
import { usePathname } from 'next/navigation'

export const CarouselContext = createContext()

export const CarouselProvider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const [data, setData] = useState({
    created_at: '',
    id: null,
    name: '',
    slug: '',
    status: '',
    updated_at: '',
    works_images: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const pathname = usePathname()

  const slug = pathname.split('/').pop()

  const changeSlide = direction => {
    setOpacity(0)
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentSlide(prevSlide =>
          prevSlide >= data.works_images.length ? 1 : prevSlide + 1
        )
      } else {
        setCurrentSlide(prevSlide =>
          prevSlide <= 1 ? data.works_images.length : prevSlide - 1
        )
      }
      setOpacity(1)
    }, 200) // Asume una transición de 200ms
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Create a URL object
        const url = new URL('/api/work', process.env.NEXT_PUBLIC_BASE_URL)

        // Append the slug parameter
        url.searchParams.append('slug', slug)

        const response = await fetch(url.toString())
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug]) // Add slug as a dependency if it can change

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
