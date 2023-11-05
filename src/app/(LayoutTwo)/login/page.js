'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@nextui-org/react'

const Login = () => {
  return (
    <section className="absolute inset-0 mx-auto my-auto w-max h-fit">
      <form className="space-y-6">
        <legend className="text-3xl font-bold text-default-700">Dashboard</legend>
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
          className="flex justify-center gap-2 px-4 py-2 text-center text-white transition-colors duration-200 ease-in-out bg-black rounded-lg shadow-sm transtion-colors hover:shadow-lg hover:bg-default-100 hover:text-black hover:underline"
          href="/dashboard"
        >
          Log in
        </Link>
      </form>
    </section>
  )
}

export default Login
