const NavInfoSection = props => {
  return (
    <div
      className={`${
        props.isInfoActive
          ? 'opacity-100 translate-x-none'
          : 'translate-x-8 opacity-0 pointer-events-none'
      } fixed w-56 right-0 top-20 lg:h-full bg-white flex flex-col transition duration-200 ease-in-out`}
      style={{ zIndex: 2000 }}
    >
      <p className="cursor-pointer hover:font-bold">
        <a href="mailto:gastonpaci@gmail.com">gastonpaci@gmail.com</a>
      </p>

      <div className="w-12 mt-2 border-t border-gray-400"></div>

      <p className="mt-2 text-xs text-gray-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  )
}

export default NavInfoSection
