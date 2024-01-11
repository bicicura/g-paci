import { Splide } from '@splidejs/react-splide'
import Slide from './Slide'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Spinner from '../Spinner'

const SplideCarousel = props => {
  const { data, loading, changeSlide, firstImageLoaded } = useContext(CarouselContext)
  const [item, setItem] = useState({})
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      setItem(data)
    }
  }, [pathname, data, loading])

  // CREO QUE EL .CURRENT NUNCA VA A SER DEFINIDO, REVER EL IF
  useEffect(() => {
    if (props.isMobile && props.splideRef.current) {
      const splide = props.splideRef.current.splide

      if (!splide) {
        return // Sale del useEffect si splide no está definido
      }

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
      className={`absolute w-[80rem] inset-0 xl:mx-auto`}
      options={{
        rewind: true,
        gap: '1rem',
        arrows: false,
        perPage: 1,
        type: 'fade',
      }}
      aria-label="My Favorite Images"
    >
      {item.works_images &&
        item.works_images.map((image, index) => (
          <Slide
            key={image.img}
            slug={item.slug}
            img={image.img}
            index={index}
          />
        ))}
    </Splide>
  )
}

export default SplideCarousel
