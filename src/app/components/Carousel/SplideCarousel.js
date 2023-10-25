import { Splide } from '@splidejs/react-splide'
import Slide from './Slide'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'

const SplideCarousel = props => {
  const setVH = () => {
    return window.innerHeight * 0.01
  }

  console.log(setVH() * 50, 'vh')

  const vh = setVH()

  const [isMobile, setIsMobile] = useState(false)

  const { changeSlide } = useContext(CarouselContext)

  useEffect(() => {
    if (props.isMobile) {
      const splide = props.splideRef.current.splide

      const onMoved = (newIndex, prevIndex) => {
        if (newIndex > prevIndex || (newIndex === 0 && prevIndex === splide.length - 1)) {
          changeSlide('next')
        } else {
          changeSlide('previous')
        }
      }

      splide.on('moved', onMoved)

      return () => {
        splide.off('moved', onMoved)
      }
    }
  }, [props.isMobile, props.splideRef, changeSlide])

  return (
    <Splide
      ref={props.splideRef}
      className="absolute inset-0 xl:mx-auto w-full border-2 border-blue-300"
      options={{
        rewind: true,
        gap: '1rem',
        arrows: false,
        perPage: 1,
        type: 'fade',
        width: `${vh * 110}px`,
        breakpoints: {
          640: {
            width: `${vh * 50}px`,
          },
          768: {
            width: `${vh * 60}px`,
          },
          1024: {
            width: `${vh * 10}px`,
          },
          1280: {
            width: `${vh * 107}px`,
          },
          1536: {
            width: `${vh * 110}px`,
          },
          2000: {
            width: `${vh * 125}px`,
          },
        },
      }}
      aria-label="My Favorite Images"
    >
      <Slide img="slide-1.jpg" />
      <Slide img="slide-2.jpg" />
      <Slide img="slide-3.jpg" />
    </Splide>
  )
}

export default SplideCarousel
