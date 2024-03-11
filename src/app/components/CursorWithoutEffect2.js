import { useState, useEffect } from 'react'

const CursorWithoutEffect = props => {
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
      className="custom-cursor-effect"
      style={{
        fontSize: '12px',
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#000',
        transform: `translate(${position.x + 1}px, calc(${position.y + 1}px - 0rem)`,
        pointerEvents: 'none',
        transition: 'transform .1s ease',
        zIndex: -1,
      }}
    >
      {props.cursorText}
    </span>
  )
}

export default CursorWithoutEffect
