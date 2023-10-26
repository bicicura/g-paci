const NavWorkBtn = props => {
  return (
    <div className="flex justify-between w-full lg:w-[250px] lg:px-[40px] lg:py-[33px]">
      <button
        type="button"
        className={`${
          props.isWorkActive ? 'font-bold' : ''
        } cursor-pointer hover:font-bold`}
        onClick={() => props.toggleNavigation()}
      >
        Work
      </button>
      <button
        onClick={() => props.toggleNavigation()}
        className={`${
          props.isWorkActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
