import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useHover } from '@/app/contexts/HoverContext'

const NavLinksList = props => {
  const isActiveLink = slug =>
    slug === 'overview' && pathname === '/' ? true : pathname.includes(`/work/${slug}`)
  const [links, setLinks] = useState([])
  const pathname = usePathname()
  const { setHoverItem, setIsHovering } = useHover()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/work')
      const data = await res.json()
      setLinks(data)
    })()
  }, [])

  return (
    <nav
      className={`${
        props.isWorkActive
          ? 'opacity-100 translate-x-none'
          : '-translate-x-8 opacity-0 pointer-events-none'
      } fixed w-full lg:w-56 left-0 pl-12 top-20 h-full bg-white flex flex-col justify-between transition duration-200 ease-in-out`}
      style={{ zIndex: 2000 }}
    >
      <ul className="w-full space-y-2">
        {links.map(link => (
          <li
            key={link.id}
            className={`hover:font-bold cursor-pointer ${
              isActiveLink(link.slug) ? 'font-bold' : ''
            }`}
            onClick={() => props.toggleNavigation()}
            onMouseEnter={() => {
              setHoverItem(link)
              setIsHovering(true) // Setear isHovering a true
            }}
            onMouseLeave={() => {
              setIsHovering(false) // Setear isHovering a false
            }}
          >
            <Link href={`/work/${link.slug}`}>{link.title}</Link>
          </li>
        ))}
      </ul>
      <h6 className="mb-32 text-xs text-gray-400">© 2023 Gastón Paci</h6>
    </nav>
  )
}

export default NavLinksList
