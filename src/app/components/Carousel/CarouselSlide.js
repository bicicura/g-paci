import { useState } from 'react'
import Image from 'next/image'

export default function CarouselSlide(props) {
  const [isActive, setIsActive] = useState(false)

  const toggleClass = () => {
    setIsActive(!isActive)
  }

  return (
    <div
      className={`${
        isActive ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-200`}
      onClick={toggleClass}
    >
      <Image
        src={'/images/' + props.img + '.jpg'}
        alt="hero image"
        className={'absolute top-0 left-0 object-contain w-full h-full'}
        priority
        fill={true}
        sizes="50vw"
      />
    </div>
  )
}
