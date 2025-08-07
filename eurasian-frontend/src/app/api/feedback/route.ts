import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { rating, message, userId } = await request.json()

    if (!rating || !message || !userId) {
      return NextResponse.json(
        { error: 'Rating, message, and userId are required' },
        { status: 400 }
      )
    }

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        rating,
        message,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      feedback,
    })

  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admins to view all feedback
    const feedbacks = await db.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      feedbacks,
    })

  } catch (error) {
    console.error('Feedback fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}