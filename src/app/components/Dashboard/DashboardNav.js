'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Tooltip,
} from '@nextui-org/react'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const DashboardNav = () => {
  const pathname = usePathname()
  const { push } = useRouter()
  const [activeNavItem, setActiveNavItem] = useState('works')

  const handleActiveNavItem = navItem => {
    setActiveNavItem(navItem)
  }

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
        <Navbar className="dashboard-nav">
          <NavbarBrand>
            <p className="font-bold text-slate-400">Gastón Paci</p>
          </NavbarBrand>

          <NavbarContent
            className="hidden gap-8 sm:flex"
            justify="center"
          >
            <NavbarItem
              className="min-w-fit w-12"
              isActive={activeNavItem === 'home' ? true : false}
            >
              <Link
                onClick={() => handleActiveNavItem('home')}
                className={`${
                  activeNavItem === 'home' ? 'text-slate-800' : 'text-slate-400'
                } hover:text-slate-800 hover:font-bold`}
                href="/dashboard/home"
                as={NextLink}
              >
                Home
              </Link>
            </NavbarItem>
            <NavbarItem
              className="min-w-fit w-14"
              isActive={activeNavItem === 'works' ? true : false}
            >
              <Link
                onClick={() => handleActiveNavItem('works')}
                className={`${
                  activeNavItem === 'works' ? 'text-slate-800' : 'text-slate-400'
                } hover:text-slate-800 hover:font-bold`}
                href="/dashboard"
                as={NextLink}
              >
                Works
              </Link>
            </NavbarItem>

            <NavbarItem
              className="min-w-fit w-8"
              isActive={activeNavItem === 'info' ? true : false}
            >
              <Link
                onClick={() => handleActiveNavItem('info')}
                className={`${
                  activeNavItem === 'info' ? 'text-slate-800' : 'text-slate-400'
                } hover:text-slate-800 hover:font-bold`}
                href="/dashboard/info"
                as={NextLink}
              >
                Info
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Tooltip
                content="Log out"
                className="text-red-400"
              >
                <button
                  className="text-red-400 hover:font-bold"
                  type="button"
                  onClick={() => handleLogOut()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>
                </button>
              </Tooltip>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )}
    </>
  )
}

export default DashboardNav
