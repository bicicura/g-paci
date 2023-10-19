import { useRef, useEffect } from 'react'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos
import { CarouselProvider } from '@/app/contexts/CarouselContext'
import { Splide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css/core'
import Slide from './Slide'
import HoverCarousel from './HoverCarousel'
import useMobileDetect from '@/app/hooks/useMobileDetect.js'

export default function Carousel() {
  const splideRef = useRef()
  const isMobile = useMobileDetect()

  const handleLeftClick = () => {
    const splide = splideRef.current.splide
    splide.go('<')
  }

  const handleRightClick = () => {
    const splide = splideRef.current.splide
    splide.go('>')
  }

  const setVH = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  useEffect(() => {
    setVH()
    window.addEventListener('resize', setVH)
    return () => {
      window.removeEventListener('resize', setVH)
    }
  }, [])

  return (
    <CarouselProvider>
      <div
        className={`${
          styles.customCursor + ' ' + styles.customMinHScreen
        } flex justify-center items-center w-full lg:min-h-screen relative p-3`}
      >
        {!isMobile && <CursorWithoutEffect />}
        <div className="relative carousel-container overflow-hidden">
          <Splide
            ref={splideRef}
            className="absolute inset-0"
            options={{
              rewind: true,
              width: '50rem',
              gap: '1rem',
              arrows: false,
              perPage: 1,
              type: 'fade',
              breakpoints: {
                1024: {
                  width: '100%',
                },
              },
            }}
            aria-label="My Favorite Images"
          >
            <Slide img="slide-1.jpg" />
            <Slide img="slide-2.jpg" />
            <Slide img="slide-3.jpg" />
          </Splide>
          <div
            onClick={handleLeftClick}
            className="absolute inset-y-0 left-0 w-1/2 hidden lg:block"
            style={{ zIndex: 40003 }}
          ></div>
          <div
            onClick={handleRightClick}
            className="absolute inset-y-0 right-0 w-1/2 hidden lg:block"
            style={{ zIndex: 40003 }}
          ></div>
          {!isMobile && <CursorWithEffect />}
          {!isMobile && <HoverCarousel />}
        </div>
      </div>
    </CarouselProvider>
  )
}
