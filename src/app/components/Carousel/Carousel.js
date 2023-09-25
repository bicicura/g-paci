import CarouselSlide from './CarouselSlide'

export default function Carousel() {
  const images = ['slide-1', 'slide-2', 'slide-3']

  return (
    <div className="flex justify-center w-full h-screen">
      <div className="relative w-[58rem] mx-auto">
        {images.map((imgName, index) => (
          <CarouselSlide
            key={index}
            img={imgName}
          />
        ))}
      </div>
    </div>
  )
}
