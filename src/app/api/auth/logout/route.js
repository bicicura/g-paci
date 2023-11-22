import { serialize } from 'cookie'
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '../../../../../constants'

export async function GET() {
  // Setear el maxAge a -1 para invalidar la cookie
  const serialized = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Invalidar la cookie inmediatamente
    path: '/',
  })

  const response = {
    message: 'Sesión cerrada con éxito.',
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Set-Cookie': serialized },
  })
}
