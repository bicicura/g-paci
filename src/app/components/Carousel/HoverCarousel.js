import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { useHover } from '@/app/contexts/HoverContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'

const HoverCarousel = () => {
  const { isHovering, hoverItem } = useHover()
  const { data, loading } = useContext(CarouselContext)

  return (
    // Verificar si isHovering es true antes de renderizar la imagen
    <>
      {data !== null &&
        data.map(item => (
          <div
            key={item.id}
            className={`transition-opacity duration-500 ease-in-out h-full opacity-0 ${
              isHovering && item.id === hoverItem.id ? 'opacity-100' : ''
            }`}
          >
            <Image
              src={`/images/work/${item.slug}/slide-1.jpg`}
              alt="hero image"
              className={'absolute top-0 left-0 object-contain w-full h-full'}
              priority
              fill={true}
              sizes="50vw"
            />
          </div>
        ))}
    </>
  )
}

export default HoverCarousel
