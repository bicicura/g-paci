const NavWorkBtn = props => {
  return (
    <div className="flex justify-between w-full lg:w-56">
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
        ✖
      </button>
    </div>
  )
}

export default NavWorkBtn
