import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

// Threat types and severities
const THREAT_TYPES = [
  'phishing',
  'malware',
  'suspicious_activity',
  'fake_profile',
  'harassment',
  'spam',
  'impersonation',
  'data_breach',
  'account_takeover'
]

const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical']

const STATUSES = ['detected', 'investigating', 'blocked', 'resolved', 'false_positive']

const ACTIONS = ['blocked', 'reported', 'ignored', 'monitored']

// Simulated threat detection logic
function generateMockThreat(userId: string, socialAccountId?: string) {
  const threatTypes = THREAT_TYPES.filter(type => {
    // Filter based on subscription tier (simplified logic)
    return Math.random() > 0.3 // 70% chance for any threat type
  })

  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
  const severity = SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)]
  
  const descriptions = {
    phishing: [
      'Suspicious link detected in direct message',
      'Fake login page attempting to steal credentials',
      'Phishing email targeting account credentials'
    ],
    malware: [
      'Malicious file attachment detected',
      'Suspicious download link identified',
      'Potential malware in shared content'
    ],
    suspicious_activity: [
      'Unusual login attempt from new location',
      'Multiple failed login attempts detected',
      'Suspicious account behavior pattern'
    ],
    fake_profile: [
      'Fake profile impersonating user',
      'Bot account detected following user',
      'Suspicious account creation pattern'
    ],
    harassment: [
      'Harassing messages detected',
      'Bullying content identified',
      'Threatening language in comments'
    ],
    spam: [
      'Spam messages detected in inbox',
      'Unsolicited promotional content',
      'Mass messaging pattern identified'
    ],
    impersonation: [
      'Account impersonating user detected',
      'Fake profile using user\'s identity',
      'Impersonation attempt blocked'
    ],
    data_breach: [
      'Potential data breach detected',
      'Unusual data access pattern',
      'Suspicious data export activity'
    ],
    account_takeover: [
      'Account takeover attempt detected',
      'Unauthorized access attempt',
      'Suspicious password change request'
    ]
  }

  const typeDescriptions = descriptions[type as keyof typeof descriptions] || ['Suspicious activity detected']
  const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]

  return {
    userId,
    socialAccountId,
    type,
    severity,
    description,
    status: 'detected',
    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    metadata: JSON.stringify({
      detectionMethod: 'ai_analysis',
      riskScore: Math.floor(Math.random() * 100),
      indicators: generateMockIndicators(type)
    })
  }
}

function generateMockIndicators(type: string) {
  const indicators = {
    phishing: ['suspicious_link', 'fake_domain', 'credential_theft'],
    malware: ['file_attachment', 'download_link', 'executable'],
    suspicious_activity: ['unusual_location', 'failed_attempts', 'timing_pattern'],
    fake_profile: ['profile_similarity', 'creation_pattern', 'behavior_analysis'],
    harassment: ['toxic_language', 'threat_keywords', 'report_frequency'],
    spam: ['mass_messaging', 'promotional_content', 'unsolicited_contact'],
    impersonation: ['profile_copy', 'identity_theft', 'name_similarity'],
    data_breach: ['data_access', 'export_activity', 'unusual_queries'],
    account_takeover: ['password_attempt', 'session_hijack', 'unauthorized_device']
  }

  return indicators[type as keyof typeof indicators] || ['suspicious_activity']
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Build where clause
    const where: any = { userId: user.id }
    
    if (severity) where.severity = severity
    if (status) where.status = status
    if (type) where.type = type

    // Get threats
    const threats = await prisma.threat.findMany({
      where,
      include: {
        socialAccount: {
          select: {
            platform: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    // Get threat counts for statistics
    const totalThreats = await prisma.threat.count({ where: { userId: user.id } })
    const activeThreats = await prisma.threat.count({ 
      where: { 
        userId: user.id, 
        status: { in: ['detected', 'investigating'] } 
      } 
    })
    const blockedThreats = await prisma.threat.count({ 
      where: { 
        userId: user.id, 
        status: 'blocked' 
      } 
    })

    return NextResponse.json({
      threats,
      statistics: {
        total: totalThreats,
        active: activeThreats,
        blocked: blockedThreats,
        resolved: totalThreats - activeThreats - blockedThreats
      }
    })

  } catch (error) {
    console.error('Threat retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    const { 
      socialAccountId, 
      type, 
      severity, 
      description, 
      source, 
      confidence,
      metadata 
    } = await request.json()

    // Validate input
    if (!type || !severity || !description) {
      return NextResponse.json(
        { error: 'Type, severity, and description are required' },
        { status: 400 }
      )
    }

    if (!THREAT_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid threat type' },
        { status: 400 }
      )
    }

    if (!SEVERITY_LEVELS.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity level' },
        { status: 400 }
      )
    }

    // Create threat
    const threat = await dbUtils.createThreat({
      userId: user.id,
      socialAccountId,
      type,
      severity,
      description,
      source,
      confidence,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'threat_detected',
        eventData: JSON.stringify({ 
          type, 
          severity, 
          source,
          socialAccountId 
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Threat recorded successfully',
      threat
    })

  } catch (error) {
    console.error('Threat creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulated threat detection endpoint
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

    const { socialAccountId } = await request.json()

    // Get user's social accounts
    const socialAccounts = await dbUtils.getUserSocialAccounts(user.id)
    
    if (socialAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No social accounts found for threat scanning' },
        { status: 404 }
      )
    }

    // Simulate threat detection
    const detectedThreats: Array<{
      status: string;
      id: string;
      severity: string;
      type: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      socialAccountId: string | null;
      description: string;
      source: string | null;
      actionTaken: string | null;
      confidence: number | null;
      metadata: string | null;
    }> = []
    const accountsToScan = socialAccountId 
      ? socialAccounts.filter(acc => acc.id === socialAccountId)
      : socialAccounts

    for (const account of accountsToScan) {
      // Simulate finding 0-2 threats per account
      const threatCount = Math.floor(Math.random() * 3)
      
      for (let i = 0; i < threatCount; i++) {
        const threatData = generateMockThreat(user.id, account.id)
        const threat = await dbUtils.createThreat(threatData)
        detectedThreats.push(threat)
      }

      // Update account threat count
      await prisma.socialAccount.update({
        where: { id: account.id },
        data: { 
          threatCount: account.threatCount + threatCount,
          lastScanned: new Date()
        }
      })
    }

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'threat_scan_completed',
        eventData: JSON.stringify({ 
          accountsScanned: accountsToScan.length,
          threatsDetected: detectedThreats.length
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Threat scan completed',
      threatsDetected: detectedThreats.length,
      threats: detectedThreats
    })

  } catch (error) {
    console.error('Threat scanning error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}