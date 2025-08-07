import { Request, Response, NextFunction } from 'express'
import * as articleService from '@/services/articleService'
import { AppError } from '@/middleware/errorHandler'

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

    const filters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      category: category as string,
      zone: zone as string,
      isPremium: isPremium === 'true' ? true : isPremium === 'false' ? false : undefined,
      status: status as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    }

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
    
    const article = await articleService.getArticleBySlug(slug)
    
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

    const filters = {
      query: q,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      zone: zone as string,
      category: category as string
    }

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
    // This will be implemented when authentication is added
    const articleData = req.body
    // const authorId = req.user.id

    const article = await articleService.createArticle(articleData)

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
    // This will be implemented when authentication is added
    const { id } = req.params
    const updateData = req.body

    const article = await articleService.updateArticle(id, updateData)

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
    // This will be implemented when authentication is added
    const { id } = req.params

    await articleService.deleteArticle(id)

    res.json({
      success: true,
      message: 'Article deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const trackView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { duration, completionPercent } = req.body
    const sessionId = req.sessionID || req.correlationId
    const userAgent = req.get('User-Agent')
    const ipAddress = req.ip

    await articleService.trackArticleView({
      articleId: id,
      sessionId,
      viewDuration: duration,
      completionPercent,
      referrer: req.get('Referer'),
      deviceType: userAgent?.includes('Mobile') ? 'mobile' : 'desktop',
      ipAddress
    })

    res.json({
      success: true,
      message: 'View tracked successfully'
    })
  } catch (error) {
    next(error)
  }
}