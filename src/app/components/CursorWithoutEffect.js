import { useState, useEffect } from 'react'

const CursorWithoutEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

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
        transform: `translate(${position.x}px, calc(${position.y}px - 5rem)`,
        pointerEvents: 'none',
        transition: 'transform .1s ease',
        zIndex: 10,
      }}
    >
      L’Officiel 1/4
    </span>
  )
}

export default CursorWithoutEffect
