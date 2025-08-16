import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

const OAUTH_CONFIGS = {
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
    scope: 'user_profile user_media',
    responseType: 'code'
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    clientId: process.env.TWITTER_CLIENT_ID || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`,
    scope: 'tweet.read users.read follows.read',
    responseType: 'code'
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`,
    scope: 'public_profile email',
    responseType: 'code'
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform } = await request.json()

    if (!OAUTH_CONFIGS[platform]) {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 })
    }

    const config = OAUTH_CONFIGS[platform]
    
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Build the OAuth URL
    const authUrl = new URL(config.authUrl)
    authUrl.searchParams.append('client_id', config.clientId)
    authUrl.searchParams.append('redirect_uri', config.redirectUri)
    authUrl.searchParams.append('scope', config.scope)
    authUrl.searchParams.append('response_type', config.responseType)
    authUrl.searchParams.append('state', state)

    // For demo purposes, we'll use our simulated callback
    // In production, you would return the real OAuth URL
    const demoCallbackUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/${platform}?code=demo_code_${platform}&state=${state}`

    return NextResponse.json({ 
      success: true, 
      authUrl: authUrl.toString(),
      demoCallbackUrl // For demo purposes
    })
  } catch (error) {
    console.error('Error initiating OAuth:', error)
    return NextResponse.json({ 
      error: 'Failed to initiate OAuth flow' 
    }, { status: 500 })
  }
}