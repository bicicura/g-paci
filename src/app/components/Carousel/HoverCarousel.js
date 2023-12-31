import Image from 'next/image'
import { useContext } from 'react'
import { useHover } from '@/app/contexts/HoverContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { NavigationContext } from '@/app/contexts/NavigationContext'

const HoverCarousel = () => {
  const { isHovering, hoverItem } = useHover()
  const { links: data, loading } = useContext(NavigationContext)
  const { loading: workLoading } = useContext(CarouselContext)

  return (
    // Verificar si isHovering es true antes de renderizar la imagen
    <>
      {!loading &&
        !workLoading &&
        data.map(item => (
          <div
            key={item.id}
            className={`transition-opacity duration-500 ease-in-out opacity-0
            ${isHovering && item.id === hoverItem.id ? 'opacity-100' : ''}`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item?.slug}/${item?.works_images[0]?.img}`}
              alt="hero image"
              className={'absolute inset-0 bg-white w-full h-auto'}
              priority
              width="0"
              height="0"
              sizes="100vw"
              style={{ aspectRatio: '16 / 10', objectFit: 'contain' }}
            />
          </div>
        ))}
    </>
  )
}

export default HoverCarousel
