import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

const VALID_PLATFORMS = ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok']

// Simulated OAuth integration data
const OAUTH_CONFIGS = {
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media'],
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'mock_instagram_client_id'
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'users.read', 'follows.read'],
    clientId: process.env.TWITTER_CLIENT_ID || 'mock_twitter_client_id'
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['public_profile', 'pages_read_engagement'],
    clientId: process.env.FACEBOOK_CLIENT_ID || 'mock_facebook_client_id'
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'r_emailaddress'],
    clientId: process.env.LINKEDIN_CLIENT_ID || 'mock_linkedin_client_id'
  },
  tiktok: {
    authUrl: 'https://open-api.tiktok.com/platform/oauth/connect/',
    scopes: ['user.info.basic', 'video.list'],
    clientId: process.env.TIKTOK_CLIENT_ID || 'mock_tiktok_client_id'
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from session cookie
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let user
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get user's social accounts
    const socialAccounts = await dbUtils.getUserSocialAccounts(user.id)

    return NextResponse.json({
      socialAccounts,
      platforms: VALID_PLATFORMS.map(platform => ({
        platform,
        connected: socialAccounts.some(acc => acc.platform === platform && acc.isActive),
        config: {
          authUrl: OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS]?.authUrl,
          scopes: OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS]?.scopes
        }
      }))
    })

  } catch (error) {
    console.error('Social accounts retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from session cookie
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let user
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { platform, accountId, username, accessToken, refreshToken } = await request.json()

    // Validate input
    if (!platform || !accountId) {
      return NextResponse.json(
        { error: 'Platform and account ID are required' },
        { status: 400 }
      )
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user.id,
        platform,
        accountId
      }
    })

    if (existingAccount) {
      // Update existing account
      const updatedAccount = await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          username,
          accessToken,
          refreshToken,
          isActive: true
        }
      })

      // Log analytics event
      try {
        await dbUtils.logAnalytics({
          userId: user.id,
          eventType: 'social_account_reconnected',
          eventData: JSON.stringify({ platform, accountId }),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        })
      } catch (analyticsError) {
        console.error('Failed to log analytics:', analyticsError)
      }

      return NextResponse.json({
        message: 'Social account reconnected successfully',
        socialAccount: updatedAccount
      })
    }

    // Create new social account
    const socialAccount = await dbUtils.createSocialAccount({
      userId: user.id,
      platform,
      accountId,
      username,
      accessToken,
      refreshToken
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'social_account_connected',
        eventData: JSON.stringify({ platform, accountId }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Social account connected successfully',
      socialAccount
    })

  } catch (error) {
    console.error('Social account connection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user from session cookie
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let user
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { socialAccountId } = await request.json()

    if (!socialAccountId) {
      return NextResponse.json(
        { error: 'Social account ID is required' },
        { status: 400 }
      )
    }

    // Get the social account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: { 
        id: socialAccountId,
        userId: user.id 
      }
    })

    if (!socialAccount) {
      return NextResponse.json(
        { error: 'Social account not found or access denied' },
        { status: 404 }
      )
    }

    // Deactivate the social account (soft delete)
    const updatedAccount = await prisma.socialAccount.update({
      where: { id: socialAccountId },
      data: {
        isActive: false,
        accessToken: null,
        refreshToken: null
      }
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'social_account_disconnected',
        eventData: JSON.stringify({ 
          platform: socialAccount.platform,
          accountId: socialAccount.accountId
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Social account disconnected successfully',
      socialAccount: updatedAccount
    })

  } catch (error) {
    console.error('Social account disconnection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}