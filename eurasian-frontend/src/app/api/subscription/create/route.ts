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

    const { plan, billingCycle = 'monthly' } = await request.json()

    // Validate plan
    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription
    const existingSubscription = await dbUtils.getUserSubscription(user.id)
    
    if (existingSubscription && existingSubscription.status === 'active') {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 409 }
      )
    }

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month from now

    // Create subscription
    const subscription = await dbUtils.createSubscription({
      userId: user.id,
      plan,
      price: PLANS[plan as keyof typeof PLANS].price,
      billingCycle,
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'subscription_created',
        eventData: JSON.stringify({ plan, billingCycle, price: PLANS[plan as keyof typeof PLANS].price }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        ...subscription,
        features: PLANS[plan as keyof typeof PLANS].features
      }
    })

  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    // Get user's subscription
    const subscription = await dbUtils.getUserSubscription(user.id)

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        plans: PLANS
      })
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        features: PLANS[subscription.plan as keyof typeof PLANS]?.features || []
      },
      plans: PLANS
    })

  } catch (error) {
    console.error('Subscription retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}