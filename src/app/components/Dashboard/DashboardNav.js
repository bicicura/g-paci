'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from '@nextui-org/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

const DashboardNav = () => {
  const pathname = usePathname()

  // get last fragment from pathname
  const lastFragment = pathname.split('/').pop()

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-black">Gastón Paci</p>
      </NavbarBrand>
      {lastFragment !== 'login' && (
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
      )}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link
            href="/login"
            as={NextLink}
          >
            Log out
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default DashboardNav
