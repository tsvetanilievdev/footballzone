import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { analyticsService } from '@/services/analyticsService'
import { ActivityAction, ActivityResource } from '@prisma/client'

// Dashboard Analytics
export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, resourceType, resourceId, userRole, period } = req.query

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    resourceType: resourceType as ActivityResource,
    resourceId: resourceId as string,
    userRole: userRole as any,
    period: period as 'day' | 'week' | 'month' | 'year'
  }

  const metrics = await analyticsService.getDashboardMetrics(filters)

  res.json({
    success: true,
    data: metrics
  })
})

// Article-specific Analytics
export const getArticleAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { startDate, endDate } = req.query

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined
  }

  const analytics = await analyticsService.getArticleAnalytics(id, filters)

  res.json({
    success: true,
    data: analytics
  })
})

// User Activity Analytics
export const getUserActivity = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const { startDate, endDate } = req.query

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined
  }

  const activity = await analyticsService.getUserActivity(userId, filters)

  res.json({
    success: true,
    data: activity
  })
})

// Performance Metrics
export const getPerformanceMetrics = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await analyticsService.getPerformanceMetrics()

  res.json({
    success: true,
    data: metrics
  })
})

// Track Event
export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const { action, resourceType, resourceId, metadata } = req.body
  const user = req.user
  const sessionId = req.headers['x-session-id'] as string || 'anonymous'
  const ipAddress = req.ip
  const userAgent = req.headers['user-agent']

  // Determine device type from user agent
  const deviceType = userAgent ? 
    /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop' : 
    'unknown'

  await analyticsService.trackEvent({
    userId: user?.id,
    sessionId,
    action: action as ActivityAction,
    resourceType: resourceType as ActivityResource,
    resourceId,
    metadata,
    ipAddress,
    userAgent,
    deviceType
  })

  res.json({
    success: true,
    message: 'Event tracked successfully'
  })
})

// Real-time Analytics
export const getRealTimeAnalytics = asyncHandler(async (req: Request, res: Response) => {
  // This would typically use WebSocket or Server-Sent Events
  // For now, we'll return current metrics
  const metrics = await analyticsService.getDashboardMetrics({
    startDate: new Date(Date.now() - 60 * 60 * 1000) // Last hour
  })

  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      activeUsers: metrics.activeUsers,
      viewsInLastHour: metrics.viewsToday, // Simplified for demo
      currentLoad: Math.floor(Math.random() * 100), // Mock data
      serverStatus: 'healthy',
      metrics
    }
  })
})

// Export Analytics Data
export const exportAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { type, format = 'json' } = req.query

  if (!type || !['dashboard', 'articles', 'users'].includes(type as string)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid export type. Must be: dashboard, articles, or users'
    })
  }

  if (!['json', 'csv'].includes(format as string)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid format. Must be: json or csv'
    })
  }

  const data = await analyticsService.exportAnalytics(
    type as 'dashboard' | 'articles' | 'users',
    format as 'json' | 'csv'
  )

  const filename = `footballzone-${type}-${new Date().toISOString().split('T')[0]}.${format}`

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json')

  return res.send(data)
})

// Advanced Analytics Queries
export const getAdvancedAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const {
    metric,
    groupBy,
    startDate,
    endDate,
    filters = {}
  } = req.body

  // This would implement more complex analytics queries
  // For now, return based on metric type
  let data: any = {}

  switch (metric) {
    case 'user_retention':
      data = await getUserRetentionAnalytics(startDate, endDate, filters)
      break
    case 'content_performance':
      data = await getContentPerformanceAnalytics(groupBy, filters)
      break
    case 'engagement_funnel':
      data = await getEngagementFunnelAnalytics(filters)
      break
    case 'revenue_analytics':
      data = await getRevenueAnalytics(startDate, endDate, filters)
      break
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid metric type'
      })
  }

  return res.json({
    success: true,
    data
  })
})

// Helper functions for advanced analytics
async function getUserRetentionAnalytics(_startDate: string, _endDate: string, _filters: any) {
  // Mock implementation - would calculate user retention rates
  return {
    cohortAnalysis: [
      { period: 'Week 1', retention: 85 },
      { period: 'Week 2', retention: 72 },
      { period: 'Week 3', retention: 65 },
      { period: 'Week 4', retention: 58 }
    ],
    overallRetention: 70
  }
}

async function getContentPerformanceAnalytics(_groupBy: string, _filters: any) {
  // Mock implementation - would analyze content performance
  return {
    topPerformers: [
      { title: 'Основи на тактиката', score: 95 },
      { title: 'Тренировъчни методи', score: 88 }
    ],
    engagementMetrics: {
      avgTimeOnPage: 240,
      bounceRate: 25,
      socialShares: 156
    }
  }
}

async function getEngagementFunnelAnalytics(_filters: any) {
  // Mock implementation - would track user engagement funnel
  return {
    stages: [
      { name: 'Page Visit', users: 1000, conversionRate: 100 },
      { name: 'Article View', users: 750, conversionRate: 75 },
      { name: 'Read Completion', users: 500, conversionRate: 50 },
      { name: 'User Registration', users: 100, conversionRate: 10 },
      { name: 'Premium Subscription', users: 25, conversionRate: 2.5 }
    ]
  }
}

async function getRevenueAnalytics(_startDate: string, _endDate: string, _filters: any) {
  // Mock implementation - would calculate revenue metrics
  return {
    totalRevenue: 15420,
    monthlyRecurring: 8500,
    churnRate: 5.2,
    averageRevenuePerUser: 25.50
  }
}