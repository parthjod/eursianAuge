import { NextRequest, NextResponse } from 'next/server'
import { dbUtils } from '@/lib/db'

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
      
      // Validate that we have the required user data
      if (!user.id || !user.email) {
        throw new Error('Invalid session data')
      }

      // Get fresh user data from database
      const freshUser = await dbUtils.getUserById(user.id)
      
      if (!freshUser) {
        throw new Error('User not found')
      }

      return NextResponse.json({
        user: freshUser
      })
    } catch (parseError) {
      console.error('Session parsing error:', parseError)
      
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