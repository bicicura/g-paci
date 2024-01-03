import { useRef, useState, useCallback, useEffect } from 'react'

const ContinuousImageFilter = ({ onDismiss, opacity }) => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const maskImageRef = useRef(null)
  const [maskSize] = useState(20)

  const draw = useCallback(
    (x, y, isNewStroke) => {
      const ctx = canvasRef.current.getContext('2d')
      if (isNewStroke) {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.filter = 'blur(10px)'
        ctx.beginPath()
        ctx.arc(x, y, maskSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.filter = 'none'
        // Update the mask image style with the canvas
        maskImageRef.current.style.mask = `url(${canvasRef.current.toDataURL()})`
        maskImageRef.current.style.webkitMask = `url(${canvasRef.current.toDataURL()})`
      }
    },
    [maskSize]
  )

  const throttle = (callback, delay) => {
    let lastCall = 0
    return function (...args) {
      const now = new Date().getTime()
      if (now - lastCall < delay) return
      lastCall = now
      callback(...args)
    }
  }

  const handleMouseMove = useCallback(
    throttle(e => {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.pageX - left
      const y = e.pageY - top
      draw(x, y, true)
    }, 25), // Throttle interval in milliseconds
    [draw]
  )

  const handleMouseLeave = useCallback(() => {
    // Update the mask image when the mouse leaves the container
    maskImageRef.current.style.mask = `url(${canvasRef.current.toDataURL()})`
    maskImageRef.current.style.webkitMask = `url(${canvasRef.current.toDataURL()})`
  }, [])

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.width = containerRef.current.offsetWidth
      canvasRef.current.height = containerRef.current.offsetHeight
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [])

  return (
    <div
      onClick={onDismiss}
      tabIndex={0}
      onKeyDown={e => e.key === 'Tab' && onDismiss()}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
      className={`cursor-pointer transition-opacity duration-300 ${
        opacity === 1 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        ref={maskImageRef}
        src="/images/overlap-effect/negative.jpg"
        alt="Positive"
        style={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <img
        src="/images/overlap-effect/positive.jpg"
        alt="Negative"
        style={{ width: '100%', height: 'auto' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'none', // Keep the canvas hidden
        }}
      />
    </div>
  )
}

export default ContinuousImageFilter
