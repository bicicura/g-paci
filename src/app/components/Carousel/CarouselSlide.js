import { useContext } from 'react'
import Image from 'next/image'
import { CarouselContext } from '@/app/contexts/CarouselContext'
import { usePathname } from 'next/navigation'

export default function CarouselSlide() {
  const { currentSlide, opacity, changeSlide } = useContext(CarouselContext)

  const pathname = usePathname()

  return (
    <>
      <div
        className={`transition-opacity duration-200 h-full`}
        style={{ opacity }}
      >
        <div
          className="h-full w-1/2 absolute left-0 z-10"
          onClick={() => changeSlide('previous')}
        ></div>
        <div
          className="h-full w-1/2 absolute right-0 z-10"
          onClick={() => changeSlide('next')}
        ></div>
        <Image
          src={`/images/work/overview/slide-${currentSlide}.jpg`}
          alt="hero image"
          className={'absolute top-0 left-0 object-contain w-full h-full'}
          priority
          fill={true}
          sizes="50vw"
        />
      </div>
    </>
  )
}
