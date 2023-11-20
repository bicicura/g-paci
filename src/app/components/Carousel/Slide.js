import Image from 'next/image'
import { SplideSlide } from '@splidejs/react-splide'
import { useContext, useState, useEffect } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'

export default function Splide(props) {
  const { data, loading, setImagesLoaded } = useContext(CarouselContext)
  const [item, setItem] = useState({})
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      setItem(data)
    }
  }, [pathname, data, loading])

  return (
    <SplideSlide>
      <div>
        {item && (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.slug}/${props.img}`}
            alt="hero image"
            priority
            width="0"
            onLoad={() => setImagesLoaded(true)} // Updated this line
            height="0"
            sizes="100vw"
            className="w-full h-auto"
          />
        )}
      </div>
    </SplideSlide>
  )
}
