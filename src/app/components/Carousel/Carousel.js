import { useRef, useEffect, useContext } from 'react'
import CursorWithEffect from '../CursorWithEffect.js'
import CursorWithoutEffect from '../CursorWithoutEffect'
import styles from './Carousel.module.css' // Importa el archivo de estilos
import SplideCarousel from './SplideCarousel.js'
import HoverCarousel from './HoverCarousel'
import useMobileDetect from '@/app/hooks/useMobileDetect.js'
import CarouselBtns from './CarouselBtns.js'
import { CarouselProvider } from '@/app/contexts/CarouselContext'
import MobileIndex from './MobileIndex.js'
import '@splidejs/react-splide/css/core'

export default function Carousel() {
  const splideRef = useRef()
  const isMobile = useMobileDetect()

  const goBack = () => {
    const splide = splideRef.current.splide
    splide.go('<')
  }

  const goNext = () => {
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
        } flex justify-center items-center w-full relative p-3 lg:p-0`}
      >
        {!isMobile && <CursorWithoutEffect />}
        <div className="relative overflow-hidden carousel-container">
          <SplideCarousel
            isMobile={isMobile}
            splideRef={splideRef}
          />
          <CarouselBtns
            goBack={goBack}
            goNext={goNext}
          />
          {!isMobile && <CursorWithEffect />}
          {!isMobile && <HoverCarousel />}
        </div>
        {isMobile && <MobileIndex />}
      </div>
    </CarouselProvider>
  )
}
