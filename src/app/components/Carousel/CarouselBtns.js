import { useContext, useEffect } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'

const CarouselBtns = props => {
  const { changeSlide } = useContext(CarouselContext)

  const handleGoBack = () => {
    changeSlide('previous')
    props.goBack()
  }

  const handleGoNext = () => {
    changeSlide('next')
    props.goNext()
  }

  const handleKeyDown = event => {
    if (event.keyCode === 37) {
      // Código de tecla de flecha izquierda es 37
      handleGoBack()
    } else if (event.keyCode === 39) {
      // Código de tecla de flecha derecha es 39
      handleGoNext()
    }
  }

  useEffect(() => {
    // Agregar el manejador de eventos de teclado al montar
    window.addEventListener('keydown', handleKeyDown)

    // Eliminar el manejador de eventos de teclado al desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }) // Dependencias vacías significa que esto se ejecuta solo una vez, al montar y desmontar

  return (
    <>
      <div
        onClick={handleGoBack}
        className="absolute inset-y-0 left-0 w-1/2 hidden lg:block"
        style={{ zIndex: 40003 }}
      ></div>
      <div
        onClick={handleGoNext}
        className="absolute inset-y-0 right-0 w-1/2 hidden lg:block"
        style={{ zIndex: 40003 }}
      ></div>
    </>
  )
}

export default CarouselBtns
