import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check for session cookie
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({
        user: null
      })
    }

    // Parse the session cookie
    try {
      const user = JSON.parse(sessionCookie.value)
      return NextResponse.json({
        user
      })
    } catch (parseError) {
      // If parsing fails, clear the invalid cookie
      const response = NextResponse.json({
        user: null
      })
      response.cookies.delete('session')
      return response
    }

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}