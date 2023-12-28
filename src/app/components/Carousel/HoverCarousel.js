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
            style={{ maxHeight: '76vh' }}
            className={`transition-opacity h-full absolute inset-0 duration-500 ease-in-out opacity-0
            ${isHovering && item.id === hoverItem.id ? 'opacity-100' : ''}`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item?.slug}/${item?.works_images[0]?.img}`}
              alt="hero image"
              className={'bg-white w-full h-full object-contain'}
              priority
              width="1080"
              height="1000"
            />
          </div>
        ))}
    </>
  )
}

export default HoverCarousel
