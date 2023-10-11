'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const links = ['Overview', 'L’Officiel', 'The Ann Wagners', 'KOSTÜME', 'Le Utthe']
  const [isActive, setIsActive] = useState(false)

  const toggleNavigation = () => {
    setIsActive(!isActive)
  }

  const generateSlug = link => link.replaceAll(' ', '-').toLowerCase()

  const isActiveLink = link => {
    const slug = generateSlug(link)
    return pathname.includes(`/work/${slug}`)
  }

  return (
    <header
      className="fixed top-0 left-0 flex justify-between w-full p-12 bg-white"
      style={{
        zIndex: 9999,
      }}
    >
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
          {links.map((link, index) => (
            <li
              key={index}
              className={`hover:underline hover:font-bold cursor-pointer ${
                isActiveLink(link) ? 'font-bold' : ''
              }`}
            >
              <Link href={`/work/${generateSlug(link)}`}>{link}</Link>
            </li>
          ))}
        </ul>
        <h6 className="mb-32 text-xs text-gray-400">© 2023 Gastón Paci</h6>
      </nav>
    </header>
  )
}

export default Navbar
