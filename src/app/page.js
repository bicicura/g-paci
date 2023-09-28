'use client'

import Carousel from './components/Carousel/Carousel.js'
import { useState } from 'react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)

  const toggleNavigation = () => {
    setIsActive(!isActive)
    console.log(isActive)
  }

  return (
    <main className="text-sm">
      <Carousel />
      <header className="fixed top-0 left-0 flex justify-between w-full p-12 bg-white">
        <div className="w-56 flex justify-between">
          <button
            type="button"
            className={`${
              isActive ? 'font-bold underline' : ''
            } cursor-pointer hover:underline hover:font-bold`}
            onClick={() => toggleNavigation()}
          >
            Work
          </button>
          <button
            onClick={() => toggleNavigation()}
            className={`${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } transition-opacity ease-in-out	duration-200`}
          >
            ✖
          </button>
        </div>
        <div className="cursor-pointer hover:underline hover:font-bold">Info +</div>
        <nav
          className={`${
            isActive
              ? 'opacity-100 translate-x-none'
              : '-translate-x-8 opacity-0 pointer-events-none'
          } fixed w-56 left-0 pl-12 top-28 h-full bg-white flex flex-col justify-between transition duration-200 ease-in-out`}
          style={{ zIndex: 2000 }}
        >
          <ul className="w-full space-y-2">
            <li className="hover:underline hover:font-bold cursor-pointer">Overview</li>
            <li className="font-bold hover:underline hover:font-bold cursor-pointer">
              L’Officiel
            </li>
            <li className="hover:underline hover:font-bold cursor-pointer">KOSTÜME</li>
            <li className="hover:underline hover:font-bold cursor-pointer">
              The Ann Wagners
            </li>
            <li className="hover:underline hover:font-bold cursor-pointer">Le Utthe</li>
          </ul>
          <h6 className="mb-32 text-xs text-gray-400">© 2023 Gastón Paci</h6>
        </nav>
      </header>
    </main>
  )
}
