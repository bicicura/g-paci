import { useRef, useState } from 'react'

const ContinuousImageFilter = ({ onDismiss, opacity }) => {
  const containerRef = useRef(null) // Define the containerRef here
  const [mousePositions, setMousePositions] = useState([])
  const [maskSize] = useState(35) // Size of the area that reveals the negative

  const handleMouseMove = e => {
    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.pageX - left
    const y = e.pageY - top
    setMousePositions(prev => [...prev, { x, y }])
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
        src="/images/overlap-effect/negative.jpg"
        alt="Negative"
        style={{ width: '100%', height: 'auto' }}
      />
      <img
        src="/images/overlap-effect/positive.jpg"
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
          <clipPath id="clip-path">
            {mousePositions.map((pos, index) => (
              <circle
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
