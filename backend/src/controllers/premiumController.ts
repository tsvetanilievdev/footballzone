import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { premiumService } from '@/services/premiumService'
import prisma from '@/config/database'

// Check content access (Public)
export const checkContentAccess = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params
  const user = req.user
  const userId = user?.id
  const userRole = user?.role || 'FREE'

  const accessCheck = await premiumService.checkContentAccess(articleId, userId, userRole)

  res.json({
    success: true,
    data: accessCheck
  })
})

// Get content preview (Public)
export const getContentPreview = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params
  const userId = req.user?.id

  const preview = await premiumService.getContentPreview(articleId, userId)

  res.json({
    success: true,
    data: preview
  })
})

// Get subscription plans (Public)
export const getSubscriptionPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await premiumService.getSubscriptionPlans()

  res.json({
    success: true,
    data: plans
  })
})

// Get user's subscription (Authenticated)
export const getUserSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id

  const subscription = await premiumService.getUserActiveSubscription(userId!)

  return res.json({
    success: true,
    data: subscription
  })
})

// Schedule content release (Admin/Coach)
export const scheduleContentRelease = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params
  const { releaseDate } = req.body

  if (!releaseDate) {
    return res.status(400).json({
      success: false,
      message: 'Release date is required'
    })
  }

  const parsedDate = new Date(releaseDate)
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid release date format'
    })
  }

  if (parsedDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Release date must be in the future'
    })
  }

  await premiumService.scheduleContentRelease(articleId, parsedDate)

  return res.json({
    success: true,
    message: 'Content release scheduled successfully'
  })
})

// Batch schedule content release (Admin/Coach)
export const batchScheduleContentRelease = asyncHandler(async (req: Request, res: Response) => {
  const { articleIds, releaseDate } = req.body

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Article IDs array is required'
    })
  }

  if (!releaseDate) {
    return res.status(400).json({
      success: false,
      message: 'Release date is required'
    })
  }

  const parsedDate = new Date(releaseDate)
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid release date format'
    })
  }

  if (parsedDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Release date must be in the future'
    })
  }

  const results = await premiumService.batchScheduleContentRelease(articleIds, parsedDate)

  return res.json({
    success: true,
    message: `Scheduled ${results.success} articles successfully`,
    data: {
      successful: results.success,
      failed: results.failed.length,
      failedIds: results.failed
    }
  })
})

// Get premium analytics (Admin)
export const getPremiumAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query

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

  const analytics = await premiumService.getPremiumAnalytics(start, end)

  return res.json({
    success: true,
    data: analytics
  })
})

// Get scheduled content (Admin/Coach)
export const getScheduledContent = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20 } = req.query

  const limitNum = parseInt(limit as string)
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be a number between 1 and 100'
    })
  }

  const scheduledContent = await premiumService.getScheduledContent(limitNum)

  return res.json({
    success: true,
    data: scheduledContent
  })
})

// Process content releases (Admin - typically called by cron job)
export const processContentReleases = asyncHandler(async (req: Request, res: Response) => {
  const results = await premiumService.processContentReleases()

  res.json({
    success: true,
    message: `Processed content releases: ${results.released} released`,
    data: {
      released: results.released,
      errors: results.errors
    }
  })
})

// Get premium content recommendations (Authenticated)
export const getPremiumRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  const { limit = 5, category } = req.query

  // This would analyze user's reading patterns and recommend premium content
  // For now, we'll return a simplified implementation
  
  const recommendedArticles = await prisma.article.findMany({
    where: {
      isPremium: true,
      status: 'PUBLISHED',
      category: category ? (category as string).toUpperCase() as any : undefined
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      readTime: true,
      featuredImageUrl: true,
      premiumReleaseDate: true,
      viewCount: true
    },
    orderBy: [
      { viewCount: 'desc' },
      { publishedAt: 'desc' }
    ],
    take: Math.min(parseInt(limit as string) || 5, 20)
  })

  // Check access for each article
  const recommendations = await Promise.all(
    recommendedArticles.map(async (article) => {
      const accessCheck = await premiumService.checkContentAccess(article.id, userId, req.user!.role)
      
      return {
        ...article,
        hasAccess: accessCheck.hasAccess,
        requiresUpgrade: accessCheck.requiresUpgrade,
        reason: accessCheck.reason,
        releaseDate: accessCheck.releaseDate
      }
    })
  )

  res.json({
    success: true,
    data: recommendations
  })
})

// Upgrade simulation (for testing premium features)
export const simulateUpgrade = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id!
  const { planId, duration = 30 } = req.body

  // This is a simulation endpoint for development/testing
  // In production, this would be handled by payment processor webhooks
  
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Simulation endpoints not available in production'
    })
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + parseInt(duration))

  // Create or update subscription
  const subscription = await prisma.subscription.upsert({
    where: { 
      id: `${userId}_${planId || 'coach_monthly'}` 
    },
    update: {
      status: 'ACTIVE',
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
      cancelAtPeriodEnd: false
    },
    create: {
      userId,
      planId: planId || 'coach_monthly',
      status: 'ACTIVE',
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
      cancelAtPeriodEnd: false
    }
  })

  return res.json({
    success: true,
    message: 'Subscription simulated successfully',
    data: {
      subscription,
      validUntil: endDate,
      note: 'This is a simulation for development purposes'
    }
  })
})

// Check bulk content access (for listing pages)
export const checkBulkContentAccess = asyncHandler(async (req: Request, res: Response) => {
  const { articleIds } = req.body
  const userId = req.user?.id
  const userRole = req.user?.role || 'FREE'

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Article IDs array is required'
    })
  }

  if (articleIds.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 50 articles can be checked at once'
    })
  }

  const accessChecks = await Promise.all(
    articleIds.map(async (articleId: string) => {
      try {
        const accessCheck = await premiumService.checkContentAccess(articleId, userId, userRole)
        return {
          articleId,
          ...accessCheck
        }
      } catch (error) {
        return {
          articleId,
          hasAccess: false,
          reason: 'Article not found',
          requiresUpgrade: false,
          error: true
        }
      }
    })
  )

  return res.json({
    success: true,
    data: accessChecks
  })
})