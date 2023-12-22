import Link from 'next/link'
import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useHover } from '@/app/contexts/HoverContext'
import { NavigationContext } from '@/app/contexts/NavigationContext'

const NavLinksList = props => {
  const pathname = usePathname()
  const { setHoverItem, setIsHovering } = useHover()
  const { links, loading, isInfoActive } = useContext(NavigationContext)

  const isActiveLink = slug => {
    if (slug === 'overview' && pathname === '/') {
      return true
    }
    const urlLastFragment = pathname.split('/').pop()
    return urlLastFragment === slug
  }

  return (
    <nav
      className={`${
        props.isWorkActive
          ? 'opacity-100 translate-x-none'
          : '-translate-x-8 opacity-0 pointer-events-none'
      }
      fixed w-full lg:px-[40px] lg:py-[33px] lg:w-[250px] left-0 pl-12 top-20 min-h-screen flex flex-col justify-between transition duration-200 ease-in-out lg:backdrop-blur-lg`}
      style={{ zIndex: 2000 }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="w-full">
          {links.map(link => (
            <li
              key={link.id}
              className={`hover:font-bold py-1 cursor-pointer ${
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
              <Link href={`/work/${link.slug}`}>{link.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <h6 className="mb-16 text-xs text-gray-400">© 2023 Gastón Paci</h6>
    </nav>
  )
}

export default NavLinksList
