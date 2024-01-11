import Image from 'next/image'
import { SplideSlide } from '@splidejs/react-splide'
import { useContext, useState, useEffect } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'
import Spinner from '../Spinner'

export default function Splide(props) {
  const { data, loading, firstImageLoaded, setFirstImageLoaded, setImagesLoaded } =
    useContext(CarouselContext)
  const [item, setItem] = useState({})
  const pathname = usePathname()
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      setItem(data)
    }
  }, [pathname, data, loading])

  const handleImageLoad = () => {
    setImageLoading(false)
    if (!firstImageLoaded && props.index === 0) {
      setFirstImageLoaded(true)
    }
    setImagesLoaded(true)
  }

  return (
    <SplideSlide>
      <div
        style={{ maxHeight: '80vh', width: '100%', height: '80vh' }}
        className={`w-full relative h-full mx-auto`}
      >
        {imageLoading && (
          <div className="flex justify-center items-center w-full h-full">
            <Spinner />
          </div>
        )}
        {item.slug && props.img && (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.slug}/${props.img}`}
            alt={`Picture from ${item.title} by Gastón Paci`}
            priority
            fill
            sizes="70vw"
            className={`w-full transition-opacity duration-500 h-full object-contain object-center ${
              props.index === 0 ? (firstImageLoaded ? 'opacity-100' : 'opacity-0') : ''
            }`}
            onLoad={() => handleImageLoad()}
          />
        )}
      </div>
    </SplideSlide>
  )
}
