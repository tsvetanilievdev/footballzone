import prisma from '@/config/database'
import redis from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { UserRole, SubscriptionStatus } from '@prisma/client'

interface PremiumAccessCheck {
  hasAccess: boolean
  reason: string
  requiresUpgrade: boolean
  upgradeUrl?: string
  previewLength?: number
  releaseDate?: Date
}

interface ContentPreview {
  id: string
  title: string
  excerpt: string
  previewContent: string
  isPremium: boolean
  releaseDate?: Date
  requiresSubscription: boolean
  estimatedReadTime: number
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  isPopular?: boolean
  trialDays?: number
}

interface UserSubscription {
  id: string
  planId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  isActive: boolean
  daysRemaining: number
}

export class PremiumService {
  private readonly CACHE_PREFIX = 'premium:'
  private readonly CACHE_TTL = 1800 // 30 minutes

  // Check if user has access to premium content
  async checkContentAccess(
    articleId: string, 
    userId?: string, 
    userRole: UserRole = 'FREE'
  ): Promise<PremiumAccessCheck> {
    const cacheKey = `${this.CACHE_PREFIX}access:${articleId}:${userId || 'anonymous'}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        zones: true,
        author: {
          select: { role: true }
        }
      }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    let accessCheck: PremiumAccessCheck

    // Admin access - always granted
    if (userRole === 'ADMIN') {
      accessCheck = {
        hasAccess: true,
        reason: 'Admin access',
        requiresUpgrade: false
      }
    }
    // Free article - always accessible
    else if (!article.isPremium) {
      accessCheck = {
        hasAccess: true,
        reason: 'Free content',
        requiresUpgrade: false
      }
    }
    // Premium article with time-based release
    else if (article.isPremium && article.premiumReleaseDate) {
      const now = new Date()
      const releaseDate = new Date(article.premiumReleaseDate)
      
      if (now >= releaseDate) {
        // Content has been released to free users
        accessCheck = {
          hasAccess: true,
          reason: 'Content released to free users',
          requiresUpgrade: false
        }
      } else if (userId) {
        // Check if user has premium subscription
        const subscription = await this.getUserActiveSubscription(userId)
        if (subscription) {
          accessCheck = {
            hasAccess: true,
            reason: 'Premium subscription',
            requiresUpgrade: false
          }
        } else {
          accessCheck = {
            hasAccess: false,
            reason: `Premium content - will be free after ${releaseDate.toLocaleDateString('bg-BG')}`,
            requiresUpgrade: true,
            upgradeUrl: '/pricing',
            previewLength: 300,
            releaseDate
          }
        }
      } else {
        // Anonymous user
        accessCheck = {
          hasAccess: false,
          reason: `Premium content - will be free after ${releaseDate.toLocaleDateString('bg-BG')}`,
          requiresUpgrade: true,
          upgradeUrl: '/auth/register',
          previewLength: 200,
          releaseDate
        }
      }
    }
    // Permanently premium content
    else if (article.isPermanentPremium) {
      if (userId) {
        const subscription = await this.getUserActiveSubscription(userId)
        if (subscription) {
          accessCheck = {
            hasAccess: true,
            reason: 'Premium subscription',
            requiresUpgrade: false
          }
        } else {
          accessCheck = {
            hasAccess: false,
            reason: 'Premium content - subscription required',
            requiresUpgrade: true,
            upgradeUrl: '/pricing',
            previewLength: 300
          }
        }
      } else {
        accessCheck = {
          hasAccess: false,
          reason: 'Premium content - subscription required',
          requiresUpgrade: true,
          upgradeUrl: '/auth/register',
          previewLength: 200
        }
      }
    }
    // Zone-specific access control
    else {
      const hasZoneAccess = await this.checkZoneAccess(article.zones, userRole, userId)
      if (hasZoneAccess.hasAccess) {
        accessCheck = hasZoneAccess
      } else {
        accessCheck = {
          hasAccess: false,
          reason: hasZoneAccess.reason,
          requiresUpgrade: true,
          upgradeUrl: hasZoneAccess.upgradeUrl || '/pricing'
        }
      }
    }

    // Cache the result
    await redis.set(cacheKey, JSON.stringify(accessCheck), this.CACHE_TTL)
    
    return accessCheck
  }

  // Get content preview for premium articles
  async getContentPreview(articleId: string, userId?: string): Promise<ContentPreview> {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        isPremium: true,
        premiumReleaseDate: true,
        readTime: true,
        zones: {
          select: {
            zone: true,
            requiresSubscription: true
          }
        }
      }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    const accessCheck = await this.checkContentAccess(articleId, userId)
    
    let previewContent = ''
    if (!accessCheck.hasAccess && accessCheck.previewLength) {
      // Extract plain text preview from content
      const plainText = article.content.replace(/<[^>]*>/g, '')
      previewContent = plainText.substring(0, accessCheck.previewLength) + '...'
    }

    const requiresSubscription = article.zones.some(zone => zone.requiresSubscription)

    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      previewContent: !accessCheck.hasAccess ? previewContent : article.content,
      isPremium: article.isPremium,
      releaseDate: article.premiumReleaseDate || undefined,
      requiresSubscription,
      estimatedReadTime: article.readTime
    }
  }

  // Get user's active subscription
  async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    const cacheKey = `${this.CACHE_PREFIX}subscription:${userId}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'PAST_DUE'] }
      },
      orderBy: { currentPeriodEnd: 'desc' }
    })

    if (!subscription) {
      return null
    }

    const now = new Date()
    const isActive = subscription.status === 'ACTIVE' && subscription.currentPeriodEnd > now
    const daysRemaining = Math.max(0, Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    const userSubscription: UserSubscription = {
      id: subscription.id,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      isActive,
      daysRemaining
    }

    // Cache for shorter time if subscription is expiring soon
    const cacheTime = daysRemaining <= 7 ? 300 : this.CACHE_TTL // 5 min if expiring soon
    await redis.set(cacheKey, JSON.stringify(userSubscription), cacheTime)

    return userSubscription
  }

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const cacheKey = `${this.CACHE_PREFIX}plans`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    // This would typically come from a database or external service like Stripe
    const plans: SubscriptionPlan[] = [
      {
        id: 'player_monthly',
        name: 'Player',
        description: 'Perfect for individual players looking to improve their game',
        price: 19.99,
        currency: 'BGN',
        interval: 'month',
        features: [
          'Access to all Player Zone content',
          'Training videos and exercises',
          'Skill development guides',
          'Community forums',
          'Mobile app access'
        ],
        trialDays: 7
      },
      {
        id: 'coach_monthly',
        name: 'Coach',
        description: 'Comprehensive resources for football coaches',
        price: 39.99,
        currency: 'BGN',
        interval: 'month',
        features: [
          'Access to all Coach Zone content',
          'Tactical analysis and formations',
          'Training session plans',
          'Team management tools',
          'Exclusive coaching webinars',
          'Priority support'
        ],
        isPopular: true,
        trialDays: 14
      },
      {
        id: 'parent_monthly',
        name: 'Parent',
        description: 'Supporting your young footballer\'s development',
        price: 14.99,
        currency: 'BGN',
        interval: 'month',
        features: [
          'Access to all Parent Zone content',
          'Child development guidance',
          'Nutrition and health tips',
          'Psychology and motivation',
          'Parent community access'
        ],
        trialDays: 7
      },
      {
        id: 'premium_yearly',
        name: 'All-Access Annual',
        description: 'Complete access to all content with significant savings',
        price: 299.99,
        currency: 'BGN',
        interval: 'year',
        features: [
          'Access to ALL zones',
          'Premium courses and series',
          'Exclusive live sessions',
          'Personalized content recommendations',
          '1-on-1 consultation credits',
          'Priority support',
          'Early access to new content'
        ],
        isPopular: true,
        trialDays: 30
      }
    ]

    await redis.set(cacheKey, JSON.stringify(plans), 3600) // Cache for 1 hour
    return plans
  }

  // Schedule content release
  async scheduleContentRelease(articleId: string, releaseDate: Date): Promise<void> {
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        isPremium: true,
        premiumReleaseDate: releaseDate,
        isPermanentPremium: false
      }
    })

    // Invalidate cache
    await this.invalidatePremiumCache([articleId])

    // TODO: Schedule background job to process content release
    // This would typically use a job queue like Bull/Redis or cron job
    console.log(`Content release scheduled for ${releaseDate.toISOString()}: ${article.title}`)
  }

  // Batch schedule multiple articles
  async batchScheduleContentRelease(
    articleIds: string[], 
    releaseDate: Date
  ): Promise<{ success: number; failed: string[] }> {
    const results = { success: 0, failed: [] as string[] }

    for (const articleId of articleIds) {
      try {
        await this.scheduleContentRelease(articleId, releaseDate)
        results.success++
      } catch (error) {
        results.failed.push(articleId)
      }
    }

    return results
  }

  // Get premium content analytics
  async getPremiumAnalytics(startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    } : {}

    const [
      totalPremiumArticles,
      scheduledReleases,
      subscriptionStats,
      conversionStats
    ] = await Promise.all([
      prisma.article.count({
        where: { isPremium: true, ...dateFilter }
      }),
      prisma.article.count({
        where: {
          isPremium: true,
          premiumReleaseDate: { gt: new Date() },
          ...dateFilter
        }
      }),
      this.getSubscriptionAnalytics(),
      this.getConversionAnalytics(startDate, endDate)
    ])

    return {
      content: {
        totalPremiumArticles,
        scheduledReleases,
        releasedToday: await this.getReleasesToday()
      },
      subscriptions: subscriptionStats,
      conversions: conversionStats
    }
  }

  // Get content scheduled for release
  async getScheduledContent(limit = 20): Promise<Array<{
    id: string
    title: string
    slug: string
    releaseDate: Date
    daysUntilRelease: number
    category: string
  }>> {
    const articles = await prisma.article.findMany({
      where: {
        isPremium: true,
        premiumReleaseDate: { gt: new Date() }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        premiumReleaseDate: true,
        category: true
      },
      orderBy: { premiumReleaseDate: 'asc' },
      take: limit
    })

    const now = new Date()

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      releaseDate: article.premiumReleaseDate!,
      daysUntilRelease: Math.ceil(
        (article.premiumReleaseDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
      category: article.category
    }))
  }

  // Process content releases (would be called by a scheduled job)
  async processContentReleases(): Promise<{ released: number; errors: string[] }> {
    const now = new Date()
    const errors: string[] = []
    
    // Find articles scheduled for release
    const articlesToRelease = await prisma.article.findMany({
      where: {
        isPremium: true,
        premiumReleaseDate: { lte: now },
        isPermanentPremium: false
      }
    })

    console.log(`Processing ${articlesToRelease.length} content releases...`)

    let released = 0

    for (const article of articlesToRelease) {
      try {
        // Release the content
        await prisma.article.update({
          where: { id: article.id },
          data: {
            isPremium: false,
            premiumReleaseDate: null
          }
        })

        // Invalidate cache
        await this.invalidatePremiumCache([article.id])

        // TODO: Send notifications to users about newly released content
        // TODO: Update search indices
        
        console.log(`Released: ${article.title}`)
        released++

      } catch (error) {
        console.error(`Failed to release article ${article.id}:`, error)
        errors.push(`${article.title}: ${error}`)
      }
    }

    return { released, errors }
  }

  // Private helper methods
  private async checkZoneAccess(zones: any[], userRole: UserRole, _userId?: string): Promise<PremiumAccessCheck> {
    // Check if any zone allows access for this user role
    for (const zone of zones) {
      if (!zone.requiresSubscription) {
        return {
          hasAccess: true,
          reason: 'Zone access granted',
          requiresUpgrade: false
        }
      }

      // Check role-based access
      if (this.hasRoleAccess(zone.zone, userRole)) {
        return {
          hasAccess: true,
          reason: `${userRole} role access`,
          requiresUpgrade: false
        }
      }
    }

    // No zone grants access
    const suggestedZone = zones[0]?.zone || 'premium'
    return {
      hasAccess: false,
      reason: `Requires ${suggestedZone} subscription`,
      requiresUpgrade: true,
      upgradeUrl: '/pricing'
    }
  }

  private hasRoleAccess(zone: string, userRole: UserRole): boolean {
    const roleAccess = {
      'READ': ['FREE', 'PLAYER', 'COACH', 'PARENT', 'ADMIN'],
      'coach': ['COACH', 'ADMIN'],
      'player': ['PLAYER', 'ADMIN'],
      'parent': ['PARENT', 'ADMIN'],
      'series': ['PLAYER', 'COACH', 'PARENT', 'ADMIN']
    }

    return roleAccess[zone as keyof typeof roleAccess]?.includes(userRole) || false
  }

  private async getSubscriptionAnalytics() {
    const [activeSubscriptions, _totalRevenue, churnRate] = await Promise.all([
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      // Placeholder for revenue calculation from payment processor
      Promise.resolve(15420),
      this.calculateChurnRate()
    ])

    return {
      activeSubscriptions,
      totalRevenue: 15420, // Placeholder - would come from payment processor
      churnRate,
      newSubscriptionsThisMonth: await this.getNewSubscriptionsThisMonth()
    }
  }

  private async getConversionAnalytics(_startDate?: Date, _endDate?: Date) {
    // This would analyze conversion from free to premium users
    // Placeholder implementation
    return {
      conversionRate: 3.2, // 3.2% conversion rate
      premiumTrials: 45,
      trialToSubscription: 68.5, // 68.5% of trials convert
      averageTimeToConvert: 5.2 // days
    }
  }

  private async getReleasesToday(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return prisma.article.count({
      where: {
        premiumReleaseDate: {
          gte: today,
          lt: tomorrow
        },
        isPremium: false // Articles that were released today
      }
    })
  }

  private async calculateChurnRate(): Promise<number> {
    // Placeholder calculation - would analyze subscription cancellations
    return 5.2 // 5.2% monthly churn rate
  }

  private async getNewSubscriptionsThisMonth(): Promise<number> {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    return prisma.subscription.count({
      where: {
        createdAt: { gte: startOfMonth }
      }
    })
  }

  private async invalidatePremiumCache(articleIds?: string[]): Promise<void> {
    const patterns = [
      `${this.CACHE_PREFIX}*`,
      ...(articleIds || []).map(id => `${this.CACHE_PREFIX}access:${id}*`)
    ]

    for (const pattern of patterns) {
      const keys = await redis.client?.keys(pattern) || []
      if (keys.length > 0) {
        await redis.delPattern(pattern)
      }
    }
  }
}

export const premiumService = new PremiumService()