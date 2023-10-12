import { useState, useEffect, useContext } from 'react'
import { CarouselContext } from '../contexts/CarouselContext'
import { usePathname } from 'next/navigation'

const CursorWithoutEffect = () => {
  const pathname = usePathname()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { currentSlide, data, loading } = useContext(CarouselContext)
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!loading) {
      const slug = pathname.split('/').pop()
      const item = data.find(project => project.slug === slug)
      setTitle(item ? item.title : 'no-data')
    }
  }, [pathname, data, loading])

  const updatePosition = event => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  useEffect(() => {
    window.addEventListener('mousemove', updatePosition)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [])

  // este calc(${position.y}px - 5rem) corresponde al margen que tiene el padre en Carousel.js
  return (
    <span
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#000',
        transform: `translate(${position.x + 1}px, calc(${position.y + 1}px - 5rem)`,
        pointerEvents: 'none',
        transition: 'transform .1s ease',
        zIndex: 10,
      }}
    >
      {title} {currentSlide}/3
    </span>
  )
}

export default CursorWithoutEffect
