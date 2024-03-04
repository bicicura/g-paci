import Image from 'next/image'
import { useState, useCallback } from 'react'
import CursorWithEffect2 from './CursorWithEffect2'
import styles from './Carousel/Carousel.module.css'
import CursorWithoutEffect2 from './CursorWithoutEffect2'

const ImgSlideEffect = () => {
  // porcentaje de en que posición esta el mouse en el eje X del contenedor padre
  const [maskWidth, setMaskWidth] = useState(0)
  const [cursorText, setCursorText] = useState('[hover the image]')
  const [mousePosition, setMousePosition] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [randomImg, setRandomImg] = useState({ img: '', client: 'KOSTUME', id: null })

  const imgs = [
    { img: 'h-1.jpg', client: 'LOfficiel', id: 0 },
    { img: 'h-2.jpg', client: 'KOSTUME', id: 1 },
    { img: 'h-3.jpg', client: 'IMAN', id: 2 },
    { img: 'h-4.jpg', client: 'Lorem', id: 3 },
    { img: 'h-5.jpg', client: 'asd', id: 4 },
  ]

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
    const maxNumber = imgs.length
    setRandomImg(prev => {
      // Returns a random integer from 0 to maxNumber -1:
      return imgs[Math.floor(Math.random() * maxNumber)]
    })
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
    []
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

  return (
    <div
      className={`${styles.customCursor} min-h-screen flex justify-center items-center`}
    >
      <CursorWithoutEffect2 cursorText={cursorText} />
      <div
        className="w-[400px] h-[500px] relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => {
          handleMouseLeave()
        }}
      >
        {/* <div className="absolute left-0 right-0 -top-12 w-max mx-auto flex gap-8">
          <span>maskWidth: {Math.floor(maskWidth)}%</span>
          <span>mousePosition: {Math.floor(mousePosition)}%</span>
          <span>randomImg: {randomImg.img}</span>
        </div> */}
        <div
          style={{ transform: 'translateX(100%)' }}
          className={
            'absolute -right-4 top-0 w-max mx-auto flex flex-col gap-y-1 transition-opacity'
          }
        >
          <span className="text-slate-400 text-sm leading-none">client</span>
          <span className="font-bold text-lg leading-none">{randomImg.client}</span>
        </div>
        <div className="w-full absolute h-full overflow-hidden">
          <CursorWithEffect2 cursorText={cursorText} />
          <Image
            style={{ opacity: mousePosition <= 50 ? 1 : 0 }}
            src={`/images/img-slide-effect/h-1.jpg`}
            fill
            className="w-full h-full object-cover transition-opacity"
            sizes="100vw"
            alt="Slide img"
          />
          <Image
            style={{ opacity: mousePosition > 50 ? 1 : 0 }}
            src={`/images/img-slide-effect/h-2.jpg`}
            fill
            className="w-full h-full object-cover transition-opacity"
            sizes="100vw"
            alt="Slide img"
          />
        </div>
        <div
          style={{
            width: `${maskWidth}%`,
            left: `${mousePosition}%`,
            transform: `translateX(-50%)`,
            transition: 'all 90ms cubic-bezier(.57,.21,.69,1.25)',
          }}
          className="w-full h-full absolute"
        >
          {imgs.map(({ img, id }, index) => (
            <Image
              key={img}
              src={`/images/img-slide-effect/${img}`}
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
  )
}

export default ImgSlideEffect
