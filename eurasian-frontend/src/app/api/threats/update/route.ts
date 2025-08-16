import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

const VALID_STATUSES = ['detected', 'investigating', 'blocked', 'resolved', 'false_positive']
const VALID_ACTIONS = ['blocked', 'reported', 'ignored', 'monitored']

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

    const { threatId, status, actionTaken } = await request.json()

    if (!threatId) {
      return NextResponse.json(
        { error: 'Threat ID is required' },
        { status: 400 }
      )
    }

    // Get the threat
    const existingThreat = await prisma.threat.findFirst({
      where: { 
        id: threatId,
        userId: user.id 
      }
    })

    if (!existingThreat) {
      return NextResponse.json(
        { error: 'Threat not found or access denied' },
        { status: 404 }
      )
    }

    // Validate status and action
    const updateData: any = {}
    
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (actionTaken) {
      if (!VALID_ACTIONS.includes(actionTaken)) {
        return NextResponse.json(
          { error: 'Invalid action value' },
          { status: 400 }
        )
      }
      updateData.actionTaken = actionTaken
    }

    // Update the threat
    const updatedThreat = await prisma.threat.update({
      where: { id: threatId },
      data: updateData
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'threat_updated',
        eventData: JSON.stringify({ 
          threatId,
          oldStatus: existingThreat.status,
          newStatus: status || existingThreat.status,
          actionTaken: actionTaken || existingThreat.actionTaken
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Threat updated successfully',
      threat: updatedThreat
    })

  } catch (error) {
    console.error('Threat update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Bulk threat update endpoint
export async function PUT(request: NextRequest) {
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

    const { threatIds, status, actionTaken } = await request.json()

    if (!threatIds || !Array.isArray(threatIds) || threatIds.length === 0) {
      return NextResponse.json(
        { error: 'Threat IDs array is required' },
        { status: 400 }
      )
    }

    // Validate status and action
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    if (actionTaken && !VALID_ACTIONS.includes(actionTaken)) {
      return NextResponse.json(
        { error: 'Invalid action value' },
        { status: 400 }
      )
    }

    // Update multiple threats
    const updateData: any = {}
    if (status) updateData.status = status
    if (actionTaken) updateData.actionTaken = actionTaken

    const updateResult = await prisma.threat.updateMany({
      where: { 
        id: { in: threatIds },
        userId: user.id
      },
      data: updateData
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'threat_bulk_updated',
        eventData: JSON.stringify({ 
          threatCount: threatIds.length,
          status,
          actionTaken
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: `${updateResult.count} threats updated successfully`,
      updatedCount: updateResult.count
    })

  } catch (error) {
    console.error('Bulk threat update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}