'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from '@nextui-org/react'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const DashboardNav = () => {
  const pathname = usePathname()
  const { push } = useRouter()

  // get last fragment from pathname
  const lastFragment = pathname.split('/').pop()

  const handleLogOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET', // o 'POST' según como hayas configurado tu servidor
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        push('/login')
      } else {
        console.error('Error al cerrar sesión:', data.message)
      }
    } catch (error) {
      console.error('Error de conexión al cerrar sesión:', error)
    }
  }

  return (
    <>
      {lastFragment !== 'login' && (
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-black">Gastón Paci</p>
          </NavbarBrand>

          <NavbarContent
            className="hidden gap-4 sm:flex"
            justify="center"
          >
            <NavbarItem isActive>
              <Link
                href="/dashboard"
                as={NextLink}
              >
                Dashboard
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <button
                className="text-black hover:font-bold"
                type="button"
                onClick={() => handleLogOut()}
              >
                Log out
              </button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )}
    </>
  )
}

export default DashboardNav
