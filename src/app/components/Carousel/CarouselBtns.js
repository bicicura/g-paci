import { useContext } from 'react'
import { CarouselContext } from '@/app/contexts/CarouselContext'

const CarouselBtns = props => {
  const { changeSlide } = useContext(CarouselContext)

  const handleGoBack = () => {
    changeSlide('previous')
    props.goBack()
  }

  const handleGoNext = () => {
    changeSlide('next')
    props.goNext()
  }

  return (
    <>
      <div
        onClick={handleGoBack}
        className="absolute inset-y-0 left-0 w-1/2 hidden lg:block"
        style={{ zIndex: 40003 }}
      ></div>
      <div
        onClick={handleGoNext}
        className="absolute inset-y-0 right-0 w-1/2 hidden lg:block"
        style={{ zIndex: 40003 }}
      ></div>
    </>
  )
}

export default CarouselBtns
