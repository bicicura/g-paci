import Image from 'next/image'
import { useContext } from 'react'
import { useHover } from '@/app/contexts/HoverContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'

const HoverCarousel = () => {
  const { isHovering, hoverItem } = useHover()
  const { data, loading } = useContext(CarouselContext)

  return (
    // Verificar si isHovering es true antes de renderizar la imagen
    <div
      className={`transition-opacity duration-200 h-full ${
        isHovering ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {data !== null &&
        data.map(item => (
          <Image
            key={item.id}
            src={`/images/work/${hoverItem.slug}/slide-1.jpg`}
            alt="hero image"
            className={'absolute top-0 left-0 object-contain w-full h-full'}
            priority
            fill={true}
            sizes="50vw"
          />
        ))}
    </div>
  )
}

export default HoverCarousel
