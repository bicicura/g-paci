import { serialize } from 'cookie'
import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { COOKIE_NAME, MAX_AGE } from '../../../../../constants'
import supabase from '../../../../../utils/supabaseClient'

export async function POST(request) {
  const body = await request.json()

  const { email, password } = body

  // @TODO: do it with db
  const { data, error } = await supabase
    .from('users')
    .select('password')
    .eq('email', email)
    .single()

  if (error || !data || !comparePasswords(password, data.password)) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  // always check this
  const secret = process.env.JWT_SECRET || ''

  const token = sign(
    {
      email,
    },
    secret,
    {
      expiresIn: MAX_AGE,
    }
  )

  const seralized = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  })

  const response = {
    message: 'Authenticated!',
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Set-Cookie': seralized },
  })
}

function comparePasswords(plainPassword, storedPassword) {
  return plainPassword === storedPassword
}
