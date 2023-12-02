'use client'

import Carousel from '../components/Carousel/Carousel'
import InteractiveImage from '../components/InteractiveImage.js'

export default function Home() {
  return (
    <main className="text-sm">
      {/* <Carousel /> */}
      <InteractiveImage imageUrl="/path/to/your/image.jpg" />
    </main>
  )
}
