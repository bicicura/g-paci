import Image from 'next/image'
import { useState, useCallback, useEffect, useContext } from 'react'
import CursorWithEffect2 from './CursorWithEffect2'
import styles from './Carousel/Carousel.module.css'
import CursorWithoutEffect2 from './CursorWithoutEffect2'
import { EffectsContext } from '../contexts/EffectsContext'

const ImgSlideEffect = ({ onDismiss, opacity }) => {
  // porcentaje de en que posición esta el mouse en el eje X del contenedor padre
  const [maskWidth, setMaskWidth] = useState(0)
  const [cursorText, setCursorText] = useState('[hover the image]')
  const [mousePosition, setMousePosition] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [randomImg, setRandomImg] = useState({ img: '', client: 'KOSTUME', id: null })
  const { isLoading, homeEffectConfig } = useContext(EffectsContext)
  const [primaryImages, setPrimaryImages] = useState([])
  const [speed, setSpeed] = useState(0) // Nuevo estado para la velocidad

  let prevEvent = null
  let currentEvent = null
  let intervalId = null

  const shouldShowFilter = homeEffectConfig && homeEffectConfig.active

  useEffect(() => {
    setPrimaryImages(homeEffectConfig?.images?.filter(item => item.isPrimary))

    if (!isLoading && homeEffectConfig.active === false) {
      onDismiss()
    }

    // Iniciar el seguimiento de la velocidad del mouse
    document.documentElement.addEventListener('mousemove', handleMouseMoveSpeed)

    // Iniciar el intervalo para calcular la velocidad
    intervalId = setInterval(calculateSpeed, 100)

    // Limpieza al desmontar
    return () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMoveSpeed)
      clearInterval(intervalId)
    }
  }, [homeEffectConfig, isLoading])

  const handleMouseMoveSpeed = event => {
    currentEvent = event
  }

  const calculateSpeed = () => {
    if (prevEvent && currentEvent) {
      const movementX = Math.abs(currentEvent.screenX - prevEvent.screenX)
      const movementY = Math.abs(currentEvent.screenY - prevEvent.screenY)
      const movement = Math.sqrt(movementX * movementX + movementY * movementY)

      // Calcular velocidad actual
      const currentSpeed = 10 * movement // Velocidad = movimiento / 0.1s
      setSpeed(Math.round(currentSpeed))
    }

    prevEvent = currentEvent
  }

  const handleTextChange = text => setCursorText(text)

  const throttle = (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  const generateRandomNumber = () => {
    if (homeEffectConfig?.images?.length) {
      console.log(homeEffectConfig)
      const maxNumber = homeEffectConfig?.images.length
      setRandomImg(prev => {
        // Returns a random integer from 0 to maxNumber -1:
        return homeEffectConfig?.images[Math.floor(Math.random() * maxNumber)]
      })
    }
  }

  const calculateMaskWidth = e => {
    const divBounds = e.currentTarget.getBoundingClientRect()
    const mouseXRelativeToDiv = e.clientX - divBounds.left
    // Calcula la distancia del centro en términos absolutos
    const distanceFromCenter = Math.abs(mouseXRelativeToDiv - divBounds.width / 2)
    // Convierte esa distancia a un porcentaje del ancho del div
    const distancePercentage = (distanceFromCenter / (divBounds.width / 2)) * 100
    // Ajusta el porcentaje para el ancho de la máscara
    const maskWidthPercentage = 100 - distancePercentage

    // Asegura que el porcentaje esté entre 0 y 100
    setMaskWidth(Math.max(maskWidthPercentage, 0))
  }

  const calculateMousePosition = e => {
    // Obtener las dimensiones y la posición del div
    const divBounds = e.currentTarget.getBoundingClientRect()

    // Calcular la posición del mouse relativa al div
    const mouseXRelativeToDiv = e.clientX - divBounds.left

    // Convertir esa posición a un porcentaje del ancho total del div
    const mousePercentage = (mouseXRelativeToDiv / divBounds.width) * 100

    // Actualizar el estado con el nuevo porcentaje, asegurándose de que esté entre 0% y 100%
    setMousePosition(Math.min(Math.max(mousePercentage, 0), 100))
  }

  const handleMouseMove = useCallback(
    throttle(e => {
      calculateMaskWidth(e)
      calculateMousePosition(e)
      generateRandomNumber()
    }, 37),
    [homeEffectConfig]
  )

  const handleMouseEnter = () => {
    handleTextChange('[click the image]')
    setIsLeaving(false)
  }

  const handleMouseLeave = () => {
    setIsLeaving(true)

    handleTextChange('[hover the image]')

    // aquí necesito que
    setRandomImg({ img: '', client: 'KOSTUME', id: null })
  }

  return shouldShowFilter ? (
    <div
      className={`${
        styles.customCursor
      } flex justify-center min-h-dvh opacity-0 lg:min-h-screen items-center w-full transition-opacity relative duration-300 ${
        opacity === 1 ? 'opacity-100' : ''
      }`}
    >
      <CursorWithoutEffect2 cursorText={cursorText} />
      <div
        className="flex relative"
        style={{ maxHeight: '80vh', height: '80vh', width: '25%' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => {
          handleMouseLeave()
        }}
        onClick={onDismiss}
      >
        <div
          style={{ transform: 'translateX(100%)' }}
          className={
            'absolute -right-4 top-0 w-max mx-auto flex flex-col gap-y-1 transition-opacity'
          }
        >
          <span className="text-slate-400 text-sm leading-none">client</span>
          <span className="font-bold text-lg leading-none">{randomImg?.client}</span>
          <span className="text-slate-400 text-sm leading-none">speed</span>
          <span className="font-bold text-lg leading-none mt-12">{speed}</span>
        </div>
        {primaryImages.length && (
          <div className="w-full inset-0 absolute h-full overflow-hidden">
            <CursorWithEffect2 cursorText={cursorText} />
            <Image
              style={{ opacity: mousePosition <= 50 ? 1 : 0 }}
              src={primaryImages[0].url}
              className="w-full h-full object-cover transition-opacity"
              fill
              sizes="70vw"
              alt="Slide img"
            />
            <Image
              style={{ opacity: mousePosition > 50 ? 1 : 0 }}
              src={primaryImages[1].url}
              fill
              className="w-full h-full object-cover transition-opacity"
              sizes="100vw"
              alt="Slide img"
            />
          </div>
        )}
        <div
          style={{
            width: `${maskWidth}%`,
            left: `${mousePosition}%`,
            transform: `translateX(-50%)`,
            transition: 'all 90ms cubic-bezier(.57,.21,.69,1.25)',
          }}
          className="w-full h-full absolute"
        >
          {homeEffectConfig?.images?.map((img, index) => (
            <Image
              key={img.id}
              src={img.url}
              fill
              className="w-full h-full object-cover"
              sizes="100vw"
              alt="Slide img"
              style={{
                opacity: index === randomImg.id ? 1 : 0,
                transitionProperty: isLeaving ? 'all' : '',
                transitionTimingFunction: isLeaving ? 'cubic-bezier(0.4, 0, 0.2, 1)' : '',
                transitionDuration: isLeaving ? '250ms' : '',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null
}

export default ImgSlideEffect
