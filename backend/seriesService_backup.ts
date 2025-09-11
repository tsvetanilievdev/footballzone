import prisma from '@/config/database'
import redis from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { SeriesCategory, SeriesStatus, ArticleStatus } from '@prisma/client'

interface SeriesFilters {
  page: number
  limit: number
  category?: SeriesCategory
  status?: SeriesStatus
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'articlesCount'
  sortOrder?: 'asc' | 'desc'
}

interface CreateSeriesData {
  name: string
  slug: string
  description?: string
  coverImageUrl?: string
  category: SeriesCategory
  totalPlannedArticles?: number
  tags?: string[]
}

interface UpdateSeriesData {
  name?: string
  slug?: string
  description?: string
  coverImageUrl?: string
  category?: SeriesCategory
  status?: SeriesStatus
  totalPlannedArticles?: number
  tags?: string[]
}

interface SeriesProgress {
  seriesId: string
  userId: string
  articlesCompleted: number
  totalArticles: number
  completionPercentage: number
  currentArticleId?: string
  lastAccessedAt: Date
}

interface SeriesRecommendation {
  seriesId: string
  name: string
  slug: string
  coverImageUrl?: string
  category: SeriesCategory
  articlesCount: number
  estimatedReadTime: number
  matchScore: number
  reason: string
}

export class SeriesService {
  private readonly CACHE_PREFIX = 'series:'
  private readonly CACHE_TTL = 3600 // 1 hour

  // Get all series with filtering and pagination
  async getSeries(filters: SeriesFilters) {
    const {
      page,
      limit,
      category,
      status = 'ACTIVE',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters

    const skip = (page - 1) * limit
    const where: any = { status }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    const [series, total] = await Promise.all([
      prisma.articleSeries.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          articles: {
            where: { status: 'PUBLISHED' },
            orderBy: { seriesPart: 'asc' },
            select: {
              id: true,
              title: true,
              slug: true,
              seriesPart: true,
              readTime: true,
              publishedAt: true,
              viewCount: true
            }
          },
          _count: { select: { articles: true } }
        }
      }),
      prisma.articleSeries.count({ where })
    ])

    const enhancedSeries = series.map(s => ({
      ...s,
      articlesCount: s._count.articles,
      estimatedReadTime: s.articles.reduce((total, article) => total + article.readTime, 0),
      completionRate: this.calculateSeriesCompletionRate(s.articles)
    }))

    return {
      series: enhancedSeries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    }
  }

  // Get series by ID or slug
  async getSeriesById(identifier: string, includeArticles = true) {
    const cacheKey = `${this.CACHE_PREFIX}${identifier}:${includeArticles}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)
    const where = isUuid ? { id: identifier } : { slug: identifier }

    const series = await prisma.articleSeries.findUnique({
      where,
      include: {
        articles: includeArticles ? {
          where: { status: 'PUBLISHED' },
          orderBy: [{ seriesPart: 'asc' }, { publishedAt: 'asc' }],
          include: {
            author: {
              select: { id: true, name: true, avatarUrl: true }
            },
            zones: true,
            _count: { select: { views: true } }
          }
        } : false,
        _count: { select: { articles: true } }
      }
    })

    if (!series) {
      throw new AppError('Series not found', 404)
    }

    const enhancedSeries = {
      ...series,
      articlesCount: series._count.articles,
      estimatedReadTime: includeArticles 
        ? series.articles.reduce((total, article) => total + article.readTime, 0)
        : 0,
      completionRate: includeArticles 
        ? this.calculateSeriesCompletionRate(series.articles)
        : 0
    }

    await redis.set(cacheKey, JSON.stringify(enhancedSeries), this.CACHE_TTL)
    return enhancedSeries
  }

  // Create new series
  async createSeries(data: CreateSeriesData) {
    // Check if slug already exists
    const existingSeries = await prisma.articleSeries.findUnique({
      where: { slug: data.slug }
    })

    if (existingSeries) {
      throw new AppError('Series with this slug already exists', 409)
    }

    const series = await prisma.articleSeries.create({
      data: {
        ...data,
        status: 'ACTIVE'
      },
      include: {
        _count: { select: { articles: true } }
      }
    })

    // Invalidate cache
    await this.invalidateSeriesCache()

    return series
  }

  // Update series
  async updateSeries(id: string, data: UpdateSeriesData) {
    // Check if slug already exists (if being updated)
    if (data.slug) {
      const existingSeries = await prisma.articleSeries.findFirst({
        where: { 
          slug: data.slug,
          NOT: { id }
        }
      })

      if (existingSeries) {
        throw new AppError('Series with this slug already exists', 409)
      }
    }

    const series = await prisma.articleSeries.update({
      where: { id },
      data,
      include: {
        articles: {
          orderBy: { seriesPart: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            seriesPart: true,
            readTime: true
          }
        },
        _count: { select: { articles: true } }
      }
    })

    // Invalidate cache
    await this.invalidateSeriesCache([id])

    return series
  }

  // Delete series
  async deleteSeries(id: string) {
    // Check if series has articles
    const articlesCount = await prisma.article.count({
      where: { seriesId: id }
    })

    if (articlesCount > 0) {
      throw new AppError('Cannot delete series with associated articles. Remove articles first.', 400)
    }

    await prisma.articleSeries.delete({
      where: { id }
    })

    // Invalidate cache
    await this.invalidateSeriesCache([id])

    return { message: 'Series deleted successfully' }
  }

  // Add article to series
  async addArticleToSeries(seriesId: string, articleId: string, seriesPart: number) {
    // Verify series exists
    const series = await prisma.articleSeries.findUnique({
      where: { id: seriesId }
    })

    if (!series) {
      throw new AppError('Series not found', 404)
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    // Check if part number is already taken
    const existingArticle = await prisma.article.findFirst({
      where: {
        seriesId,
        seriesPart
      }
    })

    if (existingArticle) {
      throw new AppError(`Part ${seriesPart} is already assigned to another article`, 409)
    }

    // Update article with series information
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        seriesId,
        seriesPart
      },
      include: {
        series: true,
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    })

    // Invalidate cache
    await this.invalidateSeriesCache([seriesId])

    return updatedArticle
  }

  // Remove article from series
  async removeArticleFromSeries(articleId: string) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, seriesId: true }
    })

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        seriesId: null,
        seriesPart: null
      }
    })

    // Invalidate cache
    if (article.seriesId) {
      await this.invalidateSeriesCache([article.seriesId])
    }

    return updatedArticle
  }

  // Reorder articles in series
  async reorderSeriesArticles(seriesId: string, articleOrders: { articleId: string; seriesPart: number }[]) {
    // Verify series exists
    const series = await prisma.articleSeries.findUnique({
      where: { id: seriesId },
      include: { articles: true }
    })

    if (!series) {
      throw new AppError('Series not found', 404)
    }

    // Validate all articles belong to the series
    const seriesArticleIds = series.articles.map(a => a.id)
    const providedArticleIds = articleOrders.map(o => o.articleId)
    
    const invalidArticles = providedArticleIds.filter(id => !seriesArticleIds.includes(id))
    if (invalidArticles.length > 0) {
      throw new AppError('Some articles do not belong to this series', 400)
    }

    // Update articles with new order
    const updates = articleOrders.map(({ articleId, seriesPart }) =>
      prisma.article.update({
        where: { id: articleId },
        data: { seriesPart }
      })
    )

    await prisma.$transaction(updates)

    // Get updated series
    const updatedSeries = await this.getSeriesById(seriesId)

    // Invalidate cache
    await this.invalidateSeriesCache([seriesId])

    return updatedSeries
  }

  // Get user progress in a series
  async getSeriesProgress(seriesId: string, userId: string): Promise<SeriesProgress> {
    const series = await prisma.articleSeries.findUnique({
      where: { id: seriesId },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { seriesPart: 'asc' },
          select: { id: true }
        }
      }
    })

    if (!series) {
      throw new AppError('Series not found', 404)
    }

    const totalArticles = series.articles.length
    const articleIds = series.articles.map(a => a.id)

    // Get completed articles (articles with views by this user)
    const completedArticles = await prisma.articleView.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
        completionPercent: { gte: 80 } // Consider 80%+ as completed
      },
      distinct: ['articleId'],
      select: { articleId: true, createdAt: true }
    })

    const articlesCompleted = completedArticles.length
    const completionPercentage = totalArticles > 0 
      ? Math.round((articlesCompleted / totalArticles) * 100)
      : 0

    // Find current article (next uncompleted article)
    const completedArticleIds = completedArticles.map(c => c.articleId)
    const currentArticle = series.articles.find(a => !completedArticleIds.includes(a.id))

    // Get last accessed time
    const lastView = await prisma.articleView.findFirst({
      where: {
        userId,
        articleId: { in: articleIds }
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    })

    return {
      seriesId,
      userId,
      articlesCompleted,
      totalArticles,
      completionPercentage,
      currentArticleId: currentArticle?.id,
      lastAccessedAt: lastView?.createdAt || new Date()
    }
  }

  // Get series recommendations for a user
  async getSeriesRecommendations(userId: string, limit = 5): Promise<SeriesRecommendation[]> {
    const cacheKey = `${this.CACHE_PREFIX}recommendations:${userId}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    // Get user's reading history and preferences
    const userActivity = await prisma.articleView.findMany({
      where: { userId },
      include: {
        article: {
          select: { category: true, tags: true, zones: true }
        }
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    })

    // Analyze user preferences
    const categoryPreferences = this.analyzeUserCategoryPreferences(userActivity)
    const tagPreferences = this.analyzeUserTagPreferences(userActivity)

    // Get series the user hasn't started
    const userSeriesIds = await prisma.article.findMany({
      where: {
        views: { some: { userId } },
        seriesId: { not: null }
      },
      select: { seriesId: true },
      distinct: ['seriesId']
    }).then(results => results.map(r => r.seriesId).filter(Boolean))

    const availableSeries = await prisma.articleSeries.findMany({
      where: {
        id: { notIn: userSeriesIds },
        status: 'ACTIVE'
      },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            category: true,
            tags: true,
            readTime: true
          }
        },
        _count: { select: { articles: true } }
      }
    })

    // Calculate match scores
    const recommendations: SeriesRecommendation[] = availableSeries.map(series => {
      const matchScore = this.calculateSeriesMatchScore(
        series,
        categoryPreferences,
        tagPreferences
      )

      const estimatedReadTime = series.articles.reduce(
        (total, article) => total + article.readTime,
        0
      )

      return {
        seriesId: series.id,
        name: series.name,
        slug: series.slug,
        coverImageUrl: series.coverImageUrl,
        category: series.category,
        articlesCount: series._count.articles,
        estimatedReadTime,
        matchScore,
        reason: this.getRecommendationReason(series, categoryPreferences, tagPreferences)
      }
    })

    // Sort by match score and take top recommendations
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)

    await redis.set(cacheKey, JSON.stringify(sortedRecommendations), 1800) // 30 min cache
    return sortedRecommendations
  }

  // Get series completion analytics
  async getSeriesAnalytics(seriesId: string) {
    const series = await prisma.articleSeries.findUnique({
      where: { id: seriesId },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          include: {
            views: {
              select: {
                userId: true,
                completionPercent: true,
                viewDuration: true,
                createdAt: true
              }
            }
          }
        }
      }
    })

    if (!series) {
      throw new AppError('Series not found', 404)
    }

    const analytics = {
      seriesInfo: {
        id: series.id,
        name: series.name,
        articlesCount: series.articles.length,
        status: series.status
      },
      engagement: {
        totalViews: series.articles.reduce((sum, article) => sum + article.views.length, 0),
        uniqueUsers: new Set(series.articles.flatMap(article => 
          article.views.map(view => view.userId)
        )).size,
        avgCompletionRate: this.calculateAverageCompletionRate(series.articles),
        avgReadTime: this.calculateAverageReadTime(series.articles)
      },
      progression: {
        usersStarted: new Set(series.articles[0]?.views.map(v => v.userId) || []).size,
        usersCompleted: this.calculateCompletedUsers(series.articles),
        dropoffPoints: this.calculateDropoffPoints(series.articles)
      },
      articlePerformance: series.articles.map(article => ({
        id: article.id,
        title: article.title,
        seriesPart: article.seriesPart,
        views: article.views.length,
        avgCompletion: article.views.length > 0 
          ? article.views.reduce((sum, view) => sum + view.completionPercent, 0) / article.views.length
          : 0
      }))
    }

    return analytics
  }

  // Private helper methods
  private calculateSeriesCompletionRate(articles: any[]): number {
    if (articles.length === 0) return 0
    
    const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0)
    const avgViewsPerArticle = totalViews / articles.length
    
    // Simple heuristic: if average views per article is high relative to first article, series is engaging
    const firstArticleViews = articles[0]?.viewCount || 0
    return firstArticleViews > 0 
      ? Math.min(Math.round((avgViewsPerArticle / firstArticleViews) * 100), 100)
      : 0
  }

  private analyzeUserCategoryPreferences(userActivity: any[]) {
    const categoryCount: { [key: string]: number } = {}
    
    userActivity.forEach(activity => {
      if (activity.article?.category) {
        categoryCount[activity.article.category] = (categoryCount[activity.article.category] || 0) + 1
      }
    })

    const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0)
    const preferences: { [key: string]: number } = {}
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      preferences[category] = count / total
    })

    return preferences
  }

  private analyzeUserTagPreferences(userActivity: any[]) {
    const tagCount: { [key: string]: number } = {}
    
    userActivity.forEach(activity => {
      if (activity.article?.tags) {
        activity.article.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    const total = Object.values(tagCount).reduce((sum, count) => sum + count, 0)
    const preferences: { [key: string]: number } = {}
    
    Object.entries(tagCount).forEach(([tag, count]) => {
      preferences[tag] = count / total
    })

    return preferences
  }

  private calculateSeriesMatchScore(
    series: any,
    categoryPreferences: { [key: string]: number },
    tagPreferences: { [key: string]: number }
  ): number {
    let score = 0
    
    // Category matching (weight: 60%)
    const seriesCategories = series.articles.map((a: any) => a.category)
    const categoryScore = seriesCategories.reduce((sum: number, category: string) => {
      return sum + (categoryPreferences[category] || 0)
    }, 0) / seriesCategories.length
    
    score += categoryScore * 0.6

    // Tag matching (weight: 30%)
    const seriesTags = series.articles.flatMap((a: any) => a.tags || [])
    const tagScore = seriesTags.reduce((sum: number, tag: string) => {
      return sum + (tagPreferences[tag] || 0)
    }, 0) / Math.max(seriesTags.length, 1)
    
    score += tagScore * 0.3

    // Series completeness bonus (weight: 10%)
    const completenessScore = series._count.articles >= 3 ? 0.1 : 0.05
    score += completenessScore

    return Math.round(score * 100)
  }

  private getRecommendationReason(
    series: any,
    categoryPreferences: { [key: string]: number },
    tagPreferences: { [key: string]: number }
  ): string {
    // Find the top matching category
    const topCategory = Object.entries(categoryPreferences)
      .sort(([,a], [,b]) => b - a)[0]?.[0]

    // Find matching tags
    const seriesTags = series.articles.flatMap((a: any) => a.tags || [])
    const matchingTags = seriesTags.filter((tag: string) => tagPreferences[tag] > 0)

    if (topCategory && series.articles.some((a: any) => a.category === topCategory)) {
      return `Based on your interest in ${topCategory.toLowerCase()}`
    } else if (matchingTags.length > 0) {
      return `Based on your interest in ${matchingTags[0]}`
    } else {
      return `Popular in ${series.category.toLowerCase()}`
    }
  }

  private calculateAverageCompletionRate(articles: any[]): number {
    const allViews = articles.flatMap(article => article.views)
    if (allViews.length === 0) return 0
    
    const totalCompletion = allViews.reduce((sum, view) => sum + view.completionPercent, 0)
    return Math.round(totalCompletion / allViews.length)
  }

  private calculateAverageReadTime(articles: any[]): number {
    const allViews = articles.flatMap(article => article.views)
    const viewsWithDuration = allViews.filter(view => view.viewDuration)
    
    if (viewsWithDuration.length === 0) return 0
    
    const totalDuration = viewsWithDuration.reduce((sum, view) => sum + view.viewDuration, 0)
    return Math.round(totalDuration / viewsWithDuration.length / 1000) // Convert to seconds
  }

  private calculateCompletedUsers(articles: any[]): number {
    if (articles.length === 0) return 0
    
    const userCompletions: { [userId: string]: number } = {}
    
    articles.forEach(article => {
      article.views.forEach((view: any) => {
        if (view.completionPercent >= 80) { // 80% completion threshold
          userCompletions[view.userId] = (userCompletions[view.userId] || 0) + 1
        }
      })
    })
    
    // Count users who completed all articles
    return Object.values(userCompletions).filter(count => count === articles.length).length
  }

  private calculateDropoffPoints(articles: any[]): Array<{ articleIndex: number; dropoffRate: number }> {
    if (articles.length <= 1) return []
    
    const dropoffPoints: Array<{ articleIndex: number; dropoffRate: number }> = []
    
    for (let i = 0; i < articles.length - 1; i++) {
      const currentViews = new Set(articles[i].views.map((v: any) => v.userId)).size
      const nextViews = new Set(articles[i + 1].views.map((v: any) => v.userId)).size
      
      if (currentViews > 0) {
        const dropoffRate = Math.round(((currentViews - nextViews) / currentViews) * 100)
        dropoffPoints.push({ articleIndex: i + 1, dropoffRate })
      }
    }
    
    return dropoffPoints
  }

  private async invalidateSeriesCache(seriesIds?: string[]): Promise<void> {
    const patterns = [
      `${this.CACHE_PREFIX}*`,
      ...(seriesIds || []).map(id => `${this.CACHE_PREFIX}${id}*`)
    ]

    for (const pattern of patterns) {
      const keys = await redis.client?.keys(pattern) || []
      if (keys.length > 0) {
        await redis.delPattern(pattern)
      }
    }
  }
}

export const seriesService = new SeriesService()