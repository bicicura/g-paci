import { useRef } from 'react'
import CarouselSlide from './CarouselSlide'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos
import { CarouselProvider } from '@/app/contexts/CarouselContext'
import HoverCarousel from './HoverCarousel'
import { Splide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/core'
import Slide from './Slide'

export default function Carousel() {
  const splideRef = useRef()

  const handleLeftClick = () => {
    const splide = splideRef.current.splide
    splide.go('<')
  }

  const handleRightClick = () => {
    const splide = splideRef.current.splide
    splide.go('>')
  }

  return (
    <CarouselProvider>
      <div
        className={`${styles.customCursor} flex justify-center items-center w-full min-h-screen border-2 border-purple-500 relative`}
      >
        <CursorWithoutEffect />
        <div className="relative carousel-container overflow-hidden">
          <Splide
            ref={splideRef}
            className="absolute inset-0"
            style={{
              zIndex: 4000,
            }}
            options={{
              rewind: true,
              width: '50rem',
              gap: '1rem',
              arrows: false,
              perPage: 1,
              type: 'fade',
            }}
            aria-label="My Favorite Images"
          >
            <Slide img="slide-1.jpg" />
            <Slide img="slide-2.jpg" />
            <Slide img="slide-3.jpg" />
          </Splide>
          <div
            onClick={handleLeftClick}
            className="absolute inset-y-0 left-0 w-1/2"
          ></div>
          <div
            onClick={handleRightClick}
            className="absolute inset-y-0 right-0 w-1/2"
          ></div>
          <CursorWithEffect />
        </div>
      </div>
    </CarouselProvider>
  )
}
