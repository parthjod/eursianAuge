import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock billing history data
    const billingHistory = [
      {
        id: 'inv_1',
        date: '2024-01-15',
        amount: 149.00,
        status: 'paid',
        description: 'Third Tier Protection - Monthly',
        invoiceUrl: '#'
      },
      {
        id: 'inv_2',
        date: '2023-12-15',
        amount: 149.00,
        status: 'paid',
        description: 'Third Tier Protection - Monthly',
        invoiceUrl: '#'
      },
      {
        id: 'inv_3',
        date: '2023-11-15',
        amount: 79.00,
        status: 'paid',
        description: 'Second Tier Protection - Monthly',
        invoiceUrl: '#'
      }
    ]

    return NextResponse.json({
      success: true,
      billingHistory
    })
  } catch (error) {
    console.error('Error fetching billing history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}