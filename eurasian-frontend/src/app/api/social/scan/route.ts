import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

const SCAN_TYPES = ['quick', 'full', 'targeted']

// Simulated social media scanning logic
function generateMockScanResults(socialAccountId: string, scanType: string) {
  const baseThreats = Math.floor(Math.random() * 5) // 0-4 threats
  const blockedThreats = Math.floor(baseThreats * 0.8) // 80% blocked
  
  type Threat = {
    type: string
    severity: string
    description: string
    confidence: number
  }
  const threats: Threat[] = []
  const threatTypes = ['phishing', 'spam', 'suspicious_activity', 'fake_profile']
  
  for (let i = 0; i < baseThreats; i++) {
    threats.push({
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      description: `Simulated threat ${i + 1} detected during ${scanType} scan`,
      confidence: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
    })
  }

  return {
    threatsFound: baseThreats,
    threatsBlocked: blockedThreats,
    scanDuration: Math.floor(Math.random() * 30) + 10, // 10-40 seconds
    threats,
    metadata: {
      scanType,
      timestamp: new Date().toISOString(),
      scanDepth: scanType === 'quick' ? 'basic' : scanType === 'full' ? 'comprehensive' : 'focused',
      areasScanned: [
        'profile_security',
        'message_content',
        'connection_network',
        'posting_patterns'
      ]
    }
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

    const { socialAccountId, scanType = 'quick' } = await request.json()

    // Validate input
    if (!socialAccountId) {
      return NextResponse.json(
        { error: 'Social account ID is required' },
        { status: 400 }
      )
    }

    if (!SCAN_TYPES.includes(scanType)) {
      return NextResponse.json(
        { error: 'Invalid scan type' },
        { status: 400 }
      )
    }

    // Get the social account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: { 
        id: socialAccountId,
        userId: user.id 
      }
    })

    if (!socialAccount) {
      return NextResponse.json(
        { error: 'Social account not found or access denied' },
        { status: 404 }
      )
    }

    if (!socialAccount.isActive) {
      return NextResponse.json(
        { error: 'Social account is not active' },
        { status: 400 }
      )
    }

    // Create scan record
    const scan = await dbUtils.createSocialScan({
      socialAccountId,
      scanType
    })

    // Update scan status to running
    await dbUtils.updateSocialScan(scan.id, {
      status: 'running'
    })

    // Simulate scanning delay (in real implementation, this would be async)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock scan results
    const scanResults = generateMockScanResults(socialAccountId, scanType)

    // Create threats if any were found
    const createdThreats: Array<{
      status: string
      id: string
      createdAt: Date
      updatedAt: Date
      userId: string
      socialAccountId: string | null
      type: string
      severity: string
      description: string
      source: string | null
      actionTaken: string | null
      confidence: number | null
      metadata: string | null
    }> = []
    for (const threat of scanResults.threats) {
      const createdThreat = await dbUtils.createThreat({
        userId: user.id,
        socialAccountId,
        type: threat.type,
        severity: threat.severity,
        description: threat.description,
        confidence: threat.confidence,
        metadata: JSON.stringify({
          scanId: scan.id,
          scanType,
          detectedAt: new Date().toISOString()
        })
      })
      createdThreats.push(createdThreat)
    }

    // Update scan record with results
    await dbUtils.updateSocialScan(scan.id, {
      status: 'completed',
      threatsFound: scanResults.threatsFound,
      threatsBlocked: scanResults.threatsBlocked,
      duration: scanResults.scanDuration,
      metadata: JSON.stringify(scanResults)
    })

    // Update social account threat count and last scanned time
    await prisma.socialAccount.update({
      where: { id: socialAccountId },
      data: {
        threatCount: socialAccount.threatCount + scanResults.threatsFound,
        lastScanned: new Date()
      }
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'social_scan_completed',
        eventData: JSON.stringify({ 
          platform: socialAccount.platform,
          scanType,
          threatsFound: scanResults.threatsFound,
          threatsBlocked: scanResults.threatsBlocked,
          duration: scanResults.scanDuration
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Social media scan completed successfully',
      scan: {
        id: scan.id,
        status: 'completed',
        scanType,
        threatsFound: scanResults.threatsFound,
        threatsBlocked: scanResults.threatsBlocked,
        duration: scanResults.scanDuration,
        threats: createdThreats
      }
    })

  } catch (error) {
    console.error('Social media scan error:', error)
    
    // If scan was created, update it to failed status
    try {
      const { socialAccountId } = await request.json()
      const user = JSON.parse(request.cookies.get('session')?.value || '{}')
      
      // Find the running scan and mark it as failed
      const runningScan = await prisma.socialScan.findFirst({
        where: {
          socialAccountId,
          status: 'running'
        },
        orderBy: { createdAt: 'desc' }
      })
      
      if (runningScan) {
        await dbUtils.updateSocialScan(runningScan.id, {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    } catch (updateError) {
      console.error('Failed to update scan status:', updateError)
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get scan history for a social account
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const socialAccountId = searchParams.get('socialAccountId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!socialAccountId) {
      return NextResponse.json(
        { error: 'Social account ID is required' },
        { status: 400 }
      )
    }

    // Verify the social account belongs to the user
    const socialAccount = await prisma.socialAccount.findFirst({
      where: { 
        id: socialAccountId,
        userId: user.id 
      }
    })

    if (!socialAccount) {
      return NextResponse.json(
        { error: 'Social account not found or access denied' },
        { status: 404 }
      )
    }

    // Get scan history
    const scans = await prisma.socialScan.findMany({
      where: { socialAccountId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Get scan statistics
    const totalScans = await prisma.socialScan.count({
      where: { socialAccountId }
    })

    const completedScans = await prisma.socialScan.count({
      where: { 
        socialAccountId,
        status: 'completed'
      }
    })

    const totalThreatsFound = await prisma.socialScan.aggregate({
      where: { 
        socialAccountId,
        status: 'completed'
      },
      _sum: {
        threatsFound: true
      }
    })

    const totalThreatsBlocked = await prisma.socialScan.aggregate({
      where: { 
        socialAccountId,
        status: 'completed'
      },
      _sum: {
        threatsBlocked: true
      }
    })

    return NextResponse.json({
      scans,
      statistics: {
        totalScans,
        completedScans,
        failedScans: totalScans - completedScans,
        totalThreatsFound: totalThreatsFound._sum.threatsFound || 0,
        totalThreatsBlocked: totalThreatsBlocked._sum.threatsBlocked || 0,
        averageScanDuration: scans.length > 0 
          ? Math.round(scans.reduce((sum, scan) => sum + (scan.duration || 0), 0) / scans.length)
          : 0
      }
    })

  } catch (error) {
    console.error('Scan history retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}