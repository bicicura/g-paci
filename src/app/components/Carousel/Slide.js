import Image from 'next/image'
import { SplideSlide } from '@splidejs/react-splide'
import { useContext, useState, useEffect } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'

export default function Splide(props) {
  const { data, loading, setImagesLoaded } = useContext(CarouselContext)
  const [item, setItem] = useState()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && pathname !== '/') {
      const slug = pathname.split('/').pop()
      setItem(data.find(project => project.slug === slug))
    } else if (!loading && pathname === '/') {
      const slug = 'overview'
      setItem(data.find(project => project.slug === slug))
    }
  }, [pathname, data, loading])

  return (
    <SplideSlide>
      <div>
        {item && (
          <Image
            src={`/images/work/${item.slug}/${props.img}`}
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
