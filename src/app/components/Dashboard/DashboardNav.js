'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from '@nextui-org/react'
import NextLink from 'next/link'

const DashboardNav = () => (
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
        <Link
          href="/dashboard"
          as={NextLink}
        >
          Log out
        </Link>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
)

export default DashboardNav
