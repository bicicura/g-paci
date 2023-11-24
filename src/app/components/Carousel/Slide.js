import Image from 'next/image'
import { SplideSlide } from '@splidejs/react-splide'
import { useContext, useState, useEffect } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'

export default function Splide(props) {
  const { data, loading, firstImageLoaded, setFirstImageLoaded, setImagesLoaded } =
    useContext(CarouselContext)
  const [item, setItem] = useState({})
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      setItem(data)
    }
  }, [pathname, data, loading])

  const handleImageLoad = () => {
    if (!firstImageLoaded && props.index === 0) {
      setFirstImageLoaded(true)
      console.log('se loadea la 1era!')
    }
    setImagesLoaded(true)
  }

  return (
    <SplideSlide>
      <div
        className={`transition-opacity duration-500 ${
          props.index === 0 ? (firstImageLoaded ? 'opacity-100' : 'opacity-0') : ''
        }`}
      >
        {item.slug && props.img && (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.slug}/${props.img}`}
            alt="hero image"
            priority
            width="0"
            onLoad={handleImageLoad}
            height="0"
            sizes="100vw"
            className="w-full h-auto"
          />
        )}
      </div>
    </SplideSlide>
  )
}
