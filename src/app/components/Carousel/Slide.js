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
        style={{ maxHeight: '80vh', width: '100%' }}
        className={`transition-opacity w-full h-full mx-auto duration-500 ${
          props.index === 0 ? (firstImageLoaded ? 'opacity-100' : 'opacity-0') : ''
        }`}
      >
        {imageLoading && (
          <div className="inset-0 flex justify-center items-center w-full min-h-screen">
            <Spinner />
          </div>
        )}
        {item.slug && props.img && (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.slug}/${props.img}`}
            alt="hero image"
            priority
            width="1080"
            height="1000"
            className="w-full h-full object-contain"
            // antes esta línea no estaba, lo agregue para que no rompa todo si se suben imgs que no respeten el aspect ratio que necesitamos
            onLoad={() => handleImageLoad()}
          />
        )}
      </div>
    </SplideSlide>
  )
}
