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
      const item = data.find(project => project.slug === slug)
      setTitle(item ? item.title : 'Overview')
    }
  }, [pathname, data, loading])

  return (
    <span className="absolute bottom-16 left-0 mx-auto right-0 w-max">
      <b>{title}</b> {currentSlide}/3
    </span>
  )
}

export default MobileIndex
