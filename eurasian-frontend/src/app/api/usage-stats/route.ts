import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock usage statistics data
    const usageStats = {
      threatsBlocked: 1247,
      accountsProtected: 3,
      socialScans: 156,
      apiCalls: 2847,
      storageUsed: 2.3, // GB
      bandwidthUsed: 15.7, // GB
      period: {
        start: '2024-01-01',
        end: '2024-01-31'
      }
    }

    return NextResponse.json({
      success: true,
      usageStats
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}