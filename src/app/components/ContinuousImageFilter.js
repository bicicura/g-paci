import { useRef, useState, useContext } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'

const ContinuousImageFilter = ({ onDismiss, opacity }) => {
  const containerRef = useRef(null) // Define the containerRef here
  const [mousePositions, setMousePositions] = useState([])
  const [maskSize] = useState(30) // Size of the area that reveals the negative
  const pointLifetime = 3000
  const maxPoints = 100
  const { isLoading, homeEffectConfig } = useContext(EffectsContext)

  const handleMouseMove = e => {
    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.pageX - left
    const y = e.pageY - top

    // Agregar nuevo punto
    const newPoint = { x, y, id: Date.now() } // Cada punto tiene un ID único
    setMousePositions(prev => {
      // Si al agregar un nuevo punto se excede el máximo, eliminar el más antiguo
      const updatedPoints = prev.length >= maxPoints ? prev.slice(1) : prev
      return [...updatedPoints, newPoint]
    })

    // Programar la eliminación del punto después de pointLifetime
    setTimeout(() => {
      setMousePositions(prev => prev.filter(point => point.id !== newPoint.id))
    }, pointLifetime)
  }

  return (
    <div
      onClick={onDismiss}
      tabIndex={0}
      onKeyDown={e => e.key === 'Tab' && onDismiss()}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
      className={`cursor-pointer transition-opacity duration-300 ${
        opacity === 1 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        // src="/images/overlap-effect/negative.jpg"
        src={homeEffectConfig.primaryImage}
        alt="Negative"
        style={{ height: 'auto', maxHeight: '80vh' }}
      />
      <img
        // src="/images/overlap-effect/positive.jpg"
        src={homeEffectConfig.secondaryImage}
        alt="Positive"
        style={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          clipPath: 'url(#clip-path)',
        }}
      />
      <svg style={{ width: 0, height: 0 }}>
        <defs>
          <clipPath
            style={{ fill: 'blue' }}
            id="clip-path"
          >
            {mousePositions.map((pos, index) => (
              <circle
                style={{ stroke: 'red', strokeWidth: '2px' }}
                key={index}
                cx={pos.x}
                cy={pos.y}
                r={maskSize}
              />
            ))}
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

export default ContinuousImageFilter
