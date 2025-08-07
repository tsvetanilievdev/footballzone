import prisma from '@/config/database'
import redis from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { Article, ArticleStatus, ArticleCategory, ZoneType } from '@prisma/client'

interface ArticleFilters {
  page: number
  limit: number
  category?: string
  zone?: string
  isPremium?: boolean
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface SearchFilters {
  query: string
  page: number
  limit: number
  zone?: string
  category?: string
}

interface TrackViewData {
  articleId: string
  sessionId: string
  userId?: string
  viewDuration?: number
  completionPercent?: number
  referrer?: string
  deviceType?: string
  ipAddress?: string
}

export const getArticles = async (filters: ArticleFilters) => {
  const {
    page,
    limit,
    category,
    zone,
    isPremium,
    status,
    search,
    sortBy,
    sortOrder
  } = filters

  // Calculate offset
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {}

  if (category) {
    where.category = category.toUpperCase() as ArticleCategory
  }

  if (isPremium !== undefined) {
    where.isPremium = isPremium
  }

  if (status) {
    where.status = status.toUpperCase() as ArticleStatus
  } else {
    // Default to published articles only
    where.status = 'PUBLISHED'
  }

  // Zone filtering
  if (zone) {
    where.zones = {
      some: {
        zone: zone.toLowerCase() as ZoneType,
        visible: true
      }
    }
  }

  // Search filtering
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }
    ]
  }

  // Build orderBy
  const orderBy: any = {}
  if (sortBy && ['title', 'createdAt', 'publishedAt', 'viewCount'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder
  } else {
    orderBy.createdAt = 'desc'
  }

  try {
    // Check cache first
    const cacheKey = `articles:${JSON.stringify(filters)}`
    const cached = await redis.getJson<{ articles: any[], total: number }>(cacheKey)
    
    if (cached) {
      return cached
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          },
          series: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true
            }
          },
          zones: true,
          template: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      }),
      prisma.article.count({ where })
    ])

    const result = { articles, total }

    // Cache result for 15 minutes
    await redis.setJson(cacheKey, result, 900)

    return result
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new AppError('Failed to fetch articles', 500)
  }
}

export const getArticleBySlug = async (slug: string) => {
  try {
    // Check cache first
    const cacheKey = `article:${slug}`
    const cached = await redis.getJson(cacheKey)
    
    if (cached) {
      return cached
    }

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        series: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        zones: true,
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            settings: true
          }
        }
      }
    })

    if (!article) {
      return null
    }

    // Cache article for 1 hour
    await redis.setJson(cacheKey, article, 3600)

    // Increment view count asynchronously
    prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error)

    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    throw new AppError('Failed to fetch article', 500)
  }
}

export const searchArticles = async (filters: SearchFilters) => {
  const { query, page, limit, zone, category } = filters

  const skip = (page - 1) * limit

  // Build where clause for search
  const where: any = {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      { tags: { has: query } }
    ]
  }

  if (category) {
    where.category = category.toUpperCase() as ArticleCategory
  }

  if (zone) {
    where.zones = {
      some: {
        zone: zone.toLowerCase() as ZoneType,
        visible: true
      }
    }
  }

  try {
    // Check cache
    const cacheKey = `search:${JSON.stringify(filters)}`
    const cached = await redis.getJson<{ articles: any[], total: number }>(cacheKey)
    
    if (cached) {
      return cached
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          },
          series: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          zones: true
        }
      }),
      prisma.article.count({ where })
    ])

    const result = { articles, total }

    // Cache search results for 10 minutes
    await redis.setJson(cacheKey, result, 600)

    return result
  } catch (error) {
    console.error('Error searching articles:', error)
    throw new AppError('Failed to search articles', 500)
  }
}

export const createArticle = async (articleData: any) => {
  try {
    // This will be implemented when authentication is added
    throw new AppError('Not implemented yet', 501)
  } catch (error) {
    console.error('Error creating article:', error)
    throw error
  }
}

export const updateArticle = async (id: string, updateData: any) => {
  try {
    // This will be implemented when authentication is added
    throw new AppError('Not implemented yet', 501)
  } catch (error) {
    console.error('Error updating article:', error)
    throw error
  }
}

export const deleteArticle = async (id: string) => {
  try {
    // This will be implemented when authentication is added
    throw new AppError('Not implemented yet', 501)
  } catch (error) {
    console.error('Error deleting article:', error)
    throw error
  }
}

export const trackArticleView = async (viewData: TrackViewData) => {
  try {
    const { articleId, sessionId, userId, viewDuration, completionPercent, referrer, deviceType, ipAddress } = viewData

    // Create article view record
    await prisma.articleView.create({
      data: {
        articleId,
        userId,
        sessionId,
        viewDuration,
        completionPercent: completionPercent || 0,
        referrer,
        deviceType,
        ipAddress
      }
    })

    // Create user activity record
    await prisma.userActivity.create({
      data: {
        userId,
        sessionId,
        action: 'VIEW',
        resourceType: 'ARTICLE',
        resourceId: articleId,
        metadata: {
          viewDuration,
          completionPercent,
          referrer,
          deviceType
        },
        ipAddress,
        deviceType
      }
    })

    // Invalidate article cache
    await redis.delPattern(`article:*`)
    await redis.delPattern(`articles:*`)

  } catch (error) {
    console.error('Error tracking article view:', error)
    // Don't throw error for tracking - it's not critical
  }
}