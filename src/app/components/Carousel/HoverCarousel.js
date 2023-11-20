import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { useHover } from '@/app/contexts/HoverContext'
import { CarouselContext } from '@/app/contexts/CarouselContext'

const HoverCarousel = () => {
  const { isHovering, hoverItem } = useHover()
  const { loading } = useContext(CarouselContext)

  // @TODO: Obtener data de api | mock
  const data = [
    {
      title: 'Overview',
      slug: 'overview',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 1,
    },
    {
      title: 'L’Officiel',
      slug: 'l-officiel',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 2,
    },
    {
      title: 'The Ann Wagners',
      slug: 'the-ann-wagners',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 3,
    },
    {
      title: 'KOSTÜME',
      slug: 'kostume',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 4,
    },
    {
      title: 'Ossira',
      slug: 'ossira',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 5,
    },
  ]

  return (
    // Verificar si isHovering es true antes de renderizar la imagen
    <>
      {data !== null &&
        data.map(item => (
          <div
            key={item.id}
            className={`transition-opacity duration-500 ease-in-out h-full opacity-0
            ${isHovering && item.id === hoverItem.id ? 'opacity-100' : ''}`}
          >
            <Image
              src={`/images/work/${item.slug}/slide-1.jpg`}
              alt="hero image"
              className={'absolute inset-0 w-full '}
              priority
              width="0"
              height="0"
              sizes="100vw"
            />
          </div>
        ))}
    </>
  )
}

export default HoverCarousel
