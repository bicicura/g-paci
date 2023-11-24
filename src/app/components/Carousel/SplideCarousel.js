import { Splide } from '@splidejs/react-splide'
import Slide from './Slide'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SplideCarousel = props => {
  const { data, loading, changeSlide } = useContext(CarouselContext)
  const [item, setItem] = useState({})
  const [vh, setVh] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    const calculateVH = () => {
      setVh(window.innerHeight * 0.01)
    }

    // Calcula el valor inicial de vh cuando se monta el componente
    calculateVH()

    // Agrega el listener para actualizar vh cuando la ventana se redimensiona
    window.addEventListener('resize', calculateVH)

    // Limpia el listener cuando el componente se desmonta
    return () => window.removeEventListener('resize', calculateVH)
  }, []) // Sin dependencias, se ejecuta solo al montar y desmontar

  // carousel breakpoints
  const breakpoints = {
    640: {
      width: `100%`,
    },
    768: {
      width: `100%`,
    },
    1024: {
      width: `${vh * 100}px`,
    },
    1280: {
      width: `${vh * 107}px`,
    },
    1536: {
      width: `${vh * 117}px`,
    },
    2000: {
      width: `${vh * 126.5}px`,
    },
    3100: {
      width: `${vh * 131}px`,
    },
  }

  // 1280 -> dell vostro lab
  // 2000 -> mackbook 16'
  // 3000 -> samnsug de lio

  useEffect(() => {
    if (!loading) {
      setItem(data)
    }
  }, [pathname, data, loading])

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

  return loading ? (
    <div>
      <svg
        className="w-5 h-5 text-black animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
        ></circle>
        <path
          fill="currentColor"
          className="opacity-50"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  ) : vh !== null ? (
    <Splide
      ref={props.splideRef}
      className={`absolute inset-0 xl:mx-auto`}
      options={{
        rewind: true,
        gap: '1rem',
        arrows: false,
        perPage: 1,
        type: 'fade',
        width: '1200px',
        breakpoints,
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
  ) : (
    <div>
      <svg
        className="w-5 h-5 text-black animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
        ></circle>
        <path
          fill="currentColor"
          className="opacity-50"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}

export default SplideCarousel
