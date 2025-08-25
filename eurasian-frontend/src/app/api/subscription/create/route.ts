import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { prisma } from '@/lib/db'

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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    })
    
    if (existingSubscription && existingSubscription.status === 'active') {
      // Update existing subscription instead of creating a new one
      const updatedSubscription = await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          plan,
          price: PLANS[plan as keyof typeof PLANS].price,
          billingCycle,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          lastPaymentDate: new Date(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      })

      // Log analytics event
      await prisma.analytics.create({
        data: {
          userId: user.id,
          eventType: 'subscription_updated',
          eventData: JSON.stringify({ plan, billingCycle, price: PLANS[plan as keyof typeof PLANS].price })
        }
      })

      return NextResponse.json({
        success: true,
        subscription: updatedSubscription
      })
    }

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month from now

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan,
        price: PLANS[plan as keyof typeof PLANS].price,
        billingCycle,
        status: 'active',
        startDate,
        endDate,
        lastPaymentDate: startDate,
        nextPaymentDate: endDate
      }
    })

    // Log analytics event
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'subscription_created',
        eventData: JSON.stringify({ plan, billingCycle, price: PLANS[plan as keyof typeof PLANS].price })
      }
    })

    return NextResponse.json({
      success: true,
      subscription
    })

  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}