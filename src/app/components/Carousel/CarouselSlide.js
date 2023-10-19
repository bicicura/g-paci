import { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'

export default function CarouselSlide() {
  const { currentSlide, opacity, changeSlide, data, loading } =
    useContext(CarouselContext)

  const pathname = usePathname()
  const [item, setItem] = useState()

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
    <>
      <div
        className={`transition-opacity ease-in-out duration-500 h-full opacity-0 ${
          item ? 'opacity-100' : ''
        }`}
        style={{ opacity }}
      >
        {item && (
          <>
            <div
              className="absolute left-0 z-10 w-1/2 h-full"
              onClick={() => changeSlide('previous')}
            ></div>
            <div
              className="absolute right-0 z-10 w-1/2 h-full"
              onClick={() => changeSlide('next')}
            ></div>
            <Image
              src={`/images/work/${item.slug}/${props.img}`}
              alt="hero image"
              className={'absolute top-0 left-0 object-contain w-full h-full'}
              priority
              fill={true}
              sizes="50vw"
            />
          </>
        )}
      </div>
    </>
  )
}
