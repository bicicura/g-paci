import { useRef, useState, useContext } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'
import Image from 'next/image'
import Spinner from './Spinner'

const ContinuousImageFilter = ({ onDismiss, opacity }) => {
  const containerRef = useRef(null) // Define the containerRef here
  const [mousePositions, setMousePositions] = useState([])
  const [maskSize] = useState(30) // Size of the area that reveals the negative
  const pointLifetime = 3000
  const maxPoints = 100
  const { isLoading, homeEffectConfig } = useContext(EffectsContext)

  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadedImagesCount, setLoadedImagesCount] = useState(0)
  const totalImages = 2 // Ajusta este número según la cantidad de imágenes que necesitas cargar

  const handleImageLoaded = () => {
    setLoadedImagesCount(prevCount => prevCount + 1)
  }

  useEffect(() => {
    if (loadedImagesCount === totalImages) {
      setImagesLoaded(true)
    }
  }, [loadedImagesCount, imagesLoaded])

  const [drawPoints, setDrawPoints] = useState([])

  const addDrawPoint = (x, y) => {
    // Añadir un nuevo punto y posiblemente eliminar los más antiguos
    setDrawPoints(currentPoints => [...currentPoints, { x, y, time: Date.now() }])
  }

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
    if (imagesLoaded && bufferCanvasRef.current) {
      bufferCtxRef.current = bufferCanvasRef.current.getContext('2d')
    }
  }, [imagesLoaded])

  useEffect(() => {
    const interval = setInterval(() => {
      // Elimina los puntos más antiguos
      setDrawPoints(currentPoints =>
        currentPoints.filter(point => Date.now() - point.time < 3000)
      ) // 3000 ms = 3 segundos
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const draw = useCallback(() => {
    // Verifica si los contextos de canvas están disponibles
    if (!bufferCtxRef.current || !canvasRef.current) {
      return
    }

    const ctx = bufferCtxRef.current
    ctx.globalCompositeOperation = 'destination-out'

    ctx.filter = 'blur(9px)'

    // Dibuja los puntos actuales
    drawPoints.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, maskSize, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.filter = 'blur(3px)'
  }, [drawPoints, maskSize])

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
      addDrawPoint(x, y) // Añade el punto a drawPoints
      requestAnimationFrame(updateMask)
    }, 25),
    [addDrawPoint, updateMask]
  )

  useEffect(() => {
    // Llama a draw y updateMask solo si los contextos de canvas están disponibles
    if (bufferCtxRef.current && canvasRef.current) {
      draw()
      requestAnimationFrame(updateMask)
    }
  }, [drawPoints, draw, updateMask])

  useEffect(() => {
    // Crear el contexto del buffer canvas si aún no existe
    if (imagesLoaded && bufferCanvasRef.current && !bufferCtxRef.current) {
      bufferCtxRef.current = bufferCanvasRef.current.getContext('2d')
    }

    // Continuar solo si tanto el canvas como el contexto están disponibles
    if (imagesLoaded && canvasRef.current && bufferCtxRef.current) {
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
  }, [imagesLoaded, homeEffectConfig])

  return isLoading ? (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Spinner />
    </div>
  ) : (
    <>
      <div
        className={`justify-center items-center min-h-screen w-full ${
          imagesLoaded ? 'hidden' : 'flex'
        }`}
      >
        <Spinner />
      </div>
      <div
        onClick={onDismiss}
        tabIndex={0}
        onKeyDown={e => e.key === 'Tab' && onDismiss()}
        ref={containerRef}
        onMouseMove={throttledMouseMove}
        style={{ position: 'relative', height: 'fit-content', maxHeight: '85vh' }}
        className={`cursor-pointer transition-opacity mx-auto topContinousImage duration-300 ${
          opacity === 1 && imagesLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            textOrientation: '',
            fontSize: '15px',
          }}
          className="absolute -right-7 bottom-0"
        >
          draw the image
        </span>
        <Image
          ref={maskImageRef}
          // src="/images/overlap-effect/positive.jpg"
          src={homeEffectConfig.primaryImage}
          alt="Positive"
          priority
          width={500}
          height={500}
          onLoad={handleImageLoaded}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '85vh',
            position: 'absolute',
            objectFit: 'cover',
            objectPosition: 'center',
            top: 0,
            left: 0,
          }}
        />
        <Image
          priority
          width={500}
          onLoad={handleImageLoaded}
          height={500}
          // src="/images/overlap-effect/negative.jpg"
          src={homeEffectConfig.secondaryImage}
          alt="Negative"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            objectPosition: 'center',
            maxHeight: '85vh',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maxHeight: '85vh',
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
    </>
  )
}

export default ContinuousImageFilter
