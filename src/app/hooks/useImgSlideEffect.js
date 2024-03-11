import { useState, useCallback, useEffect, useContext } from 'react'
import { EffectsContext } from '../contexts/EffectsContext'

const useImgSlideEffect = ({ onDismiss, opacity }) => {
  const { isLoading, homeEffectConfig } = useContext(EffectsContext)
  // porcentaje de en que posición esta el mouse en el eje X del contenedor padre
  const [maskWidth, setMaskWidth] = useState(0)
  const [cursorText, setCursorText] = useState('[hover the image]')
  const [mousePosition, setMousePosition] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [randomImg, setRandomImg] = useState({ img: '', client: '', id: null })
  const [primaryImages, setPrimaryImages] = useState([])
  const [speed, setSpeed] = useState(0) // Nuevo estado para la velocidad
  const [primaryImagesLoaded, setPrimaryImagesLoaded] = useState(false)
  const [primaryImagesCounter, setPrimaryImagesCounter] = useState(0)

  let prevEvent = null
  let currentEvent = null
  let intervalId = null

  const shouldShowFilter = homeEffectConfig && homeEffectConfig.active

  const toggleBgImage = () => {
    if (primaryImages.length === 0) {
      return setRandomImg(homeEffectConfig.images[0])
    }

    if (primaryImages.length >= 2) {
      if (mousePosition <= 50) {
        return setRandomImg(primaryImages[0])
      } else {
        return setRandomImg(primaryImages[1])
      }
    }

    return setRandomImg(primaryImages[0])
  }

  useEffect(() => {
    // si esta inactivo o no hay imagenes para mostrar, dar el efecto de baja
    if (
      (!isLoading && homeEffectConfig.active === false) ||
      (!isLoading && homeEffectConfig.images.length === 0)
    ) {
      onDismiss()
    }

    setPrimaryImages(homeEffectConfig?.images?.filter(item => item.isPrimary))

    if (homeEffectConfig.images.length) {
      toggleBgImage()
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

  const throttle = (func, getLimit) => {
    let inThrottle
    let lastLimit = getLimit()
    return function () {
      const limit = getLimit() // Obtiene el límite actual basado en la velocidad
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        lastLimit = limit
        setTimeout(() => (inThrottle = false), limit)
      } else if (limit !== lastLimit) {
        // Si el límite cambió significativamente, reiniciar el throttle
        inThrottle = false
      }
    }
  }

  // Ajuste dinámico del límite basado en la velocidad
  const dynamicThrottleLimit = () => {
    // Ajusta estos valores según necesites
    const baseLimit = 1000 // Tiempo base en ms para velocidad baja
    const minLimit = 50 // Tiempo mínimo en ms para alta velocidad
    return Math.max(baseLimit - speed * 5, minLimit)
  }

  const generateRandomNumber = () => {
    if (homeEffectConfig?.images?.length) {
      const maxNumber = homeEffectConfig?.images.length
      let newIndex, newImg
      do {
        // Genera un nuevo índice aleatorio
        newIndex = Math.floor(Math.random() * maxNumber)
        newImg = homeEffectConfig?.images[newIndex]
      } while (newImg.id === randomImg.id && homeEffectConfig.images.length > 1) // Repite si el id es igual al último y hay más de una imagen para evitar bucle infinito
      setRandomImg(newImg)
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
      // Ahora generateRandomNumber es llamado con un ritmo que depende de la velocidad
      generateRandomNumber()
    }, dynamicThrottleLimit),
    [homeEffectConfig, speed] // Asegúrate de incluir speed en las dependencias
  )

  const handleMouseEnter = () => {
    handleTextChange('[click the image]')
    setIsLeaving(false)
  }

  const handleMouseLeave = () => {
    setIsLeaving(true)
    toggleBgImage()
    handleTextChange('[hover the image]')
  }

  const handleImageLoad = type => {
    if (type === 'no-primary') {
      return setPrimaryImagesLoaded(true)
    }

    if (primaryImages.length === 1) {
      return setPrimaryImagesLoaded(true)
    }

    if (primaryImages.length > 1) {
      setPrimaryImagesCounter(primaryImagesCounter + 1)
      if (primaryImagesCounter >= 2) {
        return setPrimaryImagesLoaded(true)
      }
    }
  }

  return {
    shouldShowFilter,
    cursorText,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    randomImg,
    primaryImages,
    handleImageLoad,
    homeEffectConfig,
    isLeaving,
    isLoading,
    maskWidth,
    mousePosition,
    primaryImagesLoaded,
  }
}

export default useImgSlideEffect
