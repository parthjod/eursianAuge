import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

// Plan configurations
const PLANS = {
  'first-tier': {
    price: 29.0,
    features: ['Basic threat monitoring', 'NLP-based detection', 'Weekly reports', 'Email alerts']
  },
  'second-tier': {
    price: 79.0,
    features: ['Everything from First tier', 'Phishing detection', 'URL scanning', 'Real-time alerts', 'Priority support']
  },
  'third-tier': {
    price: 149.0,
    features: ['Everything from First and Second tier', 'Advanced threat intelligence', 'Automated blocking', 'IP/Domain scanning', '24/7 dedicated support']
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

    const { plan, billingCycle } = await request.json()

    // Validate plan
    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Get user's current subscription
    const currentSubscription = await dbUtils.getUserSubscription(user.id)

    if (!currentSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    if (currentSubscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      )
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        plan,
        price: PLANS[plan as keyof typeof PLANS].price,
        billingCycle: billingCycle || currentSubscription.billingCycle,
        lastPaymentDate: new Date(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'subscription_updated',
        eventData: JSON.stringify({ 
          oldPlan: currentSubscription.plan,
          newPlan: plan,
          billingCycle: billingCycle || currentSubscription.billingCycle,
          price: PLANS[plan as keyof typeof PLANS].price
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: {
        ...updatedSubscription,
        features: PLANS[plan as keyof typeof PLANS].features
      }
    })

  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}