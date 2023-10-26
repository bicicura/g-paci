import { useState, useEffect, useRef, useContext } from 'react'
import { CarouselContext } from '../contexts/CarouselContext'
import { usePathname } from 'next/navigation'

const CursorWithEffect = () => {
  const pathname = usePathname()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 })
  const [containerOffset, setContainerOffset] = useState({ left: 0, top: 0 })
  const cursorRef = useRef(null)
  const { currentSlide, data, loading, imagesLoaded, setImagesLoaded } =
    useContext(CarouselContext)
  const [title, setTitle] = useState('Overview')
  const resizeObserver = useRef(null)

  useEffect(() => {
    handleContainerOffset()
  }, [imagesLoaded])

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
    handleContainerOffset()
  }, [])

  const handleContainerOffset = () => {
    if (cursorRef.current) {
      const containerRect = cursorRef.current.parentElement.getBoundingClientRect()
      setContainerOffset({
        left: containerRect.left,
        top: containerRect.top,
      })
    }
  }

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(handleContainerOffset)
    if (cursorRef.current && cursorRef.current.parentElement) {
      resizeObserver.current.observe(cursorRef.current.parentElement)
    }

    // Limpiar al desmontar
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      const slug = pathname.split('/').pop()
      const item = data.find(project => project.slug === slug)
      setTitle(item ? item.title : 'Overview')
    }
  }, [pathname, data, loading])

  // Calcular la posición relativa basada en el offset previamente calculado
  useEffect(() => {
    setRelativePosition({
      x: position.x - containerOffset.left,
      y: position.y - containerOffset.top,
    })
  }, [position, containerOffset])

  return (
    <span
      className="tracking-wider"
      ref={cursorRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#fff',
        transform: `translate(${relativePosition.x + 1}px, ${relativePosition.y + 1}px)`,
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        transition: 'transform .1s ease-out',
        zIndex: 4001,
        fontWeight: '500',
        fontSize: '12px',
      }}
    >
      {title} {currentSlide}/3
    </span>
  )
}

export default CursorWithEffect
