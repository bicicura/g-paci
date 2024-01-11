import { useRef, useEffect } from 'react'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos
import SplideCarousel from './SplideCarousel.js'
import HoverCarousel from './HoverCarousel'
import useMobileDetect from '@/app/hooks/useMobileDetect.js'
import CarouselBtns from './CarouselBtns.js'
import MobileIndex from './MobileIndex.js'
import '@splidejs/react-splide/css/core'

export default function Carousel() {
  const splideRef = useRef(null)
  const isMobile = useMobileDetect()

  const goBack = () => {
    if (splideRef.current && splideRef.current.splide) {
      const splide = splideRef.current.splide
      splide.go('<')
    }
  }

  const goNext = () => {
    if (splideRef.current && splideRef.current.splide) {
      const splide = splideRef.current.splide
      splide.go('>')
    }
  }

  return (
    <div
      // Z index es para que funcione bien el efecto slitscan
      style={{ zIndex: 1000 }}
      className={`${styles.customCursor} flex justify-center min-h-dvh lg:min-h-screen items-center w-full relative`}
    >
      {!isMobile && <CursorWithoutEffect />}
      <div className="relative overflow-hidden carousel-container bg-white">
        <SplideCarousel
          isMobile={isMobile}
          splideRef={splideRef}
        />
        <CarouselBtns
          goBack={() => goBack()}
          goNext={() => goNext()}
        />
        {!isMobile && <CursorWithEffect />}
        {!isMobile && <HoverCarousel />}
      </div>
      {isMobile && <MobileIndex />}
    </div>
  )
}
