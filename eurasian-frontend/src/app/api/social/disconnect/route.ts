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

    const { platform } = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the social account before disconnecting
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user.id,
        platform
      }
    })

    if (!socialAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Deactivate social account
    await prisma.socialAccount.update({
      where: {
        id: socialAccount.id
      },
      data: {
        isActive: false,
        accessToken: null,
        refreshToken: null
      }
    })

    // Log the disconnection event
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'account_disconnected',
        eventData: JSON.stringify({
          platform,
          accountId: socialAccount.accountId,
          username: socialAccount.username
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting social account:', error)
    return NextResponse.json({ 
      error: 'Failed to disconnect account' 
    }, { status: 500 })
  }
}