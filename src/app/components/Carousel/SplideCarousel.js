import { Splide } from '@splidejs/react-splide'
import Slide from './Slide'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SplideCarousel = props => {
  const { data, loading, setImagesLoaded, changeSlide } = useContext(CarouselContext)
  const [item, setItem] = useState({})
  const [vh, setVh] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && pathname !== '/') {
      console.log(data, 'data from Splide')
      setItem(data)
    } else if (!loading && pathname === '/') {
      const slug = 'overview'
      setItem(data.find(project => project.slug === slug))
    }
  }, [pathname, data, loading])

  useEffect(() => {
    const calculateVH = () => {
      setVh(window.innerHeight * 0.01)
    }

    calculateVH()

    const handleResize = () => {
      calculateVH()
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    vh && (
      <Splide
        ref={props.splideRef}
        className="absolute inset-0 xl:mx-auto"
        options={{
          rewind: true,
          gap: '1rem',
          arrows: false,
          perPage: 1,
          type: 'fade',
          breakpoints: {
            640: {
              width: `100%`,
            },
            768: {
              width: `100%`,
            },
            1024: {
              width: `${vh * 10}px`,
            },
            1280: {
              width: `${vh * 100}px`,
            },
            1536: {
              width: `${vh * 110}px`,
            },
            2000: {
              width: `${vh * 120}px`,
            },
          },
        }}
        aria-label="My Favorite Images"
      >
        {item.works_images &&
          item.works_images.map((image, index) => (
            <Slide
              key={image.img}
              slug={item.slug}
              img={image.img}
            />
          ))}

        {/* <Slide img="slide-1.jpg" />
        <Slide img="slide-2.jpg" />
        <Slide img="slide-3.jpg" /> */}
      </Splide>
    )
  )
}

export default SplideCarousel
