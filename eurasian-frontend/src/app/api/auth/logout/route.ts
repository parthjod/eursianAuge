import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create response and clear the session cookie
    const response = NextResponse.json({
      message: 'Logout successful'
    })

    // Clear the session cookie
    response.cookies.delete('session')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}