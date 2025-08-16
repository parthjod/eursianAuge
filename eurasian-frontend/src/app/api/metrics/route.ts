import { NextRequest, NextResponse } from 'next/server'
import { prisma, dbUtils } from '@/lib/db'

const VALID_METRIC_TYPES = [
  'threats_blocked', 'accounts_protected', 'security_score', 'active_alerts', 
  'scan_count', 'response_time', 'detection_rate', 'false_positive_rate'
]

const VALID_AGGREGATIONS = ['sum', 'average', 'min', 'max', 'count']

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
    const metricTypeParam = searchParams.get('metricType')
    const metricType: string | undefined = metricTypeParam === null ? undefined : metricTypeParam
    const days = parseInt(searchParams.get('days') || '30')
    const aggregation = searchParams.get('aggregation') || 'sum'

    // Validate parameters
    if (metricType && !VALID_METRIC_TYPES.includes(metricType)) {
      return NextResponse.json(
        { error: 'Invalid metric type' },
        { status: 400 }
      )
    }

    if (!VALID_AGGREGATIONS.includes(aggregation)) {
      return NextResponse.json(
        { error: 'Invalid aggregation type' },
        { status: 400 }
      )
    }

    // Get security metrics
    const metrics = await dbUtils.getUserSecurityMetrics(user.id, metricType, days)

    // Calculate aggregated values
    let aggregatedValue: number
    switch (aggregation) {
      case 'sum':
        aggregatedValue = metrics.reduce((sum, m) => sum + m.value, 0)
        break
      case 'average':
        aggregatedValue = metrics.length > 0 
          ? Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)
          : 0
        break
      case 'min':
        aggregatedValue = metrics.length > 0 
          ? Math.min(...metrics.map(m => m.value))
          : 0
        break
      case 'max':
        aggregatedValue = metrics.length > 0 
          ? Math.max(...metrics.map(m => m.value))
          : 0
        break
      case 'count':
        aggregatedValue = metrics.length
        break
      default:
        aggregatedValue = metrics.reduce((sum, m) => sum + m.value, 0)
    }

    // Group metrics by date for chart data
    const metricsByDate = metrics.reduce((acc, metric) => {
      const date = metric.date.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(metric.value)
      return acc
    }, {} as Record<string, number[]>)

    const chartData = Object.entries(metricsByDate).map(([date, values]) => ({
      date,
      value: aggregation === 'average' 
        ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
        : aggregation === 'sum'
        ? values.reduce((sum, v) => sum + v, 0)
        : aggregation === 'min'
        ? Math.min(...values)
        : aggregation === 'max'
        ? Math.max(...values)
        : values.length
    })).sort((a, b) => a.date.localeCompare(b.date))

    // Calculate trend
    const sortedMetrics = metrics.sort((a, b) => a.date.getTime() - b.date.getTime())
    const trend = sortedMetrics.length > 1 
      ? ((sortedMetrics[sortedMetrics.length - 1].value - sortedMetrics[0].value) / sortedMetrics[0].value) * 100
      : 0

    // Get all metric types for the user
    const allMetricTypes = await prisma.securityMetric.groupBy({
      by: ['metricType'],
      where: {
        userId: user.id
      },
      _count: {
        metricType: true
      }
    })

    // Calculate summary statistics
    const summaryStats = {
      total: metrics.length,
      average: metrics.length > 0 
        ? Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)
        : 0,
      min: metrics.length > 0 ? Math.min(...metrics.map(m => m.value)) : 0,
      max: metrics.length > 0 ? Math.max(...metrics.map(m => m.value)) : 0,
      latest: metrics.length > 0 ? metrics[metrics.length - 1].value : 0,
      trend: Math.round(trend * 100) / 100
    }

    return NextResponse.json({
      metrics,
      aggregatedValue,
      chartData,
      summaryStats,
      availableMetricTypes: allMetricTypes.map(stat => stat.metricType),
      filters: {
        metricType,
        days,
        aggregation
      }
    })

  } catch (error) {
    console.error('Security metrics retrieval error:', error)
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

    const { metricType, value, date } = await request.json()

    // Validate input
    if (!metricType || !VALID_METRIC_TYPES.includes(metricType)) {
      return NextResponse.json(
        { error: 'Valid metric type is required' },
        { status: 400 }
      )
    }

    if (typeof value !== 'number' || value < 0) {
      return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      )
    }

    // Create security metric
    const metric = await dbUtils.createSecurityMetric({
      userId: user.id,
      metricType,
      value,
      date: date ? new Date(date) : new Date()
    })

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'security_metric_recorded',
        eventData: JSON.stringify({ metricType, value }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: 'Security metric recorded successfully',
      metric
    })

  } catch (error) {
    console.error('Security metric creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Bulk metrics import endpoint
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

    const { metrics } = await request.json()

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json(
        { error: 'Metrics array is required' },
        { status: 400 }
      )
    }

    // Validate and create metrics
    const createdMetrics: any[] = []
    const errors: string[] = []

    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i]
      
      try {
        if (!metric.metricType || !VALID_METRIC_TYPES.includes(metric.metricType)) {
          errors.push(`Invalid metric type at index ${i}`)
          continue
        }

        if (typeof metric.value !== 'number' || metric.value < 0) {
          errors.push(`Invalid value at index ${i}`)
          continue
        }

        const createdMetric = await dbUtils.createSecurityMetric({
          userId: user.id,
          metricType: metric.metricType,
          value: metric.value,
          date: metric.date ? new Date(metric.date) : new Date()
        })

        createdMetrics.push(createdMetric)
      } catch (error) {
        errors.push(`Failed to create metric at index ${i}: ${error}`)
      }
    }

    // Log analytics event
    try {
      await dbUtils.logAnalytics({
        userId: user.id,
        eventType: 'security_metrics_bulk_imported',
        eventData: JSON.stringify({ 
          totalAttempted: metrics.length,
          successful: createdMetrics.length,
          failed: errors.length
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      message: `Successfully imported ${createdMetrics.length} metrics`,
      metrics: createdMetrics,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Bulk metrics import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}