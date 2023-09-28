import { useState } from 'react'
import Image from 'next/image'

export default function CarouselSlide(props) {
  const images = ['slide-1', 'slide-2', 'slide-3']
  const [counter, setCounter] = useState(0)
  const [opacity, setOpacity] = useState(1)

  const increment = () => {
    setOpacity(0)
    setTimeout(() => {
      if (counter === images.length - 1) {
        setCounter(0)
      } else {
        setCounter(counter + 1)
      }
      setOpacity(1)
    }, 200) // Asume una transición de 200ms
  }

  const decrement = () => {
    setOpacity(0)
    setTimeout(() => {
      if (counter === 0) {
        setCounter(images.length - 1)
      } else {
        setCounter(counter - 1)
      }
      setOpacity(1)
    }, 200) // Asume una transición de 200ms
  }

  return (
    <>
      <div
        className={`transition-opacity duration-200 h-full`}
        style={{ opacity }}
      >
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
