import { useState } from 'react'
import Image from 'next/image'

export default function CarouselSlide(props) {
  const [isActive, setIsActive] = useState(false)
  const images = ['slide-1', 'slide-2', 'slide-3']

  const [counter, setCounter] = useState(0)

  const increment = () => {
    if (counter === images.length - 1) {
      return setCounter(0)
    }

    setCounter(counter + 1)
  }

  const decrement = () => {
    if (counter === 0) {
      return setCounter(images.length - 1)
    }

    setCounter(counter - 1)
  }

  const toggleClass = () => {
    setIsActive(!isActive)
  }

  return (
    <>
      <div className={`transition-opacity duration-200 h-full`}>
        <div
          className="h-full w-1/2 absolute left-0 z-10"
          onClick={() => decrement()}
        ></div>
        <div
          className="h-full w-1/2 absolute right-0 z-10"
          onClick={() => increment()}
        ></div>
        <Image
          src={'/images/' + images[counter] + '.jpg'}
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
