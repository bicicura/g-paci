import Image from 'next/image'
import { SplideSlide } from '@splidejs/react-splide'

export default function Splide(props) {
  return (
    <SplideSlide>
      <div className="">
        <Image
          src={`/images/work/kostume/${props.img}`}
          alt="hero image"
          priority
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
    </SplideSlide>
  )
}
