'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react'

const DashboardNav = () => (
  <Navbar>
    <NavbarBrand>
      <p className="font-bold text-inherit">Gastón Paci</p>
    </NavbarBrand>
    <NavbarContent
      className="hidden gap-4 sm:flex"
      justify="center"
    >
      <NavbarItem isActive>
        <Link
          href="/proyectos"
          aria-current="page"
        >
          Work
        </Link>
      </NavbarItem>
    </NavbarContent>
    <NavbarContent justify="end">
      <NavbarItem className="hidden lg:flex">
        <Link href="#">Log out</Link>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
)

export default DashboardNav
