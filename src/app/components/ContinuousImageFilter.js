import { useRef, useState, useCallback, useEffect, useContext } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'
import Image from 'next/image'

const ContinuousImageFilter = ({ onDismiss, opacity }) => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const maskImageRef = useRef(null)
  const [maskSize] = useState(23)
  const { isLoading, homeEffectConfig } = useContext(EffectsContext)

  const throttle = (callback, delay) => {
    let lastCall = 0
    return function (...args) {
      const now = new Date().getTime()
      if (now - lastCall < delay) return
      lastCall = now
      callback(...args)
    }
  }

  // Crear un buffer canvas para mejorar el rendimiento
  const bufferCanvasRef = useRef(null)
  const bufferCtxRef = useRef(null)

  useEffect(() => {
    if (bufferCanvasRef.current) {
      bufferCtxRef.current = bufferCanvasRef.current.getContext('2d')
    }
  }, [])

  const draw = useCallback(
    (x, y) => {
      const ctx = bufferCtxRef.current || canvasRef.current.getContext('2d')
      ctx.globalCompositeOperation = 'destination-out'
      ctx.filter = 'blur(7px)'
      ctx.beginPath()
      ctx.arc(x, y, maskSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.filter = 'none'
    },
    [maskSize]
  )

  const updateMask = useCallback(() => {
    if (canvasRef.current && bufferCanvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(bufferCanvasRef.current, 0, 0)
      maskImageRef.current.style.mask = `url(${canvasRef.current.toDataURL()})`
      maskImageRef.current.style.webkitMask = `url(${canvasRef.current.toDataURL()})`
    }
  }, [])

  const throttledMouseMove = useCallback(
    throttle(e => {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.pageX - left
      const y = e.pageY - top
      draw(x, y)
      requestAnimationFrame(updateMask)
    }, 25),
    [draw, updateMask]
  ) // 25 milisegundos como ejemplo

  useEffect(() => {
    // Crear el contexto del buffer canvas si aún no existe
    if (bufferCanvasRef.current && !bufferCtxRef.current) {
      bufferCtxRef.current = bufferCanvasRef.current.getContext('2d')
    }

    // Continuar solo si tanto el canvas como el contexto están disponibles
    if (canvasRef.current && bufferCtxRef.current) {
      // Configurar las dimensiones del canvas
      canvasRef.current.width = containerRef.current.offsetWidth
      canvasRef.current.height = containerRef.current.offsetHeight
      bufferCanvasRef.current.width = canvasRef.current.width
      bufferCanvasRef.current.height = canvasRef.current.height

      // Ahora puedes usar el contexto del buffer canvas de forma segura
      const ctx = bufferCtxRef.current
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, bufferCanvasRef.current.width, bufferCanvasRef.current.height)
    }
  }, [homeEffectConfig])

  return isLoading ? (
    <span>Loading...</span>
  ) : (
    <div
      onClick={onDismiss}
      tabIndex={0}
      onKeyDown={e => e.key === 'Tab' && onDismiss()}
      ref={containerRef}
      onMouseMove={throttledMouseMove}
      style={{ position: 'relative' }}
      className={`cursor-pointer transition-opacity topContinousImage duration-300 ${
        opacity === 1 ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          textOrientation: '',
        }}
        className="absolute -right-6   bottom-0"
      >
        draw de image
      </span>
      <Image
        ref={maskImageRef}
        src={homeEffectConfig.primaryImage}
        alt="Positive"
        priority
        width={500}
        height={500}
        style={{
          width: '100%',
          height: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <Image
        priority
        width={500}
        height={500}
        src={homeEffectConfig.secondaryImage}
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
          display: 'none',
        }}
      />
      <canvas
        ref={bufferCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'none', // Este canvas también permanece oculto
        }}
      />
    </div>
  )
}

export default ContinuousImageFilter
