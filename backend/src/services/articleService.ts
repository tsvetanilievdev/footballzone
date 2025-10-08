import prisma from '@/config/database'
import redis from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { ArticleStatus, ArticleCategory, ZoneType } from '@prisma/client'

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
    // Map zone parameter to correct enum values
    const zoneMapping: { [key: string]: string } = {
      'READ': 'READ',
      'read': 'READ',
      'COACH': 'coach',
      'coach': 'coach',
      'PLAYER': 'player',
      'player': 'player',
      'PARENT': 'parent',
      'parent': 'parent',
      'SERIES': 'series',
      'series': 'series'
    }
    
    const mappedZone = zoneMapping[zone] || zone
    
    where.zones = {
      some: {
        zone: mappedZone as ZoneType,
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

export const getArticleBySlug = async (slug: string, user?: any) => {
  try {
    // Check cache first
    const cacheKey = `article:${slug}`
    const cached = await redis.getJson<any>(cacheKey)

    const article = cached || await prisma.article.findUnique({
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

    // Cache article for 1 hour if not already cached
    if (!cached) {
      await redis.setJson(cacheKey, article, 3600)
    }

    // Increment view count asynchronously
    prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error)

    // Check if user has access to premium content
    const hasPremiumAccess = user && (user.role === 'ADMIN' || user.isPremium)

    // If article is premium and user doesn't have access, return preview
    if (article.isPremium && !hasPremiumAccess) {
      const previewContent = truncateContent(article.content, 0.20) // Show first 20%

      return {
        ...article,
        content: previewContent,
        isPreview: true,
        fullContentAvailable: false
      }
    }

    return {
      ...article,
      isPreview: false,
      fullContentAvailable: true
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    throw new AppError('Failed to fetch article', 500)
  }
}

// Helper function to truncate HTML content
function truncateContent(html: string, percentage: number): string {
  // Strip HTML tags to count actual text
  const textContent = html.replace(/<[^>]*>/g, '')
  const targetLength = Math.floor(textContent.length * percentage)

  // Find the cutoff point in the original HTML
  let currentTextLength = 0
  let result = ''
  let inTag = false

  for (let i = 0; i < html.length && currentTextLength < targetLength; i++) {
    const char = html[i]

    if (char === '<') {
      inTag = true
      result += char
    } else if (char === '>') {
      inTag = false
      result += char
    } else {
      result += char
      if (!inTag) {
        currentTextLength++
      }
    }
  }

  // Close any open tags
  const openTags: string[] = []
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  let match

  while ((match = tagRegex.exec(result)) !== null) {
    const tag = match[1].toLowerCase()
    if (match[0][1] !== '/') {
      // Opening tag
      if (!['br', 'hr', 'img', 'input'].includes(tag)) {
        openTags.push(tag)
      }
    } else {
      // Closing tag
      openTags.pop()
    }
  }

  // Close remaining open tags
  while (openTags.length > 0) {
    result += `</${openTags.pop()}>`
  }

  return result
}

export const getArticleById = async (id: string) => {
  try {
    // Check cache first
    const cacheKey = `article:id:${id}`
    const cached = await redis.getJson(cacheKey)
    
    if (cached) {
      return cached
    }

    const article = await prisma.article.findUnique({
      where: { id },
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
      throw new AppError('Article not found', 404)
    }

    // Cache the result for 10 minutes
    await redis.setJson(cacheKey, article, 600)

    // Update view count asynchronously (don't await)
    prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error)

    return article
  } catch (error) {
    console.error('Error fetching article by ID:', error)
    if (error instanceof AppError) throw error
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

// Helper function to transliterate Cyrillic to Latin
const transliterateCyrillic = (text: string): string => {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
    'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
    'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
  };

  return text
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('');
}

// Helper function to generate a unique slug
const generateUniqueSlug = async (title: string): Promise<string> => {
  // Transliterate and create base slug
  let baseSlug = transliterateCyrillic(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 90); // Leave room for suffix

  if (!baseSlug || baseSlug.length < 3) {
    baseSlug = `article-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists and add counter if needed
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export const createArticle = async (articleData: any, authorId: string): Promise<any> => {
  try {
    const { zones, ...articleFields } = articleData

    // Generate unique slug if not provided or if provided slug is too short
    if (!articleFields.slug || articleFields.slug.length < 3) {
      articleFields.slug = await generateUniqueSlug(articleFields.title)
    } else {
      // Verify provided slug is unique
      const existing = await prisma.article.findUnique({ where: { slug: articleFields.slug } })
      if (existing) {
        articleFields.slug = await generateUniqueSlug(articleFields.title)
      }
    }

    // Create article with zones using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the article
      const article = await tx.article.create({
        data: {
          ...articleFields,
          authorId,
          publishedAt: articleFields.status === 'PUBLISHED' ? new Date() : null
        }
      })

      // Create zone associations
      if (zones && zones.length > 0) {
        await tx.articleZone.createMany({
          data: zones.map((zone: any) => ({
            articleId: article.id,
            zone: zone.zone,
            visible: zone.visible ?? true,
            requiresSubscription: zone.requiresSubscription ?? false,
            freeAfterDate: zone.freeAfterDate ? new Date(zone.freeAfterDate) : null
          }))
        })
      }

      // Return article with zones
      return await tx.article.findUnique({
        where: { id: article.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          zones: true,
          series: true
        }
      })
    })

    // Invalidate article cache
    await redis.delPattern(`article:*`)
    await redis.delPattern(`articles:*`)
    await redis.delPattern(`search:*`)

    return result
  } catch (error: any) {
    console.error('Error creating article:', error)
    // P2002 shouldn't happen now since we generate unique slugs, but keep as safety
    if (error.code === 'P2002') {
      // Retry with timestamp-based slug as last resort
      const timestampSlug = `article-${Date.now()}`;
      const newArticleData = {
        ...articleData,
        slug: timestampSlug
      };
      // Retry the creation (recursive call is safe here as timestamp is always unique)
      return createArticle(newArticleData, authorId);
    }
    throw new AppError('Failed to create article', 500)
  }
}

export const updateArticle = async (id: string, updateData: any, userId: string, userRole: string) => {
  try {
    // First verify the article exists and check permissions
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!existingArticle) {
      throw new AppError('Article not found', 404)
    }

    // Check if user can modify this article
    const canModify = userRole === 'ADMIN' || existingArticle.authorId === userId
    if (!canModify) {
      throw new AppError('You can only modify your own articles', 403)
    }

    const { zones, ...articleFields } = updateData

    // Update article with zones using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the article
      const updatedArticle = await tx.article.update({
        where: { id },
        data: {
          ...articleFields,
          publishedAt: articleFields.status === 'PUBLISHED' && !existingArticle.publishedAt 
            ? new Date() 
            : existingArticle.publishedAt
        }
      })

      // Update zones if provided
      if (zones && zones.length > 0) {
        // Delete existing zones
        await tx.articleZone.deleteMany({
          where: { articleId: id }
        })

        // Create new zones
        await tx.articleZone.createMany({
          data: zones.map((zone: any) => ({
            articleId: id,
            zone: zone.zone,
            visible: zone.visible ?? true,
            requiresSubscription: zone.requiresSubscription ?? false,
            freeAfterDate: zone.freeAfterDate ? new Date(zone.freeAfterDate) : null
          }))
        })
      }

      // Return updated article with relations
      return await tx.article.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          zones: true,
          series: true
        }
      })
    })

    // Invalidate article cache
    await redis.delPattern(`article:*`)
    await redis.delPattern(`articles:*`)
    await redis.delPattern(`search:*`)

    return result
  } catch (error: any) {
    console.error('Error updating article:', error)
    if (error instanceof AppError) {
      throw error
    }
    if (error.code === 'P2002') {
      throw new AppError('Article with this slug already exists', 409)
    }
    throw new AppError('Failed to update article', 500)
  }
}

export const deleteArticle = async (id: string, userId: string, userRole: string) => {
  try {
    // First verify the article exists and check permissions
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: { 
        author: true,
        zones: true,
        views: true
      }
    })

    if (!existingArticle) {
      throw new AppError('Article not found', 404)
    }

    // Check if user can delete this article (only ADMIN can delete any article)
    const canDelete = userRole === 'ADMIN' || existingArticle.authorId === userId
    if (!canDelete) {
      throw new AppError('Only administrators can delete articles', 403)
    }

    // Delete article and related data using transaction
    await prisma.$transaction(async (tx) => {
      // Delete related data first (due to foreign key constraints)
      await tx.articleZone.deleteMany({ where: { articleId: id } })
      await tx.articleView.deleteMany({ where: { articleId: id } })
      await tx.userActivity.deleteMany({ where: { resourceId: id } })

      // Delete the article
      await tx.article.delete({ where: { id } })
    })

    // Invalidate article cache
    await redis.delPattern(`article:*`)
    await redis.delPattern(`articles:*`)
    await redis.delPattern(`search:*`)

    return { 
      success: true, 
      message: 'Article deleted successfully',
      deletedArticle: {
        id: existingArticle.id,
        title: existingArticle.title,
        slug: existingArticle.slug
      }
    }
  } catch (error: any) {
    console.error('Error deleting article:', error)
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Failed to delete article', 500)
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