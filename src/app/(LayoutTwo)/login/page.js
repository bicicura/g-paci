'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@nextui-org/react'

const Login = () => {
  return (
    <section className="w-max mx-auto  absolute inset-0 my-auto h-fit">
      <form className="space-y-6">
        <legend className="text-3xl text-default-700 font-bold">Dashboard</legend>
        <Input
          type="text"
          label="email"
          description="Ingrese un email válido."
          className="max-w-xs text-black"
        />
        <Input
          type="password"
          label="password"
          description="Ingrese la password."
          className="max-w-xs text-black"
        />

        <Link
          className="bg-black rounded-lg transtion-colors ease-in-out duration-200 shadow-sm hover:shadow-lg flex gap-2 hover:bg-default-100 hover:text-black transition-colors duration-500 text-white px-4 py-2 hover:underline text-center justify-center"
          href="/dashboard"
        >
          Log in
        </Link>
      </form>
    </section>
  )
}

export default Login
