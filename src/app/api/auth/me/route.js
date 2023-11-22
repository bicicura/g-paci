import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '../../../../../constants'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export async function GET() {
  const cookieStore = cookies()

  const token = cookieStore.get(COOKIE_NAME)

  if (!token) {
    return NextResponse.json(
      {
        message: 'Unathorized',
      },
      {
        status: 401,
      }
    )
  }

  try {
    const { value } = token
    const secret = process.env.JWT_SECRET || ''

    verify(value, secret)

    const response = {
      message: 'Authorized',
    }

    return new Response(JSON.stringify(response), {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 400,
      }
    )
  }
}
