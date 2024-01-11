import { useContext } from 'react'
import { NavigationContext } from '@/app/contexts/NavigationContext'
import { NAV_SECTION_WORK } from '../../../../constants'

const NavWorkBtn = props => {
  const { isWorkActive, toggleNavigation, isInfoActive } = useContext(NavigationContext)

  return (
    <div
      className={`${
        !isInfoActive ? 'lg:bg-white' : ''
      } flex justify-between items-center w-full lg:w-[250px] lg:px-[40px]`}
    >
      <button
        type="button"
        className={`${isWorkActive ? 'font-bold' : ''} cursor-pointer hover:font-bold`}
        onClick={() => toggleNavigation(NAV_SECTION_WORK)}
      >
        Work
      </button>
      <button
        onClick={() => toggleNavigation(NAV_SECTION_WORK)}
        className={`${
          isWorkActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity ease-in-out	duration-200`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3 h-3 xl:w-[12px] xl:h-[12px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

export default NavWorkBtn
