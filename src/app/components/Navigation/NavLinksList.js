import Link from 'next/link'
import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useHover } from '@/app/contexts/HoverContext'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { NAV_SECTION_WORK } from '../../../../constants'

const NavLinksList = props => {
  const pathname = usePathname()
  const { setHoverItem, setIsHovering } = useHover()
  const { links, loading, isInfoActive, isWorkActive, toggleNavigation } =
    useContext(NavigationContext)

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
        isWorkActive
          ? 'opacity-100 translate-x-none'
          : '-translate-x-8 opacity-0 pointer-events-none'
      }
      ${
        isInfoActive ? '' : 'bg-white'
      } fixed -z-10 w-full lg:px-[40px] lg:backdrop-blur-lg lg:pb-6 pt-10 lg:pt-24 lg:w-[250px] lg:pl-[40px] pl-3 left-0 lg:pl-12 min-h-screen flex flex-col justify-between transition duration-200 ease-in-out`}
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
              onClick={() => toggleNavigation(NAV_SECTION_WORK)}
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
      <h6 className="text-xxs text-gray-400">© 2023 Gastón Paci</h6>
    </nav>
  )
}

export default NavLinksList
