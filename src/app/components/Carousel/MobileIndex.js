import { useState, useEffect, useRef, useContext } from 'react'
import { CarouselContext } from '../../contexts/CarouselContext'
import { usePathname } from 'next/navigation'

const MobileIndex = () => {
  const pathname = usePathname()
  const { currentSlide, data, loading } = useContext(CarouselContext)
  const [title, setTitle] = useState('Overview')

  useEffect(() => {
    if (!loading) {
      const slug = pathname.split('/').pop()
      setTitle(data ? data.name : 'Overview')
    }
  }, [pathname, data, loading])

  return (
    <>
      {!loading && (
        <span className="absolute bottom-16 left-0 mx-auto right-0 w-max">
          <b>{title}</b> {currentSlide}/{data?.works_images.length}
        </span>
      )}
    </>
  )
}

export default MobileIndex
