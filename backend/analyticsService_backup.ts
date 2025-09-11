import prisma from '@/config/database'
import redis from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { ActivityAction, ActivityResource, UserRole } from '@prisma/client'

interface AnalyticsFilters {
  startDate?: Date
  endDate?: Date
  resourceType?: ActivityResource
  resourceId?: string
  userRole?: UserRole
  period?: 'day' | 'week' | 'month' | 'year'
}

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalArticles: number
  publishedArticles: number
  totalViews: number
  viewsToday: number
  avgReadTime: number
  topArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    category: string
  }>
  userGrowth: Array<{
    date: string
    newUsers: number
    totalUsers: number
  }>
  viewsGrowth: Array<{
    date: string
    views: number
    uniqueViews: number
  }>
  categoryDistribution: Array<{
    category: string
    count: number
    percentage: number
  }>
  userActivityHeatmap: Array<{
    hour: number
    day: number
    activity: number
  }>
}

interface ArticleAnalytics {
  id: string
  title: string
  slug: string
  totalViews: number
  uniqueViews: number
  avgReadTime: number
  completionRate: number
  bounceRate: number
  viewsByZone: Array<{
    zone: string
    views: number
  }>
  viewsOverTime: Array<{
    date: string
    views: number
  }>
  userEngagement: {
    likes: number
    shares: number
    comments: number
  }
  demographics: {
    byRole: Array<{ role: string; count: number }>
    byDevice: Array<{ device: string; count: number }>
  }
}

interface UserActivity {
  userId: string
  userName: string
  email: string
  role: string
  lastActive: Date
  totalSessions: number
  totalReadTime: number
  articlesRead: number
  favoriteCategories: string[]
  activityScore: number
  engagement: {
    daily: Array<{ date: string; sessions: number; readTime: number }>
    categories: Array<{ category: string; count: number }>
    zones: Array<{ zone: string; time: number }>
  }
}

interface PerformanceMetrics {
  apiResponseTimes: {
    avg: number
    p50: number
    p95: number
    p99: number
  }
  databasePerformance: {
    avgQueryTime: number
    slowQueries: number
    connectionPoolUsage: number
  }
  cachePerformance: {
    hitRate: number
    missRate: number
    evictions: number
  }
  systemResources: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
  errorRates: {
    total: number
    byEndpoint: Array<{ endpoint: string; errors: number }>
  }
}

export class AnalyticsService {
  private readonly CACHE_PREFIX = 'analytics:'
  private readonly CACHE_TTL = 900 // 15 minutes

  // Dashboard Analytics
  async getDashboardMetrics(filters: AnalyticsFilters = {}): Promise<DashboardMetrics> {
    const cacheKey = `${this.CACHE_PREFIX}dashboard:${JSON.stringify(filters)}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date() } = filters

    // Parallel queries for better performance
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      totalArticles,
      publishedArticles,
      totalViews,
      viewsToday,
      topArticles,
      userGrowth,
      viewsGrowth,
      categoryDistribution
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getActiveUsers(startDate),
      this.getNewUsersToday(),
      this.getTotalArticles(),
      this.getPublishedArticles(),
      this.getTotalViews(),
      this.getViewsToday(),
      this.getTopArticles(10),
      this.getUserGrowth(startDate, endDate),
      this.getViewsGrowth(startDate, endDate),
      this.getCategoryDistribution()
    ])

    const avgReadTime = await this.getAverageReadTime()
    const userActivityHeatmap = await this.getUserActivityHeatmap()

    const metrics: DashboardMetrics = {
      totalUsers,
      activeUsers,
      newUsersToday,
      totalArticles,
      publishedArticles,
      totalViews,
      viewsToday,
      avgReadTime,
      topArticles,
      userGrowth,
      viewsGrowth,
      categoryDistribution,
      userActivityHeatmap
    }

    await redis.set(cacheKey, JSON.stringify(metrics), this.CACHE_TTL)
    return metrics
  }

  // Article-specific Analytics
  async getArticleAnalytics(articleId: string, filters: AnalyticsFilters = {}): Promise<ArticleAnalytics> {
    const cacheKey = `${this.CACHE_PREFIX}article:${articleId}:${JSON.stringify(filters)}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        views: {
          include: { user: true }
        },
        zones: true
      }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    const [
      viewsByZone,
      viewsOverTime,
      demographics
    ] = await Promise.all([
      this.getArticleViewsByZone(articleId),
      this.getArticleViewsOverTime(articleId, filters.startDate, filters.endDate),
      this.getArticleDemographics(articleId)
    ])

    const analytics: ArticleAnalytics = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      totalViews: article.viewCount,
      uniqueViews: await this.getUniqueViews(articleId),
      avgReadTime: await this.getArticleAverageReadTime(articleId),
      completionRate: await this.getArticleCompletionRate(articleId),
      bounceRate: await this.getArticleBounceRate(articleId),
      viewsByZone,
      viewsOverTime,
      userEngagement: {
        likes: 0, // Placeholder for future implementation
        shares: 0, // Placeholder for future implementation
        comments: 0 // Placeholder for future implementation
      },
      demographics
    }

    await redis.set(cacheKey, JSON.stringify(analytics), this.CACHE_TTL)
    return analytics
  }

  // User Activity Analytics
  async getUserActivity(userId: string, filters: AnalyticsFilters = {}): Promise<UserActivity> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userActivities: {
          where: {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        articleViews: {
          include: { article: true }
        }
      }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const [
      totalSessions,
      totalReadTime,
      favoriteCategories,
      dailyActivity,
      categoryActivity,
      zoneActivity
    ] = await Promise.all([
      this.getUserTotalSessions(userId),
      this.getUserTotalReadTime(userId),
      this.getUserFavoriteCategories(userId),
      this.getUserDailyActivity(userId, filters.startDate, filters.endDate),
      this.getUserCategoryActivity(userId),
      this.getUserZoneActivity(userId)
    ])

    return {
      userId: user.id,
      userName: user.name,
      email: user.email,
      role: user.role,
      lastActive: user.lastLoginAt || user.updatedAt,
      totalSessions,
      totalReadTime,
      articlesRead: user.articleViews.length,
      favoriteCategories,
      activityScore: await this.calculateActivityScore(userId),
      engagement: {
        daily: dailyActivity,
        categories: categoryActivity,
        zones: zoneActivity
      }
    }
  }

  // Performance Analytics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const cacheKey = `${this.CACHE_PREFIX}performance`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    // This would integrate with monitoring tools like New Relic, DataDog, etc.
    // For now, we'll return mock data
    const metrics: PerformanceMetrics = {
      apiResponseTimes: {
        avg: 250,
        p50: 180,
        p95: 450,
        p99: 800
      },
      databasePerformance: {
        avgQueryTime: 15,
        slowQueries: 2,
        connectionPoolUsage: 65
      },
      cachePerformance: {
        hitRate: 85.5,
        missRate: 14.5,
        evictions: 12
      },
      systemResources: {
        cpuUsage: 45,
        memoryUsage: 68,
        diskUsage: 23
      },
      errorRates: {
        total: 0.02,
        byEndpoint: [
          { endpoint: '/api/v1/articles/search', errors: 3 },
          { endpoint: '/api/v1/auth/login', errors: 1 }
        ]
      }
    }

    await redis.set(cacheKey, JSON.stringify(metrics), 300) // 5 min cache
    return metrics
  }

  // Event Tracking
  async trackEvent(data: {
    userId?: string
    sessionId: string
    action: ActivityAction
    resourceType?: ActivityResource
    resourceId?: string
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    deviceType?: string
  }): Promise<void> {
    await prisma.userActivity.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        metadata: data.metadata || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceType: data.deviceType
      }
    })

    // Invalidate relevant caches
    await this.invalidateAnalyticsCache([
      'dashboard',
      `article:${data.resourceId}`,
      `user:${data.userId}`
    ])
  }

  // Export Analytics Data
  async exportAnalytics(type: 'dashboard' | 'articles' | 'users', format: 'csv' | 'json' = 'json'): Promise<string> {
    let data: any

    switch (type) {
      case 'dashboard':
        data = await this.getDashboardMetrics()
        break
      case 'articles':
        data = await this.getAllArticlesAnalytics()
        break
      case 'users':
        data = await this.getAllUsersActivity()
        break
      default:
        throw new AppError('Invalid export type', 400)
    }

    if (format === 'csv') {
      return this.convertToCSV(data)
    }

    return JSON.stringify(data, null, 2)
  }

  // Private helper methods
  private async getTotalUsers(): Promise<number> {
    return prisma.user.count()
  }

  private async getActiveUsers(since: Date): Promise<number> {
    return prisma.user.count({
      where: {
        lastLoginAt: {
          gte: since
        }
      }
    })
  }

  private async getNewUsersToday(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
  }

  private async getTotalArticles(): Promise<number> {
    return prisma.article.count()
  }

  private async getPublishedArticles(): Promise<number> {
    return prisma.article.count({
      where: { status: 'PUBLISHED' }
    })
  }

  private async getTotalViews(): Promise<number> {
    const result = await prisma.article.aggregate({
      _sum: { viewCount: true }
    })
    return result._sum.viewCount || 0
  }

  private async getViewsToday(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return prisma.articleView.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
  }

  private async getTopArticles(limit: number) {
    return prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        category: true
      }
    }).then(articles => 
      articles.map(article => ({
        ...article,
        views: article.viewCount,
        category: article.category
      }))
    )
  }

  private async getUserGrowth(startDate: Date, endDate: Date) {
    const users = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users,
        SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as total_users
      FROM users
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date
    ` as any[]

    return users.map(row => ({
      date: row.date.toISOString().split('T')[0],
      newUsers: Number(row.new_users),
      totalUsers: Number(row.total_users)
    }))
  }

  private async getViewsGrowth(startDate: Date, endDate: Date) {
    const views = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT user_id) as unique_views
      FROM article_views
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date
    ` as any[]

    return views.map(row => ({
      date: row.date.toISOString().split('T')[0],
      views: Number(row.views),
      uniqueViews: Number(row.unique_views)
    }))
  }

  private async getCategoryDistribution() {
    const categories = await prisma.article.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true }
    })

    const total = categories.reduce((sum, cat) => sum + cat._count.category, 0)

    return categories.map(cat => ({
      category: cat.category,
      count: cat._count.category,
      percentage: Math.round((cat._count.category / total) * 100 * 100) / 100
    }))
  }

  private async getAverageReadTime(): Promise<number> {
    const result = await prisma.article.aggregate({
      where: { status: 'PUBLISHED' },
      _avg: { readTime: true }
    })
    return Math.round(result._avg.readTime || 5)
  }

  private async getUserActivityHeatmap() {
    const activities = await prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        EXTRACT(DOW FROM created_at) as day,
        COUNT(*) as activity
      FROM user_activities
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY EXTRACT(HOUR FROM created_at), EXTRACT(DOW FROM created_at)
      ORDER BY day, hour
    ` as any[]

    return activities.map(row => ({
      hour: Number(row.hour),
      day: Number(row.day),
      activity: Number(row.activity)
    }))
  }

  private async getArticleViewsByZone(articleId: string) {
    const zones = await prisma.articleZone.findMany({
      where: { articleId },
      include: { article: { include: { views: true } } }
    })

    return zones.map(zone => ({
      zone: zone.zone,
      views: zone.article.views.length // This is simplified - in reality, we'd track zone-specific views
    }))
  }

  private async getArticleViewsOverTime(articleId: string, startDate?: Date, endDate?: Date) {
    const views = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views
      FROM article_views
      WHERE article_id = ${articleId}
        ${startDate ? `AND created_at >= ${startDate}` : ''}
        ${endDate ? `AND created_at <= ${endDate}` : ''}
      GROUP BY DATE(created_at)
      ORDER BY date
    ` as any[]

    return views.map(row => ({
      date: row.date.toISOString().split('T')[0],
      views: Number(row.views)
    }))
  }

  private async getUniqueViews(articleId: string): Promise<number> {
    return prisma.articleView.count({
      where: { articleId },
      distinct: ['userId']  as any
    })
  }

  private async getArticleAverageReadTime(articleId: string): Promise<number> {
    const result = await prisma.articleView.aggregate({
      where: { 
        articleId,
        viewDuration: { not: null }
      },
      _avg: { viewDuration: true }
    })
    return Math.round((result._avg.viewDuration || 0) / 1000) // Convert to seconds
  }

  private async getArticleCompletionRate(articleId: string): Promise<number> {
    const totalViews = await prisma.articleView.count({ where: { articleId } })
    const completedViews = await prisma.articleView.count({
      where: { 
        articleId,
        completionPercent: { gte: 90 }
      }
    })
    return totalViews > 0 ? Math.round((completedViews / totalViews) * 100 * 100) / 100 : 0
  }

  private async getArticleBounceRate(articleId: string): Promise<number> {
    const shortViews = await prisma.articleView.count({
      where: { 
        articleId,
        viewDuration: { lt: 30000 } // Less than 30 seconds
      }
    })
    const totalViews = await prisma.articleView.count({ where: { articleId } })
    return totalViews > 0 ? Math.round((shortViews / totalViews) * 100 * 100) / 100 : 0
  }

  private async getArticleDemographics(articleId: string) {
    const [roleData, deviceData] = await Promise.all([
      prisma.$queryRaw`
        SELECT u.role, COUNT(*) as count
        FROM article_views av
        JOIN users u ON av.user_id = u.id
        WHERE av.article_id = ${articleId}
        GROUP BY u.role
      ` as any[],
      
      prisma.articleView.groupBy({
        by: ['deviceType'],
        where: { articleId },
        _count: { deviceType: true }
      })
    ])

    return {
      byRole: roleData.map(row => ({ role: row.role, count: Number(row.count) })),
      byDevice: deviceData.map(item => ({ 
        device: item.deviceType || 'Unknown', 
        count: item._count.deviceType 
      }))
    }
  }

  private async getUserTotalSessions(userId: string): Promise<number> {
    const sessions = await prisma.userActivity.findMany({
      where: { userId },
      distinct: ['sessionId']
    })
    return sessions.length
  }

  private async getUserTotalReadTime(userId: string): Promise<number> {
    const result = await prisma.articleView.aggregate({
      where: { 
        userId,
        viewDuration: { not: null }
      },
      _sum: { viewDuration: true }
    })
    return Math.round((result._sum.viewDuration || 0) / 1000) // Convert to seconds
  }

  private async getUserFavoriteCategories(userId: string): Promise<string[]> {
    const categories = await prisma.$queryRaw`
      SELECT a.category, COUNT(*) as count
      FROM article_views av
      JOIN articles a ON av.article_id = a.id
      WHERE av.user_id = ${userId}
      GROUP BY a.category
      ORDER BY count DESC
      LIMIT 3
    ` as any[]

    return categories.map(row => row.category)
  }

  private async getUserDailyActivity(userId: string, startDate?: Date, endDate?: Date) {
    const activities = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as sessions,
        COALESCE(SUM(CASE WHEN resource_type = 'ARTICLE' THEN 1 ELSE 0 END), 0) * 300 as read_time
      FROM user_activities
      WHERE user_id = ${userId}
        ${startDate ? `AND created_at >= ${startDate}` : ''}
        ${endDate ? `AND created_at <= ${endDate}` : ''}
      GROUP BY DATE(created_at)
      ORDER BY date
    ` as any[]

    return activities.map(row => ({
      date: row.date.toISOString().split('T')[0],
      sessions: Number(row.sessions),
      readTime: Number(row.read_time)
    }))
  }

  private async getUserCategoryActivity(userId: string) {
    const categories = await prisma.$queryRaw`
      SELECT a.category, COUNT(*) as count
      FROM article_views av
      JOIN articles a ON av.article_id = a.id
      WHERE av.user_id = ${userId}
      GROUP BY a.category
      ORDER BY count DESC
    ` as any[]

    return categories.map(row => ({
      category: row.category,
      count: Number(row.count)
    }))
  }

  private async getUserZoneActivity(userId: string) {
    const zones = await prisma.$queryRaw`
      SELECT az.zone, SUM(av.view_duration) as time
      FROM article_views av
      JOIN articles a ON av.article_id = a.id
      JOIN article_zones az ON a.id = az.article_id
      WHERE av.user_id = ${userId} AND av.view_duration IS NOT NULL
      GROUP BY az.zone
      ORDER BY time DESC
    ` as any[]

    return zones.map(row => ({
      zone: row.zone,
      time: Math.round(Number(row.time) / 1000) // Convert to seconds
    }))
  }

  private async calculateActivityScore(userId: string): Promise<number> {
    const [sessions, views, readTime] = await Promise.all([
      this.getUserTotalSessions(userId),
      prisma.articleView.count({ where: { userId } }),
      this.getUserTotalReadTime(userId)
    ])

    // Simple scoring algorithm - can be enhanced
    const sessionScore = Math.min(sessions * 2, 50)
    const viewScore = Math.min(views * 1.5, 30)
    const timeScore = Math.min(readTime / 60, 20) // Minutes to score

    return Math.round(sessionScore + viewScore + timeScore)
  }

  private async getAllArticlesAnalytics() {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        views: true,
        _count: { select: { views: true } }
      }
    })

    return Promise.all(
      articles.map(article => this.getArticleAnalytics(article.id))
    )
  }

  private async getAllUsersActivity() {
    const users = await prisma.user.findMany({
      take: 1000 // Limit for performance
    })

    return Promise.all(
      users.map(user => this.getUserActivity(user.id))
    )
  }

  private convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return ''
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    )

    return [headers, ...rows].join('\n')
  }

  private async invalidateAnalyticsCache(patterns: string[]): Promise<void> {
    const keys = patterns.map(pattern => `${this.CACHE_PREFIX}*${pattern}*`)
    for (const pattern of keys) {
      const matchingKeys = await redis.client?.keys(pattern) || []
      if (matchingKeys.length > 0) {
        await redis.delPattern(pattern)
      }
    }
  }
}

export const analyticsService = new AnalyticsService()