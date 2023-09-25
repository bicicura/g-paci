'use client'

import Carousel from './components/Carousel/Carousel.js'

export default function Home() {
  return (
    <main className="text-xs">
      <header className="fixed top-0 left-0 flex justify-between w-full p-8">
        <div>Work</div>
        <div>Instagram</div>
      </header>
      <Carousel />
    </main>
  )
}
