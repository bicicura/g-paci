import Image from 'next/image'
import { useState, useCallback } from 'react'

const ImgSlideEffect = () => {
  // porcentaje de en que posición esta el mouse en el eje X del contenedor padre
  const [maskWidth, setMaskWidth] = useState(0)
  const [mousePosition, setMousePosition] = useState(0)
  const imgs = [
    { img: 'h-1.jpg', client: 'LOfficiel', id: 0 },
    { img: 'h-2.jpg', client: 'KOSTUME', id: 1 },
    { img: 'h-3.jpg', client: 'IMAN', id: 2 },
    { img: 'h-4.jpg', client: 'Lorem', id: 3 },
    { img: 'h-5.jpg', client: 'asd', id: 4 },
  ]

  const [randomImg, setRandomImg] = useState({ img: '', client: '' })

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

  const handleMouseMove = useCallback(
    throttle(e => {
      calculateMaskWidth(e)
      calculateMousePosition(e)
      generateRandomNumber()
    }, 25),
    []
  )

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="w-[400px] h-[500px] relative"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute left-0 right-0 -top-12 w-max mx-auto flex gap-8">
          <span>maskWidth: {Math.floor(maskWidth)}%</span>
          <span>mousePosition: {Math.floor(mousePosition)}%</span>
          <span>randomImg: {randomImg.img}</span>
        </div>
        <div
          style={{ transform: 'translateX(100%)' }}
          className="absolute -right-4 top-0 w-max mx-auto flex flex-col gap-y-1"
        >
          <span className="text-slate-400 text-sm leading-none">client</span>
          <span className="font-bold text-lg leading-none">{randomImg.client}</span>
        </div>
        <Image
          src={`/images/img-slide-effect/h-1.jpg`}
          fill
          className="w-full h-full object-cover"
          sizes="100vw"
          alt="Slide img"
        />
        <div
          style={{
            width: `${maskWidth}%`,
            left: `${mousePosition}%`,
            transform: `translateX(-50%)`,
            // transition: 'all 90ms ease-in-out',
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
              style={{ opacity: index === randomImg.id ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ImgSlideEffect
