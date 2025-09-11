import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { emailService } from '@/services/emailService'

// Send individual email (Admin only)
export const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  const { to, templateId, variables, scheduledFor, priority } = req.body

  if (!to || !templateId) {
    return res.status(400).json({
      success: false,
      message: 'Email address and template ID are required'
    })
  }

  const options: any = { priority }
  
  if (scheduledFor) {
    const scheduleDate = new Date(scheduledFor)
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule date format'
      })
    }
    options.scheduledFor = scheduleDate
  }

  const emailId = await emailService.sendEmail(to, templateId, variables, options)

  return res.json({
    success: true,
    message: scheduledFor ? 'Email scheduled successfully' : 'Email sent successfully',
    data: { emailId }
  })
})

// Send bulk emails (Admin only)
export const sendBulkEmails = asyncHandler(async (req: Request, res: Response) => {
  const { recipients, templateId, batchSize, delayBetweenBatches, priority } = req.body

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Recipients array is required'
    })
  }

  if (!templateId) {
    return res.status(400).json({
      success: false,
      message: 'Template ID is required'
    })
  }

  if (recipients.length > 10000) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 10,000 recipients allowed per bulk send'
    })
  }

  const results = await emailService.sendBulkEmails(recipients, templateId, {
    batchSize,
    delayBetweenBatches,
    priority
  })

  return res.json({
    success: true,
    message: `Bulk email completed: ${results.sent} sent, ${results.failed} failed`,
    data: results
  })
})

// Get email templates (Admin/Coach)
export const getEmailTemplates = asyncHandler(async (req: Request, res: Response) => {
  const templates = emailService.getTemplates()
  
  res.json({
    success: true,
    data: templates
  })
})

// Get email analytics (Admin)
export const getEmailAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { category, startDate, endDate } = req.query

  const start = startDate ? new Date(startDate as string) : undefined
  const end = endDate ? new Date(endDate as string) : undefined

  // Validate dates
  if (start && isNaN(start.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid start date format'
    })
  }

  if (end && isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid end date format'
    })
  }

  if (start && end && start > end) {
    return res.status(400).json({
      success: false,
      message: 'Start date cannot be after end date'
    })
  }

  const analytics = await emailService.getEmailAnalytics(
    category as any,
    start,
    end
  )

  return res.json({
    success: true,
    data: analytics
  })
})

// Update user email preferences (Authenticated users)
export const updateEmailPreferences = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const { newsletter, notifications, premium, marketing } = req.body

  await emailService.updateEmailPreferences(userId!, {
    newsletter,
    notifications,
    premium,
    marketing
  })

  return res.json({
    success: true,
    message: 'Email preferences updated successfully'
  })
})

// Get user email preferences (Authenticated users)
export const getEmailPreferences = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  
  // Get preferences from Redis
  const redis = require('@/config/redis').default
  const prefKey = `email_preferences:${userId}`
  const preferences = await redis.client?.hmget(prefKey, 'newsletter', 'notifications', 'premium', 'marketing')

  const userPreferences = {
    newsletter: preferences[0] === '1',
    notifications: preferences[1] !== '0', // Default true
    premium: preferences[2] === '1',
    marketing: preferences[3] === '1'
  }

  res.json({
    success: true,
    data: userPreferences
  })
})

// Unsubscribe from email category (Public with token)
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Unsubscribe token is required'
    })
  }

  try {
    const jwt = require('jsonwebtoken')
    const env = require('@/config/environment').default
    const decoded = jwt.verify(token, env.JWT_SECRET || 'fallback_secret')

    if (decoded.type !== 'unsubscribe') {
      throw new Error('Invalid token type')
    }

    await emailService.unsubscribe(decoded.userId, decoded.category)

    return res.json({
      success: true,
      message: 'Successfully unsubscribed from email category',
      data: {
        category: decoded.category
      }
    })

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired unsubscribe token'
    })
  }
})

// Test email sending (Development only)
export const testEmail = asyncHandler(async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Test endpoints not available in production'
    })
  }

  const { to, templateId = 'welcome', variables = {} } = req.body

  if (!to) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required for testing'
    })
  }

  const defaultVariables = {
    userName: variables.userName || 'Test User',
    dashboardUrl: variables.dashboardUrl || 'https://footballzone.bg/dashboard',
    articleTitle: variables.articleTitle || 'Test Article Title',
    articleUrl: variables.articleUrl || 'https://footballzone.bg/articles/test',
    resetUrl: variables.resetUrl || 'https://footballzone.bg/reset-password?token=test'
  }

  try {
    const emailId = await emailService.sendEmail(to, templateId, { ...defaultVariables, ...variables })

    return res.json({
      success: true,
      message: 'Test email sent successfully',
      data: { 
        emailId,
        template: templateId,
        to,
        variables: { ...defaultVariables, ...variables }
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Send notification emails based on user activity
export const sendNotificationEmails = asyncHandler(async (req: Request, res: Response) => {
  const { type, data } = req.body

  if (!type) {
    return res.status(400).json({
      success: false,
      message: 'Notification type is required'
    })
  }

  let results: any = {}

  switch (type) {
    case 'new_article':
      results = await sendNewArticleNotifications(data)
      break
    
    case 'premium_released':
      results = await sendPremiumReleasedNotifications(data)
      break
    
    case 'series_completed':
      results = await sendSeriesCompletedNotification(data)
      break
    
    case 'welcome':
      results = await sendWelcomeEmail(data)
      break
    
    default:
      return res.status(400).json({
        success: false,
        message: `Unknown notification type: ${type}`
      })
  }

  return res.json({
    success: true,
    message: `${type} notifications processed`,
    data: results
  })
})

// Helper functions for different notification types
async function sendNewArticleNotifications(data: {
  articleId: string
  category: string
  excludeUserId?: string
}) {
  const prisma = require('@/config/database').default
  
  // Get article details
  const article = await prisma.article.findUnique({
    where: { id: data.articleId },
    include: {
      author: { select: { name: true } }
    }
  })

  if (!article) {
    throw new Error('Article not found')
  }

  // Get users who want notifications for this category
  const users = await prisma.user.findMany({
    where: {
      emailNotifications: true,
      ...(data.excludeUserId ? { NOT: { id: data.excludeUserId } } : {})
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  })

  const recipients = users.map((user: any) => ({
    email: user.email,
    userId: user.id,
    variables: {
      userName: user.name,
      articleTitle: article.title,
      articleExcerpt: article.excerpt || '',
      categoryName: article.category,
      authorName: article.author?.name || 'FootballZone.bg',
      readTime: article.readTime,
      articleUrl: `${process.env.FRONTEND_URL}/articles/${article.slug}`,
      articleImage: article.featuredImageUrl
    }
  }))

  return await emailService.sendBulkEmails(recipients, 'new_article')
}

async function sendPremiumReleasedNotifications(data: {
  articleId: string
}) {
  const prisma = require('@/config/database').default
  
  const article = await prisma.article.findUnique({
    where: { id: data.articleId }
  })

  if (!article) {
    throw new Error('Article not found')
  }

  // Get users who want premium notifications
  const users = await prisma.user.findMany({
    where: {
      emailNotifications: true,
      role: { in: ['FREE', 'PLAYER', 'COACH', 'PARENT'] } // Exclude admins
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  })

  const recipients = users.map((user: any) => ({
    email: user.email,
    userId: user.id,
    variables: {
      userName: user.name,
      articleTitle: article.title,
      articleExcerpt: article.excerpt || '',
      articleUrl: `${process.env.FRONTEND_URL}/articles/${article.slug}`,
      premiumUrl: `${process.env.FRONTEND_URL}/pricing`
    }
  }))

  return await emailService.sendBulkEmails(recipients, 'premium_released')
}

async function sendSeriesCompletedNotification(data: {
  userId: string
  seriesId: string
}) {
  const prisma = require('@/config/database').default
  
  const [user, series] = await Promise.all([
    prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, name: true, emailNotifications: true }
    }),
    prisma.articleSeries.findUnique({
      where: { id: data.seriesId },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: { readTime: true }
        }
      }
    })
  ])

  if (!user || !user.emailNotifications || !series) {
    return { sent: 0, message: 'User or series not found, or notifications disabled' }
  }

  const totalReadTime = series.articles.reduce((sum: any, article: any) => sum + article.readTime, 0)

  await emailService.sendEmail(user.email, 'series_completed', {
    userName: user.name,
    seriesName: series.name,
    articleCount: series.articles.length,
    totalReadTime,
    dashboardUrl: `${process.env.FRONTEND_URL}/profile`,
    recommendedSeries: [] // TODO: Implement series recommendations
  }, {
    userId: data.userId
  })

  return { sent: 1 }
}

async function sendWelcomeEmail(data: {
  userId: string
}) {
  const prisma = require('@/config/database').default
  
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { email: true, name: true, emailNotifications: true }
  })

  if (!user || !user.emailNotifications) {
    return { sent: 0, message: 'User not found or notifications disabled' }
  }

  await emailService.sendEmail(user.email, 'welcome', {
    userName: user.name,
    dashboardUrl: `${process.env.FRONTEND_URL}/profile`
  }, {
    userId: data.userId
  })

  return { sent: 1 }
}