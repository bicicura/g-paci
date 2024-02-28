import Image from 'next/image'
import { useState } from 'react'

const ImgSlideEffect = () => {
  // porcentaje de en que posición esta el mouse en el eje X del contenedor padre
  const [maskWidth, setMaskWidth] = useState(0)
  const [mousePosition, setMousePosition] = useState(0)

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

  const handleMouseMove = e => {
    calculateMaskWidth(e)
    calculateMousePosition(e)
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="w-[400px] h-[500px] relative"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute left-0 right-0 -top-12 w-max mx-auto flex gap-8">
          <span>maskWidth: {Math.floor(maskWidth)}%</span>
          <span>mousePosition: {Math.floor(mousePosition)}%</span>
        </div>
        <div
          style={{ transform: 'translateX(100%)' }}
          className="absolute -right-4 top-0 w-max mx-auto flex flex-col gap-y-1"
        >
          <span className="text-slate-400 text-sm leading-none">client</span>
          <span className="font-bold text-lg leading-none">Officiel</span>
        </div>
        <Image
          src={`/images/overlap-effect/positive.jpg`}
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
            // transition: 'left 1s ease-out',
          }}
          className="w-full h-full absolute"
        >
          <Image
            src={`/images/overlap-effect/negative.jpg`}
            fill
            className="w-full h-full object-cover"
            sizes="100vw"
            alt="Slide img"
          />
        </div>
      </div>
    </div>
  )
}

export default ImgSlideEffect
