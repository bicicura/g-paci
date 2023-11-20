import { useRef, useState } from 'react'

const ImageFilter = () => {
  const containerRef = useRef(null)
  const [maskSize, setMaskSize] = useState(85) // Size of the area that reveals the negative

  const handleMouseMove = e => {
    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.pageX - left
    const y = e.pageY - top
    containerRef.current.style.setProperty('--mask-x', `${x}px`)
    containerRef.current.style.setProperty('--mask-y', `${y}px`)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      <img
        src="/images/overlap-effect/negative.jpg"
        alt="Negative"
        style={{ width: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/images/overlap-effect/positive.jpg')`,
          backgroundSize: 'cover',
          maskImage: `radial-gradient(circle at var(--mask-x) var(--mask-y), transparent ${
            maskSize - 10
          }px, black ${maskSize}px, black)`,
          webkitMaskImage: `radial-gradient(circle at var(--mask-x) var(--mask-y), transparent ${
            maskSize - 10
          }px, black ${maskSize}px, black)`,
        }}
      />
    </div>
  )
}

export default ImageFilter
