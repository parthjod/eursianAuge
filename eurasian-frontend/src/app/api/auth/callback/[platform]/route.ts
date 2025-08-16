import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { prisma } from '../../../../../lib/db'

export async function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.redirect('/login')
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (!code) {
      return NextResponse.redirect('/dashboard/social?error=missing_code')
    }

    // For this demo, we'll simulate the OAuth flow
    // In a real implementation, you would exchange the code for tokens
    const { accessToken, refreshToken, expiresAt, userInfo } = await simulateOAuthExchange(params.platform, code)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.redirect('/dashboard/social?error=user_not_found')
    }

    // Store the social account connection
    await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId: user.id,
          platform: params.platform
        }
      },
      update: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        accountId: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        isActive: true,
        followers: userInfo.followers || 0,
        following: userInfo.following || 0,
        posts: userInfo.posts || 0
      },
      create: {
        userId: user.id,
        platform: params.platform,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        accountId: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        isActive: true,
        followers: userInfo.followers || 0,
        following: userInfo.following || 0,
        posts: userInfo.posts || 0
      }
    })

    // Log the connection event
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'oauth_callback_success',
        eventData: JSON.stringify({
          platform: params.platform,
          accountId: userInfo.id,
          username: userInfo.username
        })
      }
    })

    return NextResponse.redirect('/dashboard/social?success=true')
  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Log the error
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      
      if (user) {
        await prisma.analytics.create({
          data: {
            userId: user.id,
            eventType: 'oauth_callback_error',
            eventData: JSON.stringify({
              platform: params.platform,
              error: error instanceof Error ? error.message : String(error)
            })
          }
        })
      }
    }
    
    return NextResponse.redirect('/dashboard/social?error=true')
  }
}

// Simulated OAuth exchange function
// In a real implementation, this would make actual API calls to the OAuth providers
async function simulateOAuthExchange(platform: string, code: string): Promise<{
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  userInfo: {
    id: string
    username: string
    email?: string
    avatar?: string
    followers?: number
    following?: number
    posts?: number
  }
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate mock tokens and user info based on platform
  const mockUserInfo = {
    instagram: {
      id: `ig_${Math.random().toString(36).substr(2, 9)}`,
      username: 'instagram_user',
      email: 'user@instagram.com',
      avatar: 'https://via.placeholder.com/150',
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      posts: Math.floor(Math.random() * 500)
    },
    twitter: {
      id: `tw_${Math.random().toString(36).substr(2, 9)}`,
      username: 'twitter_user',
      email: 'user@twitter.com',
      avatar: 'https://via.placeholder.com/150',
      followers: Math.floor(Math.random() * 5000),
      following: Math.floor(Math.random() * 2000),
      posts: Math.floor(Math.random() * 10000)
    },
    facebook: {
      id: `fb_${Math.random().toString(36).substr(2, 9)}`,
      username: 'facebook_user',
      email: 'user@facebook.com',
      avatar: 'https://via.placeholder.com/150',
      followers: Math.floor(Math.random() * 500),
      following: Math.floor(Math.random() * 300),
      posts: Math.floor(Math.random() * 200)
    }
  }

  const userInfo = mockUserInfo[platform] || mockUserInfo.instagram

  return {
    accessToken: `mock_access_token_${Math.random().toString(36).substr(2, 32)}`,
    refreshToken: `mock_refresh_token_${Math.random().toString(36).substr(2, 32)}`,
    expiresAt: Date.now() + (3600 * 1000), // 1 hour from now
    userInfo
  }
}