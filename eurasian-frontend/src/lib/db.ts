import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Utility functions for common database operations
export const dbUtils = {
  // User operations
  async createUser(data: {
    email: string
    name?: string
    password?: string
    googleId?: string
    avatar?: string
  }) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    })
  },

  // Subscription operations
  async createSubscription(data: {
    userId: string
    plan: string
    price: number
    billingCycle?: string
  }) {
    return await prisma.subscription.create({
      data: {
        ...data,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })
  },

  async getUserSubscription(userId: string) {
    return await prisma.subscription.findUnique({
      where: { userId },
    })
  },

  // Threat operations
  async createThreat(data: {
    userId: string
    socialAccountId?: string
    type: string
    severity: string
    description: string
    source?: string
    confidence?: number
    metadata?: string
  }) {
    return await prisma.threat.create({
      data,
    })
  },

  async getUserThreats(userId: string, limit = 50, offset = 0) {
    return await prisma.threat.findMany({
      where: { userId },
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
  },

  // Social account operations
  async createSocialAccount(data: {
    userId: string
    platform: string
    accountId: string
    username?: string
    accessToken?: string
    refreshToken?: string
  }) {
    return await prisma.socialAccount.create({
      data,
    })
  },

  async getUserSocialAccounts(userId: string) {
    return await prisma.socialAccount.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Security metrics operations
  async createSecurityMetric(data: {
    userId: string
    metricType: string
    value: number
    date?: Date
  }) {
    return await prisma.securityMetric.create({
      data: {
        ...data,
        date: data.date || new Date(),
      },
    })
  },

  async getUserSecurityMetrics(userId: string, metricType?: string, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: any = {
      userId,
      date: {
        gte: startDate,
      },
    }

    if (metricType) {
      where.metricType = metricType
    }

    return await prisma.securityMetric.findMany({
      where,
      orderBy: { date: 'desc' },
    })
  },

  // Analytics operations
  async logAnalytics(data: {
    userId: string
    eventType: string
    eventData?: string
    ipAddress?: string
    userAgent?: string
  }) {
    return await prisma.analytics.create({
      data,
    })
  },

  async getUserAnalytics(userId: string, eventType?: string, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: any = {
      userId,
      createdAt: {
        gte: startDate,
      },
    }

    if (eventType) {
      where.eventType = eventType
    }

    return await prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  },

  // AI Agent operations
  async createAIAgent(data: {
    userId: string
    name: string
    type: string
    tier: string
    configuration?: string
  }) {
    return await prisma.aIAgent.create({
      data,
    })
  },

  async getUserAIAgents(userId: string) {
    return await prisma.aIAgent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Feedback operations
  async createFeedback(data: {
    userId: string
    message: string
    rating?: number
    category?: string
  }) {
    return await prisma.feedback.create({
      data,
    })
  },

  async getUserFeedbacks(userId: string) {
    return await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Social scan operations
  async createSocialScan(data: {
    socialAccountId: string
    scanType: string
  }) {
    return await prisma.socialScan.create({
      data,
    })
  },

  async updateSocialScan(id: string, data: {
    status?: string
    threatsFound?: number
    threatsBlocked?: number
    duration?: number
    errorMessage?: string
    metadata?: string
  }) {
    return await prisma.socialScan.update({
      where: { id },
      data,
    })
  },
}

// Type definitions
export type User = {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type Subscription = {
  id: string
  userId: string
  plan: string
  status: string
  startDate: Date
  endDate?: Date
  price: number
  billingCycle: string
  lastPaymentDate?: Date
  nextPaymentDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type Threat = {
  id: string
  userId: string
  socialAccountId?: string
  type: string
  severity: string
  description: string
  source?: string
  status: string
  actionTaken?: string
  confidence?: number
  metadata?: string
  createdAt: Date
  updatedAt: Date
}

export type SocialAccount = {
  id: string
  userId: string
  platform: string
  accountId: string
  username?: string
  accessToken?: string
  refreshToken?: string
  isActive: boolean
  isProtected: boolean
  lastScanned?: Date
  threatCount: number
  createdAt: Date
  updatedAt: Date
}

export type SecurityMetric = {
  id: string
  userId: string
  metricType: string
  value: number
  date: Date
  createdAt: Date
}

export type Analytics = {
  id: string
  userId: string
  eventType: string
  eventData?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export type AIAgent = {
  id: string
  userId: string
  name: string
  type: string
  tier: string
  status: string
  configuration?: string
  lastRun?: Date
  nextRun?: Date
  performance?: number
  createdAt: Date
  updatedAt: Date
}

export type Feedback = {
  id: string
  userId: string
  message: string
  rating?: number
  category?: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export type SocialScan = {
  id: string
  socialAccountId: string
  scanType: string
  status: string
  threatsFound: number
  threatsBlocked: number
  duration?: number
  errorMessage?: string
  metadata?: string
  createdAt: Date
  updatedAt: Date
}