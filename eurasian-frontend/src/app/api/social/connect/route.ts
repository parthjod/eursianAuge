import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform, accessToken, refreshToken, expiresAt, accountId, username, email, avatar } = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or update social account
    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId: user.id,
          platform
        }
      },
      update: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        accountId,
        username,
        email,
        avatar,
        isActive: true
      },
      create: {
        userId: user.id,
        platform,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        accountId,
        username,
        email,
        avatar,
        isActive: true
      }
    })

    // Log the connection event
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'account_connected',
        eventData: JSON.stringify({
          platform,
          accountId,
          username
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      account: socialAccount 
    })
  } catch (error) {
    console.error('Error connecting social account:', error)
    return NextResponse.json({ 
      error: 'Failed to connect account' 
    }, { status: 500 })
  }
}