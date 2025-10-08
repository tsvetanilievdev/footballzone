import { Request, Response, NextFunction } from 'express'
import * as articleService from '@/services/articleService'
import { AppError } from '@/middleware/errorHandler'
import { ArticleFilters, SearchFilters, TrackViewData } from '@/types/api'

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      zone,
      isPremium,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const filters: ArticleFilters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    }

    // Add optional properties only if they exist
    if (category) filters.category = category as string
    if (zone) filters.zone = zone as string
    if (isPremium === 'true') {
      filters.isPremium = true
    } else if (isPremium === 'false') {
      filters.isPremium = false
    }
    if (status) filters.status = status as string
    if (search) filters.search = search as string

    const result = await articleService.getArticles(filters)

    res.json({
      success: true,
      data: result.articles,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        pages: Math.ceil(result.total / filters.limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const user = req.user // Get authenticated user if exists

    const article = await articleService.getArticleBySlug(slug, user)

    if (!article) {
      throw new AppError('Article not found', 404)
    }

    res.json({
      success: true,
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    
    const article = await articleService.getArticleById(id)
    
    if (!article) {
      throw new AppError('Article not found', 404)
    }

    res.json({
      success: true,
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export const searchArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      q,
      page = '1',
      limit = '10',
      zone,
      category
    } = req.query

    if (!q || typeof q !== 'string') {
      throw new AppError('Search query is required', 400)
    }

    const filters: SearchFilters = {
      query: q,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    }

    // Add optional properties only if they exist
    if (zone) filters.zone = zone as string
    if (category) filters.category = category as string

    const result = await articleService.searchArticles(filters)

    res.json({
      success: true,
      data: result.articles,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        pages: Math.ceil(result.total / filters.limit)
      },
      query: q
    })
  } catch (error) {
    next(error)
  }
}

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('Authentication required')
    }

    const articleData = req.body
    const authorId = req.user.userId

    const article = await articleService.createArticle(articleData, authorId)

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article created successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('Authentication required')
    }

    const { id } = req.params
    const updateData = req.body
    const userId = req.user.userId
    const userRole = req.user.role

    const article = await articleService.updateArticle(id, updateData, userId, userRole)

    res.json({
      success: true,
      data: article,
      message: 'Article updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('Authentication required')
    }

    const { id } = req.params
    const userId = req.user.userId
    const userRole = req.user.role

    const result = await articleService.deleteArticle(id, userId, userRole)

    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const trackView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { duration, completionPercent } = req.body
    const sessionId = req.correlationId || 'anonymous'
    const userAgent = req.get('User-Agent')
    const ipAddress = req.ip

    const trackData: TrackViewData = {
      articleId: id,
      sessionId,
      viewDuration: duration,
      completionPercent
    }

    // Add optional properties only if they exist
    const referrer = req.get('Referer')
    if (referrer) trackData.referrer = referrer
    if (userAgent) trackData.deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop'
    if (ipAddress) trackData.ipAddress = ipAddress
    if (req.user?.id) trackData.userId = req.user.id

    await articleService.trackArticleView(trackData)

    res.json({
      success: true,
      message: 'View tracked successfully'
    })
  } catch (error) {
    next(error)
  }
}