import { useState, useEffect, useRef } from 'react'

const CursorWithEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 })
  const [containerOffset, setContainerOffset] = useState({ left: 0, top: 0 })
  const cursorRef = useRef(null)

  // Escuchador para obtener la posición actual del mouse
  useEffect(() => {
    const updatePosition = event => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })
    }

    window.addEventListener('mousemove', updatePosition)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [])

  // Calcular el offset del contenedor padre una vez al montar el componente
  useEffect(() => {
    if (cursorRef.current) {
      const containerRect = cursorRef.current.parentElement.getBoundingClientRect()
      setContainerOffset({
        left: containerRect.left,
        top: containerRect.top,
      })
    }
  }, [])

  // Calcular la posición relativa basada en el offset previamente calculado
  useEffect(() => {
    setRelativePosition({
      x: position.x - containerOffset.left,
      y: position.y - containerOffset.top,
    })
  }, [position, containerOffset])

  return (
    <span
      ref={cursorRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#fff',
        transform: `translate(${relativePosition.x}px, ${relativePosition.y}px)`,
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        transition: 'transform .1s ease-out',
        zIndex: 1000,
      }}
    >
      <b>L’Officiel 1/4</b>
    </span>
  )
}

export default CursorWithEffect
