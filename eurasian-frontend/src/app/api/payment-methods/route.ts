import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock payment methods data
    const paymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'card',
        brand: 'mastercard',
        last4: '5555',
        expMonth: 8,
        expYear: 2024,
        isDefault: false
      }
    ]

    return NextResponse.json({
      success: true,
      paymentMethods
    })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token } = await request.json()

    // Mock payment method creation
    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'card',
      brand: 'visa',
      last4: token.slice(-4),
      expMonth: new Date().getMonth() + 1,
      expYear: new Date().getFullYear() + 2,
      isDefault: false
    }

    return NextResponse.json({
      success: true,
      paymentMethod: newPaymentMethod,
      message: 'Payment method added successfully'
    })
  } catch (error) {
    console.error('Error adding payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}