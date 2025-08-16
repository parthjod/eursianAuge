import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

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

    // Get user's subscription
    const subscription = await dbUtils.getUserSubscription(user.id)

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      )
    }

    // Update subscription status to cancelled
    const updatedSubscription = await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: 'cancelled',
        endDate: new Date()
      }
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'subscription_cancelled',
        eventData: JSON.stringify({ 
          plan: subscription.plan,
          cancelledAt: new Date().toISOString()
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription: updatedSubscription
    })

  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}